import React from 'react'
import {
  Save,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Database,
} from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { storage, STORAGE_KEYS } from '../services/localStorage'
import toast from 'react-hot-toast'

const Settings = () => {
  const { settings, updateSettings } = useSettings()

  const handleSave = () => {
    updateSettings(settings)
    toast.success('Paramètres enregistrés avec succès')
  }

  const handleBackup = () => {
    const data = {
      medicines: storage.get(STORAGE_KEYS.MEDICINES),
      patients: storage.get(STORAGE_KEYS.PATIENTS),
      sales: storage.get(STORAGE_KEYS.SALES),
      inventory: storage.get(STORAGE_KEYS.INVENTORY_MOVEMENTS),
      suppliers: storage.get(STORAGE_KEYS.SUPPLIERS),
      settings,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pharmacy_backup_${new Date()
      .toISOString()
      .split('T')[0]}.json`
    a.click()

    URL.revokeObjectURL(url)
    toast.success('Backup créé avec succès')
  }

  const handleRestore = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)

        Object.entries(data).forEach(([key, value]) => {
          storage.set(`pharmacy_${key}`, value)
        })

        if (data.settings) {
          updateSettings(data.settings)
        }

        toast.success('Backup restauré avec succès')
        setTimeout(() => window.location.reload(), 1000)
      } catch {
        toast.error('Fichier invalide')
      }
    }

    reader.readAsText(file)
  }

  const clearSpecificData = (key, label) => {
    if (window.confirm(`Supprimer toutes les données ${label} ?`)) {
      storage.remove(key)
      toast.success(`${label} supprimé`)
    }
  }

  const resetAll = () => {
    if (window.confirm('Tout supprimer ?')) {
      storage.clear()
      toast.success('Toutes les données supprimées')
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <div className="card space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Informations pharmacie</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input"
              value={settings.pharmacyName}
              onChange={(e) =>
                updateSettings({ pharmacyName: e.target.value })
              }
              placeholder="Nom pharmacie"
            />

            <input
              className="input"
              value={settings.pharmacyPhone}
              onChange={(e) =>
                updateSettings({ pharmacyPhone: e.target.value })
              }
              placeholder="Téléphone"
            />

            <input
              className="input"
              value={settings.pharmacyAddress}
              onChange={(e) =>
                updateSettings({ pharmacyAddress: e.target.value })
              }
              placeholder="Adresse"
            />

            <input
              className="input"
              value={settings.pharmacyEmail}
              onChange={(e) =>
                updateSettings({ pharmacyEmail: e.target.value })
              }
              placeholder="Email"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Business</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <select
              className="input"
              value={settings.currency}
              onChange={(e) =>
                updateSettings({ currency: e.target.value })
              }
            >
              <option value="MAD">MAD (DH)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>

            <input
              type="number"
              className="input"
              value={settings.taxRate}
              onChange={(e) =>
                updateSettings({ taxRate: Number(e.target.value) })
              }
            />

            <input
              type="number"
              className="input"
              value={settings.lowStockAlert}
              onChange={(e) =>
                updateSettings({
                  lowStockAlert: Number(e.target.value),
                })
              }
            />

            <input
              className="input"
              value={settings.receiptFooter}
              onChange={(e) =>
                updateSettings({
                  receiptFooter: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.showLogo}
              onChange={(e) =>
                updateSettings({ showLogo: e.target.checked })
              }
            />
            Afficher logo ticket
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.duplicateReceipt}
              onChange={(e) =>
                updateSettings({
                  duplicateReceipt: e.target.checked,
                })
              }
            />
            Ticket en double
          </label>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>

        <div className="border-t pt-6 flex flex-wrap gap-4">
          <button
            onClick={handleBackup}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Backup
          </button>

          <label className="btn-secondary flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Restaurer
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="hidden"
            />
          </label>

          <button
            onClick={() =>
              clearSpecificData(STORAGE_KEYS.SALES, 'ventes')
            }
            className="btn-warning flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Sales
          </button>

          <button
            onClick={() =>
              clearSpecificData(STORAGE_KEYS.PATIENTS, 'patients')
            }
            className="btn-warning flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Clear Patients
          </button>

          <button
            onClick={resetAll}
            className="btn-danger flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings