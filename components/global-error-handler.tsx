'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { AlertTriangle, Bug, Wifi } from 'lucide-react'

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
      
      // Show toast for unhandled promise rejections
      const reason = event.reason
      let errorMessage = 'Váratlan hiba történt'
      let errorType: 'network' | 'generic' = 'generic'
      
      if (reason && typeof reason === 'object') {
        if (reason.message) {
          errorMessage = reason.message
        }
        if (reason.message && reason.message.toLowerCase().includes('fetch')) {
          errorType = 'network'
        }
      } else if (typeof reason === 'string') {
        errorMessage = reason
        if (reason.toLowerCase().includes('network') || reason.toLowerCase().includes('fetch')) {
          errorType = 'network'
        }
      }

      // Show appropriate toast
      if (errorType === 'network') {
        toast.error('Hálózati hiba', {
          description: 'Kapcsolódási probléma történt.',
          icon: <Wifi className="h-4 w-4" />,
          action: {
            label: 'Újrapróbálás',
            onClick: () => window.location.reload()
          },
          duration: 6000,
          style: {
            backgroundColor: 'var(--info-bg)',
            borderColor: 'var(--info-border)',
            color: 'var(--info-text)',
            border: '1px solid var(--info-border)',
            borderRadius: 'var(--radius)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px -4px color-mix(in srgb, var(--chart-2) 25%, transparent), 0 0 0 1px color-mix(in srgb, var(--chart-2) 30%, transparent)',
          }
        })
      } else {
        toast.error('Alkalmazás hiba', {
          description: errorMessage || 'Váratlan hiba történt az alkalmazásban.',
          icon: <Bug className="h-4 w-4" />,
          action: {
            label: 'Frissítés',
            onClick: () => window.location.reload()
          },
          duration: 7000,
          style: {
            backgroundColor: 'var(--error-bg)',
            borderColor: 'var(--error-border)',
            color: 'var(--error-text)',
            border: '1px solid var(--error-border)',
            borderRadius: 'var(--radius)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px -4px color-mix(in srgb, var(--destructive) 25%, transparent), 0 0 0 1px color-mix(in srgb, var(--destructive) 30%, transparent)',
          }
        })
      }
      
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
      
      // Show toast for uncaught JavaScript errors
      const errorMessage = event.message || 'JavaScript hiba történt'
      let errorType: 'network' | 'script' | 'generic' = 'generic'
      
      if (event.message) {
        const lowerMessage = event.message.toLowerCase()
        if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
          errorType = 'network'
        } else if (lowerMessage.includes('script') || event.filename) {
          errorType = 'script'
        }
      }

      // Show appropriate toast
      switch (errorType) {
        case 'network':
          toast.error('Hálózati hiba', {
            description: 'Kapcsolódási probléma történt.',
            icon: <Wifi className="h-4 w-4" />,
            action: {
              label: 'Újrapróbálás',
              onClick: () => window.location.reload()
            },
            duration: 6000,
            style: {
              backgroundColor: 'var(--info-bg)',
              borderColor: 'var(--info-border)',
              color: 'var(--info-text)',
              border: '1px solid var(--info-border)',
              borderRadius: 'var(--radius)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px -4px color-mix(in srgb, var(--chart-2) 25%, transparent), 0 0 0 1px color-mix(in srgb, var(--chart-2) 30%, transparent)',
            }
          })
          break
        case 'script':
          toast.error('Script hiba', {
            description: 'JavaScript hiba történt az alkalmazásban.',
            icon: <AlertTriangle className="h-4 w-4" />,
            action: {
              label: 'Frissítés',
              onClick: () => window.location.reload()
            },
            duration: 5000,
            style: {
              backgroundColor: 'var(--warning-bg)',
              borderColor: 'var(--warning-border)',
              color: 'var(--warning-text)',
              border: '1px solid var(--warning-border)',
              borderRadius: 'var(--radius)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px -4px color-mix(in srgb, var(--chart-4) 25%, transparent), 0 0 0 1px color-mix(in srgb, var(--chart-4) 30%, transparent)',
            }
          })
          break
        default:
          toast.error('Alkalmazás hiba', {
            description: errorMessage,
            icon: <Bug className="h-4 w-4" />,
            action: {
              label: 'Frissítés',
              onClick: () => window.location.reload()
            },
            duration: 7000,
            style: {
              backgroundColor: 'var(--error-bg)',
              borderColor: 'var(--error-border)',
              color: 'var(--error-text)',
              border: '1px solid var(--error-border)',
              borderRadius: 'var(--radius)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px -4px color-mix(in srgb, var(--destructive) 25%, transparent), 0 0 0 1px color-mix(in srgb, var(--destructive) 30%, transparent)',
            }
          })
      }
      
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
