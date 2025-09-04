import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useLoginMutation } from '../../api/index'
import { useAppDispatch } from '../../hooks/redux'
import { setCredentials } from '../../store/slices/authSlice'

interface LoginForm {
  username: string
  password: string
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  
  
  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await login(data).unwrap()
      dispatch(setCredentials({ user: result.user, token: result.access_token }))
      toast.success('Welcome back!')
    } catch (error: any) {
      toast.error(error?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-blue-100 text-sm">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                    Username or Email
                  </label>
                  <input
                    {...register('username', { 
                      required: 'Username or email is required',
                      minLength: { value: 3, message: 'Minimum 3 characters required' }
                    })}
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white"
                    placeholder="Enter your username or email"
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white"
                      placeholder="Enter your password"
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
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage