import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './hooks/redux'
import Layout from './components/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Dashboard from './pages/Dashboard'
import ExpensesPage from './pages/ExpensesPage'
import CategoriesPage from './pages/CategoriesPage'
import BudgetsPage from './pages/BudgetsPage'
import ReportsPage from './pages/ReportsPage'
import { useEffect } from 'react'
import { useAppDispatch } from './hooks/redux'
import { checkAuth } from './store/slices/authSlice'

function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading, isInitialized } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Always call checkAuth if not initialized
    // checkAuth will handle whether there's a token or not
    if (!isInitialized) {
      console.log('App not initialized, calling checkAuth')
      dispatch(checkAuth())
    }
  }, [dispatch, isInitialized])

  // Show loading during the initial authentication check
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Only redirect to login if we're initialized and definitely not authenticated
  if (isInitialized && !isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // User is authenticated - show protected routes
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App