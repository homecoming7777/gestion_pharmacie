import { storage, STORAGE_KEYS } from '../services/localStorage'
import { v4 as uuidv4 } from 'uuid'

export const initializeSampleData = () => {
  const existingPatients = storage.get(STORAGE_KEYS.PATIENTS)
  if (existingPatients && existingPatients.length > 0) return

  const medicines = [
    {
      id: uuidv4(),
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      description: 'Antalgique et antipyrétique',
      buyPrice: 5,
      sellPrice: 10,
      stock: 150,
      alertThreshold: 20,
      expirationDate: '2026-12-31',
      batchNumber: 'BATCH001',
      supplier: 'PharmaCorp',
      barcode: '8901234567890',
      prescriptionRequired: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      description: 'Antibiotique à large spectre',
      buyPrice: 15,
      sellPrice: 25,
      stock: 80,
      alertThreshold: 15,
      expirationDate: '2026-10-15',
      batchNumber: 'BATCH002',
      supplier: 'MediCare Ltd',
      barcode: '8901234567891',
      prescriptionRequired: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Vitamin C 1000mg',
      category: 'Vitamins',
      description: 'Complément immunitaire',
      buyPrice: 8,
      sellPrice: 18,
      stock: 200,
      alertThreshold: 30,
      expirationDate: '2027-01-20',
      batchNumber: 'BATCH003',
      supplier: 'HealthPlus',
      barcode: '8901234567892',
      prescriptionRequired: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Lisinopril 10mg',
      category: 'Blood Pressure',
      description: 'Traitement hypertension',
      buyPrice: 12,
      sellPrice: 22,
      stock: 45,
      alertThreshold: 10,
      expirationDate: '2026-09-30',
      batchNumber: 'BATCH004',
      supplier: 'CardioHealth',
      barcode: '8901234567893',
      prescriptionRequired: true,
      createdAt: new Date().toISOString(),
    },
  ]

  storage.set(STORAGE_KEYS.MEDICINES, medicines)

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

  const sales = patients.map((patient, index) => {
    const med1 = medicines[index % medicines.length]
    const med2 = medicines[(index + 1) % medicines.length]
    const qty1 = (index % 3) + 1
    const qty2 = ((index + 1) % 2) + 1
    const total = qty1 * med1.sellPrice + qty2 * med2.sellPrice

    const sale = {
      id: uuidv4(),
      invoiceNumber: `INV-${String(index + 1).padStart(3, '0')}`,
      date: new Date(Date.now() - index * 86400000).toISOString(),
      patientId: patient.id,
      patientName: patient.fullName,
      items: [
        { id: med1.id, name: med1.name, quantity: qty1, price: med1.sellPrice },
        { id: med2.id, name: med2.name, quantity: qty2, price: med2.sellPrice },
      ],
      subtotal: total,
      discount: 0,
      tax: 0,
      total,
      paymentMethod: index % 2 === 0 ? 'Cash' : 'Card',
      status: 'completed',
    }

    patient.purchaseHistory = [{
      saleId: sale.id,
      date: sale.date,
      total: sale.total,
      items: sale.items,
    }]
    patient.totalSpent = total

    return sale
  })

  storage.set(STORAGE_KEYS.PATIENTS, patients)
  storage.set(STORAGE_KEYS.SALES, sales)

  const inventoryMovements = medicines.flatMap((medicine, index) => [
    {
      id: uuidv4(),
      medicineId: medicine.id,
      medicineName: medicine.name,
      type: 'IN',
      quantity: 100 + index * 25,
      reason: 'Initial stock',
      reference: `STK-IN-${String(index + 1).padStart(3, '0')}`,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    },
    {
      id: uuidv4(),
      medicineId: medicine.id,
      medicineName: medicine.name,
      type: 'OUT',
      quantity: 5 + index,
      reason: 'POS sale',
      reference: `STK-OUT-${String(index + 1).padStart(3, '0')}`,
      createdAt: new Date(Date.now() - (index + 1) * 43200000).toISOString(),
    },
  ])

  storage.set(STORAGE_KEYS.INVENTORY_MOVEMENTS, inventoryMovements)
}
