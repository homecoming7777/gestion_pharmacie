import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const current = authService.getCurrentUser()
    if (current) setUser(current)
  }, [])

  const login = (username, password, remember) => {
    const user = authService.login(username, password, remember)
    if (user) setUser(user)
    return user
  }

  const register = (data) => {
    const user = authService.register(data)
    if (user) setUser(user)
    return user
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)