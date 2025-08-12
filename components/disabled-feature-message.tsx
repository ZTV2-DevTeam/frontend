"use client"

import { AlertCircle, Construction } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DisabledFeatureMessageProps {
  featureName: string
  description?: string
}

export function DisabledFeatureMessage({ 
  featureName, 
  description = "Ez a funkció jelenleg fejlesztés alatt áll." 
}: DisabledFeatureMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
            <Construction className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {featureName} Kikapcsolva
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Fejlesztői Üzenet
          </Badge>
          <p className="text-sm text-muted-foreground">
            A fejlesztő ideiglenesen kikapcsolta ezt a funkciót. 
            Kérjük, próbálja meg később, vagy vegye fel a kapcsolatot a rendszergazdával.
          </p>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Ha sürgős, forduljon a ZTV2 fejlesztői csapathoz.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
