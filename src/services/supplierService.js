import { storage, STORAGE_KEYS } from './localStorage'
import { v4 as uuidv4 } from 'uuid'

export const supplierService = {
  getAll: () => {
    return storage.get(STORAGE_KEYS.SUPPLIERS) || []
  },
  
  getById: (id) => {
    const suppliers = supplierService.getAll()
    return suppliers.find(s => s.id === id)
  },
  
  create: (supplier) => {
    const suppliers = supplierService.getAll()
    const newSupplier = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...supplier,
    }
    suppliers.push(newSupplier)
    storage.set(STORAGE_KEYS.SUPPLIERS, suppliers)
    return newSupplier
  },
  
  update: (id, updates) => {
    const suppliers = supplierService.getAll()
    const index = suppliers.findIndex(s => s.id === id)
    if (index !== -1) {
      suppliers[index] = { ...suppliers[index], ...updates }
      storage.set(STORAGE_KEYS.SUPPLIERS, suppliers)
      return suppliers[index]
    }
    return null
  },
  
  delete: (id) => {
    const suppliers = supplierService.getAll()
    const filtered = suppliers.filter(s => s.id !== id)
    storage.set(STORAGE_KEYS.SUPPLIERS, filtered)
  },
}