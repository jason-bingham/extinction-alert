import { useEffect, useState } from "react";
import {
  colors,
  fontFamily,
  linkBase,
  donateBtnBase,
} from "../shared/theme.js";
import CategoryIcon from "./CategoryIcon.jsx";

export default function Modal({
  category,
  fact,
  org,
  todayEstimate,
  onDismiss,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setVisible(true));
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  function acknowledge() {
    setVisible(false);
    setTimeout(onDismiss, 350);
  }

  const backdrop = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.88)",
    backdropFilter: "blur(4px)",
    zIndex: 2147483647,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily,
    opacity: visible ? 1 : 0,
    transition: "opacity 0.35s ease",
    pointerEvents: "all",
  };

  const dialog = {
    background: colors.bg,
    color: colors.text,
    borderRadius: "16px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
    maxWidth: "540px",
    width: "calc(100% - 48px)",
    padding: "36px",
    transform: visible
      ? "scale(1) translateY(0)"
      : "scale(0.95) translateY(20px)",
    transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const eyebrow = {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: colors.link,
    marginBottom: "12px",
  };

  const headline = {
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "1.25",
    color: colors.textHeadline,
    marginBottom: "18px",
  };

  const factText = {
    fontSize: "15px",
    lineHeight: "1.65",
    color: colors.textFact,
    marginBottom: "24px",
    paddingBottom: "24px",
    borderBottom: `1px solid ${colors.border}`,
  };

  const counter = {
    fontSize: "28px",
    fontWeight: "800",
    color: colors.counterAlert,
    display: "block",
    marginBottom: "4px",
  };

  const counterLabel = {
    fontSize: "12px",
    color: colors.textMuted,
    marginBottom: "28px",
    display: "block",
  };

  const sectionTitle = {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: "12px",
  };

  const linksRow = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  };

  const linkItem = {
    ...linkBase,
    fontSize: "13px",
    padding: "8px 14px",
    borderRadius: "6px",
    display: "block",
  };

  const donateCard = {
    background: "rgba(125,46,46,0.25)",
    border: `1px solid ${colors.donateBorder}`,
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "28px",
  };

  const orgName = {
    fontWeight: "700",
    color: colors.textTitle,
    marginBottom: "4px",
    fontSize: "14px",
  };

  const orgDesc = {
    fontSize: "12px",
    color: colors.textMuted,
    marginBottom: "10px",
  };

  const donateBtn = {
    ...donateBtnBase,
    display: "inline-block",
    fontSize: "13px",
    padding: "8px 18px",
    borderRadius: "6px",
  };

  const ackBtn = {
    display: "block",
    width: "100%",
    background: colors.ackBg,
    color: "#ccc",
    border: "none",
    borderRadius: "8px",
    padding: "14px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.02em",
  };

  return (
    <div style={backdrop}>
      <div style={dialog} role="dialog" aria-modal="true">
        <div style={{ ...eyebrow, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Extinction Event
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <CategoryIcon categoryId={category.id} size={28} color={colors.textTitle} />
          <h2 style={{ ...headline, marginBottom: 0 }}>
            {category.article} {category.label.toLowerCase()} has likely gone extinct.
          </h2>
        </div>
        <p style={factText}>{fact}</p>

        <span style={counter}>{todayEstimate}</span>
        <span style={counterLabel}>estimated species lost today</span>

        <div style={sectionTitle}>Learn More</div>
        <div style={linksRow}>
          {category.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              style={linkItem}>
              {l.label} ↗
            </a>
          ))}
        </div>

        <div style={donateCard}>
          <div style={orgName}>{org.name}</div>
          <div style={orgDesc}>{org.description}</div>
          <a href={org.url} target="_blank" rel="noreferrer" style={donateBtn}>
            Donate to {org.name}
          </a>
        </div>

        <button style={ackBtn} onClick={acknowledge}>
          I Acknowledge — Continue Browsing
        </button>
      </div>
    </div>
  );
}
