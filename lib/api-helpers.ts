import { apiClient } from './api'
import { useState, useEffect } from 'react'

// Type definitions for common API response patterns
export interface ApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface MutationResult {
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<any>
}

// Custom hooks for common API operations
export function useApiQuery<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): ApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, dependencies)

  return { data, loading, error }
}

export function useApiMutation<T extends (...args: any[]) => Promise<any>>(
  apiCall: T
): MutationResult & { data: Awaited<ReturnType<T>> | null } {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Awaited<ReturnType<T>> | null>(null)

  const execute = async (...args: Parameters<T>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall(...args)
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, execute }
}

// Auth helper functions
export const authHelpers = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => apiClient.isAuthenticated(),

  /**
   * Get current auth token
   */
  getToken: () => apiClient.getToken(),

  /**
   * Login and handle token storage
   */
  login: async (username: string, password: string) => {
    const response = await apiClient.login({ username, password })
    return response
  },

  /**
   * Logout and clear tokens
   */
  logout: async () => {
    await apiClient.logout()
  },

  /**
   * Refresh token if needed
   */
  refreshToken: async () => {
    try {
      await apiClient.refreshToken()
      return true
    } catch (error) {
      // If refresh fails, user needs to login again
      await apiClient.logout()
      return false
    }
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    return await apiClient.getProfile()
  },

  /**
   * Get user permissions
   */
  getPermissions: async () => {
    return await apiClient.getPermissions()
  }
}

// Common API operations with error handling
export const apiHelpers = {
  /**
   * Get all partners with error handling
   */
  getPartners: async () => {
    try {
      return await apiClient.getPartners()
    } catch (error) {
      console.error('Failed to fetch partners:', error)
      throw error
    }
  },

  /**
   * Get all filming sessions with optional filters
   */
  getFilmingSessions: async (filters?: {
    startDate?: string
    endDate?: string
    type?: string
  }) => {
    try {
      return await apiClient.getFilmingSessions(
        filters?.startDate,
        filters?.endDate,
        filters?.type
      )
    } catch (error) {
      console.error('Failed to fetch filming sessions:', error)
      throw error
    }
  },

  /**
   * Get all announcements with error handling
   */
  getAnnouncements: async (myOnly = false) => {
    try {
      return await apiClient.getAnnouncements(myOnly)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
      throw error
    }
  },

  /**
   * Get all users with error handling
   */
  getUsers: async () => {
    try {
      return await apiClient.getAllUsers()
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  },

  /**
   * Get equipment with optional filters
   */
  getEquipment: async (functionalOnly = false) => {
    try {
      return await apiClient.getEquipment(functionalOnly)
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
      throw error
    }
  },

  /**
   * Get classes with error handling
   */
  getClasses: async () => {
    try {
      return await apiClient.getClasses()
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      throw error
    }
  },

  /**
   * Get school years with error handling
   */
  getSchoolYears: async () => {
    try {
      return await apiClient.getSchoolYears()
    } catch (error) {
      console.error('Failed to fetch school years:', error)
      throw error
    }
  },

  /**
   * Get active school year
   */
  getActiveSchoolYear: async () => {
    try {
      return await apiClient.getActiveSchoolYear()
    } catch (error) {
      console.error('Failed to fetch active school year:', error)
      throw error
    }
  },

  /**
   * Get user absences with filters
   */
  getAbsences: async (filters?: {
    userId?: number
    startDate?: string
    endDate?: string
    myAbsences?: boolean
  }) => {
    try {
      return await apiClient.getAbsences(
        filters?.userId,
        filters?.startDate,
        filters?.endDate,
        filters?.myAbsences
      )
    } catch (error) {
      console.error('Failed to fetch absences:', error)
      throw error
    }
  },

  /**
   * Get system configuration status
   */
  getTanevConfigStatus: async () => {
    try {
      return await apiClient.getTanevConfigStatus()
    } catch (error) {
      console.error('Failed to fetch tanev config status:', error)
      throw error
    }
  }
}

// Utility functions for API data formatting
export const formatters = {
  /**
   * Format user full name
   */
  formatUserName: (user: { first_name: string; last_name: string }) => {
    return `${user.first_name} ${user.last_name}`.trim()
  },

  /**
   * Format date for API calls (ISO format)
   */
  formatDateForApi: (date: Date) => {
    return date.toISOString().split('T')[0]
  },

  /**
   * Format datetime for API calls (ISO format)
   */
  formatDateTimeForApi: (date: Date) => {
    return date.toISOString()
  },

  /**
   * Parse API date string to Date object
   */
  parseApiDate: (dateString: string) => {
    return new Date(dateString)
  },

  /**
   * Format display name for classes
   */
  formatClassName: (osztaly: { start_year: number; szekcio: string }) => {
    return `${osztaly.start_year}${osztaly.szekcio}`
  },

  /**
   * Format school year display name
   */
  formatSchoolYear: (tanev: { start_year: number; end_year: number }) => {
    return `${tanev.start_year}/${tanev.end_year}`
  }
}

// Error handling utilities
export const errorUtils = {
  /**
   * Extract user-friendly error message from API error
   */
  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unexpected error occurred'
  },

  /**
   * Check if error is authentication related
   */
  isAuthError: (error: unknown): boolean => {
    if (error instanceof Error) {
      return error.message.includes('401') || 
             error.message.toLowerCase().includes('unauthorized') ||
             error.message.toLowerCase().includes('authentication')
    }
    return false
  },

  /**
   * Check if error is permission related
   */
  isPermissionError: (error: unknown): boolean => {
    if (error instanceof Error) {
      return error.message.includes('403') ||
             error.message.toLowerCase().includes('forbidden') ||
             error.message.toLowerCase().includes('permission')
    }
    return false
  }
}

// Validation utilities for API data
export const validators = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate password strength (example criteria)
   */
  isValidPassword: (password: string): boolean => {
    return password.length >= 8
  },

  /**
   * Validate Hungarian phone number format
   */
  isValidPhoneNumber: (phone: string): boolean => {
    // Basic Hungarian phone number validation
    const phoneRegex = /^(\+36|06)[1-9][0-9]{7,8}$/
    return phoneRegex.test(phone.replace(/[\s-]/g, ''))
  },

  /**
   * Validate date range
   */
  isValidDateRange: (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return start <= end
  }
}

// Cache utilities for API responses
export class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

export const apiCache = new ApiCache()
