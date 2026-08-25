const ADULT_DEFAULTS = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com',
  'youporn.com', 'tube8.com', 'spankbang.com', 'txxx.com', 'eporner.com',
  'porn.com', 'hqporner.com', 'nuvid.com', 'beeg.com', 'drtuber.com',
  'porntrex.com', 'slutload.com', 'sunporno.com', 'thumbzilla.com',
  'rule34.xxx', 'nhentai.net', 'xhamsterlive.com', 'chaturbate.com',
  'stripchat.com', 'cam4.com', 'bongacams.com', 'livejasmin.com'
];

const GAME_DEFAULTS = [
  'poki.com', 'playhop.com', 'crazygames.com', 'y8.com', 'coolmathgames.com',
  'kizi.com', 'miniclip.com', 'addictinggames.com', 'armorgames.com',
  'kongregate.com', 'newgrounds.com', 'friv.com', 'lagged.com', 'silvergames.com',
  'gamesgames.com', 'notdoppler.com', 'mousebreaker.com', 'primarygames.com',
  'puffgames.com', 'a10.com', 'agame.com', 'fog.com', 'kbhgames.com',
  'gameflare.com', 'yad.com', 'gamevui.com', 'crazygames.co', 'plays.org',
  'itch.io', 'gamedistribution.com', 'crazygames.com.br', 'y8.com.br',
  'io-games.com', 'iogames.space', 'iogames.fun', 'iogames.onl',
  'shellshock.io', 'krunker.io', 'slither.io', 'agar.io', 'paper-io.com',
  'surviv.io', 'hole-io.com', 'diep.io', 'moomoo.io', 'skribbl.io',
  '1v1.lol', 'brawlhalla.com', 'friv5online.com', 'unblockedgames66.com',
  'unblockedgames77.com', 'unblockedgameswtf.com', 'unblockedgames911.com'
];

const DEFAULTS = {
  enabled: true,
  adultFilter: true,
  gameFilter: true,
  blockedSites: [],
  version: 4
};

async function getSettings() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  return {
    enabled: settings.enabled !== false,
    adultFilter: settings.adultFilter !== false,
    gameFilter: settings.gameFilter !== false,
    blockedSites: Array.isArray(settings.blockedSites) ? settings.blockedSites : []
  };
}

async function refreshRules() {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map(rule => rule.id);
  if (removeRuleIds.length) {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules: [] });
  }
  await updateBadge(await getSettings());
}

async function updateBadge(settings) {
  const count = settings.blockedSites.length + (settings.adultFilter ? ADULT_DEFAULTS.length : 0) + (settings.gameFilter ? GAME_DEFAULTS.length : 0);
  await chrome.action.setBadgeText({
    text: settings.enabled && count ? String(count) : ''
  });
  await chrome.action.setBadgeBackgroundColor({ color: '#d93025' });
}

async function initialize() {
  const stored = await chrome.storage.local.get(null);
  if (stored.enabled === undefined) await chrome.storage.local.set({ enabled: DEFAULTS.enabled });
  if (stored.adultFilter === undefined) await chrome.storage.local.set({ adultFilter: DEFAULTS.adultFilter });
  if (stored.gameFilter === undefined) await chrome.storage.local.set({ gameFilter: DEFAULTS.gameFilter });
  if (stored.blockedSites === undefined) await chrome.storage.local.set({ blockedSites: DEFAULTS.blockedSites });
  await refreshRules();
}

chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local' && (changes.enabled || changes.adultFilter || changes.gameFilter || changes.blockedSites)) {
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
    if (message?.type === 'getGameDomains') {
      sendResponse({ ok: true, domains: GAME_DEFAULTS });
      return;
    }
    sendResponse({ ok: false, error: 'Unknown message' });
  })().catch(error => {
    console.error(error);
    sendResponse({ ok: false, error: error.message });
  });
  return true;
});
