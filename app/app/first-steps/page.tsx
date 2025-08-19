'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useUserRole } from '@/contexts/user-role-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Shield, Settings, Users, GraduationCap, FileText, Upload, Database } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FirstStepsPage() {
  const { user } = useAuth()
  const { currentRole } = useUserRole()
  const router = useRouter()

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
                A rendszer beállításához és adatok importálásához használja az alábbi eszközöket.
                A felhasználó import funkció lehetővé teszi CSV fájlok feltöltését és feldolgozását.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Felhasználók Importálása
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              CSV fájlok feltöltése és feldolgozása felhasználók, osztályok és stábok létrehozásához.
            </p>
            <Button 
              onClick={() => router.push('/app/user-import')}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              User Import megnyitása
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Django Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Közvetlen adatbázis kezelés és részletes rendszer beállítások.
            </p>
            <Button 
              onClick={() => window.open('/admin', '_blank')}
              variant="outline"
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Django Admin megnyitása
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Irányítópult
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Visszatérés a főoldalra a rendszer áttekintéséhez és napi használatához.
          </p>
          <Button 
            onClick={() => router.push('/app/iranyitopult')}
            variant="outline"
            className="w-full"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Irányítópult megnyitása
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
