import browser from 'webextension-polyfill'
import data from '../data/extinctions.json'

export function estimatedTodayCount() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const hoursElapsed = (now - startOfDay) / 3_600_000
  return Math.round(hoursElapsed * (data.ratePerYear / 365 / 24))
}

export const DEFAULTS = {
  alertLevel: 2,
  meanIntervalMinutes: 20,
  paused: false,
  chimeEnabled: true,
}

export async function getSettings() {
  const stored = await browser.storage.local.get(Object.keys(DEFAULTS))
  return { ...DEFAULTS, ...stored }
}

export async function saveSetting(key, value) {
  return browser.storage.local.set({ [key]: value })
}

