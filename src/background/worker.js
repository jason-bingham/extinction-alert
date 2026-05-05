import browser from 'webextension-polyfill'
import data from '../data/extinctions.json'
import { getSettings, estimatedTodayCount } from '../shared/storage.js'

const ALARM_NAME = 'extinctionAlert'

function pickWeighted(categories) {
  const r = Math.random()
  let cumulative = 0
  for (const cat of categories) {
    cumulative += cat.weight
    if (r < cumulative) return cat
  }
  return categories[categories.length - 1]
}

// Exponential distribution centered on meanMinutes, clamped to [25%, 400%] of mean.
// This models real extinction events as a Poisson process.
function nextDelayMinutes(meanMinutes) {
  const raw = -meanMinutes * Math.log(Math.random())
  const min = meanMinutes * 0.25
  const max = meanMinutes * 4
  return Math.max(min, Math.min(max, raw))
}


function updateBadge(count) {
  browser.action.setBadgeText({ text: count > 0 ? String(count) : '' })
  browser.action.setBadgeBackgroundColor({ color: '#5a3e2b' })
}

async function scheduleNext(meanMinutes) {
  await browser.alarms.clear(ALARM_NAME)
  browser.alarms.create(ALARM_NAME, {
    delayInMinutes: nextDelayMinutes(meanMinutes),
  })
}

async function fireAlert() {
  const settings = await getSettings()
  if (settings.paused) {
    await scheduleNext(settings.meanIntervalMinutes)
    return
  }

  const category = pickWeighted(data.categories)
  const factIndex = Math.floor(Math.random() * category.facts.length)
  const orgIndex = Math.floor(Math.random() * data.donationOrgs.length)
  const todayEstimate = estimatedTodayCount()

  updateBadge(todayEstimate)

  const payload = {
    type: 'SHOW_ALERT',
    alertLevel: settings.alertLevel,
    chimeEnabled: settings.chimeEnabled,
    category,
    fact: category.facts[factIndex],
    org: data.donationOrgs[orgIndex],
    todayEstimate,
  }

  // Send to all active tabs; inject content script first if not yet loaded
  const tabs = await browser.tabs.query({ active: true })
  for (const tab of tabs) {
    if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('about:')) {
      browser.tabs.sendMessage(tab.id, payload).catch(async () => {
        try {
          await browser.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content/index.js'],
          })
          browser.tabs.sendMessage(tab.id, payload).catch(() => {})
        } catch { /* tab may not allow injection (e.g. chrome-extension page) */ }
      })
    }
  }

  await scheduleNext(settings.meanIntervalMinutes)
}

browser.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings()
  updateBadge(estimatedTodayCount())
  await scheduleNext(settings.meanIntervalMinutes)
})

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    await fireAlert()
  }
})

// Allow the popup to trigger a test alert immediately
browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === 'TRIGGER_NOW') {
    await fireAlert()
  }
  if (msg.type === 'RESCHEDULE') {
    await scheduleNext(msg.meanIntervalMinutes)
  }
})
