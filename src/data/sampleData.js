import { storage, STORAGE_KEYS } from '../services/localStorage'
import { v4 as uuidv4 } from 'uuid'

export const initializeSampleData = () => {
  const existingPatients = storage.get(STORAGE_KEYS.PATIENTS)
  if (existingPatients && existingPatients.length > 0) return

  const names = [
    'Ahmed Benali','Sara El Mansouri','Youssef Amrani','Khadija Tazi','Omar Alaoui',
    'Salma Idrissi','Mehdi Bennani','Nadia Chraibi','Hamza Fassi','Imane Lahlou',
    'Anas Berrada','Meryem El Fassi','Zakaria Sqalli','Hajar Amrani','Soufiane El Idrissi',
    'Aya Benjelloun','Rachid Lamrani','Oumaima Tazi','Bilal Alaoui','Fatima Zahra Bennani'
  ]

  const diseases = [
    'Diabète','Asthme','Hypertension','Migraine','Cholestérol',
    'Aucune','Thyroïde','Anémie','Sinusite','Arthrite'
  ]

  const patients = names.map((fullName, index) => ({
    id: uuidv4(),
    fullName,
    phone: `+2126${String(10000000 + index * 23456).slice(0, 8)}`,
    birthDate: `19${80 + (index % 20)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
    allergies: index % 3 === 0 ? 'Pénicilline' : 'Aucune',
    chronicDiseases: diseases[index % diseases.length],
    notes: `Patient fidèle ${index + 1}`,
    totalSpent: 0,
    purchaseHistory: [],
    createdAt: new Date().toISOString(),
  }))

  
  storage.set(STORAGE_KEYS.PATIENTS, patients)
  storage.set(STORAGE_KEYS.SALES, sales)
}
