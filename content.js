(() => {
  const OVERLAY_ID = '__website_blocker_overlay__';

  function getCurrentHostname() {
    try {
      return location.hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  function normalizeDomain(value) {
    return String(value || '').trim().toLowerCase().replace(/^www\./, '');
  }

  function shouldBlock(hostname, blockedSites) {
    const host = normalizeDomain(hostname);
    return blockedSites.some((domain) => {
      const normalized = normalizeDomain(domain);
      return host === normalized || host.endsWith(`.${normalized}`);
    });
  }

  function removeOverlay() {
    document.getElementById(OVERLAY_ID)?.remove();
  }

  function showOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="wb-card">
        <div class="wb-icon">🛑</div>
        <div class="wb-kicker">Website Blocker</div>
        <h1>This website is blocked</h1>
        <p>Access to <strong class="wb-domain"></strong> is blocked by your Website Blocker settings.</p>
        <button type="button" class="wb-go-back">Go back</button>
      </div>
    `;

    const style = document.createElement('style');
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
        background: linear-gradient(135deg, #0f172a, #1e293b) !important;
        color: #f8fafc !important;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        box-sizing: border-box !important;
      }
      #${OVERLAY_ID} * { box-sizing: border-box !important; }
      #${OVERLAY_ID} .wb-card {
        width: min(560px, 100%);
        padding: 42px 34px;
        border-radius: 24px;
        text-align: center;
        background: rgba(15, 23, 42, .94);
        border: 1px solid rgba(255,255,255,.12);
        box-shadow: 0 30px 80px rgba(0,0,0,.4);
        backdrop-filter: blur(12px);
      }
      #${OVERLAY_ID} .wb-icon { font-size: 56px; margin-bottom: 14px; }
      #${OVERLAY_ID} .wb-kicker { font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #94a3b8; }
      #${OVERLAY_ID} h1 { margin: 10px 0 12px; font-size: clamp(28px, 5vw, 40px); line-height: 1.1; color: #fff; }
      #${OVERLAY_ID} p { margin: 0 auto 26px; max-width: 440px; color: #cbd5e1; font-size: 16px; line-height: 1.6; }
      #${OVERLAY_ID} .wb-domain { color: #fff; overflow-wrap: anywhere; }
      #${OVERLAY_ID} .wb-go-back {
        border: 0;
        border-radius: 12px;
        padding: 12px 20px;
        background: #fff;
        color: #0f172a;
        font-weight: 700;
        cursor: pointer;
      }
    `;

    overlay.querySelector('.wb-domain').textContent = getCurrentHostname() || location.host;
    overlay.querySelector('.wb-go-back').addEventListener('click', () => history.back());
    (document.head || document.documentElement).appendChild(style);
    (document.body || document.documentElement).appendChild(overlay);
  }

  async function refresh() {
    try {
      const { enabled = true, blockedSites = [] } = await chrome.storage.local.get({
        enabled: true,
        blockedSites: []
      });
      const block = enabled && shouldBlock(getCurrentHostname(), blockedSites);
      if (block) showOverlay();
      else removeOverlay();
    } catch {
      removeOverlay();
    }
  }

  refresh();
  chrome.storage.onChanged.addListener(refresh);
})();
