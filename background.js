const DEFAULTS = {
  enabled: true,
  blockedSites: [],
  version: 1
};

const RULE_ID_BASE = 1000;

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

function buildRules(blockedSites) {
  return blockedSites.map((site, index) => {
    const domain = normalizeDomain(site);
    return {
      id: RULE_ID_BASE + index,
      priority: 1,
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getSettings() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  return {
    enabled: settings.enabled !== false,
    blockedSites: Array.isArray(settings.blockedSites) ? settings.blockedSites : []
  };
}

async function refreshRules() {
  const settings = await getSettings();
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map(rule => rule.id).filter(id => id >= RULE_ID_BASE);
  const addRules = settings.enabled ? buildRules(settings.blockedSites) : [];

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules
  });

  await updateBadge(settings);
}

async function updateBadge(settings) {
  await chrome.action.setBadgeText({ text: settings.enabled && settings.blockedSites.length ? String(settings.blockedSites.length) : '' });
  await chrome.action.setBadgeBackgroundColor({ color: '#d93025' });
}

async function initialize() {
  const stored = await chrome.storage.local.get(null);
  if (stored.enabled === undefined || stored.blockedSites === undefined) {
    await chrome.storage.local.set(DEFAULTS);
  }
  await refreshRules();
}

chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local' && (changes.enabled || changes.blockedSites)) {
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
