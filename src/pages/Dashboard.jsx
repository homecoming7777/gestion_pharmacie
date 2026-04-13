import React, { useState, useEffect } from 'react'
import { DollarSign, Package, AlertTriangle, Users, Truck, ShoppingCart } from 'lucide-react'
import { dashboardService } from '../services/dashboardService'
import StatsCard from '../components/UI/StatsCard'
import ChartCard from '../components/UI/ChartCard'
import DataTable from '../components/UI/DataTable'
import { formatCurrency, formatDate } from '../utils/formatters'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSalesToday: 0,
    revenueToday: 0,
    lowStock: 0,
    expiringSoon: 0,
    totalPatients: 0,
    totalSuppliers: 0,
  })
  const [recentSales, setRecentSales] = useState([])
  const [topMedicines, setTopMedicines] = useState([])
  
  useEffect(() => {
    setStats(dashboardService.getStats())
    setRecentSales(dashboardService.getRecentSales(5))
    setTopMedicines(dashboardService.getTopMedicines(5))
  }, [])
  
  const salesColumns = [
    { header: 'Facture', accessor: 'invoiceNumber' },
    { header: 'Date', accessor: 'date', render: (val) => formatDate(val) },
    { header: 'Patiente', accessor: 'patientName' },
    { header: 'Total', accessor: 'total', render: (val) => formatCurrency(val) },
  ]
  
  const sampleChartData = [
    { name: 'Lun', sales: 400 },
    { name: 'Mar', sales: 300 },
    { name: 'Mer', sales: 600 },
    { name: 'Jeu', sales: 800 },
    { name: 'Ven', sales: 500 },
    { name: 'Sam', sales: 700 },
    { name: 'Dim', sales: 900 },
  ]
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue ! Voici un aperçu de votre pharmacie.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard title="Today's Sales" value={stats.totalSalesToday} icon={ShoppingCart} color="blue" />
        <StatsCard title="Today's Revenue" value={formatCurrency(stats.revenueToday)} icon={DollarSign} color="green" />
        <StatsCard title="Low Stock" value={stats.lowStock} icon={Package} color="yellow" />
        <StatsCard title="Expiring Soon" value={stats.expiringSoon} icon={AlertTriangle} color="red" />
        <StatsCard title="Total Patients" value={stats.totalPatients} icon={Users} color="purple" />
        <StatsCard title="Suppliers" value={stats.totalSuppliers} icon={Truck} color="cyan" />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Sales Overview">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
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
              <Bar dataKey="quantity" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Ventes récentes</h3>
        <DataTable columns={salesColumns} data={recentSales} />
      </div>
    </div>
  )
}

export default Dashboard