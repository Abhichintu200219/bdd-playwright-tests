export interface User {
  id: number
  username: string
  email: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  color: string
  icon: string
  user_id?: number
  is_default?: boolean
  created_at?: string
  expense_count?: number
  total_amount?: number
}

export interface Expense {
  id: number
  amount: number
  description: string
  notes?: string
  expense_date: string
  category_id: number
  category_name?: string
  category_color?: string
  user_id: number
  created_at: string
  updated_at?: string
}

export interface Budget {
  id: number
  amount: number
  period_type: 'monthly' | 'yearly'
  year: number
  month?: number
  category_id?: number
  category_name?: string
  category_color?: string
  user_id: number
  spent?: number
  remaining?: number
  percentage?: number
  is_over_budget?: boolean
  created_at: string
  updated_at?: string
}

export interface BudgetAlert {
  type: 'danger' | 'warning' | 'info'
  message: string
}

export interface MonthlyReport {
  period: {
    month: number
    year: number
    month_name: string
    start_date: string
    end_date: string
  }
  summary: {
    total_spent: number
    transaction_count: number
    avg_expense: number
    highest_expense: number
    lowest_expense: number
  }
  comparison: {
    previous_month_total: number
    percentage_change: number
    trend: 'increase' | 'decrease' | 'same'
  }
  category_breakdown: CategoryBreakdown[]
  daily_trend: DailyTrend[]
}

export interface CategoryBreakdown {
  id: number
  name: string
  color: string
  expense_count: number
  total_amount: number
  percentage?: number
}

export interface DailyTrend {
  expense_date: string
  daily_total: number
}

export interface TrendData {
  period: string
  total: number
}


export interface DashboardData {
  month_summary: {
    total_spent: number
    transaction_count: number
    month_name: string
    year: number
  }
  recent_expenses: Expense[]
  top_categories: CategoryBreakdown[]
  budget_summary: {
    total_budgets: number
    over_budget_count: number
  }
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ExpenseFilters {
  category_id?: number
  start_date?: string
  end_date?: string
  search?: string
  min_amount?: number
  max_amount?: number
  page?: number
  limit?: number
}

export interface CreateExpenseData {
  amount: number
  description: string
  notes?: string
  category_id: number
  expense_date?: string
}

export interface CreateCategoryData {
  name: string
  color?: string
  icon?: string
}

export interface CreateBudgetData {
  amount: number
  category_id?: number
  period_type: 'monthly' | 'yearly'
  year?: number
  month?: number
}

export interface BudgetStatus {
  budget_status: Budget[]
  alerts: BudgetAlert[]
  summary: {
    total_budget: number
    total_spent: number
    total_remaining: number
    overall_percentage: number
  }
}


// --- ADDED (paste at the end of your file) ---

// Dashboard-specific pieces you don't have yet
export interface MonthSummary {
  total_spent: number
  transaction_count: number
  month_name: string
  year: number
}

export interface RecentExpense {
  id: number
  amount: number
  description: string
  expense_date: string
  category_name: string
  category_color: string
}

export interface TopCategory {
  name: string
  color: string
  total: number
}

export interface BudgetSummary {
  total_budgets: number
  over_budget_count: number
}

// Budget status item (you already have BudgetStatus, but not this fine-grained item)
export interface BudgetStatusItem {
  category_name: string
  amount: number
  spent: number
  percentage: number
}

// Reports helpers
export interface PeriodInfo {
  month?: number
  year: number
  month_name?: string
  start_date: string
  end_date: string
}

export interface ExpenseSummary {
  total_spent: number
  transaction_count: number
  avg_expense: number
  highest_expense: number
  lowest_expense: number
}

export interface MonthlyBreakdown {
  month: number
  month_name: string
  total_amount: number
  expense_count: number
}

export interface YearlyReport {
  year: number
  summary: {
    total_spent: number
    transaction_count: number
    avg_expense: number
  }
  monthly_breakdown: MonthlyBreakdown[]
  category_breakdown: CategoryBreakdown[]
}

export interface Insight {
  type: string
  message: string
  amount?: number
  percentage?: number
  frequency?: number
  days?: number
}

export interface InsightsReport {
  insights: Insight[]
  generated_at: string
}

// Analysis / trends
export interface CategoryAnalysis extends CategoryBreakdown {
  avg_amount: number
  max_amount: number
  min_amount: number
}

export interface CategoryAnalysisReport {
  period: PeriodInfo
  total_spent: number
  category_analysis: CategoryAnalysis[]
}

// Form interfaces (useful for components / API forms)
export interface ExpenseFormData {
  amount: number
  description: string
  category_id: number
  expense_date: string
  notes?: string
}

export interface CategoryFormData {
  name: string
  color: string
}

export interface BudgetFormData {
  amount: number
  period_type: 'monthly' | 'yearly'
  month?: number
  year: number
  category_id?: number
}

export interface UserFormData {
  username: string
  email: string
  password: string
}

export interface LoginFormData {
  email: string
  password: string
}

// Utility/filter/chart pieces
export interface DateRange {
  start_date: string
  end_date: string
}

export interface ChartDataItem {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesDataItem {
  date: string
  value: number
  label?: string
}

export interface BarChartDataItem {
  name: string
  [key: string]: string | number
}

// Component props helpers
export interface StatCardProps {
  icon: React.ComponentType<any>
  name: string
  value: string | number
  bgColor?: string
  color?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

export interface EmptyStateProps {
  icon: React.ComponentType<any>
  title: string
  description?: string
  action?: React.ReactNode
}

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

// Error / validation shapes
export interface AppError {
  message: string
  code?: string | number
  details?: any
}

export interface ValidationError {
  field: string
  message: string
}

export interface FormErrors {
  [key: string]: string | string[]
}
