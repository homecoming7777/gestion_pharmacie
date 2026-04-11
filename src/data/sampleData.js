import { storage, STORAGE_KEYS } from '../services/localStorage'
import { v4 as uuidv4 } from 'uuid'

export const initializeSampleData = () => {
  const existingMedicines = storage.get(STORAGE_KEYS.MEDICINES)
  if (existingMedicines && existingMedicines.length > 0) return
  
  const medicines = [
    {
      id: uuidv4(),
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      description: 'Effective pain reliever and fever reducer',
      buyPrice: 5,
      sellPrice: 10,
      stock: 150,
      alertThreshold: 20,
      expirationDate: '2025-12-31',
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
      description: 'Broad-spectrum antibiotic',
      buyPrice: 15,
      sellPrice: 25,
      stock: 80,
      alertThreshold: 15,
      expirationDate: '2025-10-15',
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
      description: 'Immune support supplement',
      buyPrice: 8,
      sellPrice: 18,
      stock: 200,
      alertThreshold: 30,
      expirationDate: '2026-01-20',
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
      description: 'ACE inhibitor for hypertension',
      buyPrice: 12,
      sellPrice: 22,
      stock: 45,
      alertThreshold: 10,
      expirationDate: '2025-09-30',
      batchNumber: 'BATCH004',
      supplier: 'CardioHealth',
      barcode: '8901234567893',
      prescriptionRequired: true,
      createdAt: new Date().toISOString(),
    },
  ]
  
  storage.set(STORAGE_KEYS.MEDICINES, medicines)
  
  const patients = [
    {
      id: uuidv4(),
      fullName: 'John Doe',
      phone: '+1 234 567 8900',
      birthDate: '1985-05-15',
      allergies: 'Penicillin',
      chronicDiseases: 'Hypertension',
      notes: 'Requires regular BP monitoring',
      totalSpent: 0,
      purchaseHistory: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      fullName: 'Jane Smith',
      phone: '+1 234 567 8901',
      birthDate: '1990-08-22',
      allergies: 'None',
      chronicDiseases: 'None',
      notes: '',
      totalSpent: 0,
      purchaseHistory: [],
      createdAt: new Date().toISOString(),
    },
  ]
  
  storage.set(STORAGE_KEYS.PATIENTS, patients)
  
  const suppliers = [
    {
      id: uuidv4(),
      companyName: 'PharmaCorp',
      contactPerson: 'Michael Johnson',
      phone: '+1 234 567 8902',
      email: 'contact@pharmacorp.com',
      address: '123 Pharma Street, Industrial Area',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      companyName: 'MediCare Ltd',
      contactPerson: 'Sarah Williams',
      phone: '+1 234 567 8903',
      email: 'info@medicare.com',
      address: '456 Health Blvd, Medical District',
      createdAt: new Date().toISOString(),
    },
  ]
  
  storage.set(STORAGE_KEYS.SUPPLIERS, suppliers)
  
  const sales = [
    {
      id: uuidv4(),
      invoiceNumber: 'INV-001',
      date: new Date().toISOString(),
      patientId: patients[0].id,
      patientName: patients[0].fullName,
      items: [
        { id: medicines[0].id, name: medicines[0].name, quantity: 2, price: medicines[0].sellPrice },
        { id: medicines[2].id, name: medicines[2].name, quantity: 1, price: medicines[2].sellPrice },
      ],
      subtotal: 38,
      discount: 0,
      tax: 0,
      total: 38,
      paymentMethod: 'Cash',
      status: 'completed',
    },
  ]
  
  storage.set(STORAGE_KEYS.SALES, sales)
}