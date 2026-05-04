import { useEffect, useState } from 'react'
import { colors, fontFamily, linkBase, donateBtnBase } from '../shared/theme.js'
import CategoryIcon from './CategoryIcon.jsx'

const AUTO_DISMISS_MS = 8000

export default function Toast({ category, fact, org, todayEstimate, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setLeaving(true)
    setTimeout(onDismiss, 300)
  }

  const container = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '320px',
    background: colors.bg,
    color: colors.text,
    borderRadius: '10px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
    fontFamily,
    fontSize: '13px',
    lineHeight: '1.5',
    zIndex: 2147483647,
    opacity: visible && !leaving ? 1 : 0,
    transform: visible && !leaving ? 'translateY(0)' : 'translateY(16px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents: 'all',
    overflow: 'hidden',
  }

  const header = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px 8px',
    borderBottom: `1px solid ${colors.border}`,
  }

  const title = {
    fontWeight: '600',
    fontSize: '14px',
    color: colors.textTitle,
    letterSpacing: '0.02em',
  }

  const closeBtn = {
    background: 'none',
    border: 'none',
    color: colors.textMuted,
    cursor: 'pointer',
    fontSize: '18px',
    lineHeight: 1,
    padding: '0 2px',
  }

  const body = { padding: '10px 14px 14px' }

  const factText = {
    color: colors.textFact,
    marginBottom: '12px',
    fontSize: '12px',
  }

  const row = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  }

  const link = { ...linkBase, fontSize: '12px', padding: '3px 8px' }
  const donateBtn = { ...donateBtnBase, fontSize: '12px', padding: '3px 8px' }

  const counter = {
    marginTop: '10px',
    fontSize: '11px',
    color: colors.textMuted,
  }

  return (
    <div style={container}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.textTitle} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <CategoryIcon categoryId={category.id} size={16} color={colors.textTitle} />
          <span style={title}>A {category.label.toLowerCase()} has likely gone extinct</span>
        </div>
        <button style={closeBtn} onClick={dismiss} aria-label="Dismiss">×</button>
      </div>
      <div style={body}>
        <p style={factText}>{fact}</p>
        <div style={row}>
          {category.links.slice(0, 2).map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" style={link}>{l.label}</a>
          ))}
          <a href={org.url} target="_blank" rel="noreferrer" style={donateBtn}>Donate to {org.name}</a>
        </div>
        <p style={counter}>Est. {todayEstimate} species lost today</p>
      </div>
    </div>
  )
}
