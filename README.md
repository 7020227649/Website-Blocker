# Website Blocker

A lightweight, privacy-first Google Chrome extension for blocking distracting and adult websites. Built with Chrome Manifest V3 and designed to be simple, transparent, and useful for everyone.

## Why Website Blocker?

Website Blocker is made with a clear principle: **your browsing data should stay yours**.

This project is **open source**, has **no analytics**, uses **no tracking**, and does not require a remote server or account. Your blocked-site settings are stored locally in your browser.

### 100% Free. For everyone. For a lifetime.

Website Blocker is intended to remain **free to use for everyone, with no subscription and no paywall**. The project is shared openly so people can learn from it, use it, improve it, and build on it.

## Features

- Add and remove domains from a blocked list.
- Block a domain and its subdomains.
- Built-in adult-content protection enabled by default.
- Enable or pause protection without losing your lists.
- Local settings stored with `chrome.storage.local`.
- No external libraries, build step, analytics, tracking, or remote server.
- Simple popup interface plus dedicated settings page.
- Open-source code that can be inspected and improved by the community.

## Privacy

Website Blocker is designed with privacy in mind.

- No browsing history is sent to a server.
- No personal browsing data is collected by the extension.
- No advertising or tracking system is built into the extension.
- Settings remain local to the Chrome profile where the extension is installed.

> Note: Chrome itself may collect data according to your Chrome and Google account settings. This extension does not add its own remote data collection system.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this repository folder.
5. Pin **Website Blocker** to the toolbar.
6. Open the extension and add domains such as `youtube.com` or `reddit.com`.

## How blocking works

The extension uses Chrome Manifest V3 and the `declarativeNetRequest` API to apply blocking rules in the browser. The project is intentionally lightweight and does not need a separate backend.

## Open source

This project is publicly available so anyone can read the source code, learn from it, suggest improvements, report issues, or contribute changes.

**Repository:** https://github.com/7020227649/Website-Blocker

## Developer

### Sagar Deshmukh

**MSW | Web Developer**

Developer of Website Blocker, with a focus on building practical, accessible, privacy-conscious digital tools.

🔗 **LinkedIn:** https://in.linkedin.com/in/sagar-deshmukh-social-worker

## License

This project includes an open-source license in the repository. See [`LICENSE`](LICENSE) for details.

## Notes

- Blocking is domain-based, so blocking `youtube.com` also applies to `www.youtube.com` and other subdomains.
- The extension intentionally stores its own settings locally.
- `chrome://` pages and Chrome Web Store pages are not blockable by ordinary extension rules.

---

Made with a simple goal: **help people stay focused, protect privacy, and keep useful software free for everyone.**
