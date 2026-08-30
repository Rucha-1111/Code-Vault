import React, { createContext, useContext, useState, useCallback } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('gc_user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('gc_token'))

  const persist = (data) => {
    localStorage.setItem('gc_token', data.token)
    const userData = {
      id: data.userId,
      username: data.username,
      email: data.email,
      avatarEmoji: data.avatarEmoji,
    }
    localStorage.setItem('gc_user', JSON.stringify(userData))
    setToken(data.token)
    setUser(userData)
  }

  const login = useCallback(async (username, password) => {
    const data = await authApi.login({ username, password })
    persist(data)
    return data
  }, [])

  const signup = useCallback(async (username, email, password) => {
    const data = await authApi.signup({ username, email, password })
    persist(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('gc_token')
    localStorage.removeItem('gc_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
