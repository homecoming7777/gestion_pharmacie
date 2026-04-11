import { storage, STORAGE_KEYS } from './localStorage'
import { v4 as uuidv4 } from 'uuid'

export const patientService = {
  getAll: () => {
    return storage.get(STORAGE_KEYS.PATIENTS) || []
  },
  
  getById: (id) => {
    const patients = patientService.getAll()
    return patients.find(p => p.id === id)
  },
  
  create: (patient) => {
    const patients = patientService.getAll()
    const newPatient = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      totalSpent: 0,
      purchaseHistory: [],
      ...patient,
    }
    patients.push(newPatient)
    storage.set(STORAGE_KEYS.PATIENTS, patients)
    return newPatient
  },
  
  update: (id, updates) => {
    const patients = patientService.getAll()
    const index = patients.findIndex(p => p.id === id)
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates }
      storage.set(STORAGE_KEYS.PATIENTS, patients)
      return patients[index]
    }
    return null
  },
  
  delete: (id) => {
    const patients = patientService.getAll()
    const filtered = patients.filter(p => p.id !== id)
    storage.set(STORAGE_KEYS.PATIENTS, filtered)
  },
  
  addPurchase: (patientId, sale) => {
    const patient = patientService.getById(patientId)
    if (patient) {
      const purchaseRecord = {
        saleId: sale.id,
        date: sale.date,
        total: sale.total,
        items: sale.items,
      }
      const updatedHistory = [purchaseRecord, ...(patient.purchaseHistory || [])]
      const newTotalSpent = (patient.totalSpent || 0) + sale.total
      return patientService.update(patientId, {
        purchaseHistory: updatedHistory,
        totalSpent: newTotalSpent,
      })
    }
    return null
  },
}