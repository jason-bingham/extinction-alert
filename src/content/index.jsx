import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import browser from 'webextension-polyfill'
import Toast from './Toast.jsx'
import Banner from './Banner.jsx'
import Modal from './Modal.jsx'

let root = null

function playChime() {
  try {
    const ctx = new AudioContext()
    const t = ctx.currentTime

    // Heavy thud — sine drops from 110 Hz to 30 Hz fast
    const thud = ctx.createOscillator()
    const thudGain = ctx.createGain()
    thud.type = 'sine'
    thud.frequency.setValueAtTime(110, t)
    thud.frequency.exponentialRampToValueAtTime(30, t + 0.22)
    thudGain.gain.setValueAtTime(0.6, t)
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    thud.connect(thudGain)
    thudGain.connect(ctx.destination)
    thud.start(t)
    thud.stop(t + 0.4)

    // Tritone stab (Bb3 + E4) — the "devil's interval", sawtooth for harshness
    const stab = (freq, start, dur, vol = 0.17) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(vol, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + dur)
    }
    stab(233, t, 1.8)        // Bb3
    stab(329, t + 0.04, 1.8) // E4 — tritone above Bb3

    setTimeout(() => ctx.close(), 2200)
  } catch (_) {}
}

function AlertHost() {
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    const handler = (msg) => {
      if (msg.type === 'SHOW_ALERT') {
        if (msg.chimeEnabled) playChime()
        setAlert(msg)
      }
    }
    browser.runtime.onMessage.addListener(handler)
    return () => browser.runtime.onMessage.removeListener(handler)
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
  if (document.getElementById('extinction-alert-root')) return
  const host = document.createElement('div')
  host.id = 'extinction-alert-root'
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
