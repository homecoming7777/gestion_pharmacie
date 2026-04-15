import React, { useState, useEffect } from 'react'
import { saleService } from '../services/saleService'
import DataTable from '../components/UI/DataTable'
import FilterBar from '../components/UI/FilterBar'
import ReceiptModal from '../components/UI/ReceiptModal'
import { formatCurrency, formatDate } from '../utils/formatters'
import { Eye } from 'lucide-react'

const SalesHistory = () => {
  const [sales, setSales] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedSale, setSelectedSale] = useState(null)

  useEffect(() => {
    loadSales()
  }, [])

  useEffect(() => {
    filterSales()
  }, [sales, dateFilter])

  const loadSales = () => {
    const data = saleService.getAll()
    setSales(data)
    setFilteredSales(data)
  }

  const filterSales = () => {
    let filtered = [...sales]
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    switch (dateFilter) {
      case 'aujourdhui':
        filtered = filtered.filter(s => new Date(s.date).toDateString() === today.toDateString())
        break
      case 'semaine':
        filtered = filtered.filter(s => new Date(s.date) >= startOfWeek)
        break
      case 'mois':
        filtered = filtered.filter(s => new Date(s.date) >= startOfMonth)
        break
      default:
        break
    }
    setFilteredSales(filtered)
  }

  const columns = [
    { header: 'Facture', accessor: 'invoiceNumber' },
    { header: 'Date', accessor: 'date', render: (val) => formatDate(val) },
    { header: 'Patient', accessor: 'patientName' },
    { header: 'Total', accessor: 'total', render: (val) => formatCurrency(val) },
    { header: 'Paiement', accessor: 'paymentMethod' },
  ]

  const actions = [
    { icon: <Eye className="w-4 h-4" />, onClick: (sale) => setSelectedSale(sale) },
  ]

  const filters = [
    { label: 'Tout', value: 'all' },
    { label: 'Aujourd\'hui', value: 'aujourdhui' },
    { label: 'Cette semaine', value: 'semaine' },
    { label: 'Ce mois', value: 'mois' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">History des ventes</h1>
      </div>

      <FilterBar filters={filters} activeFilter={dateFilter} onFilterChange={setDateFilter} />

      <div className="card">
        <DataTable columns={columns} data={filteredSales} actions={actions} />
      </div>

      <ReceiptModal isOpen={!!selectedSale} onClose={() => setSelectedSale(null)} sale={selectedSale} />
    </div>
  )
}

export default SalesHistory