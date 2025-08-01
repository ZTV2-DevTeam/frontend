'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient, type User, type LoginRequest } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const profile = await apiClient.getProfile()
          setUser({
            user_id: profile.user_id,
            username: profile.username,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
          })
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        apiClient.setToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.login(credentials)
      setUser({
        user_id: response.user_id,
        username: response.username,
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
      })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const refreshToken = async () => {
    try {
      await apiClient.refreshToken()
      // Optionally refresh user profile after token refresh
      const profile = await apiClient.getProfile()
      setUser({
        user_id: profile.user_id,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
      })
    } catch (error) {
      console.error('Token refresh failed:', error)
      setUser(null)
      apiClient.setToken(null)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
