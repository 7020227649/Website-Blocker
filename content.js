(() => {
  const OVERLAY_ID = '__website_error_overlay__';

  function getCurrentHostname() {
    try {
      return location.hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  const ADULT_DEFAULTS = [
    'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com',
    'youporn.com', 'tube8.com', 'spankbang.com', 'txxx.com', 'eporner.com',
    'porn.com', 'hqporner.com', 'nuvid.com', 'beeg.com', 'drtuber.com',
    'porntrex.com', 'slutload.com', 'sunporno.com', 'thumbzilla.com',
    'rule34.xxx', 'nhentai.net', 'xhamsterlive.com', 'chaturbate.com',
    'stripchat.com', 'cam4.com', 'bongacams.com', 'livejasmin.com'
  ];

  function normalizeDomain(value) {
    return String(value || '').trim().toLowerCase().replace(/^www\./, '');
  }

  function shouldBlock(hostname, blockedSites, adultFilter) {
    const host = normalizeDomain(hostname);
    const customMatch = blockedSites.some((domain) => {
      const normalized = normalizeDomain(domain);
      return host === normalized || host.endsWith(`.${normalized}`);
    });
    const adultMatch = adultFilter && ADULT_DEFAULTS.some((domain) => {
      return host === domain || host.endsWith(`.${domain}`);
    });
    return customMatch || adultMatch;
  }

  function removeOverlay() {
    document.getElementById(OVERLAY_ID)?.remove();
    document.getElementById(`${OVERLAY_ID}_style`)?.remove();
  }

  function showOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-live', 'assertive');
    overlay.innerHTML = `
      <div class="wb-error-page">
        <div class="wb-code">404</div>
        <h1>Page Not Found</h1>
        <p>The requested URL was not found on this server.</p>
        <div class="wb-actions">
          <button type="button" class="wb-back">Go Back</button>
          <button type="button" class="wb-reload">Reload</button>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.id = `${OVERLAY_ID}_style`;
    style.textContent = `
      #${OVERLAY_ID} {
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483647 !important;
        display: grid !important;
        place-items: center !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 24px !important;
        background: #fff !important;
        color: #202124 !important;
        font-family: Arial, Helvetica, sans-serif !important;
        box-sizing: border-box !important;
      }
      #${OVERLAY_ID} * { box-sizing: border-box !important; }
      #${OVERLAY_ID} .wb-error-page {
        width: min(680px, 100%);
        text-align: left;
      }
      #${OVERLAY_ID} .wb-code {
        font-size: clamp(88px, 18vw, 150px);
        line-height: .9;
        font-weight: 700;
        letter-spacing: -.06em;
        color: #202124;
        margin-bottom: 18px;
      }
      #${OVERLAY_ID} h1 {
        margin: 0 0 12px;
        font-size: clamp(26px, 4vw, 36px);
        line-height: 1.2;
        font-weight: 500;
        color: #202124;
      }
      #${OVERLAY_ID} p {
        margin: 0 0 28px;
        max-width: 600px;
        font-size: 16px;
        line-height: 1.6;
        color: #5f6368;
      }
      #${OVERLAY_ID} .wb-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      #${OVERLAY_ID} button {
        border: 1px solid #dadce0;
        border-radius: 8px;
        padding: 10px 16px;
        background: #fff;
        color: #202124;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }
      #${OVERLAY_ID} button:hover { background: #f8f9fa; }
    `;

    overlay.querySelector('.wb-back').addEventListener('click', () => history.back());
    overlay.querySelector('.wb-reload').addEventListener('click', () => location.reload());
    (document.head || document.documentElement).appendChild(style);
    (document.body || document.documentElement).appendChild(overlay);
  }

  async function refresh() {
    try {
      const {
        enabled = true,
        adultFilter = true,
        blockedSites = []
      } = await chrome.storage.local.get({
        enabled: true,
        adultFilter: true,
        blockedSites: []
      });

      const block = enabled && shouldBlock(getCurrentHostname(), blockedSites, adultFilter);
      if (block) showOverlay();
      else removeOverlay();
    } catch {
      removeOverlay();
    }
  }

  refresh();
  chrome.storage.onChanged.addListener(refresh);
})();
