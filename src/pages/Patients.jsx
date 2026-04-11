import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { patientService } from '../services/patientService'
import DataTable from '../components/UI/DataTable'
import ModalForm from '../components/UI/ModalForm'
import ConfirmDialog from '../components/UI/ConfirmDialog'
import SearchBar from '../components/UI/SearchBar'
import { formatCurrency, formatShortDate } from '../utils/formatters'
import toast from 'react-hot-toast'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    birthDate: '',
    allergies: '',
    chronicDiseases: '',
    totalSpent: 0,
  })

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [patients, searchQuery])

  const loadPatients = () => {
    const data = patientService.getAll()
    setPatients(data)
    setFilteredPatients(data)
  }

  const filterPatients = () => {
    let filtered = [...patients]
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery)
      )
    }
    setFilteredPatients(filtered)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingPatient) {
      patientService.update(editingPatient.id, formData)
      toast.success('Mise à jour du patient effectuée avec succès')
    } else {
      patientService.create(formData)
      toast.success('Patient ajouté avec succès')
    }
    loadPatients()
    closeModal()
  }

  const handleDelete = () => {
    if (deleteTarget) {
      patientService.delete(deleteTarget.id)
      loadPatients()
      toast.success('Patient supprimé avec succès')
      setDeleteTarget(null)
    }
  }

  const openModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient)
      setFormData({
        fullName: patient.fullName,
        phone: patient.phone || '',
        birthDate: patient.birthDate || '',
        allergies: patient.allergies || '',
        chronicDiseases: patient.chronicDiseases || '',
        totalSpent: patient.totalSpent || 0,
      })
    } else {
      setEditingPatient(null)
      setFormData({
        fullName: '',
        phone: '',
        birthDate: '',
        allergies: '',
        chronicDiseases: '',
        totalSpent: 0,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPatient(null)
  }

  const viewDetails = (patient) => {
    setSelectedPatient(patient)
  }

  const columns = [
    { header: 'Nom', accessor: 'fullName' },
    { header: 'Téléphone', accessor: 'phone' },
    { header: 'DOB', accessor: 'birthDate', render: (val) => val ? formatShortDate(val) : '-' },
    { header: 'Allergies', accessor: 'allergies' },
    { header: 'Total dépensé', accessor: 'totalSpent', render: (val) => formatCurrency(val || 0) },
  ]

  const actions = [
    { icon: <Eye className="w-4 h-4" />, onClick: viewDetails },
    { icon: <Edit className="w-4 h-4" />, onClick: openModal },
    { icon: <Trash2 className="w-4 h-4 text-red-500" />, onClick: setDeleteTarget },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Les patients</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add patient
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Rechercher par nom ou téléphone..." />

      <div className="card">
        <DataTable columns={columns} data={filteredPatients} actions={actions} onRowClick={viewDetails} />
      </div>

      <ModalForm isOpen={isModalOpen} onClose={closeModal} title={editingPatient ? 'Modifier le patient' : 'Ajouter un patient'} onSubmit={handleSubmit}>
        <div>
          <label className="label">Nom complet</label>
          <input 
            type="text" 
            className="input" 
            value={formData.fullName} 
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
            pattern="^[a-zA-ZÀ-ÿ\s\-']{2,}$"
            title="Le nom doit contenir au moins 2 caractères, lettres uniquement"
            minLength="2"
            maxLength="100"
            required 
          />
        </div>
        <div>
          <label className="label">Téléphone</label>
          <input 
            type="tel" 
            className="input" 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            pattern="^[\d\s\-\+\(\)]{10,}$"
            title="Le téléphone doit contenir au moins 10 chiffres"
            inputMode="tel"
            maxLength="20"
          />
        </div>
        <div>
          <label className="label">Date de naissance</label>
          <input 
            type="date" 
            className="input" 
            value={formData.birthDate} 
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="label">Allergies</label>
          <input 
            type="text" 
            className="input" 
            value={formData.allergies} 
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} 
            pattern="^[a-zA-ZÀ-ÿ0-9\s\-\,\.]*$"
            title="Les allergies ne doivent contenir que des lettres, chiffres, virgules et points"
            maxLength="200"
          />
        </div>
        <div>
          <label className="label">Maladies chroniques</label>
          <input 
            type="text" 
            className="input" 
            value={formData.chronicDiseases} 
            onChange={(e) => setFormData({ ...formData, chronicDiseases: e.target.value })} 
            pattern="^[a-zA-ZÀ-ÿ0-9\s\-\,\.]*$"
            title="Les maladies chroniques ne doivent contenir que des lettres, chiffres, virgules et points"
            maxLength="200"
          />
        </div>
        <div>
          <label className="label">Total dépensé</label>
          <input 
            type="number" 
            className="input" 
            value={formData.totalSpent} 
            onChange={(e) => setFormData({ ...formData, totalSpent: parseFloat(e.target.value) || 0 })} 
            step="0.01"
            min="0"
            title="Le montant total dépensé doit être un nombre positif"
            inputMode="decimal"
          />
        </div>
      </ModalForm>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer le patient"
        message={`Êtes-vous sûr de vouloir supprimer ${deleteTarget?.fullName}?`}
      />

      {/* Patient Details Modal - simplified */}
      {selectedPatient && (
        <ModalForm isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title="Détails du patient" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <p><strong>Nom complet:</strong> {selectedPatient.fullName}</p>
            <p><strong>Téléphone:</strong> {selectedPatient.phone || '-'}</p>
            <p><strong>Date de naissance:</strong> {selectedPatient.birthDate || '-'}</p>
            <p><strong>Allergies:</strong> {selectedPatient.allergies || '-'}</p>
            <p><strong>Maladies chroniques:</strong> {selectedPatient.chronicDiseases || '-'}</p>
            <p><strong>Total dépensé:</strong> {formatCurrency(selectedPatient.totalSpent || 0)}</p>
          </div>
        </ModalForm>
      )}
    </div>
  )
}

export default Patients