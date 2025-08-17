'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useUserRole } from '@/contexts/user-role-context'
import { ConfigurationWizard } from '@/components/configuration-wizard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Settings, Users, GraduationCap } from 'lucide-react'

export default function FirstStepsPage() {
  const { user } = useAuth()
  const { currentRole } = useUserRole()
  const [isSetupComplete, setIsSetupComplete] = useState(false)

  // Check if user is admin
  if (currentRole !== 'admin') {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Ez az oldal csak rendszergazdák számára érhető el.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isSetupComplete) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Konfiguráció befejezve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>A rendszer sikeresen konfigurálva lett! Most már teljes funkcionalitással használható.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Üdvözöljük {user?.first_name} {user?.last_name}! (Rendszergazda)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Jelenleg Ön a rendszeradminisztrátor. Önnek teljes körű hozzáférése van a rendszerhez, 
              mind ezen a felületen, mind a rendszer adatbázisát közvetlenül kezelő eszközökhöz (Django Admin).
            </p>
            
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                Ez a felület azért jelenik meg Önnek, mivel úgy tűnik jelenleg nincs konfigurálva a következő tanév. 
                A következő konfiguráció végigvezeti Önt a tanév beállításán és adatok importálásán, amely után a rendszer teljes funkcionalitása 
                elérhető lesz.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <ConfigurationWizard onComplete={() => setIsSetupComplete(true)} />
    </div>
  )
}
