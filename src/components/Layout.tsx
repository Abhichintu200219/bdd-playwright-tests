import { useState } from 'react'
import type{ReactNode} from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  DollarSign, 
  PieChart, 
  TrendingUp, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react'

import { logoutUser } from '../store/slices/authSlice'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAppSelector((state) => state.auth)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
  try {
    await dispatch(logoutUser()).unwrap()
    navigate('/login', { replace: true })
  } catch (error) {
    // Even if logout API fails, still navigate to login
    console.error('Logout error:', error)
    navigate('/login', { replace: true })
  }
}

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/expenses', label: 'Expenses', icon: DollarSign },
    { path: '/categories', label: 'Categories', icon: PieChart },
    { path: '/budgets', label: 'Budgets', icon: TrendingUp },
    { path: '/reports', label: 'Reports', icon: FileText },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6">
              <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
            </div>
            <nav className="mt-8 flex-1 px-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{user?.username || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">ExpenseTracker</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center px-3 py-2 text-base font-medium rounded-lg ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 h-6 w-6 ${
                      isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.label}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="mr-3 h-6 w-6 text-red-500" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout