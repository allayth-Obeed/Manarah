/**
 * Custom Hook for Authentication
 * يدير منطق المصادقة والحالة المتعلقة بتسجيل الدخول/الخروج
 */
import { useState, useCallback } from 'react'
import { signIn as signInApi, signUp as signUpApi, signOut as signOutApi, storeToken, getStoredToken } from '../services/authService'

const useAuth = () => {
  // حالة تسجيل الدخول
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredToken())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // تسجيل الدخول
  const signIn = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await signInApi(email, password)
      storeToken(response.accessToken)
      setIsAuthenticated(true)
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول')
      setIsAuthenticated(false)
      setUser(null)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // إنشاء حساب جديد
  const signUp = useCallback(async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await signUpApi(userData)
      storeToken(response.accessToken)
      setIsAuthenticated(true)
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err) {
      setError(err.message || 'فشل إنشاء الحساب')
      setIsAuthenticated(false)
      setUser(null)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // تسجيل الخروج
  const signOut = useCallback(async () => {
    setLoading(true)

    try {
      await signOutApi()
      setIsAuthenticated(false)
      setUser(null)
      return { success: true }
    } catch (err) {
      setError(err.message || 'فشل تسجيل الخروج')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // مسح الخطأ
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isAuthenticated,
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  }
}

export default useAuth
