// api/index.ts - Updated version with better error handling
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  User,
  Expense,
  Category,
  Budget,
  MonthlyReport,
  DashboardData,
  BudgetStatus,
  CreateExpenseData,
  CreateCategoryData,
  CreateBudgetData,
  ExpenseFilters,
  PaginatedResponse
} from '../types'

// Enhanced base query with better error handling
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:5001/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    if (token) {
      // Ensure proper Bearer format
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`
      headers.set('authorization', authHeader)
    }
    
    // Always set content type
    headers.set('content-type', 'application/json')
    
    return headers
  },
})

// Enhanced base query with retry logic and error handling
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)
  
  if (result.error && result.error.status === 401) {
    // Token expired or invalid - clear it and optionally redirect to login
    localStorage.removeItem('token')
    console.log('Authentication failed - token removed')
    
    // You can dispatch a logout action here if using Redux
    // api.dispatch(logout())
    
    // Optionally redirect to login page
    window.location.href = '/login'
  }
  
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Expense', 'Category', 'Budget', 'Report'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      { access_token: string; refresh_token?: string; user: User },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Handle successful login
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.access_token) {
            localStorage.setItem('token', data.access_token)
            console.log('Login successful, token stored')
          }
        } catch (error) {
          console.error('Login failed:', error)
        }
      },
    }),
    
    register: builder.mutation<
      { access_token: string; refresh_token?: string; user: User },
      { username: string; email: string; password: string }
    >({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.access_token) {
            localStorage.setItem('token', data.access_token)
            console.log('Registration successful, token stored')
          }
        } catch (error) {
          console.error('Registration failed:', error)
        }
      },
    }),
    
    getProfile: builder.query<{ user: User }, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),

    // Expense endpoints with proper response structure
    getExpenses: builder.query<
      { 
        expenses: Array<Expense & { 
          category_name?: string; 
          category_color?: string; 
        }>; 
        pagination: {
          page: number;
          pages: number;
          total: number;
          limit: number;
        } 
      },
      ExpenseFilters
    >({
      query: (filters) => ({
        url: '/expenses',
        params: filters,
      }),
      providesTags: ['Expense'],
      // Transform response to match expected structure
      transformResponse: (response: any) => {
        console.log('Expenses API response:', response)
        return response
      },
    }),

    createExpense: builder.mutation<
      { expense: Expense; message: string },
      CreateExpenseData
    >({
      query: (expenseData) => ({
        url: '/expenses',
        method: 'POST',
        body: expenseData,
      }),
      invalidatesTags: ['Expense', 'Report', 'Budget'],
    }),

    updateExpense: builder.mutation<
      { expense: Expense; message: string },
      { id: number; data: Partial<CreateExpenseData> }
    >({
      query: ({ id, data }) => ({
        url: `/expenses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Expense', 'Report', 'Budget'],
    }),

    deleteExpense: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expense', 'Report', 'Budget'],
    }),

    // Category endpoints
    getCategories: builder.query<{ categories: Category[] }, void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),

    createCategory: builder.mutation<
      { category: Category; message: string },
      CreateCategoryData
    >({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation<
      { category: Category; message: string },
      { id: number; data: Partial<CreateCategoryData> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    deleteCategory: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    getCategoryStats: builder.query<{ category_stats: Category[] }, void>({
      query: () => '/categories/stats',
      providesTags: ['Category'],
    }),

    // Budget endpoints
    getBudgets: builder.query<{ budgets: Budget[] }, void>({
      query: () => '/budgets',
      providesTags: ['Budget'],
    }),

    createBudget: builder.mutation<
      { budget: Budget; message: string },
      CreateBudgetData
    >({
      query: (budgetData) => ({
        url: '/budgets',
        method: 'POST',
        body: budgetData,
      }),
      invalidatesTags: ['Budget'],
    }),

    deleteBudget: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/budgets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Budget'],
    }),

    getBudgetStatus: builder.query<BudgetStatus, void>({
      query: () => '/budgets/status',
      providesTags: ['Budget'],
    }),

    // Report endpoints
    getMonthlyReport: builder.query<
      MonthlyReport,
      { year?: number; month?: number }
    >({
      query: (params) => ({
        url: '/reports/monthly',
        params,
      }),
      providesTags: ['Report'],
    }),

    getDashboard: builder.query<DashboardData, void>({
      query: () => '/reports/dashboard',
      providesTags: ['Report'],
    }),

    getInsights: builder.query<{ insights: any[] }, void>({
      query: () => '/reports/insights',
      providesTags: ['Report'],
    }),

    getTrends: builder.query<any, { period?: string }>({
      query: (params) => ({
        url: '/reports/trends',
        params,
      }),
      providesTags: ['Report'],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      // Handle successful logout by clearing local storage
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled
          // Clear token from localStorage
          localStorage.removeItem('token')
          console.log('Logout successful, token removed')
        } catch (error) {
          console.error('Logout API call failed:', error)
          // Even if API call fails, we should still clear the local token
          localStorage.removeItem('token')
        }
      },
    }),

    getCategoryAnalysis: builder.query<
      any,
      { start_date?: string; end_date?: string }
    >({
      query: (params) => ({
        url: '/reports/category-analysis',
        params,
      }),
      providesTags: ['Report'],
    }),
  }),
})

export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  
  // Expenses
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  
  // Categories
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryStatsQuery,
  
  // Budgets
  useGetBudgetsQuery,
  useCreateBudgetMutation,
  useDeleteBudgetMutation,
  useGetBudgetStatusQuery,
  
  // Reports
  useGetMonthlyReportQuery,
  useGetDashboardQuery,
  useGetInsightsQuery,
  useGetTrendsQuery,
  useGetCategoryAnalysisQuery,

  useLogoutMutation,
} = api