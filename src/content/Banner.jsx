import { useEffect, useState } from 'react'
import { colors, fontFamily, linkBase, donateBtnBase } from '../shared/theme.js'
import CategoryIcon from './CategoryIcon.jsx'

export default function Banner({ category, fact, org, todayEstimate, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  function dismiss() {
    setLeaving(true)
    setTimeout(onDismiss, 300)
  }

  const banner = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: colors.bg,
    color: colors.text,
    zIndex: 2147483647,
    fontFamily,
    fontSize: '13px',
    lineHeight: '1.5',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    transform: visible && !leaving ? 'translateY(0)' : 'translateY(-100%)',
    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'all',
  }

  const inner = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  }

  const left = { flex: 1, minWidth: 0 }

  const title = {
    fontWeight: '700',
    fontSize: '15px',
    color: colors.textTitle,
    marginBottom: '4px',
  }

  const factText = {
    color: colors.textFact,
    fontSize: '13px',
    marginBottom: '10px',
  }

  const row = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center',
  }

  const link = { ...linkBase, fontSize: '12px', padding: '4px 10px', whiteSpace: 'nowrap' }
  const donateBtn = { ...donateBtnBase, fontSize: '12px', padding: '4px 10px', whiteSpace: 'nowrap' }

  const counter = {
    fontSize: '11px',
    color: colors.textMuted,
    marginLeft: 'auto',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
  }

  const closeBtn = {
    background: 'none',
    border: 'none',
    color: colors.textMuted,
    cursor: 'pointer',
    fontSize: '22px',
    lineHeight: 1,
    padding: '0 4px',
    flexShrink: 0,
    alignSelf: 'flex-start',
  }

  return (
    <div style={banner}>
      <div style={inner}>
        <div style={left}>
          <div style={{ ...title, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={colors.textTitle} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <CategoryIcon categoryId={category.id} size={18} color={colors.textTitle} />
            <span>{category.article} {category.label.toLowerCase()} has likely gone extinct</span>
          </div>
          <p style={factText}>{fact}</p>
          <div style={row}>
            {category.links.slice(0, 2).map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" style={link}>{l.label}</a>
            ))}
            <a href={org.url} target="_blank" rel="noreferrer" style={donateBtn}>Donate to {org.name}</a>
            <span style={counter}>Est. {todayEstimate} species lost today</span>
          </div>
        </div>
        <button style={closeBtn} onClick={dismiss} aria-label="Dismiss">×</button>
      </div>
    </div>
  )
}
