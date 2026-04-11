import { storage, STORAGE_KEYS } from './localStorage'
import { v4 as uuidv4 } from 'uuid'

export const medicineService = {
  getAll: () => {
    return storage.get(STORAGE_KEYS.MEDICINES) || []
  },
  
  getById: (id) => {
    const medicines = medicineService.getAll()
    return medicines.find(m => m.id === id)
  },
  
  create: (medicine) => {
    const medicines = medicineService.getAll()
    const newMedicine = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...medicine,
      stock: medicine.stock || 0,
    }
    medicines.push(newMedicine)
    storage.set(STORAGE_KEYS.MEDICINES, medicines)
    return newMedicine
  },
  
  update: (id, updates) => {
    const medicines = medicineService.getAll()
    const index = medicines.findIndex(m => m.id === id)
    if (index !== -1) {
      medicines[index] = { ...medicines[index], ...updates }
      storage.set(STORAGE_KEYS.MEDICINES, medicines)
      return medicines[index]
    }
    return null
  },
  
  delete: (id) => {
    const medicines = medicineService.getAll()
    const filtered = medicines.filter(m => m.id !== id)
    storage.set(STORAGE_KEYS.MEDICINES, filtered)
  },
  
  updateStock: (id, quantity, type = 'add') => {
    const medicine = medicineService.getById(id)
    if (medicine) {
      const newStock = type === 'add' ? medicine.stock + quantity : medicine.stock - quantity
      return medicineService.update(id, { stock: Math.max(0, newStock) })
    }
    return null
  },
  
  getLowStock: () => {
    const medicines = medicineService.getAll()
    return medicines.filter(m => m.stock <= (m.alertThreshold || 10))
  },
  
  getExpiringSoon: (days = 30) => {
    const medicines = medicineService.getAll()
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + days)
    return medicines.filter(m => {
      if (!m.expirationDate) return false
      const expDate = new Date(m.expirationDate)
      return expDate <= futureDate && expDate >= today
    })
  },
}