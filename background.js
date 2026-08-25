const ADULT_DEFAULTS = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com',
  'youporn.com', 'tube8.com', 'spankbang.com', 'txxx.com', 'eporner.com',
  'porn.com', 'hqporner.com', 'nuvid.com', 'beeg.com', 'drtuber.com',
  'porntrex.com', 'slutload.com', 'sunporno.com', 'thumbzilla.com',
  'rule34.xxx', 'nhentai.net', 'xhamsterlive.com', 'chaturbate.com',
  'stripchat.com', 'cam4.com', 'bongacams.com', 'livejasmin.com'
];

const DEFAULTS = {
  enabled: true,
  adultFilter: true,
  blockedSites: [],
  version: 2
};

const RULE_ID_BASE = 1000;
const ADULT_RULE_ID_BASE = 100000;

function normalizeDomain(input) {
  let value = String(input || '').trim().toLowerCase();
  value = value.replace(/^https?:\/\//, '');
  value = value.split('/')[0].split('?')[0].split('#')[0];
  value = value.replace(/^www\./, '');
  value = value.replace(/:\d+$/, '');
  return value;
}

function isValidDomain(domain) {
  if (!domain || domain.length > 253 || domain.includes(' ')) return false;
  if (domain === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) return true;
  const labels = domain.split('.');
  if (labels.length < 2) return false;
  return labels.every(label =>
    label.length >= 1 &&
    label.length <= 63 &&
    !label.startsWith('-') &&
    !label.endsWith('-') &&
    /^[a-z0-9-]+$/i.test(label)
  );
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRules(blockedSites) {
  return blockedSites.map((site, index) => {
    const domain = normalizeDomain(site);
    return {
      id: RULE_ID_BASE + index,
      priority: 10,
      action: {
        type: 'redirect',
        redirect: { extensionPath: '/blocked.html' }
      },
      condition: {
        regexFilter: `^https?://([^/]+\\.)?${escapeRegex(domain)}([/:?#]|$)`,
        resourceTypes: ['main_frame']
      }
    };
  });
}

function buildAdultRules() {
  return ADULT_DEFAULTS.map((site, index) => {
    const domain = normalizeDomain(site);
    return {
      id: ADULT_RULE_ID_BASE + index,
      priority: 20,
      action: {
        type: 'redirect',
        redirect: { extensionPath: '/blocked.html' }
      },
      condition: {
        regexFilter: `^https?://([^/]+\\.)?${escapeRegex(domain)}([/:?#]|$)`,
        resourceTypes: ['main_frame']
      }
    };
  });
}

async function getSettings() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  return {
    enabled: settings.enabled !== false,
    adultFilter: settings.adultFilter !== false,
    blockedSites: Array.isArray(settings.blockedSites) ? settings.blockedSites : []
  };
}

async function refreshRules() {
  const settings = await getSettings();
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing
    .map(rule => rule.id)
    .filter(id => (id >= RULE_ID_BASE && id < RULE_ID_BASE + 10000) || (id >= ADULT_RULE_ID_BASE && id < ADULT_RULE_ID_BASE + 10000));

  const addRules = settings.enabled
    ? [
        ...buildRules(settings.blockedSites.filter(site => !ADULT_DEFAULTS.includes(normalizeDomain(site)))),
        ...(settings.adultFilter ? buildAdultRules() : [])
      ]
    : [];

  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
  await updateBadge(settings);
}

async function updateBadge(settings) {
  const count = settings.blockedSites.length + (settings.adultFilter ? ADULT_DEFAULTS.length : 0);
  await chrome.action.setBadgeText({ text: settings.enabled && count ? String(count) : '' });
  await chrome.action.setBadgeBackgroundColor({ color: '#d93025' });
}

async function initialize() {
  const stored = await chrome.storage.local.get(null);
  if (stored.enabled === undefined) await chrome.storage.local.set({ enabled: DEFAULTS.enabled });
  if (stored.adultFilter === undefined) await chrome.storage.local.set({ adultFilter: DEFAULTS.adultFilter });
  if (stored.blockedSites === undefined) await chrome.storage.local.set({ blockedSites: DEFAULTS.blockedSites });
  await refreshRules();
}

chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local' && (changes.enabled || changes.adultFilter || changes.blockedSites)) {
    try {
      await refreshRules();
    } catch (error) {
      console.error('Failed to refresh blocker rules:', error);
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message?.type === 'refreshRules') {
      await refreshRules();
      sendResponse({ ok: true });
      return;
    }

    if (message?.type === 'getState') {
      sendResponse({ ok: true, ...(await getSettings()) });
      return;
    }

    if (message?.type === 'validateDomain') {
      const domain = normalizeDomain(message.domain);
      sendResponse({ ok: true, domain, valid: isValidDomain(domain) });
      return;
    }

    sendResponse({ ok: false, error: 'Unknown message' });
  })().catch(error => {
    console.error(error);
    sendResponse({ ok: false, error: error.message });
  });
  return true;
});
