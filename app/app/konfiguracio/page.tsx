"use client"

import { StandardizedLayout } from "@/components/standardized-layout"
import { ConfigurationWizard } from "@/components/configuration-wizard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserRole } from "@/contexts/user-role-context"
import { Shield, AlertTriangle } from "lucide-react"

export default function ConfigurationPage() {
  const { currentRole } = useUserRole()

  // Only allow admin access
  if (currentRole !== 'admin') {
    return (
      <StandardizedLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          <Card className="border-destructive/50 bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Hozzáférés megtagadva
              </CardTitle>
              <CardDescription>
                Ez a funkció csak rendszergazdák számára elérhető.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nincs jogosultságod a konfiguráció kezeléséhez.</p>
                <p className="text-sm mt-2">Csak rendszergazdák férhetnek hozzá ehhez a funkcióhoz.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </StandardizedLayout>
    )
  }

  const handleComplete = () => {
    // Configuration completed - could navigate to dashboard or show success message
    window.location.href = '/app/iranyitopult'
  }

  return (
    <StandardizedLayout>
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Konfiguráció Varázsló
          </h1>
          <p className="text-sm text-muted-foreground">
            Rendszer kezdeti beállítása és alapadatok feltöltése
          </p>
        </div>

        {/* Configuration Wizard Component */}
        <ConfigurationWizard onComplete={handleComplete} />
      </div>
    </StandardizedLayout>
  )
}
