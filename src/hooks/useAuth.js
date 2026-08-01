import { useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout, fetchCurrentUser } from '../api/auth'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCurrentUser()
      .then((result) => setUser(result?.user ?? null))
      .catch((err) => {
        console.error('Error checking session:', err)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const signIn = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const result = await apiLogin(email, password)
      setUser(result.user)
      setLoading(false)
      return { success: true }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err.message || 'Anmeldung fehlgeschlagen'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      await apiLogout()
      setUser(null)
      return { success: true }
    } catch (err) {
      console.error('Logout error:', err)
      return { success: false, error: 'Abmeldung fehlgeschlagen' }
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }
}
