import { useState } from 'react'
import { Plus, Edit, Trash2, Folder, Tag, TrendingUp, DollarSign } from 'lucide-react'
import { useGetCategoriesQuery, useDeleteCategoryMutation, useGetCategoryStatsQuery } from '../api/index'
import { toast } from 'react-hot-toast'
import CategoryModal from '../components/CategoryModal'
import type { Category } from '../types'

function CategoriesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const { data: categoriesData, isLoading } = useGetCategoriesQuery()
  const { data: statsData } = useGetCategoryStatsQuery()
  const [deleteCategory] = useDeleteCategoryMutation()

  const handleDeleteCategory = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteCategory(id).unwrap()
        toast.success('Category deleted successfully')
      } catch (error: any) {
        toast.error(error?.data?.error || 'Failed to delete category')
      }
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
  }

  const categories = categoriesData?.categories || []
  const categoryStats = statsData?.category_stats || []

  // Merge categories with stats
  const categoriesWithStats = categories.map(category => {
    const stats = categoryStats.find(stat => stat.id === category.id)
    return {
      ...category,
      expense_count: stats?.expense_count || 0,
      total_amount: stats?.total_amount || 0
    }
  })

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="w-full h-full space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-56 animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-96 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-40 animate-pulse"></div>
          </div>
          
          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full  p-6">
      <div className="w-full h-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Categories
            </h1>
            <p className="text-lg text-gray-600">Organize your expenses with custom categories and smart insights</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="group relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          >
            <div className="flex items-center space-x-2">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Category</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Categories Grid */}
        {categoriesWithStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithStats.map((category) => (
              <div
                key={category.id}
                /* Removed the gradient/blur overlay that caused the light-green tint on hover.
                   Kept hover scale + shadow for an interactive feel. */
                className="group relative bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {/* Category Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div
                        className="w-6 h-6 rounded-full shadow-lg ring-2 ring-white"
                        style={{ backgroundColor: category.color }}
                      />
                      {/* Removed the pulsing/blur overlay that sat on top of the color dot */}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900  ">
                        {category.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {category.is_default ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                            <Tag size={10} className="mr-1" />
                            Default
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200">
                            <Tag size={10} className="mr-1" />
                            Custom
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!category.is_default && (
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Category Stats */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Expenses</p>
                          <p className="text-lg font-bold text-blue-600">{category.expense_count}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Total Amount</p>
                          <p className="text-lg font-bold text-emerald-600">₹{category.total_amount.toLocaleString()}</p>
                        </div>
                       
                      </div>
                    </div>
                  </div>

                  {/* Category Activity Indicator */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Activity Level</span>
                      <span className="text-xs font-medium text-gray-500">
                        {category.expense_count > 10 ? 'High' : category.expense_count > 5 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          category.expense_count > 10 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                          category.expense_count > 5 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                          'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{
                          width: `${Math.min((category.expense_count / 15) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hover overlay removed intentionally to avoid the green blur/tint */}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 text-center py-16">
            <div className="text-gray-500">
              <div className="relative inline-block mb-6">
                <Folder className="h-20 w-20 mx-auto text-gray-300" />
                {/* Removed the green-ish blurred glow behind the folder icon */}
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No categories found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Create your first custom category to better organize and track your expenses</p>
              <button
                onClick={() => setShowModal(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              >
                <div className="flex items-center space-x-2">
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span>Create Your First Category</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showModal && (
          <CategoryModal
            category={editingCategory}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  )
}

export default CategoriesPage
