'use client'

import { useEffect } from 'react'

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent the error from being logged to console as uncaught
      event.preventDefault()
      
      // Check if the rejection reason is empty or null
      if (event.reason === undefined || event.reason === null || event.reason === '') {
        console.warn('🚨 Empty Promise Rejection Caught:', {
          reason: 'Empty/undefined promise rejection',
          promise: event.promise,
          stack: new Error().stack
        })
        return
      }
      
      console.error('Unhandled Promise Rejection:', event.reason)
      
      // You can add custom error reporting here
      // For now, we'll just log it in a controlled way
      if (process.env.NODE_ENV === 'development') {
        console.warn('🚨 Unhandled Promise Rejection Caught:', {
          reason: event.reason,
          promise: event.promise
        })
      }
    }

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      // Check if the error is empty or null
      if (!event.error && (!event.message || event.message.trim() === '')) {
        console.warn('🚨 Empty Error Event Caught:', {
          message: event.message || 'Empty error message',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: new Error().stack
        })
        return
      }
      
      console.error('Uncaught Error:', event.error)
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('🚨 Uncaught Error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        })
      }
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null // This component doesn't render anything
}
