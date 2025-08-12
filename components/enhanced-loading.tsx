'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Loader2, 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  Clock, 
  Shield, 
  Mail,
  Phone,
  RefreshCw
} from 'lucide-react'

interface EnhancedLoadingProps {
  isLoading: boolean
  error: string | null
  onRetry?: () => void
  loadingText?: string
  stage?: 'auth' | 'permissions' | 'data'
  timeout?: number
}

export function EnhancedLoading({
  isLoading,
  error,
  onRetry,
  loadingText,
  stage = 'auth',
  timeout = 30000 // 30 seconds default
}: EnhancedLoadingProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showTips, setShowTips] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (!isLoading && !error) {
      setTimeElapsed(0)
      setShowTips(false)
      setShowError(false)
      return
    }

    if (isLoading) {
      // Show tips very quickly (500ms) if loading
      const tipTimer = setTimeout(() => {
        if (isLoading) {
          setShowTips(true)
        }
      }, 500)

      const interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1000
          
          // Show error after timeout
          if (newTime >= timeout && !showError && !error) {
            setShowError(true)
          }
          
          return newTime
        })
      }, 1000)

      return () => {
        clearTimeout(tipTimer)
        clearInterval(interval)
      }
    }
  }, [isLoading, error, timeout, showTips, showError])

  useEffect(() => {
    if (error) {
      setShowError(true)
    }
  }, [error])

  const handleRetry = () => {
    setIsConnecting(true)
    setTimeElapsed(0)
    setShowTips(false)
    setShowError(false)
    
    setTimeout(() => setIsConnecting(false), 2000)
    
    if (onRetry) {
      onRetry()
    }
  }

  const getStageText = () => {
    switch (stage) {
      case 'auth':
        return 'Bejelentkezés ellenőrzése...'
      case 'permissions':
        return 'Jogosultságok betöltése...'
      case 'data':
        return 'Adatok betöltése...'
      default:
        return loadingText || 'Betöltés...'
    }
  }

  const getLoadingIcon = () => {
    if (isConnecting) {
      return <RefreshCw className="h-8 w-8 animate-spin text-primary" />
    }
    
    if (timeElapsed > 15000) {
      return <WifiOff className="h-8 w-8 text-orange-500 animate-pulse" />
    }
    
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />
  }

  const getTipsContent = () => {
    return (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">Biztonsági ellenőrzés</p>
            <p>A rendszer biztonsági okokból alaposan ellenőrzi a jogosultságokat. Ez néhány másodpercig tarthat.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">Szerver kapcsolat</p>
            <p>A szerver esetenként lassabban válaszol. Kérjük, legyen türelemmel.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Wifi className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">Hálózati kapcsolat</p>
            <p>Ellenőrizze az internetkapcsolatot, ha a betöltés túl sokáig tart.</p>
          </div>
        </div>
      </div>
    )
  }

  const getErrorContent = () => {
    const isNetworkError = error?.includes('CORS') || 
                          error?.includes('Network') || 
                          error?.includes('Failed to fetch') ||
                          timeElapsed >= timeout

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-8 w-8 text-destructive flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg">
              {isNetworkError ? 'Kapcsolódási probléma' : 'Hiba történt'}
            </h3>
            <p className="text-muted-foreground">
              {isNetworkError 
                ? 'Nem sikerült csatlakozni a szerverhez. Ez többnyire átmeneti probléma.'
                : error || 'Váratlan hiba történt a betöltés során.'
              }
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <p className="font-medium text-sm">Mit tehet:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Próbálja újra a kapcsolódást
            </li>
            <li className="flex items-start gap-2">
              <Wifi className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Ellenőrizze az internetkapcsolatot
            </li>
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Várjon egy keveset, majd próbálja újra
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2">
            Továbbra sem működik?
          </p>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email: balla.botond.23f@szlgbp.hu</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Fejlesztői támogatás: +36 30 123 4567</span>
            </div> */}
          </div>
        </div>
      </div>
    )
  }

  // If not loading and no error, don't show anything
  if (!isLoading && !error) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          {showError || error ? (
            <>
              {getErrorContent()}
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={handleRetry} 
                  disabled={isConnecting}
                  className="flex-1"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Kapcsolódás...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Újrapróbálás
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Loading indicator */}
              <div className="relative">
                {getLoadingIcon()}
                {timeElapsed > 5000 && (
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
                )}
              </div>

              {/* Status text */}
              <div className="space-y-2">
                <p className="text-lg font-medium">{getStageText()}</p>
                {timeElapsed > 5000 && (
                  <p className="text-sm text-muted-foreground">
                    Eltelt idő: {Math.floor(timeElapsed / 1000)} másodperc
                  </p>
                )}
              </div>

              {/* Tips section - always show when loading, not just after delay */}
              {(showTips || timeElapsed > 2000) && (
                <div className="text-left space-y-4 border-t pt-4">
                  <h4 className="font-medium text-center">Miért tart ez ilyen sokáig?</h4>
                  {getTipsContent()}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
