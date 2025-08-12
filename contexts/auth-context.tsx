'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient, type LoginRequest, type LoginResponse } from '@/lib/api'
import { DEBUG_CONFIG } from '@/lib/config'

// Define User type based on LoginResponse
interface User {
  user_id: number
  username: string
  first_name: string
  last_name: string
  email: string
}

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
        // Force refresh token from storage
        const token = apiClient.getToken()
        if (DEBUG_CONFIG.LOG_API_CALLS) {
          console.log('🔐 Auth initialization:', {
            hasToken: !!token,
            tokenLength: token?.length || 0,
            tokenPreview: token ? `${token.substring(0, 10)}...` : 'none'
          })
        }
        
        if (apiClient.isAuthenticated()) {
          try {
            // Use a timeout for profile fetch to avoid infinite loading
            const profile = await Promise.race([
              apiClient.getProfile(),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 15000)
              )
            ])
            
            setUser({
              user_id: profile.user_id,
              username: profile.username,
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.email,
            })
            
            if (DEBUG_CONFIG.LOG_API_CALLS) {
              console.log('✅ Auth initialized successfully:', {
                username: profile.username,
                userId: profile.user_id
              })
            }
          } catch (profileError) {
            console.error('Failed to get user profile:', profileError)
            
            // If profile fetch fails with auth error, clear token
            if (profileError instanceof Error && (
              profileError.message.includes('401') ||
              profileError.message.includes('Unauthorized') ||
              profileError.message.includes('munkamenet lejárt') ||
              profileError.message.includes('Profile fetch timeout')
            )) {
              console.log('🔑 Clearing token due to profile fetch error:', profileError.message)
              apiClient.setToken(null)
              setUser(null)
            } else {
              // For other errors (network, server), don't clear token immediately
              // Let the user retry or handle it gracefully
              console.warn('⚠️ Profile fetch failed but token preserved for retry')
              setUser(null)
            }
          }
        } else {
          if (DEBUG_CONFIG.LOG_API_CALLS) {
            console.log('⚠️ No valid authentication token found')
          }
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        
        // Only clear token if it's actually an auth error
        if (error instanceof Error && (
          error.message.includes('401') || 
          error.message.includes('Unauthorized') ||
          error.message.includes('Bejelentkezés szükséges')
        )) {
          console.log('🔑 Clearing invalid token due to auth error')
          apiClient.setToken(null)
        }
        
        setUser(null)
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
      
      // Provide more user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          throw new Error('Nem sikerült csatlakozni a szerverhez. Kérjük, ellenőrizze az internetkapcsolatot és próbálja újra.')
        } else if (error.message.includes('Unauthorized')) {
          throw new Error('Hibás felhasználónév vagy jelszó.')
        } else if (error.message.includes('HTTP 500')) {
          throw new Error('Szerverhiba történt. Kérjük, próbálja újra később.')
        }
      }
      
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
