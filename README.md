# Website Blocker — Free Privacy-First Chrome Extension

**Website Blocker** is a free, open-source **Google Chrome extension** for blocking distracting websites, unwanted websites, and common adult-content websites. It is designed for people who want a simple website blocker, focus tool, and privacy-friendly browser extension without subscriptions or a required account.

> **100% free for everyone, for a lifetime. Open source. Privacy first.**

[![Open Source](https://img.shields.io/badge/open%20source-yes-success)](https://github.com/7020227649/Website-Blocker)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4)](https://github.com/7020227649/Website-Blocker)
[![Free Forever](https://img.shields.io/badge/free-forever-brightgreen)](https://github.com/7020227649/Website-Blocker)

## What is Website Blocker?

Website Blocker is a **Chrome website blocker extension** that lets you block websites such as social media, video sites, distracting sites, and adult-content sites. You can add your own domains, pause protection, and manage settings from a simple browser popup.

The project is intentionally lightweight and privacy-focused. It does not require a backend service, account, subscription, advertising system, or analytics platform.

## Why use this Chrome website blocker?

Website Blocker is built for:

- **Focus and productivity** — block distracting websites while studying or working.
- **Adult-content protection** — a built-in adult website filter is enabled by default.
- **Privacy** — extension settings are stored locally in the Chrome profile.
- **Simplicity** — add a domain and block it without complicated configuration.
- **Transparency** — the complete source code is publicly available on GitHub.
- **Free access** — no subscription, no paywall, and no required account.

## Features

- Block custom websites by domain.
- Block domains and their subdomains.
- Built-in adult-content website protection.
- Enable or pause protection at any time.
- Manage blocked websites from the popup or Settings page.
- Keep the original website URL visible in the browser address bar when a page is blocked.
- Local settings using `chrome.storage.local`.
- Chrome Manifest V3 architecture.
- No external libraries required.
- No analytics or tracking built into the extension.
- No remote server required for normal operation.
- Open-source code for learning, auditing, and contribution.

## Privacy-first website blocking

This project is designed to keep the extension's own operation local to the browser.

- No browsing history is sent to a Website Blocker server.
- No Website Blocker account is required.
- No Website Blocker advertising or tracking system is built in.
- Blocked-site settings stay in the local Chrome extension storage.
- The source code is available for public inspection.

> Chrome and Google may have their own privacy and telemetry settings. This project does not add a separate Website Blocker backend for collecting browsing activity.

## 100% Free for everyone

Website Blocker is intended to remain **free for everyone for a lifetime**. There is no subscription plan, no paid tier, and no paywall for the core extension.

The goal is simple: provide a useful **free Chrome website blocker** that anyone can use, inspect, learn from, or improve.

## Install the Chrome extension locally

1. Download or clone this repository.
2. Open `chrome://extensions` in Google Chrome.
3. Turn on **Developer mode**.
4. Select **Load unpacked**.
5. Choose the `Website-Blocker` repository folder.
6. Pin **Website Blocker** to the Chrome toolbar.
7. Open the extension and add domains such as `youtube.com`, `reddit.com`, or other sites you want to block.

## For developers

This project uses:

- Google Chrome Extensions Manifest V3
- `declarativeNetRequest`
- `chrome.storage.local`
- A lightweight content script for the blocked-page experience
- Plain HTML, CSS, and JavaScript

There is no npm install or build process required for the current extension.

## Open source project

The Website Blocker source code is public on GitHub. Anyone can read the code, audit how the extension works, report issues, suggest improvements, or contribute changes.

**GitHub repository:**
https://github.com/7020227649/Website-Blocker

## Developer — Sagar Deshmukh

**Sagar Deshmukh** is the developer of Website Blocker.

**MSW | Web Developer**

Sagar Deshmukh created this project with a focus on practical web development, privacy-conscious software, open-source learning, and free tools for everyone.

**Developer profile:**
https://in.linkedin.com/in/sagar-deshmukh-social-worker

## About this project

Website Blocker is also suitable as a learning project for developers interested in Chrome extension development, browser privacy, content blocking, Manifest V3, and client-side web technologies.

The project name and description intentionally make the purpose clear: **Website Blocker is a free Chrome extension for blocking websites.**

## Search topics and keywords

This repository is relevant to people searching for:

- website blocker
- website blocker extension
- website blocker Chrome extension
- free website blocker
- free Chrome extension website blocker
- Chrome website blocker
- block websites on Chrome
- block distracting websites
- productivity website blocker
- adult website blocker
- adult-content blocker Chrome extension
- privacy website blocker
- open-source Chrome extension
- free productivity Chrome extension
- Sagar Deshmukh Website Blocker
- Sagar Deshmukh Chrome extension

## License

This project includes an open-source license in the repository. See [`LICENSE`](LICENSE) for the license text.

## Notes

- Blocking is domain-based, so blocking `youtube.com` also applies to `www.youtube.com` and matching subdomains.
- The extension intentionally stores its own settings locally.
- `chrome://` pages and Chrome Web Store pages are not blockable by ordinary extension rules.
- Search engines decide independently whether and how to index and rank public GitHub content.

---

**Website Blocker — a free, open-source, privacy-first Chrome extension by Sagar Deshmukh.**
