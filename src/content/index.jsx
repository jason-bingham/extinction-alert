import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import browser from 'webextension-polyfill'
import Toast from './Toast.jsx'
import Banner from './Banner.jsx'
import Modal from './Modal.jsx'

let root = null

function AlertHost() {
  const [alert, setAlert] = useState(null)

  browser.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SHOW_ALERT') {
      setAlert(msg)
    }
  })

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
