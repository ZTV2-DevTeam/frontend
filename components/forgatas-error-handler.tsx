'use client'

import React from 'react'
import { AlertCircle, LogIn, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface ForgatásErrorHandlerProps {
  error: string | null
  onRetry?: () => void
  showRetryButton?: boolean
  className?: string
}

export function ForgatásErrorHandler({ 
  error, 
  onRetry, 
  showRetryButton = true,
  className = ""
}: ForgatásErrorHandlerProps) {
  const router = useRouter()

  // Ensure error is a string and not null/undefined
  if (!error || typeof error !== 'string') return null

  // Determine error type
  const isAuthError = error.includes('munkamenet lejárt') || 
                     error.includes('Bejelentkezés szükséges') ||
                     error.includes('401') ||
                     error.includes('Unauthorized')
                     
  const isPermissionError = error.includes('Nincs jogosultsága') ||
                           error.includes('Forbidden') ||
                           error.includes('403')

  const isNetworkError = error.includes('Network') ||
                        error.includes('fetch') ||
                        error.includes('CORS') ||
                        error.includes('timeout')

  const handleLogin = () => {
    // Use router.push for better navigation
    router.push('/login')
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  const getErrorTitle = () => {
    if (isAuthError) return 'Bejelentkezés szükséges'
    if (isPermissionError) return 'Nincs jogosultság'
    if (isNetworkError) return 'Kapcsolódási hiba'
    return 'Hiba történt'
  }

  const getErrorDescription = () => {
    if (isAuthError) {
      return 'A munkamenet lejárt vagy nincs megfelelő hitelesítés. Kérjük, jelentkezzen be újra a folytatáshoz.'
    }
    if (isPermissionError) {
      return 'Nincs megfelelő jogosultsága ehhez a művelethez. Vegye fel a kapcsolatot az adminisztrátorral.'
    }
    if (isNetworkError) {
      return 'Hálózati hiba történt. Ellenőrizze az internetkapcsolatot és próbálja újra.'
    }
    return 'Váratlan hiba történt az adatok betöltése során.'
  }

  const getErrorIcon = () => {
    if (isAuthError) return <LogIn className="h-12 w-12 text-blue-500" />
    if (isPermissionError) return <AlertCircle className="h-12 w-12 text-orange-500" />
    if (isNetworkError) return <RefreshCw className="h-12 w-12 text-yellow-500" />
    return <AlertCircle className="h-12 w-12 text-destructive" />
  }

  return (
    <Card className={`border-border/50 bg-card/50 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getErrorIcon()}
          {getErrorTitle()}
        </CardTitle>
        <CardDescription>{getErrorDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 text-sm text-muted-foreground bg-muted/50 rounded-md">
          <strong>Részletek:</strong> {typeof error === 'string' ? error : 'Ismeretlen hiba'}
        </div>
        
        <div className="flex gap-2">
          {isAuthError && (
            <Button onClick={handleLogin} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Bejelentkezés
            </Button>
          )}
          
          {showRetryButton && !isPermissionError && (
            <Button 
              onClick={handleRetry} 
              variant={isAuthError ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Újra próbálkozás
            </Button>
          )}
          
          {!isAuthError && (
            <Button 
              onClick={() => router.push('/app/forgatasok')} 
              variant="outline"
            >
              Vissza a forgatásokhoz
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper component for critical errors that prevent page functionality
export function CriticalForgatásError({ 
  errors, 
  onRetry 
}: { 
  errors: string[]
  onRetry?: () => void 
}) {
  const router = useRouter()

  return (
    <Card className="border-destructive/50 bg-destructive/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Kritikus hiba
        </CardTitle>
        <CardDescription>
          A forgatás létrehozásához szükséges adatok nem tölthetők be.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="p-2 text-sm bg-destructive/20 rounded border border-destructive/30">
              • {error}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onRetry || (() => window.location.reload())} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Újra próbálkozás
          </Button>
          <Button onClick={() => router.push('/app/forgatasok')} variant="default">
            Vissza a forgatásokhoz
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper component for API warnings (non-critical errors)
export function ForgatásApiWarning({ 
  warnings 
}: { 
  warnings: string[] 
}) {
  return (
    <Card className="border-amber-500/50 bg-amber-500/10">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-amber-500 text-lg">⚠️</div>
          <div className="flex-1">
            <p className="font-medium text-amber-800">Néhány mező jelenleg nem elérhető</p>
            <div className="text-sm text-amber-700 mt-1 space-y-1">
              {warnings.map((warning, index) => (
                <div key={index}>• {warning}</div>
              ))}
            </div>
            <p className="text-sm text-amber-700 mt-2">
              Ezek a mezők opcionálisak vagy később módosíthatók. A forgatás továbbra is létrehozható.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
