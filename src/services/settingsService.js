import { storage, STORAGE_KEYS } from './localStorage'

const DEFAULT_SETTINGS = {
  pharmacyName: 'Pharmacy PMS',
  currency: 'USD',
  taxRate: 0,
  receiptFooter: 'Thank you for your purchase!',
  darkMode: false,
}

export const settingsService = {
  get: () => {
    const settings = storage.get(STORAGE_KEYS.SETTINGS)
    return { ...DEFAULT_SETTINGS, ...settings }
  },
  
  update: (updates) => {
    const current = settingsService.get()
    const newSettings = { ...current, ...updates }
    storage.set(STORAGE_KEYS.SETTINGS, newSettings)
    return newSettings
  },
  
  reset: () => {
    storage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
    return DEFAULT_SETTINGS
  },
}