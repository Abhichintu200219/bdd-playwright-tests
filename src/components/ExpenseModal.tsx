import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCreateExpenseMutation, useUpdateExpenseMutation, useGetCategoriesQuery } from '../api/index'
import type { Expense, CreateExpenseData } from '../types'

interface ExpenseModalProps {
  expense?: Expense | null
  onClose: () => void
}

function ExpenseModal({ expense, onClose }: ExpenseModalProps) {
  const { data: categoriesData } = useGetCategoriesQuery()
  const [createExpense, { isLoading: creating }] = useCreateExpenseMutation()
  const [updateExpense, { isLoading: updating }] = useUpdateExpenseMutation()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateExpenseData>({
    defaultValues: {
      amount: expense?.amount || undefined,
      description: expense?.description || '',
      notes: expense?.notes || '',
      category_id: expense?.category_id || undefined,
      expense_date: expense?.expense_date || new Date().toISOString().split('T')[0],
    }
  })

  useEffect(() => {
    if (expense) {
      reset({
        amount: expense.amount,
        description: expense.description,
        notes: expense.notes || '',
        category_id: expense.category_id,
        expense_date: expense.expense_date,
      })
    }
  }, [expense, reset])

  const onSubmit = async (data: CreateExpenseData) => {
    try {
      if (expense) {
        await updateExpense({ id: expense.id, data }).unwrap()
        toast.success('Expense updated successfully')
      } else {
        await createExpense(data).unwrap()
        toast.success('Expense created successfully')
      }
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to save expense')
    }
  }

  const categories = categoriesData?.categories || []
  const isLoading = creating || updating

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl transform transition-all duration-300 scale-100 animate-in max-h-[90vh] overflow-y-auto">
        {/* Decorative gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl opacity-20 blur-xl"></div>
        
        <div className="relative bg-white rounded-3xl p-6 border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                {expense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {expense ? 'Update your expense details' : 'Fill in the details for your new expense'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input
                  {...register('amount', { required: true })}
                  type="number"
                  step="0.01"
                  className={`w-full pl-7 pr-3 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-lg font-medium ${
                    errors.amount ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 text-white flex items-center justify-center text-xs mr-2">!</span>
                  Amount is required
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                {...register('description', { required: true })}
                type="text"
                className={`w-full px-3 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 ${
                  errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                }`}
                placeholder="What did you spend on?"
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 text-white flex items-center justify-center text-xs mr-2">!</span>
                  Description is required
                </p>
              )}
            </div>

            {/* Category and Date - Side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category_id', { required: true })}
                  className={`w-full px-3 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 ${
                    errors.category_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-xs text-red-500 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 text-white flex items-center justify-center text-xs mr-1">!</span>
                    Required
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('expense_date', { required: true })}
                  type="date"
                  className={`w-full px-3 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 ${
                    errors.expense_date ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.expense_date && (
                  <p className="text-xs text-red-500 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 text-white flex items-center justify-center text-xs mr-1">!</span>
                    Required
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Notes <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                className="w-full px-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none"
                placeholder="Additional notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed overflow-hidden"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 animate-pulse"></div>
                )}
                <span className="relative flex items-center justify-center">
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  )}
                  {isLoading ? "Saving..." : (expense ? "Update" : "Add Expense")}
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ExpenseModal