'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

interface UseApiOptions {
  autoFetch?: boolean  // Whether to auto-fetch on mount (default: true)
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'  // Initial method (default: GET)
}

/**
 * Enhanced simple API hook - supports all HTTP methods while keeping it simple
 * 
 * Basic usage (GET request, auto-fetches):
 * const { data, loading, error } = useApi('partners')
 * 
 * Manual control:
 * const { data, loading, error, refetch, post, put, patch, delete: del } = useApi('partners', { autoFetch: false })
 * 
 * POST-only usage:
 * const { post, loading, error } = useApi('partners', { autoFetch: false })
 */
export function useApi<T = any>(route: string, options: UseApiOptions = {}) {
  const { autoFetch = true, method = 'GET' } = options
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)

  // Generic request handler
  const request = useCallback(async (
    httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    payload?: any,
    customRoute?: string
  ): Promise<T> => {
    const targetRoute = customRoute || route
    
    try {
      setLoading(true)
      setError(null)
      
      let result: T
      switch (httpMethod) {
        case 'GET':
          result = await apiClient.get<T>(targetRoute)
          break
        case 'POST':
          result = await apiClient.post<T>(targetRoute, payload)
          break
        case 'PUT':
          result = await apiClient.put<T>(targetRoute, payload)
          break
        case 'PATCH':
          result = await apiClient.patch<T>(targetRoute, payload)
          break
        case 'DELETE':
          result = await apiClient.delete<T>(targetRoute)
          break
        default:
          throw new Error(`Unsupported HTTP method: ${httpMethod}`)
      }
      
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Request failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [route])

  // Individual method handlers for convenience
  const get = useCallback((customRoute?: string) => 
    request('GET', undefined, customRoute), [request])
  
  const post = useCallback((payload?: any, customRoute?: string) => 
    request('POST', payload, customRoute), [request])
  
  const put = useCallback((payload?: any, customRoute?: string) => 
    request('PUT', payload, customRoute), [request])
  
  const patch = useCallback((payload?: any, customRoute?: string) => 
    request('PATCH', payload, customRoute), [request])
  
  const del = useCallback((customRoute?: string) => 
    request('DELETE', undefined, customRoute), [request])

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && method === 'GET') {
      get()
    }
  }, [autoFetch, method, get])

  return {
    data,
    loading,
    error,
    // Aliases for backward compatibility and convenience
    refetch: get,
    fetch: get,
    // HTTP method functions
    get,
    post,
    put,
    patch,
    delete: del,
    // Generic request function for advanced usage
    request
  }
}
