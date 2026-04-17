import React, { useEffect, useState } from 'react'
import { Menu, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { dashboardService } from '../../services/dashboardService'
import { formatCurrency } from '../../utils/formatters'
import toast from 'react-hot-toast'

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    lowStock: 0,
    revenueToday: 0,
  })

  const [open, setOpen] = useState(false)

  const user =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(sessionStorage.getItem('user'))

  useEffect(() => {
    loadNavbarStats()

    const interval = setInterval(() => {
      loadNavbarStats()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const loadNavbarStats = () => {
    const dashboardStats = dashboardService.getStats()

    setStats({
      lowStock: dashboardStats.lowStock || 0,
      revenueToday: dashboardStats.revenueToday || 0,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    toast.success('Logged out')
    navigate('/auth')
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-4">
            <div className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-sm font-medium">
              Stock faible: {stats.lowStock}
            </div>

            <div className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
              CA aujourd’hui: {formatCurrency(stats.revenueToday)}
            </div>

            <button
              onClick={() => navigate('/pos')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            >
              Nouvelle vente
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.name || 'Administrateur'}
            </span>
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b text-sm">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setOpen(false)
                  navigate('/profile')
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="w-4 h-4" />
                Profile / Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar