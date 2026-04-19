// Custom hook for authentication - separates auth logic from UI
import { useState, useEffect, useCallback, useContext, createContext } from 'react'
import ApiService from '../services/apiService'
import AuthService from '../services/authService'

const AuthContext = createContext(null)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

export function useAuthProvider() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const checkAuth = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      const userData = await ApiService.getCurrentUser()
      setUser(userData)
    } catch (err) {
      console.error('Auth check failed:', err)
      AuthService.clearTokens()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = useCallback(async (username, password) => {
    try {
      setError(null)
      const { access_token, refresh_token } = await ApiService.login(username, password)
      AuthService.setTokens(access_token, refresh_token)
      await checkAuth()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Login failed'
      setError(message)
      return { success: false, error: message }
    }
  }, [checkAuth])

  const register = useCallback(async (userData) => {
    try {
      setError(null)
      const data = await ApiService.register(userData)
      return { success: true, data }
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Registration failed'
      setError(message)
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(() => {
    AuthService.clearTokens()
    setUser(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    checkAuth,
  }
}

export function AuthProvider({ children }) {
  const auth = useAuthProvider()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default useAuthContext
