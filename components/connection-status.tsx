'use client'

import { useState, useEffect } from 'react'
import { useConnectionStatus } from '@/hooks/use-connection'
import { WifiOff, Wifi, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConnectionStatusProps {
  className?: string
  showText?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export function ConnectionStatus({ 
  className,
  showText = false,
  position = 'top-right'
}: ConnectionStatusProps) {
  const { isOnline, serverReachable, checkConnection } = useConnectionStatus()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show the indicator if there are connection issues
    setIsVisible(!isOnline || !serverReachable)
  }, [isOnline, serverReachable])

  // Auto-check connection when coming back online
  useEffect(() => {
    if (isOnline && !serverReachable) {
      const timeoutId = setTimeout(() => {
        checkConnection()
      }, 2000)
      return () => clearTimeout(timeoutId)
    }
  }, [isOnline, serverReachable, checkConnection])

  if (!isVisible) return null

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="h-4 w-4 text-red-500" />
    }
    if (!serverReachable) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
    return <Wifi className="h-4 w-4 text-green-500" />
  }

  const getStatusText = () => {
    if (!isOnline) {
      return 'Nincs internetkapcsolat'
    }
    if (!serverReachable) {
      return 'Szerver nem elérhető'
    }
    return 'Kapcsolódva'
  }

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-50 border-red-200 text-red-800'
    if (!serverReachable) return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    return 'bg-green-50 border-green-200 text-green-800'
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      default:
        return 'top-4 right-4'
    }
  }

  return (
    <div className={cn(
      'fixed z-50 px-3 py-2 rounded-lg border shadow-md',
      getStatusColor(),
      getPositionClasses(),
      className
    )}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        {showText && (
          <span className="text-sm font-medium">
            {getStatusText()}
          </span>
        )}
      </div>
    </div>
  )
}

// Hook for components that need to react to connection changes
export function useConnectionAware() {
  const { isOnline, serverReachable, checkConnection, retryCount } = useConnectionStatus()
  const [connectionLost, setConnectionLost] = useState(false)

  useEffect(() => {
    setConnectionLost(!isOnline || !serverReachable)
  }, [isOnline, serverReachable])

  const isConnected = isOnline && serverReachable
  const shouldRetry = connectionLost && retryCount < 3

  return {
    isConnected,
    connectionLost,
    shouldRetry,
    checkConnection,
    retryCount
  }
}
