const enabled = document.getElementById('enabled');
const adultFilter = document.getElementById('adultFilter');
const form = document.getElementById('form');
const domainInput = document.getElementById('domain');
const list = document.getElementById('list');
const empty = document.getElementById('empty');
const clearButton = document.getElementById('clear');
const status = document.getElementById('status');

function normalizeDomain(input) {
  let value = String(input || '').trim().toLowerCase();
  value = value.replace(/^https?:\/\//, '');
  value = value.split('/')[0].split('?')[0].split('#')[0].replace(/^www\./, '');
  value = value.replace(/:\d+$/, '');
  return value;
}

function validDomain(domain) {
  if (!domain || domain.length > 253 || domain.includes(' ')) return false;
  if (domain === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) return true;
  const labels = domain.split('.');
  return labels.length >= 2 && labels.every(label =>
    label.length <= 63 && /^[a-z0-9-]+$/i.test(label) && !label.startsWith('-') && !label.endsWith('-')
  );
}

function showStatus(text, kind = '') {
  status.textContent = text;
  status.className = `status ${kind}`;
  if (text) setTimeout(() => { if (status.textContent === text) status.textContent = ''; }, 2500);
}

async function getState() {
  return chrome.storage.local.get({ enabled: true, adultFilter: true, blockedSites: [] });
}

async function saveSites(sites) {
  sites = [...new Set(sites)].sort();
  await chrome.storage.local.set({ blockedSites: sites });
  render(await getState());
}

function render(state) {
  const sites = Array.isArray(state.blockedSites) ? state.blockedSites : [];
  enabled.checked = state.enabled !== false;
  adultFilter.checked = state.adultFilter !== false;
  list.innerHTML = '';
  empty.style.display = sites.length ? 'none' : 'block';

  for (const site of sites) {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `<span class="domain"></span><button class="danger" type="button">Remove</button>`;
    item.querySelector('.domain').textContent = site;
    item.querySelector('button').addEventListener('click', async () => {
      await saveSites(sites.filter(value => value !== site));
      showStatus(`${site} removed.`, 'success');
    });
    list.appendChild(item);
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const domain = normalizeDomain(domainInput.value);
  if (!validDomain(domain)) {
    showStatus('Enter a valid domain such as youtube.com.', 'error');
    return;
  }
  const state = await getState();
  if (state.blockedSites.includes(domain)) {
    showStatus('That site is already blocked.', 'error');
    return;
  }
  await saveSites([...state.blockedSites, domain]);
  domainInput.value = '';
  showStatus(`${domain} added.`, 'success');
});

enabled.addEventListener('change', async () => {
  await chrome.storage.local.set({ enabled: enabled.checked });
  showStatus(enabled.checked ? 'Blocking enabled.' : 'Blocking paused.', 'success');
});

adultFilter.addEventListener('change', async () => {
  await chrome.storage.local.set({ adultFilter: adultFilter.checked });
  showStatus(adultFilter.checked ? 'Adult filter enabled.' : 'Adult filter paused.', 'success');
});

clearButton.addEventListener('click', async () => {
  const state = await getState();
  if (!state.blockedSites.length) return;
  if (!confirm('Remove every custom blocked website?')) return;
  await saveSites([]);
  showStatus('Custom blocked list cleared.', 'success');
});

chrome.storage.onChanged.addListener(() => getState().then(render));
getState().then(render);
