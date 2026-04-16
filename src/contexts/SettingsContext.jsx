import { createContext, useContext, useEffect, useState } from 'react'
import { settingsService } from '../services/settingsService'

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(settingsService.get())

  useEffect(() => {
    const updateSettings = () => {
      setSettings(settingsService.get())
    }

    window.addEventListener('settingsUpdated', updateSettings)
    return () =>
      window.removeEventListener('settingsUpdated', updateSettings)
  }, [])

  const updateSettings = (newSettings) => {
    settingsService.update(newSettings)
    setSettings(newSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)