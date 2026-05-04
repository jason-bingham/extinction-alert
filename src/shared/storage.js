import browser from 'webextension-polyfill'

export const DEFAULTS = {
  alertLevel: 2,
  meanIntervalMinutes: 20,
  paused: false,
  todayCount: 0,
  todayDate: '',
}

export async function getSettings() {
  const stored = await browser.storage.local.get(Object.keys(DEFAULTS))
  const today = new Date().toDateString()
  const result = { ...DEFAULTS, ...stored }
  // Reset daily counter at start of new day
  if (result.todayDate !== today) {
    result.todayCount = 0
    result.todayDate = today
    await browser.storage.local.set({ todayCount: 0, todayDate: today })
  }
  return result
}

export async function saveSetting(key, value) {
  return browser.storage.local.set({ [key]: value })
}

export async function incrementTodayCount() {
  const { todayCount, todayDate } = await getSettings()
  const newCount = todayCount + 1
  await browser.storage.local.set({ todayCount: newCount, todayDate })
  return newCount
}
