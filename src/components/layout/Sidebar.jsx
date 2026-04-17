import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingCart, 
  Users, 
  History, 
  Package, 
  Truck, 
  BarChart3, 
  Settings,
  User,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/medicines', icon: Pill, label: 'Médicaments' },
  { path: '/pos', icon: ShoppingCart, label: 'POS / Ventes' },
  { path: '/patients', icon: Users, label: 'Les patients' },
  { path: '/sales-history', icon: History, label: 'Historique des ventes' },
  { path: '/inventory', icon: Package, label: 'Inventaire' },
  { path: '/suppliers', icon: Truck, label: 'Fournisseuses' },
  { path: '/reports', icon: BarChart3, label: 'Rapports' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Paramètres' },
]

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  
  const handleCloseMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.2 }}
        className="fixed lg:relative lg:!translate-x-0 w-72 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 flex flex-col"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Pharmacie Dawae
          </h1>
          <button 
            onClick={handleCloseMobile}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Système de gestion de pharmacie v1.0
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar