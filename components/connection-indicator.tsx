'use client'

import { useState, useEffect } from 'react'
import { Loader2, Check, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { API_CONFIG } from '@/lib/config'

type ConnectionState = 'checking' | 'connected' | 'failed'

interface ConnectionIndicatorProps {
  className?: string
}

export function ConnectionIndicator({ className = '' }: ConnectionIndicatorProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('checking')
  const [showIndicator, setShowIndicator] = useState(true)

  const testConnection = async () => {
    setConnectionState('checking')
    setShowIndicator(true)

    try {
      // Test basic API connectivity with a simple endpoint
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/hello?name=ZTV2`)
      
      if (response.ok) {
        setConnectionState('connected')
        // Hide the indicator after showing success for 2 seconds
        setTimeout(() => {
          setShowIndicator(false)
        }, 2000)
      } else {
        setConnectionState('failed')
      }
    } catch (error) {
      setConnectionState('failed')
    }
  }

  // Test connection on component mount
  useEffect(() => {
    testConnection()
  }, [])

  // Don't render if the indicator should be hidden
  if (!showIndicator) {
    return null
  }

  const handleRetry = () => {
    testConnection()
  }

  return (
    <div className={`absolute top-4 right-4 ${className}`}>
      {connectionState === 'checking' && (
        <div className="flex items-center justify-center w-6 h-6">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {connectionState === 'connected' && (
        <div className="flex items-center justify-center w-6 h-6">
          <Check className="w-4 h-4 text-green-600 animate-in zoom-in-75 duration-300" />
        </div>
      )}
      
      {connectionState === 'failed' && (
        <Button
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 hover:bg-red-50 hover:text-red-600"
          onClick={handleRetry}
          title="Connection failed - Click to retry"
        >
          <RotateCcw className="w-4 h-4 text-red-600" />
        </Button>
      )}
    </div>
  )
}
