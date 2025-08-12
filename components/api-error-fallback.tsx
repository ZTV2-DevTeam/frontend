'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ApiErrorFallbackProps {
  error: Error
  retry: () => void
}

export function ApiErrorFallback({ error, retry }: ApiErrorFallbackProps) {
  const errorMessage = error.message || 'Ismeretlen hiba történt'
  
  const isApiError = errorMessage.includes('API') || errorMessage.includes('fetch')
  const isAuthError = errorMessage.includes('401') || errorMessage.includes('Unauthorized') || 
                     errorMessage.includes('Bejelentkezés szükséges')
  const isNetworkError = errorMessage.includes('network') || errorMessage.includes('CORS') ||
                        errorMessage.includes('Failed to fetch')

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-full max-w-md border-destructive/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">
            {isApiError ? 'API Hiba' : 
             isAuthError ? 'Hitelesítési Hiba' :
             isNetworkError ? 'Hálózati Hiba' :
             'Adatbetöltési Hiba'}
          </CardTitle>
          <CardDescription>
            {isApiError && 'Hiba történt az adatok lekérése során.'}
            {isAuthError && 'A munkamenet lejárt vagy nincs megfelelő jogosultsága.'}
            {isNetworkError && 'Hálózati hiba történt. Kérjük, ellenőrizze az internetkapcsolatot.'}
            {!isApiError && !isAuthError && !isNetworkError && 'Váratlan hiba történt az adatok betöltésekor.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={retry} variant="outline" className="flex items-center gap-2">
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
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Fejlesztői részletek
              </summary>
              <pre className="mt-2 whitespace-pre-wrap bg-muted p-2 rounded text-xs overflow-auto max-h-32 text-left">
                {error.stack || error.message || 'Ismeretlen hiba'}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ApiErrorFallback
