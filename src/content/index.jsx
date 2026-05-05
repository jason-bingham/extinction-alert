import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import browser from 'webextension-polyfill'
import Toast from './Toast.jsx'
import Banner from './Banner.jsx'
import Modal from './Modal.jsx'

let root = null
let setAlertGlobal = null
let pendingAlert = null

// Register at module scope so the listener is live before React mounts.
// This matters when the content script is injected dynamically — a message
// sent immediately after injection would otherwise arrive before useEffect runs.
browser.runtime.onMessage.addListener((msg) => {
  if (msg.type !== 'SHOW_ALERT') return
  if (msg.chimeEnabled) playChime()
  if (setAlertGlobal) {
    setAlertGlobal(msg)
  } else {
    pendingAlert = msg
  }
})

function playChime() {
  try {
    const ctx = new AudioContext()
    const t = ctx.currentTime

    // Heavy thud — sine drops from 48 Hz to 22 Hz fast
    const thud = ctx.createOscillator()
    const thudGain = ctx.createGain()
    thud.type = 'sine'
    thud.frequency.setValueAtTime(48, t)
    thud.frequency.exponentialRampToValueAtTime(22, t + 0.22)
    thudGain.gain.setValueAtTime(0.6, t)
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    thud.connect(thudGain)
    thudGain.connect(ctx.destination)
    thud.start(t)
    thud.stop(t + 0.4)

    // Tritone stab (D2 + Ab2) — the "devil's interval", triangle for cleaner tone
    const stab = (freq, start, dur, vol = 0.17) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(vol, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + dur)
    }
    stab(73, t, 1.8)        // D2
    stab(103, t + 0.04, 1.8) // Ab2 — tritone above D2

    setTimeout(() => ctx.close(), 2200)
  } catch (_) {}
}

function AlertHost() {
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    setAlertGlobal = setAlert
    if (pendingAlert) {
      setAlert(pendingAlert)
      pendingAlert = null
    }
    return () => {
      setAlertGlobal = null
    }
  }, [])

  if (!alert) return null

  const props = {
    category: alert.category,
    fact: alert.fact,
    org: alert.org,
    todayEstimate: alert.todayEstimate,
    onDismiss: () => setAlert(null),
  }

  if (alert.alertLevel === 2) return <Toast {...props} />
  if (alert.alertLevel === 3) return <Banner {...props} />
  if (alert.alertLevel === 4) return <Modal {...props} />
  return null
}

function mount() {
  if (document.getElementById('extinction-extension-root')) return
  const host = document.createElement('div')
  host.id = 'extinction-extension-root'
  host.style.cssText = 'all: initial; position: fixed; z-index: 2147483647; pointer-events: none;'
  document.body.appendChild(host)
  root = createRoot(host)
  root.render(<AlertHost />)
}

if (document.body) {
  mount()
} else {
  document.addEventListener('DOMContentLoaded', mount)
}
