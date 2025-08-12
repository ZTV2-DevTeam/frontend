'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ApiErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ApiErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{error: Error, retry: () => void}>
}

export class ApiErrorBoundary extends React.Component<
  ApiErrorBoundaryProps,
  ApiErrorBoundaryState
> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 API Error Boundary caught an error:', error)
    console.error('📍 Component Stack:', errorInfo.componentStack)
    
    // Log additional context for API errors
    if (error.message.includes('API') || error.message.includes('fetch')) {
      console.error('🔗 This appears to be an API-related error')
    }
    
    // Check for React rendering errors with objects
    if (error.message.includes('Objects are not valid as a React child') ||
        error.message.includes('object with keys')) {
      console.error('⚠️ Object rendering error detected - check for objects being passed to React text rendering')
    }

    this.setState({
      hasError: true,
      error,
      errorInfo
    })
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state
      
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={error!} retry={this.retry} />
      }

      // Determine error type
      const isApiError = error?.message.includes('API') || error?.message.includes('fetch')
      const isAuthError = error?.message.includes('401') || error?.message.includes('Unauthorized')
      const isNetworkError = error?.message.includes('network') || error?.message.includes('CORS')
      const isRenderError = error?.message.includes('Objects are not valid') || 
                           error?.message.includes('object with keys')

      return (
        <Card className="w-full max-w-2xl mx-auto border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {isApiError ? 'API Hiba' : 
               isAuthError ? 'Hitelesítési Hiba' :
               isNetworkError ? 'Hálózati Hiba' :
               isRenderError ? 'Megjelenítési Hiba' :
               'Alkalmazás Hiba'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {isApiError && (
                <p className="text-sm text-muted-foreground">
                  Hiba történt az adatok lekérése során. Kérjük, ellenőrizze az internetkapcsolatot és próbálja újra.
                </p>
              )}
              {isAuthError && (
                <p className="text-sm text-muted-foreground">
                  A munkamenet lejárt vagy nincs megfelelő jogosultsága. Kérjük, jelentkezzen be újra.
                </p>
              )}
              {isNetworkError && (
                <p className="text-sm text-muted-foreground">
                  Hálózati hiba történt. Kérjük, ellenőrizze az internetkapcsolatot.
                </p>
              )}
              {isRenderError && (
                <p className="text-sm text-muted-foreground">
                  Megjelenítési hiba történt az adatok feldolgozása során. A fejlesztőket értesítettük.
                </p>
              )}
              {!isApiError && !isAuthError && !isNetworkError && !isRenderError && (
                <p className="text-sm text-muted-foreground">
                  Váratlan hiba történt. Kérjük, próbálja újra vagy vegye fel a kapcsolatot a támogatással.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={this.retry} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Újra próbálkozás
              </Button>
              
              {isAuthError && (
                <Button 
                  onClick={() => window.location.href = '/login'}
                  variant="default"
                >
                  Bejelentkezés
                </Button>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer mb-2">Fejlesztői részletek</summary>
                <pre className="whitespace-pre-wrap bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                  {error?.stack || error?.message || 'Ismeretlen hiba'}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for easier use
export function withApiErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{error: Error, retry: () => void}>
) {
  return function WrappedComponent(props: P) {
    return (
      <ApiErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ApiErrorBoundary>
    )
  }
}
