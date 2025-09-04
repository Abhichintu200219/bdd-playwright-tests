import { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react'
import { useGetExpensesQuery, useDeleteExpenseMutation, useGetCategoriesQuery } from '../api/index'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import ExpenseModal from '../components/ExpenseModal'
import type { Expense, ExpenseFilters } from '../types'

function ExpensesPage() {
  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    limit: 20,
  })
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const { data: expenseData, isLoading } = useGetExpensesQuery(filters)
  const { data: categoriesData } = useGetCategoriesQuery()
  const [deleteExpense] = useDeleteExpenseMutation()

  const handleDeleteExpense = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id).unwrap()
        toast.success('Expense deleted successfully')
      } catch (error: any) {
        toast.error(error?.data?.error || 'Failed to delete expense')
      }
    }
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingExpense(null)
  }

  const handleFilterChange = (key: keyof ExpenseFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ page: 1, limit: 20 })
  }

  const expenses = expenseData?.expenses || []
  const pagination = expenseData?.pagination || { page: 1, pages: 1, total: 0 }
  const categories = categoriesData?.categories || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 animate-pulse"></div>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-40 animate-pulse"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-full mb-4 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full  bg-gradient-to-br  ">
      <div className="w-full h-full  px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Expenses
              </h1>
              <p className="text-gray-600 text-lg">Track and manage your expenses with style</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <div className="flex items-center space-x-2">
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                <span>Add Expense</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 font-medium rounded-xl border transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  showFilters
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Filter size={16} className={showFilters ? 'text-blue-600' : ''} />
                  <span>Filters</span>
                </div>
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category_id || ''}
                      onChange={(e) => handleFilterChange('category_id', e.target.value || undefined)}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.start_date || ''}
                      onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.end_date || ''}
                      onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.min_amount || ''}
                        onChange={(e) => handleFilterChange('min_amount', e.target.value || undefined)}
                        className="w-full px-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.max_amount || ''}
                        onChange={(e) => handleFilterChange('max_amount', e.target.value || undefined)}
                        className="w-full px-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={clearFilters} 
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Expenses List */}
          <div className="space-y-4">
            {expenses.length > 0 ? (
              <>
                {expenses.map((expense) => (
                  <div key={expense.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-5 h-5 rounded-full shadow-sm ring-2 ring-white"
                          style={{ backgroundColor: expense.category_color }}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                            {expense.description}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                            <span className="font-medium bg-gray-100 px-2 py-1 rounded-md">
                              {expense.category_name}
                            </span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="font-medium">
                              {format(new Date(expense.expense_date), 'MMM dd, yyyy')}
                            </span>
                            {expense.notes && (
                              <>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span className="truncate max-w-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                                  {expense.notes}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ₹{expense.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700 font-medium">
                        Showing <span className="font-bold text-blue-600">{((pagination.page - 1) * filters.limit!) + 1}</span> to{' '}
                        <span className="font-bold text-blue-600">{Math.min(pagination.page * filters.limit!, pagination.total)}</span> of{' '}
                        <span className="font-bold text-blue-600">{pagination.total}</span> expenses
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleFilterChange('page', pagination.page - 1)}
                          disabled={pagination.page <= 1}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => handleFilterChange('page', pagination.page + 1)}
                          disabled={pagination.page >= pagination.pages}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 text-center py-16">
                <div className="text-gray-500">
                  <div className="relative inline-block mb-6">
                    <Plus className="h-16 w-16 mx-auto text-gray-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-xl opacity-30"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses found</h3>
                  <p className="text-gray-500 mb-6">Start by adding your first expense and begin tracking your spending</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <div className="flex items-center space-x-2">
                      <Plus size={18} />
                      <span>Add Your First Expense</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Expense Modal */}
          {showModal && (
            <ExpenseModal
              expense={editingExpense}
              onClose={handleCloseModal}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpensesPage