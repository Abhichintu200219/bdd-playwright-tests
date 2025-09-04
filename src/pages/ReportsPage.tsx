import { useState } from 'react'
import { Calendar, TrendingUp, PieChart, BarChart3, Folder, Sparkles, Target, DollarSign } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import {
  useGetMonthlyReportQuery,
  useGetTrendsQuery,
  useGetCategoryAnalysisQuery,
  useGetInsightsQuery
} from '../api/index'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import type { CategoryBreakdown, TrendData } from '../types'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#f97316']

function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [dateRange, setDateRange] = useState({
    start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end_date: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  })

  const { data: monthlyReport, isLoading: monthlyLoading } = useGetMonthlyReportQuery({
    year: selectedYear,
    month: selectedMonth
  })
  const { data: trendsData, isLoading: trendsLoading } = useGetTrendsQuery({ period: 'last_6_months' })
  const { data: categoryAnalysis, isLoading: categoryLoading } = useGetCategoryAnalysisQuery(dateRange)
  const { data: insightsData, isLoading: insightsLoading } = useGetInsightsQuery()

  const currentYear = new Date().getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(currentYear, i).toLocaleDateString('default', { month: 'long' })
  }))
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i)

  if (monthlyLoading && trendsLoading && categoryLoading && insightsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-80 animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-96 animate-pulse"></div>
            </div>
          </div>
          
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mr-4"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 mb-4"></div>
                <div className="h-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const insights = insightsData?.insights || []
  const trendData = trendsData?.trend_data || []
  const categoryData = categoryAnalysis?.category_analysis || []

  const dailyTrendData =
    monthlyReport?.daily_trend?.map((item) => ({
      date: format(new Date(item.expense_date), 'MMM dd'),
      amount: item.daily_total
    })) || []

  const categoryChartData =
    monthlyReport?.category_breakdown?.map((item, index) => ({
      name: item.name,
      value: item.total_amount,
      color: COLORS[index % COLORS.length]
    })) || []

  const trendsChartData =
    trendData?.map((item: TrendData) => ({
      period: item.period,
      amount: item.total
    })) || []

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50   p-6">
      <div className="w-full h-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-lg text-gray-600">Analyze your spending patterns and discover financial insights</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 px-4 py-3 text-sm bg-white/70 backdrop-blur-sm font-medium transition-all duration-200"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 px-4 py-3 text-sm bg-white/70 backdrop-blur-sm font-medium transition-all duration-200"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ">Category Analysis Period</label>
              <div className="flex gap-6">
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start_date: e.target.value }))}
                  className="rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 px-4 py-3 text-sm bg-white/70 backdrop-blur-sm font-medium transition-all duration-200"
                />
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end_date: e.target.value }))}
                  className="rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 px-4 py-3 text-sm bg-white/70 backdrop-blur-sm font-medium transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {monthlyReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Spent */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600 truncate">Total Spent</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                    ₹{monthlyReport.summary.total_spent.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>

            {/* Transactions */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600 truncate">Transactions</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent truncate">
                    {monthlyReport.summary.transaction_count}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>

            {/* Avg Expense */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600 truncate">Avg Expense</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent truncate">
                    ₹{monthlyReport.summary.avg_expense.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>

            {/* Comparison */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="flex items-center space-x-3">
                <div
                  className={`flex-shrink-0 p-3 rounded-xl ${
                    monthlyReport.comparison.trend === 'increase'
                      ? 'bg-gradient-to-r from-red-100 to-pink-100'
                      : monthlyReport.comparison.trend === 'decrease'
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100'
                      : 'bg-gradient-to-r from-gray-100 to-slate-100'
                  }`}
                >
                  <TrendingUp
                    className={`h-5 w-5 ${
                      monthlyReport.comparison.trend === 'increase'
                        ? 'text-red-600'
                        : monthlyReport.comparison.trend === 'decrease'
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600 truncate">vs Last Month</p>
                  <p
                    className={`text-2xl font-bold truncate ${
                      monthlyReport.comparison.trend === 'increase'
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'
                        : monthlyReport.comparison.trend === 'decrease'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent'
                    }`}
                  >
                    {monthlyReport.comparison.percentage_change > 0 ? '+' : ''}
                    {monthlyReport.comparison.percentage_change.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
          </div>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-violet-500" />
              <span>Smart Insights</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.slice(0, 3).map((insight, index) => (
                <div
                  key={index}
                  className="group relative p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse"></div>
                    <p className="text-sm font-medium text-violet-800">{insight.message}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Spending */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-500" />
              <span>Daily Spending - {monthlyReport?.period.month_name} {monthlyReport?.period.year}</span>
            </h2>
            {dailyTrendData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="url(#blueGradient)" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No daily data available</p>
                  <p className="text-sm text-gray-400 mt-1">Start adding expenses to see trends</p>
                </div>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <PieChart className="h-6 w-6 text-violet-500" />
              <span>Category Breakdown</span>
            </h2>
            {categoryChartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent?(percent * 100).toFixed(0):0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`₹${Number(value).toLocaleString()}`, name]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        padding: '8px 12px',
                        lineHeight: '1.6',
                      }}
                    />

                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No category data available</p>
                  <p className="text-sm text-gray-400 mt-1">Add expenses to see category breakdown</p>
                </div>
              </div>
            )}
          </div>

          {/* Trends */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-emerald-500" />
              <span>6-Month Spending Trend</span>
            </h2>
            {trendsChartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="amount" fill="url(#emeraldGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No trend data available</p>
                  <p className="text-sm text-gray-400 mt-1">Add more expenses to see spending trends</p>
                </div>
              </div>
            )}
          </div>

          {/* Category Analysis */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Target className="h-6 w-6 text-purple-500" />
              <span>Category Analysis</span>
            </h2>
            {categoryData.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {categoryData.slice(0, 8).map((category: CategoryBreakdown) => (
                  <div
                    key={category.id}
                    className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-indigo-50 border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: category.color }} />
                        <div className="absolute inset-0 rounded-full animate-pulse opacity-30" style={{ backgroundColor: category.color }}></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{category.name}</p>
                        <p className="text-xs text-gray-500 flex items-center space-x-1">
                          <DollarSign size={10} />
                          <span>{category.expense_count} expenses</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        ₹{category.total_amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{category.percentage?.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Folder className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No category analysis available</p>
                  <p className="text-sm text-gray-400 mt-1">Add expenses to see detailed analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage