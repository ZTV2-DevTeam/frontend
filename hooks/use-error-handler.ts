'use client'

import { useCallback } from 'react'
import { useErrorToast } from '@/contexts/error-toast-context'

export interface UseErrorHandlerOptions {
  showToast?: boolean
  logToConsole?: boolean
  reportError?: boolean
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { 
    showErrorToast, 
    showNetworkErrorToast, 
    showPermissionErrorToast, 
    showTimeoutErrorToast 
  } = useErrorToast()

  const {
    showToast = true,
    logToConsole = true,
    reportError = false
  } = options

  const handleError = useCallback((error: Error | string, context?: string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    
    // Log to console if enabled
    if (logToConsole) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, errorObj)
    }

    // Show toast if enabled
    if (showToast) {
      showErrorToast(errorObj)
    }

    // Report error if enabled (placeholder for future error reporting service)
    if (reportError) {
      // TODO: Implement error reporting to external service
      console.log('Error reported:', { error: errorObj, context })
    }
  }, [showErrorToast, showToast, logToConsole, reportError])

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    customErrorHandler?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      return await asyncFn()
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      if (customErrorHandler) {
        customErrorHandler(errorObj)
      } else {
        handleError(errorObj, context)
      }
      
      return null
    }
  }, [handleError])

  const handleNetworkError = useCallback((error: Error | string, context?: string) => {
    if (logToConsole) {
      console.error(`Network error${context ? ` in ${context}` : ''}:`, error)
    }
    
    if (showToast) {
      showNetworkErrorToast(typeof error === 'string' ? error : error.message)
    }
  }, [showNetworkErrorToast, logToConsole, showToast])

  const handlePermissionError = useCallback((error: Error | string, context?: string) => {
    if (logToConsole) {
      console.error(`Permission error${context ? ` in ${context}` : ''}:`, error)
    }
    
    if (showToast) {
      showPermissionErrorToast(typeof error === 'string' ? error : error.message)
    }
  }, [showPermissionErrorToast, logToConsole, showToast])

  const handleTimeoutError = useCallback((error: Error | string, context?: string) => {
    if (logToConsole) {
      console.error(`Timeout error${context ? ` in ${context}` : ''}:`, error)
    }
    
    if (showToast) {
      showTimeoutErrorToast(typeof error === 'string' ? error : error.message)
    }
  }, [showTimeoutErrorToast, logToConsole, showToast])

  // Wrapper for try-catch blocks
  const withErrorHandling = useCallback(<T extends unknown[], R>(
    fn: (...args: T) => R,
    context?: string
  ) => {
    return (...args: T): R | null => {
      try {
        return fn(...args)
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        handleError(errorObj, context)
        return null
      }
    }
  }, [handleError])

  // Enhanced fetch wrapper with automatic error handling
  const safeFetch = useCallback(async (
    url: string,
    options?: RequestInit,
    context?: string
  ): Promise<Response | null> => {
    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handlePermissionError(new Error(`HTTP ${response.status}: ${response.statusText}`), context)
        } else if (response.status >= 500) {
          handleNetworkError(new Error(`Server error: HTTP ${response.status}`), context)
        } else {
          handleError(new Error(`HTTP ${response.status}: ${response.statusText}`), context)
        }
        return null
      }
      
      return response
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      // Determine error type based on error characteristics
      if (errorObj.name === 'TypeError' || errorObj.message.includes('fetch')) {
        handleNetworkError(errorObj, context)
      } else if (errorObj.message.includes('timeout')) {
        handleTimeoutError(errorObj, context)
      } else {
        handleError(errorObj, context)
      }
      
      return null
    }
  }, [handleError, handleNetworkError, handlePermissionError, handleTimeoutError])

  return {
    handleError,
    handleAsyncError,
    handleNetworkError,
    handlePermissionError,
    handleTimeoutError,
    withErrorHandling,
    safeFetch
  }
}