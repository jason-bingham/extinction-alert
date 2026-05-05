# Extinction Alert

A browser extension that periodically reminds you that species are going extinct — roughly once every 20 minutes, mirroring the real-world rate.

## What it does

A background service worker fires on a randomized interval (exponential distribution, so you can't predict it) and injects an alert into whatever tab you're on. Each alert shows a randomly selected species category, a fact about its decline, a running estimate of species lost today, and a link to donate to a conservation org.

**Alert styles** (configurable):

- **Badge only** — a counter on the extension icon, no interruption
- **Toast** — small pop-up in the bottom-right corner, auto-dismisses after 8 seconds
- **Banner** — full-width bar at the top of the page, stays until dismissed
- **Full takeover** — covers the screen until you click "I Acknowledge"

**Popup controls:**

- Switch alert style
- Change the mean interval (10 min / 20 min / 1 hour / 4 hours)
- Pause and resume alerts
- Trigger a test alert immediately

The popup also shows how many alerts have fired since you opened the browser today. That counter resets at midnight.

The extinction rate used is 27,000 species per year. Species categories in the data (insects, invertebrates, plants, fish, amphibians, reptiles, birds, mammals) are weighted by their share of known extinctions.

## Install (unpacked extension)

1. Clone or download this repo.
2. Run the build (see below) — the output goes to `dist/`.
3. Open Chrome (or any Chromium-based browser) and go to `chrome://extensions`.
4. Enable **Developer mode** (toggle in the top right).
5. Click **Load unpacked** and select the `dist/` folder.

The extension will install and start scheduling alerts immediately.

To update after a code change: rebuild, then click the refresh icon on the extension card in `chrome://extensions`.

## Develop

```sh
npm install
npm run build
```

`npm run build` runs Vite and then a post-build script (`scripts/build-scripts.mjs`) that copies the content and background scripts into the right locations under `dist/`.

There's no hot-reload for extension development. After making changes, rebuild and refresh the extension in `chrome://extensions`. Use **"Test alert now"** in the popup to trigger an alert without waiting for the timer.

```sh
npm run lint   # ESLint
```

## Privacy

The extension stores settings locally using `chrome.storage`. No browsing data, tab URLs, or user information is collected, transmitted, or shared with any third party.

## Project layout

```text
src/
  background/worker.js      # Service worker — alarm scheduling, alert dispatch
  content/                  # Injected UI components (Toast, Banner, Modal)
  popup/                    # Extension popup (Popup.jsx)
  shared/storage.js         # chrome.storage wrapper, settings defaults
  data/extinctions.json     # Species categories, facts, donation orgs, rate
scripts/
  build-scripts.mjs         # Post-build copy step
manifest.json               # Extension manifest (MV3)
```

## Justification for `<all_urls>`

This extension's core function is to periodically remind users about species extinction by displaying an alert on whatever page the user is currently browsing. It cannot fulfill this purpose without permission to inject content into the active tab. `<all_urls>` is required because the reminder must appear regardless of which site the user is on — restricting to a subset of domains would render the extension useless. The extension does not read, collect, or transmit any page content. It only injects a self-contained UI overlay and removes it when dismissed.
