'use client'

import React, { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: () => Promise<void>
  reset: () => void
}

/**
 * Custom hook for making API calls with loading and error states
 * @param route - The API route (without /api prefix)
 * @param method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param payload - Optional payload for POST/PUT/PATCH requests
 * @param autoExecute - Whether to execute the request immediately on mount
 */
export function useApi<T = any>(
  route: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  payload?: any,
  autoExecute: boolean = false
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      let result: T
      
      switch (method) {
        case 'GET':
          result = await apiClient.get<T>(route)
          break
        case 'POST':
          result = await apiClient.post<T>(route, payload)
          break
        case 'PUT':
          result = await apiClient.put<T>(route, payload)
          break
        case 'PATCH':
          result = await apiClient.patch<T>(route, payload)
          break
        case 'DELETE':
          result = await apiClient.delete<T>(route)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
      
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
    }
  }, [route, method, payload])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  // Auto-execute on mount if enabled
  React.useEffect(() => {
    if (autoExecute) {
      execute()
    }
  }, [autoExecute, execute])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  }
}

/**
 * Simplified hook for GET requests
 */
export function useApiGet<T = any>(route: string, autoExecute: boolean = true): UseApiReturn<T> {
  return useApi<T>(route, 'GET', undefined, autoExecute)
}

/**
 * Hook for POST requests
 */
export function useApiPost<T = any>(route: string, payload?: any): Omit<UseApiReturn<T>, 'execute'> & {
  execute: (data?: any) => Promise<void>
} {
  const [currentPayload, setCurrentPayload] = useState(payload)
  const { data, loading, error, execute: originalExecute, reset } = useApi<T>(route, 'POST', currentPayload, false)
  
  const execute = useCallback(async (data?: any) => {
    if (data !== undefined) {
      setCurrentPayload(data)
      // We need to wait for the next tick for the state to update
      setTimeout(() => originalExecute(), 0)
    } else {
      await originalExecute()
    }
  }, [originalExecute])

  return { data, loading, error, execute, reset }
}

/**
 * Hook for PUT requests
 */
export function useApiPut<T = any>(route: string, payload?: any): Omit<UseApiReturn<T>, 'execute'> & {
  execute: (data?: any) => Promise<void>
} {
  const [currentPayload, setCurrentPayload] = useState(payload)
  const { data, loading, error, execute: originalExecute, reset } = useApi<T>(route, 'PUT', currentPayload, false)
  
  const execute = useCallback(async (data?: any) => {
    if (data !== undefined) {
      setCurrentPayload(data)
      setTimeout(() => originalExecute(), 0)
    } else {
      await originalExecute()
    }
  }, [originalExecute])

  return { data, loading, error, execute, reset }
}

/**
 * Hook for DELETE requests
 */
export function useApiDelete<T = any>(route: string): UseApiReturn<T> {
  return useApi<T>(route, 'DELETE', undefined, false)
}
