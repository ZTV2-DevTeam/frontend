'use client'

import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { usePermissions } from '@/contexts/permissions-context'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Loader2, Shield } from 'lucide-react'
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
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { permissions, hasPermission, canAccessPage, isLoading: permissionsLoading } = usePermissions()

  // Get current page path
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    // If permissions are loaded and user doesn't have access
    if (!permissionsLoading && permissions) {
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
    currentPath,
    requiredPermission,
    hasPermission,
    canAccessPage,
    router,
    fallbackPath,
    showFallback
  ])

  // Loading state
  if (authLoading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Betöltés...</p>
            <p className="text-sm text-muted-foreground">
              Jogosultságok ellenőrzése...
            </p>
          </div>
        </div>
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
