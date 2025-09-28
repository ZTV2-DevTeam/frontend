'use client'

import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { usePermissions } from '@/contexts/permissions-context'
import { useAuth } from '@/contexts/auth-context'
import { useConnectionStatus } from '@/hooks/use-connection'
import { ProfessionalLoading } from '@/components/professional-loading'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  fallbackPath?: string
  showFallback?: boolean
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  fallbackPath = '/app/iranyitopult',
  showFallback = true 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, login } = useAuth()
  const { 
    permissions, 
    hasPermission, 
    canAccessPage, 
    isLoading: permissionsLoading,
    error: permissionsError,
    refresh: refreshPermissions
  } = usePermissions()
  const { checkConnection } = useConnectionStatus()

  // Get current page path
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    // If permissions are loaded and user doesn't have access
    if (!permissionsLoading && permissions && !permissionsError) {
      const hasPageAccess = canAccessPage(currentPath)
      const hasRequiredPermission = requiredPermission ? hasPermission(requiredPermission) : true

      if (!hasPageAccess || !hasRequiredPermission) {
        if (showFallback) {
          // Don't redirect, just show access denied
          return
        } else {
          router.push(fallbackPath)
          return
        }
      }
    }
  }, [
    isAuthenticated,
    authLoading,
    permissions,
    permissionsLoading,
    permissionsError,
    currentPath,
    requiredPermission,
    hasPermission,
    canAccessPage,
    router,
    fallbackPath,
    showFallback
  ])

  const handleRetry = async () => {
    try {
      await checkConnection()
      await refreshPermissions()
    } catch (error) {
      console.error('Retry failed:', error)
    }
  }

  // Loading state with professional loading component - show immediately if any loading
  if (authLoading || (permissionsLoading && !permissions)) {
    return (
      <ProfessionalLoading
        variant="detailed"
        title={authLoading ? "Bejelentkezés ellenőrzése" : "Jogosultságok betöltése"}
        subtitle="Kérjük, várjon..."
      />
    )
  }

  // Handle permissions error - show custom error state with ProfessionalLoading fallback
  if (permissionsError && !permissions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Hiba történt</h3>
              <p className="text-muted-foreground">{permissionsError}</p>
            </div>
            <Button onClick={handleRetry} className="w-full">
              Újrapróbálás
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Bejelentkezés szükséges</h3>
            <p className="text-muted-foreground mb-6">
              Az oldal megtekintéséhez be kell jelentkeznie.
            </p>
            <Button onClick={() => router.push('/login')}>
              Bejelentkezés
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check permissions
  if (permissions) {
    const hasPageAccess = canAccessPage(currentPath)
    const hasRequiredPermission = requiredPermission ? hasPermission(requiredPermission) : true

    if (!hasPageAccess || !hasRequiredPermission) {
      if (showFallback) {
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
                  <Shield className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Nincs jogosultság</h3>
                <p className="text-muted-foreground mb-6">
                  Nincs jogosultsága ehhez az oldalhoz.
                </p>
                <Button onClick={() => router.push(fallbackPath)}>
                  Vissza az irányítópulthoz
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      }
      // Will redirect via useEffect
      return null
    }
  }

  return <>{children}</>
}
