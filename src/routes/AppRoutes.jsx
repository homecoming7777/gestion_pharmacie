import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/Dashboard'
import Medicines from '../pages/Medicines'
import POS from '../pages/POS'
import Patients from '../pages/Patients'
import SalesHistory from '../pages/SalesHistory'
import Suppliers from '../pages/Suppliers'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="pos" element={<POS />} />
        <Route path="patients" element={<Patients />} />
        <Route path="sales-history" element={<SalesHistory />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes