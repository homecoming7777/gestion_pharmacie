import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { inventoryService } from '../services/inventoryService'
import { medicineService } from '../services/medicineService'
import { supplierService } from '../services/supplierService'
import DataTable from '../components/UI/DataTable'
import ModalForm from '../components/UI/ModalForm'
import FilterBar from '../components/UI/FilterBar'
import BadgeStatus from '../components/UI/BadgeStatus'
import { formatDate } from '../utils/formatters'
import { MOVEMENT_TYPES } from '../utils/constants'
import toast from 'react-hot-toast'

const Inventory = () => {
  const [movements, setMovements] = useState([])
  const [filteredMovements, setFilteredMovements] = useState([])
  const [movementType, setMovementType] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [medicines, setMedicines] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState({
    type: 'IN',
    medicineId: '',
    quantity: '',
    reason: '',
    supplier: '',
    batch: '',
    expiration: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterMovements()
  }, [movements, movementType])

  const loadData = () => {
    setMovements(inventoryService.getAllMovements())
    setMedicines(medicineService.getAll())
    setSuppliers(supplierService.getAll())
  }

  const filterMovements = () => {
    let filtered = [...movements]
    if (movementType !== 'all') {
      filtered = filtered.filter(m => m.type === movementType)
    }
    setFilteredMovements(filtered)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    inventoryService.createMovement({
      ...formData,
      quantity: parseInt(formData.quantity),
    })
    toast.success('Stock movement recorded')
    loadData()
    setIsModalOpen(false)
    setFormData({ type: 'IN', medicineId: '', quantity: '', reason: '', supplier: '', batch: '', expiration: '' })
  }

  const columns = [
    { header: 'Type', accessor: 'type', render: (val) => <BadgeStatus status={val.toLowerCase()} /> },
    { header: 'Medicine', accessor: 'medicineId', render: (val) => medicines.find(m => m.id === val)?.name || val },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Old Stock', accessor: 'oldStock' },
    { header: 'New Stock', accessor: 'newStock' },
    { header: 'Reason', accessor: 'reason' },
    { header: 'Date', accessor: 'date', render: (val) => formatDate(val) },
  ]

  const typeFilters = [
    { label: 'All', value: 'all' },
    ...MOVEMENT_TYPES.map(t => ({ label: t, value: t })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mouvements de stock</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter du mouvement de stock
        </button>
      </div>

      <FilterBar filters={typeFilters} activeFilter={movementType} onFilterChange={setMovementType} />

      <div className="card">
        <DataTable columns={columns} data={filteredMovements} />
      </div>

      <ModalForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Stock Movement" onSubmit={handleSubmit}>
        <div>
          <label className="label">Type de mouvement</label>
          <select className="input" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            {MOVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Médicament</label>
          <select className="input" value={formData.medicineId} onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })} required>
            <option value="">Sélectionner un médicament</option>
            {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Quantité</label>
          <input type="number" className="input" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
        </div>
        <div>
          <label className="label">Raison</label>
          <input type="text" className="input" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
        </div>
        <div>
          <label className="label">Fournisseur (pour les mouvements d'entrée)</label>
          <select className="input" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}>
            <option value="">Sélectionner un fournisseur</option>
            {suppliers.map(s => <option key={s.id} value={s.companyName}>{s.companyName}</option>)}
          </select>
        </div>
      </ModalForm>
    </div>
  )
}

export default Inventory