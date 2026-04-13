import { storage, STORAGE_KEYS } from '../services/localStorage'
import { v4 as uuidv4 } from 'uuid'

export const initializeSampleData = () => {
  const existingMedicines = storage.get(STORAGE_KEYS.MEDICINES)
  if (existingMedicines && existingMedicines.length > 0) return

  // ===============================
  // SUPPLIERS
  // ===============================
  const suppliers = [
    {
      id: uuidv4(),
      companyName: 'Pharma Maroc',
      contactPerson: 'Ahmed El Fassi',
      phone: '+212612345678',
      email: 'contact@pharmamaroc.ma',
      address: 'Casablanca, Maroc',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      companyName: 'Medi Santé',
      contactPerson: 'Salma Bennani',
      phone: '+212623456789',
      email: 'info@medisante.ma',
      address: 'Rabat, Maroc',
      createdAt: new Date().toISOString(),
    },
  ]

  storage.set(STORAGE_KEYS.SUPPLIERS, suppliers)

  // ===============================
  // MEDICINES
  // ===============================
  const medicines = [
    {
      id: uuidv4(),
      name: 'Doliprane 1000mg',
      category: 'Pain Relief',
      description: 'Anti douleur et fièvre',
      buyPrice: 8,
      sellPrice: 15,
      stock: 120,
      alertThreshold: 20,
      expirationDate: '2027-12-31',
      batchNumber: 'LOT001',
      supplier: suppliers[0].companyName,
      barcode: '6111111111111',
      prescriptionRequired: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Augmentin 1g',
      category: 'Antibiotics',
      description: 'Antibiotique large spectre',
      buyPrice: 25,
      sellPrice: 40,
      stock: 60,
      alertThreshold: 10,
      expirationDate: '2027-10-10',
      batchNumber: 'LOT002',
      supplier: suppliers[1].companyName,
      barcode: '6222222222222',
      prescriptionRequired: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Vitamine C',
      category: 'Vitamins',
      description: 'Complément alimentaire',
      buyPrice: 12,
      sellPrice: 20,
      stock: 200,
      alertThreshold: 30,
      expirationDate: '2028-05-15',
      batchNumber: 'LOT003',
      supplier: suppliers[0].companyName,
      barcode: '6333333333333',
      prescriptionRequired: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Amlor 5mg',
      category: 'Blood Pressure',
      description: 'Hypertension',
      buyPrice: 18,
      sellPrice: 30,
      stock: 35,
      alertThreshold: 8,
      expirationDate: '2027-08-20',
      batchNumber: 'LOT004',
      supplier: suppliers[1].companyName,
      barcode: '6444444444444',
      prescriptionRequired: true,
      createdAt: new Date().toISOString(),
    },
  ]

  storage.set(STORAGE_KEYS.MEDICINES, medicines)

  // ===============================
  // PATIENTS
  // ===============================
  const names = [
    'Ahmed Benali',
    'Fatima Zahra',
    'Youssef Alaoui',
    'Salma Idrissi',
    'Omar Tazi',
    'Meryem Chraibi',
    'Hamza El Fassi',
    'Imane Bennis',
    'Mehdi Amrani',
    'Sara Bennani',
  ]

  const diseases = ['Hypertension', 'Diabète', 'Asthme', 'Aucune']

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

  // ===============================
  // SALES / POS
  // ===============================
  const sales = patients.slice(0, 5).map((patient, index) => {
    const med = medicines[index % medicines.length]
    const quantity = index + 1
    const total = med.sellPrice * quantity

    return {
      id: uuidv4(),
      invoiceNumber: `INV-${String(index + 1).padStart(3, '0')}`,
      date: new Date(Date.now() - index * 86400000).toISOString(),
      patientId: patient.id,
      patientName: patient.fullName,
      items: [
        {
          id: med.id,
          name: med.name,
          quantity,
          price: med.sellPrice,
        },
      ],
      subtotal: total,
      discount: 0,
      tax: 0,
      total,
      paymentMethod: index % 2 === 0 ? 'Cash' : 'Card',
      status: 'completed',
    }
  })

  storage.set(STORAGE_KEYS.SALES, sales)

  // ===============================
  // UPDATE PATIENT PURCHASE HISTORY
  // ===============================
  const updatedPatients = patients.map((patient) => {
    const patientSales = sales.filter((sale) => sale.patientId === patient.id)
    const totalSpent = patientSales.reduce((sum, sale) => sum + sale.total, 0)

    return {
      ...patient,
      totalSpent,
      purchaseHistory: patientSales.map((sale) => ({
        saleId: sale.id,
        date: sale.date,
        total: sale.total,
        items: sale.items,
      })),
    }
  })

  storage.set(STORAGE_KEYS.PATIENTS, updatedPatients)

  // ===============================
  // INVENTORY MOVEMENTS
  // ===============================
  const inventoryMovements = medicines.flatMap((medicine, index) => [
    {
      id: uuidv4(),
      medicineId: medicine.id,
      medicineName: medicine.name,
      type: 'IN',
      quantity: 100 + index * 20,
      reason: 'Stock initial',
      reference: `ENT-${index + 1}`,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      medicineId: medicine.id,
      medicineName: medicine.name,
      type: 'OUT',
      quantity: 5 + index,
      reason: 'Vente POS',
      reference: `SORT-${index + 1}`,
      createdAt: new Date().toISOString(),
    },
  ])

  storage.set(STORAGE_KEYS.INVENTORY_MOVEMENTS, inventoryMovements)
}