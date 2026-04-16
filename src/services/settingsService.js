import { storage, STORAGE_KEYS } from './localStorage'

export const defaultSettings = {
  pharmacyName: 'Pharmacie Centrale',
  pharmacyAddress: 'Casablanca, Maroc',
  pharmacyPhone: '+212612345678',
  pharmacyEmail: 'contact@pharmacie.ma',
  currency: 'MAD',
  taxRate: 0,
  lowStockAlert: 10,
  receiptFooter: 'Merci pour votre visite ❤️',
  autoBackup: true,
  showLogo: true,
  duplicateReceipt: false,
  saleSound: true,
}

export const settingsService = {
  get: () => {
    const saved = storage.get(STORAGE_KEYS.SETTINGS)
    return { ...defaultSettings, ...(saved || {}) }
  },

  update: (newSettings) => {
    storage.set(STORAGE_KEYS.SETTINGS, newSettings)
    window.dispatchEvent(new Event('settingsUpdated'))
    return newSettings
  },

  reset: () => {
    storage.set(STORAGE_KEYS.SETTINGS, defaultSettings)
    window.dispatchEvent(new Event('settingsUpdated'))
  },
}