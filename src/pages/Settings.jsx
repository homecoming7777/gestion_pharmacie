import React, { useState, useEffect } from 'react'
import {
  Save,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Database,
} from 'lucide-react'
import { settingsService } from '../services/settingsService'
import { storage, STORAGE_KEYS } from '../services/localStorage'
import toast from 'react-hot-toast'

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

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const data = settingsService.get()
    setSettings({ ...defaultSettings, ...data })
  }

  const handleSave = () => {
    settingsService.update(settings)
    toast.success('Paramètres enregistrés avec succès')
  }

  const handleBackup = () => {
    const data = {
      medicines: storage.get(STORAGE_KEYS.MEDICINES),
      patients: storage.get(STORAGE_KEYS.PATIENTS),
      sales: storage.get(STORAGE_KEYS.SALES),
      inventory: storage.get(STORAGE_KEYS.INVENTORY_MOVEMENTS),
      suppliers: storage.get(STORAGE_KEYS.SUPPLIERS),
      settings: settings,
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

        if (data.medicines)
          storage.set(STORAGE_KEYS.MEDICINES, data.medicines)

        if (data.patients)
          storage.set(STORAGE_KEYS.PATIENTS, data.patients)

        if (data.sales)
          storage.set(STORAGE_KEYS.SALES, data.sales)

        if (data.inventory)
          storage.set(STORAGE_KEYS.INVENTORY_MOVEMENTS, data.inventory)

        if (data.suppliers)
          storage.set(STORAGE_KEYS.SUPPLIERS, data.suppliers)

        if (data.settings)
          storage.set(STORAGE_KEYS.SETTINGS, data.settings)

        toast.success('Backup restauré avec succès')
        setTimeout(() => window.location.reload(), 1000)
      } catch (error) {
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
    if (window.confirm('Tout supprimer ? Cette action est irréversible.')) {
      storage.clear()
      toast.success('Toutes les données ont été supprimées')
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <div className="card space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Informations pharmacie
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nom pharmacie</label>
              <input
                type="text"
                className="input"
                value={settings.pharmacyName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pharmacyName: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="label">Téléphone</label>
              <input
                type="text"
                className="input"
                value={settings.pharmacyPhone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pharmacyPhone: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="label">Adresse</label>
              <input
                type="text"
                className="input"
                value={settings.pharmacyAddress}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pharmacyAddress: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={settings.pharmacyEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pharmacyEmail: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Paramètres business
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Devise</label>
              <select
                className="input"
                value={settings.currency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    currency: e.target.value,
                  })
                }
              >
                <option value="MAD">MAD (DH)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="label">TVA (%)</label>
              <input
                type="number"
                className="input"
                value={settings.taxRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    taxRate: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="label">Seuil stock faible</label>
              <input
                type="number"
                className="input"
                value={settings.lowStockAlert}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    lowStockAlert: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="label">Footer ticket</label>
              <input
                type="text"
                className="input"
                value={settings.receiptFooter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    receiptFooter: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Paramètres POS
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.showLogo}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    showLogo: e.target.checked,
                  })
                }
              />
              Afficher logo sur ticket
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.duplicateReceipt}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    duplicateReceipt: e.target.checked,
                  })
                }
              />
              Imprimer ticket en double
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.saleSound}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    saleSound: e.target.checked,
                  })
                }
              />
              Son après vente
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">
            Gestion des données
          </h2>

          <div className="flex gap-4 flex-wrap">
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
    </div>
  )
}

export default Settings