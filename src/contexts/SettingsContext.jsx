import React, { createContext, useContext, useEffect, useState } from 'react'
import { settingsService } from '../services/settingsService'

const defaultSettings = {
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

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    const saved = settingsService.get()
    setSettings({ ...defaultSettings, ...saved })
  }, [])

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    settingsService.update(updated)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)