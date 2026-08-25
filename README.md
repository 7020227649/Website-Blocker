# Website Blocker

A lightweight Google Chrome extension that blocks distracting websites using Manifest V3 and `declarativeNetRequest`.

## Features

- Add and remove domains from a blocked list.
- Block the domain and its subdomains.
- Enable or pause protection without losing the list.
- Redirect blocked top-level pages to a friendly blocked screen.
- Persist settings with `chrome.storage.local`.
- No external libraries, build step, analytics, or remote server.
- Popup plus dedicated settings page.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this repository folder.
5. Pin **Website Blocker** to the toolbar.
6. Open the extension and add domains such as `youtube.com` or `reddit.com`.

## How blocking works

The extension uses Chrome Manifest V3 and the `declarativeNetRequest` API to install dynamic rules. Only top-level page navigations are redirected, so the extension does not need to inspect page contents.

## Notes

- This version blocks by domain, so blocking `youtube.com` also blocks `www.youtube.com` and other subdomains.
- The extension intentionally stores settings locally in the browser.
- `chrome://` pages and Chrome Web Store pages are not blockable by ordinary extension rules.
