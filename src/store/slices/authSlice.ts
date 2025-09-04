import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  isInitialized: boolean
}

// Helper function to get token from localStorage safely
const getStoredToken = (): string | null => {
  try {
    const token = localStorage.getItem('token')
    console.log('Retrieved stored token:', token ? 'Token exists' : 'No token')
    return token
  } catch (error) {
    console.error('Error accessing localStorage:', error)
    return null
  }
}

// Helper function to store token safely
const storeToken = (token: string): void => {
  try {
    localStorage.setItem('token', token)
    console.log('Token stored successfully')
  } catch (error) {
    console.error('Error storing token:', error)
  }
}

// Helper function to remove token safely
const removeToken = (): void => {
  try {
    localStorage.removeItem('token')
    console.log('Token removed successfully')
  } catch (error) {
    console.error('Error removing token:', error)
  }
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
}

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Starting auth check...')
      const token = getStoredToken()
      
      if (!token) {
        console.log('No token found during auth check')
        return rejectWithValue('No token found')
      }

      console.log('Making profile request with token')
      const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Profile response status:', response.status)

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token expired or invalid')
          removeToken()
          return rejectWithValue('Token expired')
        }
        
        const errorText = await response.text()
        console.log('Profile request failed:', errorText)
        
        try {
          const errorData = JSON.parse(errorText)
          return rejectWithValue(errorData.error || 'Failed to verify token')
        } catch {
          return rejectWithValue('Failed to verify token')
        }
      }

      const data = await response.json()
      console.log('Auth check successful:', data)
      
      return { user: data.user, token }
    } catch (error: any) {
      console.error('Auth check error:', error)
      removeToken()
      return rejectWithValue(error.message || 'Authentication failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Starting logout process...')
      const token = getStoredToken()
      
      if (!token) {
        console.log('No token found during logout')
        return { message: 'Already logged out' }
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        console.log('Logout API response status:', response.status)
      } catch (apiError) {
        console.error('Logout API call failed:', apiError)
      }

      // Always clear token regardless of API response
      removeToken()
      console.log('Logout completed successfully')
      
      return { message: 'Logged out successfully' }
    } catch (error: any) {
      console.error('Logout error:', error)
      // Ensure token is removed even on error
      removeToken()
      return { message: 'Logged out locally (error occurred)' }
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      console.log('Setting credentials for user:', action.payload.user.username)
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.isInitialized = true
      state.error = null
      storeToken(token)
    },
    logout: (state) => {
      console.log('Logging out user')
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isInitialized = true
      state.error = null
      removeToken()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        console.log('Auth check pending...')
        state.loading = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log('Auth check fulfilled for user:', action.payload.user.username)
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.isInitialized = true
        state.error = null
      })
      .addCase(checkAuth.rejected, (state, action) => {
        console.log('Auth check rejected:', action.payload)
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.isInitialized = true
        state.user = null
        state.token = null
        removeToken()
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.log('Logout fulfilled')
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isInitialized = true
        state.error = null
      })
      .addCase(logoutUser.rejected, (state) => {
        console.log('Logout rejected but clearing state anyway')
        state.loading = false
        // Still logout locally even if API call failed
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isInitialized = true
        state.error = null
      })
  },
})

export const { setCredentials, logout, clearError } = authSlice.actions
export default authSlice.reducer