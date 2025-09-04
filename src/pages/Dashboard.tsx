import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { CreditCard, Target, TrendingUp, AlertTriangle, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useGetDashboardQuery, useGetBudgetStatusQuery } from '../api/index'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316']

// Type definitions
interface StatCardProps {
  icon: React.ComponentType<any>
  name: string
  value: string | number
  bgColor?: string
  color?: string
  trend?: 'up' | 'down'
  trendValue?: string
}

interface CardProps {
  children: React.ReactNode
  title?: string
  className?: string
}

interface EmptyStateProps {
  icon: React.ComponentType<any>
  title: string
  action?: React.ReactNode
}

interface ChartDataItem {
  name: string
  value: number
  color: string
}

interface BudgetChartDataItem {
  name: string
  budget: number
  spent: number
  remaining: number
}

interface RecentExpense {
  id: number
  amount: number
  description: string
  expense_date: string
  category_name: string
  category_color: string
}

interface TopCategory {
  name: string
  color: string
  total: number
}

interface DashboardData {
  month_summary: {
    total_spent: number
    transaction_count: number
    month_name: string
    year: number
  }
  recent_expenses: RecentExpense[]
  top_categories: TopCategory[]
  budget_summary: {
    total_budgets: number
    over_budget_count: number
  }
}

interface BudgetStatus {
  summary: {
    total_budget: number
  }
  alerts: Array<{
    type: string
    message: string
  }>
  budget_status: Array<{
    category_name: string
    amount: number
    spent: number
  }>
}

// Helper function to get error message from RTK Query error
function getErrorMessage(error: any): string {
  if (error?.data?.error) {
    return error.data.error
  }
  if (error?.data?.message) {
    return error.data.message
  }
  if (error?.message) {
    return error.message
  }
  if (typeof error?.data === 'string') {
    return error.data
  }
  return 'An unexpected error occurred'
}

// Small presentational components
function StatCard({ 
  icon: Icon, 
  name, 
  value, 
  bgColor = 'from-blue-500/10 to-blue-600/10', 
  color = 'text-blue-600',
  trend,
  trendValue
}: StatCardProps) {
  return (
    <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${bgColor} ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-300`}> 
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{name}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-gray-800 transition-colors">{value}</p>
        </div>
      </div>
    </div>
  )
}

function Card({ children, title, className = "" }: CardProps) {
  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-white/20 ${className}`}> 
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      )}
      {children}
    </div>
  )
}

function EmptyState({ icon: Icon, title, action }: EmptyStateProps) {
  return (
    <div className="h-72 flex flex-col items-center justify-center text-gray-500">
      <div className="relative mb-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon className="h-8 w-8 text-gray-300" />
        </div>
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <p className="text-lg font-medium text-gray-400 mb-2">{title}</p>
      {action}
    </div>
  )
}

export default function Dashboard() {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useGetDashboardQuery()
  const { data: budgetStatus, isLoading: budgetLoading, error: budgetError } = useGetBudgetStatusQuery()

  if (dashboardLoading || budgetLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mb-3"></div>
            <div className="h-5 w-96 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-12 w-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (dashboardError || budgetError) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start">
            <div className="p-2 bg-red-100 rounded-lg mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
              <p className="text-red-700">
                {getErrorMessage(dashboardError || budgetError)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Safely access dashboard data with proper null checks
  const monthSummary = dashboardData?.month_summary
  const recentExpenses = dashboardData?.recent_expenses || []
  const topCategories = dashboardData?.top_categories || []
  const budgetSummary = dashboardData?.budget_summary

  const stats = [
    {
      name: 'This Month Spent',
      value: `₹${monthSummary?.total_spent?.toLocaleString() || 0}`,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      trend: 'up' as const,
      trendValue: '+12%'
    },
    {
      name: 'Transactions',
      value: monthSummary?.transaction_count || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'from-green-500/10 to-green-600/10',
      trend: 'up' as const,
      trendValue: '+8%'
    },
    {
      name: 'Active Budgets',
      value: budgetStatus?.summary?.total_budget ? `₹${budgetStatus.summary.total_budget.toLocaleString()}` : '₹0',
      icon: Target,
      color: 'text-amber-600',
      bgColor: 'from-amber-500/10 to-amber-600/10',
    },
    {
      name: 'Budget Alerts',
      value: budgetStatus?.alerts?.length || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'from-red-500/10 to-red-600/10',
      trend: budgetStatus?.alerts?.length ? 'down' as const : undefined,
      trendValue: budgetStatus?.alerts?.length ? '-2' : undefined
    },
  ]

  const chartData: ChartDataItem[] = (topCategories || []).map((category, index) => {
    // accept different possible property names returned by the API
    const rawValue = (category as any).total_amount ?? (category as any).total ?? (category as any).totalValue ?? 0;
    const value = Number(rawValue) || 0;
    return {
      name: category.name || `Category ${index + 1}`,
      value,
      color: COLORS[index % COLORS.length],
    };
  }).filter(item => item.value > 0); // only include categories with value > 0

  const totalChartValue = chartData.reduce((s, c) => s + c.value, 0);

  const budgetChartData: BudgetChartDataItem[] = budgetStatus?.budget_status?.map(budget => ({
    name: budget.category_name || 'Total',
    budget: budget.amount,
    spent: budget.spent || 0,
    remaining: Math.max(0, budget.amount - (budget.spent || 0)),
  })) || []

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back! Here's your expense overview for{' '}
            <span className="font-semibold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {monthSummary?.month_name || 'this month'} {monthSummary?.year || new Date().getFullYear()}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/reports" 
            className="px-6 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-700 font-medium hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            View Reports
          </Link>
          <Link 
            to="/expenses" 
            className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
          >
            <Plus size={18} className="inline mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard 
            key={stat.name} 
            icon={stat.icon} 
            name={stat.name} 
            value={stat.value} 
            bgColor={stat.bgColor} 
            color={stat.color}
            trend={stat.trend}
            trendValue={stat.trendValue}
          />
        ))}
      </div>

      {/* Budget Alerts */}
      {budgetStatus?.alerts && budgetStatus.alerts.length > 0 && (
        <Card title="Budget Alerts" className="border-l-4 border-l-red-500">
          <div className="space-y-4">
            {budgetStatus.alerts.map((alert, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden flex items-center p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  alert.type === 'danger' ? 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50 text-red-800 hover:from-red-100 hover:to-pink-100' :
                  alert.type === 'warning' ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 hover:from-amber-100 hover:to-yellow-100' :
                  'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 hover:from-blue-100 hover:to-indigo-100'
                }`}
              >
                <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                <p className="font-medium">{alert.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card title="Top Categories This Month">
          {chartData.length > 0 && totalChartValue > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ index, value, percent }) => {
                      const name = chartData[index]?.name ?? 'Category';
                      return `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`;
                    }}
                    outerRadius={100}
                    dataKey="value"
                    minAngle={3}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div>
              <EmptyState icon={CreditCard} title="No expenses this month" />
              <div className="mt-3 text-xs text-gray-500">
                <div><strong>Debug:</strong></div>
                <pre className="max-h-40 overflow-auto text-xs bg-gray-50 p-2 rounded">{JSON.stringify(topCategories, null, 2)}</pre>
                <pre className="max-h-40 overflow-auto text-xs bg-gray-50 p-2 rounded mt-2">{JSON.stringify(chartData, null, 2)}</pre>
              </div>
            </div>
          )}
        </Card>

        <Card title="Budget Overview">
          {budgetChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetChartData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="budget" fill="#e5e7eb" name="Budget" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="url(#blueGradient)" name="Spent" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={Target}
              title="No budgets set"
              action={
                <Link 
                  to="/budgets" 
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
                >
                  Create Budget
                </Link>
              }
            />
          )}
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card title="Recent Expenses">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
          <Link 
            to="/expenses" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center group transition-colors"
          >
            View all 
            <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {recentExpenses && recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl hover:from-gray-100/50 hover:to-white hover:shadow-md transition-all duration-300 border border-gray-100/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white"
                      style={{ backgroundColor: expense.category_color || '#6b7280' }}
                    />
                    <div 
                      className="absolute inset-0 w-4 h-4 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-300"
                      style={{ backgroundColor: expense.category_color || '#6b7280' }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-gray-800">{expense.description || 'No description'}</p>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                        {expense.category_name || 'Uncategorized'}
                      </span>
                      <span>•</span>
                      <span>{format(new Date(expense.expense_date), 'MMM dd')}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    ₹{expense.amount?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={CreditCard} 
            title="No expenses yet" 
            action={
              <Link 
                to="/expenses" 
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
              >
                Add Your First Expense
              </Link>
            }
          />
        )}
      </Card>
    </div>
  )
}