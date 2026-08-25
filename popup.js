const DEFAULTS = { enabled: true, adultFilter: true, blockedSites: [] };

const enabledToggle = document.getElementById('enabledToggle');
const adultToggle = document.getElementById('adultToggle');
const statusText = document.getElementById('statusText');
const adultStatusText = document.getElementById('adultStatusText');
const addForm = document.getElementById('addForm');
const siteInput = document.getElementById('siteInput');
const message = document.getElementById('message');
const sitesList = document.getElementById('sitesList');
const emptyState = document.getElementById('emptyState');
const siteCount = document.getElementById('siteCount');
const settingsButton = document.getElementById('settingsButton');

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
    label.length <= 63 &&
    /^[a-z0-9-]+$/i.test(label) &&
    !label.startsWith('-') && !label.endsWith('-')
  );
}

async function getState() {
  return chrome.storage.local.get(DEFAULTS);
}

function setMessage(text, isSuccess = false) {
  message.textContent = text;
  message.className = `message${isSuccess ? ' success' : ''}`;
  if (text) setTimeout(() => { if (message.textContent === text) message.textContent = ''; }, 2200);
}

function render(state) {
  const enabled = state.enabled !== false;
  const adultFilter = state.adultFilter !== false;
  const sites = Array.isArray(state.blockedSites) ? state.blockedSites : [];
  enabledToggle.checked = enabled;
  adultToggle.checked = adultFilter;
  statusText.textContent = enabled ? (sites.length ? 'Blocking is active' : 'Protection is on') : 'Blocking is paused';
  adultStatusText.textContent = adultFilter ? 'Protected by default' : 'Adult filter is off';
  siteCount.textContent = sites.length;
  sitesList.innerHTML = '';
  emptyState.style.display = sites.length ? 'none' : 'block';

  for (const site of sites) {
    const row = document.createElement('div');
    row.className = 'site-row';
    row.innerHTML = `<span class="site-name"></span><button class="remove" type="button">Remove</button>`;
    row.querySelector('.site-name').textContent = site;
    row.querySelector('.remove').addEventListener('click', () => removeSite(site));
    sitesList.appendChild(row);
  }
}

async function addSite(event) {
  event.preventDefault();
  const domain = normalizeDomain(siteInput.value);
  if (!validDomain(domain)) {
    setMessage('Enter a valid domain, e.g. youtube.com');
    return;
  }

  const state = await getState();
  const sites = Array.isArray(state.blockedSites) ? state.blockedSites : [];
  if (sites.includes(domain)) {
    setMessage('That website is already blocked.');
    return;
  }

  sites.push(domain);
  sites.sort();
  await chrome.storage.local.set({ blockedSites: sites });
  render({ ...state, blockedSites: sites });
  siteInput.value = '';
  setMessage(`${domain} is now blocked.`, true);
}

async function removeSite(domain) {
  const state = await getState();
  const sites = (state.blockedSites || []).filter(site => site !== domain);
  await chrome.storage.local.set({ blockedSites: sites });
  render({ ...state, blockedSites: sites });
  setMessage(`${domain} removed.`, true);
}

async function toggleEnabled() {
  await chrome.storage.local.set({ enabled: enabledToggle.checked });
  const state = await getState();
  render(state);
  setMessage(enabledToggle.checked ? 'Blocking enabled.' : 'Blocking paused.', true);
}

async function toggleAdultFilter() {
  await chrome.storage.local.set({ adultFilter: adultToggle.checked });
  const state = await getState();
  render(state);
  setMessage(adultToggle.checked ? 'Adult website blocking enabled.' : 'Adult filter paused.', true);
}

addForm.addEventListener('submit', addSite);
enabledToggle.addEventListener('change', toggleEnabled);
adultToggle.addEventListener('change', toggleAdultFilter);
settingsButton.addEventListener('click', () => chrome.runtime.openOptionsPage());

chrome.storage.onChanged.addListener(() => getState().then(render));
getState().then(render);
