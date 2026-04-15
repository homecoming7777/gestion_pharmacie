import React, { useState, useEffect } from 'react'
import { saleService } from '../services/saleService'
import { medicineService } from '../services/medicineService'
import ChartCard from '../components/UI/ChartCard'
import DataTable from '../components/UI/DataTable'
import { formatCurrency } from '../utils/formatters'
import { exportToCSV } from '../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Download, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const Reports = () => {
  const [salesData, setSalesData] = useState([])
  const [topMedicines, setTopMedicines] = useState([])
  const [expiredMedicines, setExpiredMedicines] = useState([])

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = () => {
    const sales = saleService.getAll()
    const salesByDate = sales.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString()
      acc[date] = (acc[date] || 0) + sale.total
      return acc
    }, {})
    const chartData = Object.entries(salesByDate).map(([date, total]) => ({ date, total }))

    const medicineSales = {}
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!medicineSales[item.name]) {
          medicineSales[item.name] = { name: item.name, quantity: 0, revenue: 0 }
        }
        medicineSales[item.name].quantity += item.quantity
        medicineSales[item.name].revenue += item.price * item.quantity
      })
    })
    const topMedicinesData = Object.values(medicineSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5)

  
    const medicines = medicineService.getAll()
    const today = new Date()
    const expired = medicines.filter(m => m.expirationDate && new Date(m.expirationDate) < today)

    setSalesData(chartData)
    setTopMedicines(topMedicinesData)
    setExpiredMedicines(expired)
  }

  const handleExportCSV = () => {
    const sales = saleService.getAll()
    const exportData = sales.map(s => ({
      Invoice: s.invoiceNumber,
      Date: new Date(s.date).toLocaleDateString(),
      Patient: s.patientName,
      Total: s.total,
      Payment: s.paymentMethod,
    }))
    exportToCSV(exportData, 'sales_report.csv')
    toast.success('CSV exporté')
  }

  const columns = [
    { header: 'Médicament', accessor: 'name' },
    { header: 'Lot', accessor: 'batchNumber' },
    { header: 'Date d\'expiration', accessor: 'expirationDate' },
    { header: 'Stock', accessor: 'stock' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rapports et analyses</h1>
        <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Revenue Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Selling Medicines">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topMedicines}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Expiré / Expiration prochaine</h3>
        <DataTable columns={columns} data={expiredMedicines} />
      </div>
    </div>
  )
}

export default Reports