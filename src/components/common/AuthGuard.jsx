/**
 * Auth Guard Component
 * يحمي المسارات ويتحقق من تسجيل الدخول قبل السماح بالوصول
 */
import React from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getStoredToken, removeToken, validateToken } from '../../services/authService'

const AuthGuard = ({ children }) => {
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)
  const [isValidSession, setIsValidSession] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const token = getStoredToken()

      if (!token) {
        setIsValidSession(false)
        setIsChecking(false)
        return
      }

      const result = await validateToken()
      if (!result.valid) {
        removeToken()
        setIsValidSession(false)
      } else {
        setIsValidSession(true)
      }

      setIsChecking(false)
    }

    checkSession()
  }, [location.pathname])

  if (isChecking) {
    return null
  }

  if (!isValidSession) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />
  }

  return children
}

export default AuthGuard
