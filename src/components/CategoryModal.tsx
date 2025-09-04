import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Palette, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../api/index'
import type { Category, CreateCategoryData } from '../types'

interface CategoryModalProps {
  category?: Category | null
  onClose: () => void
}

const COLORS = [
  { color: '#3b82f6', name: 'Blue' },
  { color: '#ef4444', name: 'Red' },
  { color: '#f59e0b', name: 'Amber' },
  { color: '#10b981', name: 'Emerald' },
  { color: '#8b5cf6', name: 'Violet' },
  { color: '#f97316', name: 'Orange' },
  { color: '#06b6d4', name: 'Cyan' },
  { color: '#84cc16', name: 'Lime' },
  { color: '#ec4899', name: 'Pink' },
  { color: '#6366f1', name: 'Indigo' },
]

const ICONS = [
  { icon: 'dollar-sign', label: 'Money', emoji: '💰' },
  { icon: 'shopping-cart', label: 'Shopping', emoji: '🛒' },
  { icon: 'car', label: 'Transport', emoji: '🚗' },
  { icon: 'home', label: 'Home', emoji: '🏠' },
  { icon: 'utensils', label: 'Food', emoji: '🍽️' },
  { icon: 'gas-pump', label: 'Fuel', emoji: '⛽' },
  { icon: 'heart', label: 'Health', emoji: '❤️' },
  { icon: 'book', label: 'Education', emoji: '📚' },
  { icon: 'plane', label: 'Travel', emoji: '✈️' },
  { icon: 'gift', label: 'Gifts', emoji: '🎁' },
]

function CategoryModal({ category, onClose }: CategoryModalProps) {
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation()

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<CreateCategoryData>({
    defaultValues: {
      name: category?.name || '',
      color: category?.color || COLORS[0].color,
      icon: category?.icon || ICONS[0].icon,
    }
  })

  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        color: category.color,
        icon: category.icon,
      })
    }
  }, [category, reset])

  const onSubmit = async (data: CreateCategoryData) => {
    try {
      if (category) {
        await updateCategory({ id: category.id, data }).unwrap()
        toast.success('Category updated successfully')
      } else {
        await createCategory(data).unwrap()
        toast.success('Category created successfully')
      }
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to save category')
    }
  }

  const isLoading = creating || updating
  const selectedColorObj = COLORS.find(c => c.color === selectedColor)
  const selectedIconObj = ICONS.find(i => i.icon === selectedIcon)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {category ? 'Edit Category' : 'Create Category'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                {...register('name', {
                  required: 'Category name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 50, message: 'Name cannot exceed 50 characters' }
                })}
                type="text"
                placeholder="Enter category name"
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Color and Icon Selection Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Color Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color *
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {COLORS.map((colorObj) => (
                    <button
                      key={colorObj.color}
                      type="button"
                      onClick={() => setValue('color', colorObj.color)}
                      className={`w-7 h-7 rounded-lg transition-all duration-200 ${
                        selectedColor === colorObj.color ? 'ring-2 ring-gray-400 scale-105' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorObj.color }}
                      title={colorObj.name}
                    >
                      {selectedColor === colorObj.color && (
                        <div className="w-1 h-1 bg-white rounded-full mx-auto"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon *
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {ICONS.map((iconObj) => (
                    <button
                      key={iconObj.icon}
                      type="button"
                      onClick={() => setValue('icon', iconObj.icon)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200 text-xs ${
                        selectedIcon === iconObj.icon 
                          ? 'border-blue-500 bg-blue-50 scale-105' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-105'
                      }`}
                      title={iconObj.label}
                    >
                      {iconObj.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                >
                  {selectedIconObj?.emoji || '💰'}
                </div>
                <span className="font-semibold text-sm text-gray-900">
                  {watch('name') || 'Category Name'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  category ? 'Update' : 'Create'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-200"
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

export default CategoryModal