import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCreateBudgetMutation, useGetCategoriesQuery } from '../api/index'
import type { CreateBudgetData } from '../types'

interface BudgetModalProps {
  onClose: () => void
}

function BudgetModal({ onClose }: BudgetModalProps) {
  const { data: categoriesData } = useGetCategoriesQuery()
  const [createBudget, { isLoading }] = useCreateBudgetMutation()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateBudgetData>({
    defaultValues: {
      period_type: 'monthly',
      year: currentYear,
      month: currentMonth,
    }
  })

  const periodType = watch('period_type')

  const onSubmit = async (data: CreateBudgetData) => {
    try {
      await createBudget(data).unwrap()
      toast.success('Budget created successfully')
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to create budget')
    }
  }

  const categories = categoriesData?.categories || []

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Add New Budget</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-1 rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Budget Amount *
            </label>
            <input
              {...register('amount', {
                required: 'Budget amount is required',
                min: { value: 1, message: 'Amount must be greater than 0' },
                valueAsNumber: true
              })}
              type="number"
              step="0.01"
              placeholder="Enter budget amount"
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register('category_id', { valueAsNumber: true })}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white appearance-none cursor-pointer"
            >
              <option value="">Total Budget (All Categories)</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Leave empty for total budget
            </p>
          </div>

          {/* Period Type and Year - Side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Period Type *
              </label>
              <select
                {...register('period_type', { required: 'Period type is required' })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white appearance-none cursor-pointer"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors.period_type && (
                <p className="mt-1 text-xs text-red-600">{errors.period_type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Year *
              </label>
              <select
                {...register('year', { 
                  required: 'Year is required',
                  valueAsNumber: true 
                })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white appearance-none cursor-pointer"
              >
                {Array.from({ length: 3 }, (_, i) => currentYear + i - 1).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.year && (
                <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>
              )}
            </div>
          </div>

          {periodType === 'monthly' && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Month *
              </label>
              <select
                {...register('month', { 
                  required: periodType === 'monthly' ? 'Month is required for monthly budgets' : false,
                  valueAsNumber: true 
                })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white appearance-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(currentYear, month - 1).toLocaleDateString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="mt-1 text-xs text-red-600">{errors.month.message}</p>
              )}
            </div>
          )}

          <div className="flex space-x-3 pt-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Budget'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetModal