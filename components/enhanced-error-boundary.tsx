'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import { CONTACT_CONFIG } from '@/lib/config'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  private handleGoHome = () => {
    window.location.href = '/app/iranyitopult'
  }

  private getErrorType = () => {
    if (!this.state.error) return 'unknown'

    const message = this.state.error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'network'
    }
    if (message.includes('permission') || message.includes('jogosultság')) {
      return 'permission'
    }
    if (message.includes('timeout') || message.includes('időtúllépés')) {
      return 'timeout'
    }
    if (message.includes('loading') || message.includes('betöltés')) {
      return 'loading'
    }
    
    return 'generic'
  }

  private getErrorMessage = () => {
    const errorType = this.getErrorType()
    
    switch (errorType) {
      case 'network':
        return {
          title: 'Hálózati hiba',
          description: 'Nem sikerült kapcsolódni a szerverhez. Ellenőrizze az internetkapcsolatot.',
          canRetry: true
        }
      case 'permission':
        return {
          title: 'Hozzáférési hiba',
          description: 'Nincs jogosultsága ehhez a funkcióhoz vagy lejárt a munkamenet.',
          canRetry: false
        }
      case 'timeout':
        return {
          title: 'Időtúllépés',
          description: 'A kérés túl sokáig tartott. Próbálja újra.',
          canRetry: true
        }
      case 'loading':
        return {
          title: 'Betöltési hiba',
          description: 'Hiba történt az oldal betöltése során.',
          canRetry: true
        }
      default:
        return {
          title: 'Váratlan hiba',
          description: 'Váratlan hiba történt. Kérjük, próbálja újra vagy lépjen kapcsolatba a támogatással.',
          canRetry: true
        }
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const errorMessage = this.getErrorMessage()

      return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex items-center gap-3 justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{errorMessage.title}</h3>
                  <p className="text-muted-foreground text-sm">{errorMessage.description}</p>
                </div>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-muted rounded-lg p-4 text-left">
                  <p className="text-sm font-medium mb-2">Fejlesztői információ:</p>
                  <code className="text-xs text-muted-foreground block whitespace-pre-wrap">
                    {this.state.error.message}
                    {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
                  </code>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {errorMessage.canRetry && (
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Újrapróbálás
                  </Button>
                )}
                
                <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Főoldal
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-sm text-blue-900 dark:text-blue-100">
                    Segítségre van szüksége?
                  </p>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Lépjen kapcsolatba a fejlesztőkkel: {CONTACT_CONFIG.SUPPORT_EMAIL}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC version for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <EnhancedErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </EnhancedErrorBoundary>
    )
  }
}
