'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

interface UseConnectionStatusReturn {
  isOnline: boolean
  serverReachable: boolean
  retryCount: number
  lastError: string | null
  checkConnection: () => Promise<void>
  resetRetryCount: () => void
}

export function useConnectionStatus(): UseConnectionStatusReturn {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [serverReachable, setServerReachable] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)

  const checkConnection = useCallback(async () => {
    try {
      // Simple health check - you might want to add a specific health endpoint
      await fetch('/api/health').catch(() => {
        // If health endpoint doesn't exist, try the base API
        return fetch('/api/')
      })
      
      setServerReachable(true)
      setLastError(null)
    } catch (error) {
      setServerReachable(false)
      setLastError(error instanceof Error ? error.message : 'Connection failed')
      setRetryCount(prev => prev + 1)
    }
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  const resetRetryCount = useCallback(() => {
    setRetryCount(0)
    setLastError(null)
  }, [])

  return {
    isOnline,
    serverReachable,
    retryCount,
    lastError,
    checkConnection,
    resetRetryCount
  }
}

interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
}

export class RetryableApiClient {
  private config: RetryConfig

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      ...config
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getRetryDelay(attempt: number): number {
    const delay = this.config.baseDelay * Math.pow(2, attempt)
    return Math.min(delay, this.config.maxDelay)
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    context: string = 'API operation'
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on certain errors
        if (this.shouldNotRetry(lastError)) {
          throw lastError
        }

        // If this was the last attempt, throw the error
        if (attempt === this.config.maxRetries) {
          console.error(`❌ Final attempt failed for ${context}:`, lastError.message)
          throw lastError
        }

        const delay = this.getRetryDelay(attempt)
        console.warn(`⚠️ Attempt ${attempt + 1} failed for ${context}, retrying in ${delay}ms:`, lastError.message)
        
        await this.delay(delay)
      }
    }

    throw lastError || new Error('Maximum retries reached')
  }

  private shouldNotRetry(error: Error): boolean {
    // Don't retry on authentication errors
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return true
    }

    // Don't retry on permission errors
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return true
    }

    // Don't retry on client errors (except 408 Request Timeout)
    if (error.message.includes('400') && !error.message.includes('408')) {
      return true
    }

    return false
  }
}

// Global retry client instance
export const retryApiClient = new RetryableApiClient()
