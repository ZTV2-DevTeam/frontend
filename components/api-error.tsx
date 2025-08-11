'use client'

import { AlertCircle, RefreshCw, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ApiErrorProps {
  error: string
  title?: string
  showRetry?: boolean
  onRetry?: () => void
  className?: string
}

export function ApiError({ 
  error, 
  title = "Hiba történt", 
  showRetry = true, 
  onRetry,
  className = "" 
}: ApiErrorProps) {
  const isAuthError = error?.includes('Bejelentkezés szükséges') || 
                     error?.includes('Unauthorized') ||
                     error?.includes('401')
                     
  const isPermissionError = error?.includes('Nincs jogosultsága') ||
                           error?.includes('Forbidden') ||
                           error?.includes('403')

  const handleLogin = () => {
    window.location.href = '/login'
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-destructive">
            {title}
          </h3>
          <p className="text-muted-foreground max-w-md">
            {error}
          </p>
          
          {isAuthError && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                A munkamenet lejárt vagy nincs bejelentkezve.
              </p>
              <Button onClick={handleLogin} className="gap-2">
                <LogIn className="h-4 w-4" />
                Bejelentkezés
              </Button>
            </div>
          )}
          
          {isPermissionError && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Forduljon a rendszergazdához a hozzáférésért.
              </p>
            </div>
          )}
          
          {!isAuthError && !isPermissionError && showRetry && (
            <Button 
              onClick={handleRetry}
              variant="outline" 
              className="mt-4 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Újrapróbálkozás
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Simplified version for inline use
export function InlineApiError({ 
  error, 
  onRetry,
  className = "" 
}: { 
  error: string
  onRetry?: () => void
  className?: string 
}) {
  const isAuthError = error?.includes('Bejelentkezés szükséges') || 
                     error?.includes('Unauthorized')

  return (
    <div className={`flex items-center justify-center p-4 text-center ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        {isAuthError ? (
          <Button 
            onClick={() => window.location.href = '/login'}
            size="sm"
            variant="outline"
            className="gap-1"
          >
            <LogIn className="h-3 w-3" />
            Bejelentkezés
          </Button>
        ) : (
          onRetry && (
            <Button 
              onClick={onRetry}
              size="sm"
              variant="outline"
              className="gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Újra
            </Button>
          )
        )}
      </div>
    </div>
  )
}
