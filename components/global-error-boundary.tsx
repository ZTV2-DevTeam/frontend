'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Mail, Bug } from 'lucide-react'
import { CONTACT_CONFIG } from '@/lib/config'
import { toast } from 'sonner'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showToast?: boolean
  showFallback?: boolean
  level?: 'page' | 'component' | 'global'
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null
  }

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by GlobalErrorBoundary:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Show toast notification if enabled
    if (this.props.showToast !== false) {
      this.showErrorToast(error)
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Report error in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary')
      console.error('Error:', error)
      console.error('Component Stack:', errorInfo.componentStack)
      console.error('Error ID:', this.state.errorId)
      console.groupEnd()
    }
  }

  private showErrorToast = (error: Error) => {
    const errorType = this.getErrorType(error)
    const level = this.props.level || 'component'
    
    let title = 'Hiba történt'
    let description = 'Egy komponens hibája miatt a tartalom nem jeleníthető meg.'
    
    switch (level) {
      case 'global':
        title = 'Alkalmazás hiba'
        description = 'Váratlan hiba történt az alkalmazásban.'
        break
      case 'page':
        title = 'Oldal hiba'
        description = 'Hiba történt az oldal betöltése során.'
        break
      case 'component':
        title = 'Komponens hiba'
        description = 'Egy komponens hibája miatt a tartalom nem jeleníthető meg.'
        break
    }

    // Show different toasts based on error type
    switch (errorType) {
      case 'network':
        toast.error('Hálózati hiba', {
          description: 'Kapcsolódási probléma történt. Ellenőrizze az internetkapcsolatot.',
          icon: <AlertTriangle className="h-4 w-4" />,
          action: {
            label: 'Újrapróbálás',
            onClick: () => this.handleRetry()
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
      case 'permission':
        toast.error('Hozzáférési hiba', {
          description: 'Nincs jogosultsága ehhez a művelethez.',
          icon: <AlertTriangle className="h-4 w-4" />,
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
        toast.error(title, {
          description,
          icon: <Bug className="h-4 w-4" />,
          action: level === 'global' ? {
            label: 'Újraindítás',
            onClick: () => window.location.reload()
          } : {
            label: 'Újrapróbálás',
            onClick: () => this.handleRetry()
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
  }

  private getErrorType = (error: Error): 'network' | 'permission' | 'generic' => {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch') || message.includes('loading chunk')) {
      return 'network'
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'permission'
    }
    
    return 'generic'
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  private handleGoHome = () => {
    window.location.href = '/app/iranyitopult'
  }

  private handleReload = () => {
    window.location.reload()
  }

  private getErrorMessage = () => {
    if (!this.state.error) return { title: 'Ismeretlen hiba', description: '', canRetry: true }

    const errorType = this.getErrorType(this.state.error)
    const level = this.props.level || 'component'
    
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
      default:
        switch (level) {
          case 'global':
            return {
              title: 'Alkalmazás hiba',
              description: 'Váratlan hiba történt az alkalmazásban. Kérjük, frissítse az oldalt.',
              canRetry: false
            }
          case 'page':
            return {
              title: 'Oldal hiba',
              description: 'Hiba történt az oldal betöltése során.',
              canRetry: true
            }
          default:
            return {
              title: 'Komponens hiba',
              description: 'Egy komponens hibája miatt a tartalom nem jeleníthető meg.',
              canRetry: true
            }
        }
    }
  }

  public render() {
    if (this.state.hasError) {
      // Return custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Don't show fallback UI if showFallback is false (toast-only mode)
      if (this.props.showFallback === false) {
        return this.props.children
      }

      const errorMessage = this.getErrorMessage()
      const level = this.props.level || 'component'

      return (
        <div className="flex items-center justify-center min-h-[300px] px-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex items-center gap-3 justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{errorMessage.title}</h3>
                  <p className="text-muted-foreground text-sm">{errorMessage.description}</p>
                </div>
              </div>

              {/* Development info */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-muted rounded-lg p-3 text-left">
                  <summary className="cursor-pointer mb-2 text-sm font-medium">
                    Fejlesztői információ
                  </summary>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium">Hiba ID:</p>
                      <code className="text-xs text-muted-foreground">{this.state.errorId}</code>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Üzenet:</p>
                      <code className="text-xs text-muted-foreground break-all">
                        {this.state.error.message}
                      </code>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="text-xs font-medium">Komponens stack:</p>
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                          {this.state.errorInfo?.componentStack?.slice(0, 500) || 'Stack trace not available'}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                {errorMessage.canRetry && (
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Újrapróbálás
                  </Button>
                )}
                
                {level === 'global' ? (
                  <Button variant="outline" onClick={this.handleReload} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Oldal frissítése
                  </Button>
                ) : (
                  <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Főoldal
                  </Button>
                )}
              </div>

              {/* Support info */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-sm text-blue-900 dark:text-blue-100">
                    Segítségre van szüksége?
                  </p>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Lépjen kapcsolatba a fejlesztőkkel: {CONTACT_CONFIG.SUPPORT_EMAIL}
                </p>
                {this.state.errorId && (
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Hiba ID: {this.state.errorId}
                  </p>
                )}
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
export function withGlobalErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
    showToast?: boolean
    showFallback?: boolean
    level?: 'page' | 'component' | 'global'
  }
) {
  return function WithGlobalErrorBoundaryComponent(props: P) {
    return (
      <GlobalErrorBoundary {...options}>
        <Component {...props} />
      </GlobalErrorBoundary>
    )
  }
}