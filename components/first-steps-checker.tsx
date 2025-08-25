'use client'

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useUserRole } from '@/contexts/user-role-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Settings, CheckCircle } from 'lucide-react'
import { apiClient } from '@/lib/api'

export function FirstStepsChecker({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { currentRole } = useUserRole()
  const router = useRouter()
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && currentRole === 'admin') {
      checkSetupStatus()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, currentRole])

  const checkSetupStatus = async () => {
    try {
      // Check if school year is configured, classes exist, etc.
      const response = await apiClient.getSetupStatus()
      setNeedsSetup(response.needs_setup)
    } catch (error) {
      console.error('Failed to check setup status:', error)
      // If API call fails, assume no setup needed to avoid blocking users
      setNeedsSetup(false)
    } finally {
      setIsLoading(false)
    }
  }

  const goToFirstSteps = () => {
    router.push('/app/first-steps')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Rendszer állapot ellenőrzése...</p>
        </div>
      </div>
    )
  }

  // Only show setup prompt for admins who need setup
  if (isAuthenticated && currentRole === 'admin' && needsSetup) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Rendszer beállítása szükséges
            </CardTitle>
            <CardDescription>
              Üdvözöljük {user?.last_name} {user?.first_name}! A rendszer első használata előtt 
              be kell állítani az alapvető konfigurációt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                A rendszer jelenleg nincs konfigurálva a tanévre. Kérem, kövesse az első lépések 
                útmutatót a teljes funkciók eléréséhez.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button onClick={goToFirstSteps} className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Első lépések megkezdése
              </Button>
              <Button variant="outline" onClick={() => setNeedsSetup(false)}>
                Később
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // For all other cases, render the children normally
  return <>{children}</>
}
