import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/Dashboard'
import Medicines from '../pages/Medicines'
import Inventory from '../pages/inventory'
import POS from '../pages/POS'
import Patients from '../pages/Patients'
import SalesHistory from '../pages/SalesHistory'
import Suppliers from '../pages/Suppliers'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'
import Auth from '../pages/Auth'
import ProtectedRoute from '../components/ProtectedRoute'
import PublicRoute from '../components/PublicRoute'
import Profile from '../pages/Profile'

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile  />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="pos" element={<POS />} />
        <Route path="patients" element={<Patients />} />
        <Route path="sales-history" element={<SalesHistory />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRoutes