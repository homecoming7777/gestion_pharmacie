import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSettings } from '../contexts/SettingsContext'

const Settings = () => {
  const { settings: globalSettings, updateSettings } = useSettings()
  const [settings, setSettings] = useState(globalSettings)

  useEffect(() => {
    setSettings(globalSettings)
  }, [globalSettings])

  const handleSave = () => {
    updateSettings(settings)
    toast.success('Paramètres enregistrés avec succès')
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-gray-500">Gérez les configurations de votre pharmacie.</p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Nom pharmacie</label>
            <input
              type="text"
              className="input"
              value={settings.pharmacyName}
              onChange={(e) =>
                setSettings({ ...settings, pharmacyName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">Footer ticket</label>
            <input
              type="text"
              className="input"
              value={settings.receiptFooter}
              onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Devise</label>
            <select
              className="input"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            >
              <option value="MAD">MAD (DH)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div>
            <label className="label">Seuil stock faible</label>
            <input
              type="number"
              className="input"
              value={settings.lowStockAlert}
              onChange={(e) => setSettings({
                ...settings,
                lowStockAlert: Number(e.target.value),
              })}
            />
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>
      </div>
    </div>
  )
}

export default Settings