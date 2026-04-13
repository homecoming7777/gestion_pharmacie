import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { medicineService } from '../services/medicineService'
import { supplierService } from '../services/supplierService'
import DataTable from '../components/UI/DataTable'
import ModalForm from '../components/UI/ModalForm'
import ConfirmDialog from '../components/UI/ConfirmDialog'
import SearchBar from '../components/UI/SearchBar'
import FilterBar from '../components/UI/FilterBar'
import BadgeStatus from '../components/UI/BadgeStatus'
import { formatCurrency, formatShortDate } from '../utils/formatters'
import { MEDICINE_CATEGORIES } from '../utils/constants'
import toast from 'react-hot-toast'

const Medicines = () => {
  const [medicines, setMedicines] = useState([])
  const [filteredMedicines, setFilteredMedicines] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    buyPrice: '',
    sellPrice: '',
    stock: '',
    alertThreshold: '',
    expirationDate: '',
    batchNumber: '',
    supplier: '',
    barcode: '',
    prescriptionRequired: false,
  })
  
  const suppliers = supplierService.getAll()
  
  useEffect(() => {
    loadMedicines()
  }, [])
  
  useEffect(() => {
    filterMedicines()
  }, [medicines, searchQuery, categoryFilter])
  
  const loadMedicines = () => {
    const data = medicineService.getAll()
    setMedicines(data)
    setFilteredMedicines(data)
  }
  
  const filterMedicines = () => {
    let filtered = [...medicines]
    
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.barcode?.includes(searchQuery)
      )
    }
    
    if (categoryFilter !== 'tous') {
      filtered = filtered.filter(m => m.category === categoryFilter)
    }
    
    setFilteredMedicines(filtered)
  }
  
  const getStockStatus = (medicine) => {
    if (new Date(medicine.expirationDate) < new Date()) return 'expired'
    if (medicine.stock <= medicine.alertThreshold) return 'low'
    return 'normal'
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const medicineData = {
      ...formData,
      buyPrice: parseFloat(formData.buyPrice),
      sellPrice: parseFloat(formData.sellPrice),
      stock: parseInt(formData.stock),
      alertThreshold: parseInt(formData.alertThreshold),
    }
    
    if (editingMedicine) {
      medicineService.update(editingMedicine.id, medicineData)
      toast.success('Medicine updated successfully')
    } else {
      medicineService.create(medicineData)
      toast.success('Medicine added successfully')
    }
    
    loadMedicines()
    closeModal()
  }
  
  const handleDelete = () => {
    if (deleteTarget) {
      medicineService.delete(deleteTarget.id)
      loadMedicines()
      toast.success('Medicine deleted successfully')
      setDeleteTarget(null)
    }
  }
  
  const openModal = (medicine = null) => {
    if (medicine) {
      setEditingMedicine(medicine)
      setFormData({
        name: medicine.name,
        category: medicine.category,
        description: medicine.description || '',
        buyPrice: medicine.buyPrice,
        sellPrice: medicine.sellPrice,
        stock: medicine.stock,
        alertThreshold: medicine.alertThreshold,
        expirationDate: medicine.expirationDate,
        batchNumber: medicine.batchNumber || '',
        supplier: medicine.supplier || '',
        barcode: medicine.barcode || '',
        prescriptionRequired: medicine.prescriptionRequired || false,
      })
    } else {
      setEditingMedicine(null)
      setFormData({
        name: '',
        category: '',
        description: '',
        buyPrice: '',
        sellPrice: '',
        stock: '',
        alertThreshold: '',
        expirationDate: '',
        batchNumber: '',
        supplier: '',
        barcode: '',
        prescriptionRequired: false,
      })
    }
    setIsModalOpen(true)
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingMedicine(null)
  }
  
  const columns = [
  { header: 'Nom', accessor: 'name' },
  { header: 'Catégorie', accessor: 'category' },
  {
    header: 'Prix',
    accessor: 'sellPrice',
    render: (val) => formatCurrency(val),
  },
  { header: 'Stock', accessor: 'stock' },
  {
    header: 'Expiration',
    accessor: 'expirationDate',
    render: (val) => val ? formatShortDate(val) : '-',
  },
  {
    header: 'Status',
    accessor: 'stock',
    render: (_, row) => <BadgeStatus status={getStockStatus(row)} />,
  },
]
  const actions = [
    { icon: <Edit className="w-4 h-4" />, onClick: openModal },
    { icon: <Trash2 className="w-4 h-4 text-red-500" />, onClick: setDeleteTarget },
  ]
  
  const categoryFilters = [
    { label: 'Tous', value: 'tous' },
    ...MEDICINE_CATEGORIES.map(cat => ({ label: cat, value: cat })),
  ]
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Médicaments</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un médicament
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Recherche par nom ou code-barres..." />
        <FilterBar filters={categoryFilters} activeFilter={categoryFilter} onFilterChange={setCategoryFilter} onClear={() => setCategoryFilter('all')} />
      </div>
      
      <div className="card">
        <DataTable columns={columns} data={filteredMedicines} actions={actions} />
      </div>
      
      <ModalForm isOpen={isModalOpen} onClose={closeModal} title={editingMedicine ? 'Edit Medicine' : 'Add Medicine'} onSubmit={handleSubmit}>
        <div>
          <label className="label">Nom du médicament *</label>
          <input type="text" className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <label className="label">Catégorie du médicament</label>
          <select className="input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
            <option value="">Sélectionner une catégorie</option>
            {MEDICINE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Prix d'achat</label>
            <input type="number" className="input" value={formData.buyPrice} onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })} />
          </div>
          <div>
            <label className="label">Prix de vente *</label>
            <input type="number" className="input" value={formData.sellPrice} onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Quantité en stock *</label>
            <input type="number" className="input" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
          </div>
          <div>
            <label className="label">Seuil d'alerte</label>
            <input type="number" className="input" value={formData.alertThreshold} onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Date d'expiration</label>
          <input type="date" className="input" value={formData.expirationDate} onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Numéro de lot</label>
            <input type="text" className="input" value={formData.batchNumber} onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })} />
          </div>
          <div>
            <label className="label">Fournisseur</label>
            <select className="input" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}>
              <option value="">Sélectionner un fournisseur</option>
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.companyName}>{sup.companyName}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Code-barres</label>
          <input type="text" className="input" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="prescription" checked={formData.prescriptionRequired} onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })} />
          <label htmlFor="prescription" className="text-sm">Ordonnance requise</label>
        </div>
      </ModalForm>
      
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer les médicaments"
        message={`Êtes-vous sûr de vouloir supprimer ${deleteTarget?.name}? This action cannot be undone.`}
      />
    </div>
  )
}

export default Medicines