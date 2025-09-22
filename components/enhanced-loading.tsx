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
  RefreshCw,
  Server
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
      return (
        <div className="relative">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }
    
    if (timeElapsed > 15000) {
      return (
        <div className="relative">
          <WifiOff className="h-8 w-8 text-chart-4" />
        </div>
      )
    }
    
    return (
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const getTipsContent = () => {
    return (
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Biztonsági ellenőrzés</p>
            <p className="text-muted-foreground">A rendszer biztonsági okokból alaposan ellenőrzi a jogosultságokat. Ez néhány másodpercig tarthat.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-4/5 border border-chart-4/20">
          <Server className="h-5 w-5 text-chart-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Szerver kapcsolat</p>
            <p className="text-muted-foreground">A szerver esetenként lassabban válaszol. Kérjük, legyen türelemmel.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-2/5 border border-chart-2/20">
          <Wifi className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Hálózati kapcsolat</p>
            <p className="text-muted-foreground">Ellenőrizze az internetkapcsolatot, ha a betöltés túl sokáig tart.</p>
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
          <div className="relative">
            <AlertCircle className="h-10 w-10 text-destructive flex-shrink-0" />
            <div className="absolute inset-0 rounded-full border-2 border-destructive/20 animate-pulse" />
          </div>
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

        <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border">
          <p className="font-medium text-sm flex items-center gap-2">
            <Server className="h-4 w-4" />
            Mit tehet:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
              <span>Próbálja újra a kapcsolódást</span>
            </li>
            <li className="flex items-start gap-2">
              <Wifi className="h-4 w-4 mt-0.5 flex-shrink-0 text-chart-2" />
              <span>Ellenőrizze az internetkapcsolatot</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-chart-4" />
              <span>Várjon egy keveset, majd próbálja újra</span>
            </li>
          </ul>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="font-medium text-sm text-foreground mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Továbbra sem működik?
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email: balla.botond.23f@szlgbp.hu</span>
            </div>
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
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="max-w-lg w-full shadow-sm border border-border">
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
              <div className="relative flex justify-center items-center py-4">
                {getLoadingIcon()}
              </div>

              {/* Status text */}
              <div className="space-y-3">
                <p className="text-lg font-semibold text-foreground">
                  {getStageText()}
                </p>
                {timeElapsed > 5000 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Eltelt idő: {Math.floor(timeElapsed / 1000)} másodperc</span>
                  </div>
                )}
                
                {/* Progress bar visual */}
                {timeElapsed > 3000 && (
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                      style={{ 
                        width: `${Math.min((timeElapsed / timeout) * 100, 95)}%`
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Tips section with improved styling */}
              {(showTips || timeElapsed > 2000) && (
                <div className="text-left space-y-4 border-t border-border pt-6">
                  <h4 className="font-semibold text-center text-base flex items-center justify-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Miért tart ez ilyen sokáig?
                  </h4>
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
