import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "../types/UserTypes"
import { AuthService } from "../services/AuthService"
import { apiClient } from "../api/client"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const authService = new AuthService(apiClient)

  const checkAuth = async () => {
    try {
      const userData = await authService.getMe()
      setUser(userData)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      window.location.href = "/auth/login"
    }
  }

  useEffect(() => {
    apiClient.setUnauthorizedHandler(() => {
      setUser(null)
    })

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, checkAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
