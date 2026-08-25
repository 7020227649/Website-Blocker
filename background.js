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
  version: 3
};

async function getSettings() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  return {
    enabled: settings.enabled !== false,
    adultFilter: settings.adultFilter !== false,
    blockedSites: Array.isArray(settings.blockedSites) ? settings.blockedSites : []
  };
}

async function refreshRules() {
  // Blocking is now done in-page by content.js so the browser keeps the
  // original URL visible instead of navigating to chrome-extension://.../blocked.html.
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map(rule => rule.id);
  if (removeRuleIds.length) {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules: [] });
  }
  await updateBadge(await getSettings());
}

async function updateBadge(settings) {
  const count = settings.blockedSites.length + (settings.adultFilter ? ADULT_DEFAULTS.length : 0);
  await chrome.action.setBadgeText({
    text: settings.enabled && count ? String(count) : ''
  });
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
      console.error('Failed to refresh blocker state:', error);
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message?.type === 'getState') {
      sendResponse({ ok: true, ...(await getSettings()) });
      return;
    }
    if (message?.type === 'getAdultDomains') {
      sendResponse({ ok: true, domains: ADULT_DEFAULTS });
      return;
    }
    sendResponse({ ok: false, error: 'Unknown message' });
  })().catch(error => {
    console.error(error);
    sendResponse({ ok: false, error: error.message });
  });
  return true;
});
