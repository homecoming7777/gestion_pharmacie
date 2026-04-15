import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { supplierService } from '../services/supplierService'
import DataTable from '../components/UI/DataTable'
import ModalForm from '../components/UI/ModalForm'
import ConfirmDialog from '../components/UI/ConfirmDialog'
import SearchBar from '../components/UI/SearchBar'
import toast from 'react-hot-toast'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [filteredSuppliers, setFilteredSuppliers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  })

  useEffect(() => {
    loadSuppliers()
  }, [])

  useEffect(() => {
    filterSuppliers()
  }, [suppliers, searchQuery])

  const loadSuppliers = () => {
    const data = supplierService.getAll()
    setSuppliers(data)
    setFilteredSuppliers(data)
  }

  const filterSuppliers = () => {
    let filtered = [...suppliers]
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredSuppliers(filtered)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSupplier) {
      supplierService.update(editingSupplier.id, formData)
      toast.success('Supplier updated successfully')
    } else {
      supplierService.create(formData)
      toast.success('Supplier added successfully')
    }
    loadSuppliers()
    closeModal()
  }

  const handleDelete = () => {
    if (deleteTarget) {
      supplierService.delete(deleteTarget.id)
      loadSuppliers()
      toast.success('Supplier deleted successfully')
      setDeleteTarget(null)
    }
  }

  const openModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier)
      setFormData({
        companyName: supplier.companyName,
        contactPerson: supplier.contactPerson || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
      })
    } else {
      setEditingSupplier(null)
      setFormData({ companyName: '', contactPerson: '', phone: '', email: '', address: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingSupplier(null)
  }

  const columns = [
    { header: 'Company', accessor: 'companyName' },
    { header: 'Contact Person', accessor: 'contactPerson' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Email', accessor: 'email' },
  ]

  const actions = [
    { icon: <Edit className="w-4 h-4" />, onClick: openModal },
    { icon: <Trash2 className="w-4 h-4 text-red-500" />, onClick: setDeleteTarget },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by company or contact..." />

      <div className="card">
        <DataTable columns={columns} data={filteredSuppliers} actions={actions} />
      </div>

      <ModalForm isOpen={isModalOpen} onClose={closeModal} title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'} onSubmit={handleSubmit}>
        <div>
          <label className="label">Company Name *</label>
          <input type="text" className="input" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
        </div>
        <div>
          <label className="label">Contact Person</label>
          <input type="text" className="input" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input type="tel" className="input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Address</label>
          <textarea className="input" rows="2" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
        </div>
      </ModalForm>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message={`Are you sure you want to delete ${deleteTarget?.companyName}?`}
      />
    </div>
  )
}

export default Suppliers