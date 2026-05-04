import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { getSettings, saveSetting, DEFAULTS, estimatedTodayCount } from "../shared/storage.js";

const INTERVAL_OPTIONS = [
  { label: "~10 min", value: 10 },
  { label: "~20 min", value: 20 },
  { label: "~1 hour", value: 60 },
  { label: "~4 hours", value: 240 },
];

const LEVEL_OPTIONS = [
  {
    value: 1,
    label: "Badge only",
    desc: "Counter on the extension icon — silent.",
  },
  {
    value: 2,
    label: "Toast",
    desc: "Small pop-up in the corner. Fades after 8s.",
  },
  { value: 3, label: "Banner", desc: "Full-width bar at the top of the page." },
  {
    value: 4,
    label: "Full takeover",
    desc: "Covers the screen until you acknowledge.",
  },
];

export default function Popup() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  async function update(key, value) {
    await saveSetting(key, value);
    setSettings((s) => ({ ...s, [key]: value }));
    if (key === "meanIntervalMinutes") {
      browser.runtime.sendMessage({
        type: "RESCHEDULE",
        meanIntervalMinutes: value,
      });
    }
  }

  function triggerNow() {
    browser.runtime.sendMessage({ type: "TRIGGER_NOW" });
  }

  if (!settings) return <div className="loading">Loading…</div>;

  return (
    <div className="popup">
      <header className="popup-header">
        <h1>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Extinction Alert
        </h1>
        <p className="subtitle">
          We lose one species to extinction every ~20 minutes. This extension
          reminds you.
        </p>
      </header>

      <div className="counter-box">
        <span className="counter-num">{estimatedTodayCount()}</span>
        <span className="counter-label">estimated species lost today</span>
      </div>

      <section className="section">
        <h2 className="section-title">Alert style</h2>
        <div className="level-grid">
          {LEVEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`level-btn ${settings.alertLevel === opt.value ? "active" : ""}`}
              onClick={() => update("alertLevel", opt.value)}>
              <span className="level-name">{opt.label}</span>
              <span className="level-desc">{opt.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Mean interval</h2>
        <div className="interval-row">
          {INTERVAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`interval-btn ${settings.meanIntervalMinutes === opt.value ? "active" : ""}`}
              onClick={() => update("meanIntervalMinutes", opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
        <p className="hint">
          Actual intervals vary randomly (exponential distribution) so you
          can&apos;t predict them.
        </p>
      </section>

      <section className="section controls-row">
        <button
          className={`pause-btn ${settings.paused ? "paused" : ""}`}
          onClick={() => update("paused", !settings.paused)}>
          {settings.paused ? "▶ Resume alerts" : "⏸ Pause alerts"}
        </button>
        <button className="test-btn" onClick={triggerNow}>
          Test alert now
        </button>
      </section>

      <section className="section">
        <label className="toggle-row">
          <span className="toggle-label">🔔 Alert chime</span>
          <span className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.chimeEnabled}
              onChange={(e) => update("chimeEnabled", e.target.checked)}
            />
            <span className="toggle-track" />
          </span>
        </label>
      </section>

      <footer className="popup-footer">
        <div className="footer-links">
          <a
            href="https://www.iucnredlist.org/search?redListCategory=EX"
            target="_blank"
            rel="noreferrer">
            IUCN Extinct Species
          </a>
          {" · "}
          <a
            href="https://en.wikipedia.org/wiki/Holocene_extinction"
            target="_blank"
            rel="noreferrer">
            About extinction rates
          </a>
        </div>
        <a
          href="https://ko-fi.com/jasonbingham"
          target="_blank"
          rel="noreferrer"
          className="dev-tip-link footer-dev">
          Support the dev
        </a>
      </footer>
    </div>
  );
}
