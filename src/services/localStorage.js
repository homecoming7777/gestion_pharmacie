const STORAGE_KEYS = {
  MEDICINES: 'pharmacy_medicines',
  PATIENTS: 'pharmacy_patients',
  SALES: 'pharmacy_sales',
  INVENTORY_MOVEMENTS: 'pharmacy_inventory_movements',
  SUPPLIERS: 'pharmacy_suppliers',
  SETTINGS: 'pharmacy_settings',
}

export const storage = {
  get: (key) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key) => {
    localStorage.removeItem(key)
  },
  clear: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  },
}

export { STORAGE_KEYS }