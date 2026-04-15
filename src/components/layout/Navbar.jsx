import React from 'react'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()

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
              Stock faible: 4
            </div>

            <div className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
              CA aujourd’hui: 2,450 DH
            </div>

            <button
              onClick={() => navigate('/pos')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            >
              Nouvelle vente
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
              Administrateur
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar