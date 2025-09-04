import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useRegisterMutation } from '../../api/index'
import { useAppDispatch } from '../../hooks/redux'
import { setCredentials } from '../../store/slices/authSlice'

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [register, { isLoading }] = useRegisterMutation()
  const dispatch = useAppDispatch()
  const { register: registerField, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    try {
      const result = await register({
        username: data.username,
        email: data.email,
        password: data.password
      }).unwrap()
      dispatch(setCredentials({ user: result.user, token: result.access_token }))
      toast.success('Account created successfully!')
    } catch (error: any) {
      toast.error(error?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="h-186 flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-5 text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Join Us Today
            </h2>
            <p className="text-purple-100 text-sm">
              Create your account
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    {...registerField('username', { 
                      required: 'Username is required',
                      minLength: { value: 3, message: 'Username must be at least 3 characters' },
                      maxLength: { value: 50, message: 'Username cannot exceed 50 characters' }
                    })}
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white"
                    placeholder="Choose a username"
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    {...registerField('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerField('password', { 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerField('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage