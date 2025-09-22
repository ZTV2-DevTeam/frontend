'use client'

import React, { createContext, useContext, useCallback, ReactNode } from 'react'
import { toast } from 'sonner'
import { XCircle, Wifi, Clock, Shield } from 'lucide-react'

interface ErrorToastContextType {
  showErrorToast: (error: Error | string, options?: ErrorToastOptions) => void
  showNetworkErrorToast: (message?: string) => void
  showPermissionErrorToast: (message?: string) => void
  showTimeoutErrorToast: (message?: string) => void
  showGenericErrorToast: (message?: string) => void
}

interface ErrorToastOptions {
  duration?: number
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  type?: 'network' | 'permission' | 'timeout' | 'generic'
}

const ErrorToastContext = createContext<ErrorToastContextType | undefined>(undefined)

interface ErrorToastProviderProps {
  children: ReactNode
}

export function ErrorToastProvider({ children }: ErrorToastProviderProps) {
  const getErrorType = useCallback((error: Error | string): 'network' | 'permission' | 'timeout' | 'generic' => {
    const message = typeof error === 'string' ? error : error.message
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('hálózat')) {
      return 'network'
    }
    if (lowerMessage.includes('permission') || lowerMessage.includes('unauthorized') || lowerMessage.includes('jogosultság')) {
      return 'permission'
    }
    if (lowerMessage.includes('timeout') || lowerMessage.includes('időtúllépés')) {
      return 'timeout'
    }
    
    return 'generic'
  }, [])

  const getErrorIcon = useCallback((type: string) => {
    switch (type) {
      case 'network':
        return <Wifi className="h-4 w-4" />
      case 'permission':
        return <Shield className="h-4 w-4" />
      case 'timeout':
        return <Clock className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }, [])

  const getErrorTitle = useCallback((type: string) => {
    switch (type) {
      case 'network':
        return 'Hálózati hiba'
      case 'permission':
        return 'Hozzáférési hiba'
      case 'timeout':
        return 'Időtúllépés'
      default:
        return 'Hiba történt'
    }
  }, [])

  const getErrorDescription = useCallback((error: Error | string, type: string) => {
    const message = typeof error === 'string' ? error : error.message
    
    switch (type) {
      case 'network':
        return 'Kapcsolódási probléma. Ellenőrizze az internetkapcsolatot.'
      case 'permission':
        return 'Nincs jogosultsága ehhez a művelethez.'
      case 'timeout':
        return 'A kérés túl sokáig tartott. Próbálja újra később.'
      default:
        return message || 'Váratlan hiba történt.'
    }
  }, [])

  const showErrorToast = useCallback((error: Error | string, options?: ErrorToastOptions) => {
    const errorType = options?.type || getErrorType(error)
    const title = getErrorTitle(errorType)
    const description = options?.description || getErrorDescription(error, errorType)
    const icon = getErrorIcon(errorType)

    toast.error(title, {
      description,
      icon,
      duration: options?.duration || 5000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'error-toast',
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

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Toast:', { error, type: errorType, title, description })
    }
  }, [getErrorType, getErrorIcon, getErrorTitle, getErrorDescription])

  const showNetworkErrorToast = useCallback((message?: string) => {
    toast.error('Hálózati hiba', {
      description: message || 'Kapcsolódási probléma. Ellenőrizze az internetkapcsolatot.',
      icon: <Wifi className="h-4 w-4" />,
      duration: 6000,
      action: {
        label: 'Újrapróbálás',
        onClick: () => window.location.reload()
      },
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
  }, [])

  const showPermissionErrorToast = useCallback((message?: string) => {
    toast.error('Hozzáférési hiba', {
      description: message || 'Nincs jogosultsága ehhez a művelethez.',
      icon: <Shield className="h-4 w-4" />,
      duration: 6000,
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
  }, [])

  const showTimeoutErrorToast = useCallback((message?: string) => {
    toast.error('Időtúllépés', {
      description: message || 'A kérés időtúllépés miatt megszakadt.',
      icon: <Clock className="h-4 w-4" />,
      duration: 5000,
      action: {
        label: 'Újrapróbálás',
        onClick: () => window.location.reload()
      },
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
  }, [])

  const showGenericErrorToast = useCallback((message?: string) => {
    toast.error('Hiba történt', {
      description: message || 'Váratlan hiba történt.',
      icon: <XCircle className="h-4 w-4" />,
      duration: 5000,
      action: {
        label: 'Frissítés',
        onClick: () => window.location.reload()
      },
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
  }, [])

  const value: ErrorToastContextType = {
    showErrorToast,
    showNetworkErrorToast,
    showPermissionErrorToast,
    showTimeoutErrorToast,
    showGenericErrorToast
  }

  return (
    <ErrorToastContext.Provider value={value}>
      {children}
    </ErrorToastContext.Provider>
  )
}

export function useErrorToast(): ErrorToastContextType {
  const context = useContext(ErrorToastContext)
  
  if (context === undefined) {
    throw new Error('useErrorToast must be used within an ErrorToastProvider')
  }
  
  return context
}

// Hook for automatic error toast handling
export function useErrorHandler() {
  const { showErrorToast } = useErrorToast()
  
  return useCallback((error: Error | string, options?: ErrorToastOptions) => {
    showErrorToast(error, options)
  }, [showErrorToast])
}