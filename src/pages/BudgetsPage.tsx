import { useState } from 'react'
import { Plus, Target, Trash2, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react'
import { useGetBudgetsQuery, useDeleteBudgetMutation, useGetBudgetStatusQuery } from '../api/index'
import { toast } from 'react-hot-toast'
import BudgetModal from '../components/BudgetModal'
import type { Budget } from '../types/index'

function BudgetsPage() {
  const [showModal, setShowModal] = useState(false)

  const { data: budgetsData, isLoading } = useGetBudgetsQuery()
  const { data: budgetStatusData } = useGetBudgetStatusQuery()
  const [deleteBudget] = useDeleteBudgetMutation()

  const handleDeleteBudget = async (id: number, categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete the budget for "${categoryName}"?`)) {
      try {
        await deleteBudget(id).unwrap()
        toast.success('Budget deleted successfully')
      } catch (error: any) {
        toast.error(error?.data?.error || 'Failed to delete budget')
      }
    }
  }

  const budgets = budgetsData?.budgets || []
  const budgetStatus = budgetStatusData?.budget_status || []
  const alerts = budgetStatusData?.alerts || []
  const summary = budgetStatusData?.summary

  // Merge budgets with status
  const budgetsWithStatus = budgets.map(budget => {
    const status = budgetStatus.find(s => s.id === budget.id)
    return { ...budget, ...status }
  })

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-50  p-6">
        <div className="w-full h-full space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-48 animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-80 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-36 animate-pulse"></div>
          </div>
          
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Budget Cards Skeleton */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
                    <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getProgressColor = (percentage: number, isOverBudget: boolean) => {
    if (isOverBudget) return 'bg-gradient-to-r from-red-500 to-red-600'
    if (percentage >= 90) return 'bg-gradient-to-r from-amber-500 to-orange-500'
    if (percentage >= 75) return 'bg-gradient-to-r from-blue-500 to-indigo-500'
    return 'bg-gradient-to-r from-emerald-500 to-green-500'
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200 shadow-red-100'
      case 'warning': return 'bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border border-amber-200 shadow-amber-100'
      case 'info': return 'bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-800 border border-blue-200 shadow-blue-100'
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200 shadow-gray-100'
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Budgets
            </h1>
            <p className="text-lg text-gray-600">Set and track your spending limits with intelligent insights</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            <div className="flex items-center space-x-2">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Budget</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Budget Summary */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ₹{summary.total_budget.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{summary.total_spent.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl">
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Remaining</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    ₹{summary.total_remaining.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Overall Usage</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {summary.overall_percentage.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${
                  summary.overall_percentage >= 100 ? 'bg-gradient-to-r from-red-100 to-red-200' :
                  summary.overall_percentage >= 90 ? 'bg-gradient-to-r from-amber-100 to-yellow-200' :
                  'bg-gradient-to-r from-emerald-100 to-green-200'
                }`}>
                  <span className={`text-2xl font-bold ${
                    summary.overall_percentage >= 100 ? 'text-red-600' :
                    summary.overall_percentage >= 90 ? 'text-amber-600' :
                    'text-emerald-600'
                  }`}>%</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
          </div>
        )}

        {/* Budget Alerts */}
        {alerts.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <span>Budget Alerts</span>
            </h2>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-xl shadow-lg ${getAlertColor(alert.type)} hover:scale-105 transition-all duration-300`}
                >
                  <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                  <p className="text-sm font-medium">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budgets List */}
        {budgetsWithStatus.length > 0 ? (
          <div className="space-y-6">
            {budgetsWithStatus.map((budget) => (
              <div key={budget.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-6 h-6 rounded-full shadow-lg ring-2 ring-white"
                      style={{ backgroundColor: budget.category_color || '#6366f1' }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                        {budget.category_name || 'Total Budget'}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {budget.period_type === 'monthly' ? 'Monthly Budget' : 'Yearly Budget'}
                        {budget.month && ` • ${new Date(budget.year, budget.month - 1).toLocaleDateString('default', { month: 'long', year: 'numeric' })}`}
                        {budget.period_type === 'yearly' && ` • ${budget.year}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBudget(budget.id, budget.category_name || 'Total Budget')}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Budget Amount</span>
                        <span className="text-lg font-bold text-blue-600">₹{budget.amount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Spent</span>
                        <span className="text-lg font-bold text-red-600">₹{(budget.spent || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Remaining</span>
                        <span className={`text-lg font-bold ${
                          (budget.remaining || 0) < 0 ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          ₹{Math.abs(budget.remaining || 0).toLocaleString()}
                          {(budget.remaining || 0) < 0 && ' over budget'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Progress</span>
                      <span className={`text-sm font-bold ${
                        budget.is_over_budget ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {(budget.percentage || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 shadow-lg ${
                            getProgressColor(budget.percentage || 0, budget.is_over_budget || false)
                          }`}
                          style={{
                            width: `${Math.min(budget.percentage || 0, 100)}%`
                          }}
                        />
                      </div>
                      {budget.is_over_budget && (
                        <div className="absolute -top-1 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 text-center py-16">
            <div className="text-gray-500">
              <div className="relative inline-block mb-6">
                <Target className="h-20 w-20 mx-auto text-gray-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full blur-xl opacity-30"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No budgets set</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Create your first budget to track spending and achieve your financial goals</p>
              <button
                onClick={() => setShowModal(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                <div className="flex items-center space-x-2">
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span>Create Your First Budget</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        )}

        {/* Budget Modal */}
        {showModal && (
          <BudgetModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  )
}

export default BudgetsPage