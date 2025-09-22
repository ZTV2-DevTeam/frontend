'use client'

import { useEffect } from 'react'
import Link from "next/link"
import { Clapperboard, Home, RefreshCw, AlertTriangle, Bug, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const getErrorType = (error: Error): 'network' | 'permission' | 'generic' => {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch') || message.includes('loading chunk')) {
      return 'network'
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'permission'
    }
    
    return 'generic'
  }

  const getErrorMessage = () => {
    const errorType = getErrorType(error)
    
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
        return {
          title: 'Alkalmazás hiba',
          description: 'Váratlan hiba történt. Kérjük, próbálja meg újra.',
          canRetry: true
        }
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container flex items-center justify-between px-4 py-4 mx-auto sm:px-6 lg:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer" aria-label="FTV főoldal">
          <Clapperboard className="w-8 h-8 text-primary" aria-hidden="true" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span>FTV</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full border border-orange-200 dark:border-orange-700" aria-label="Beta verzió">
                BETA
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-normal leading-none">Hiányzás Áttekintő Platform</span>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">
              Bejelentkezés
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Large Error Icon */}
          <div className="relative">
            <div className="mx-auto w-48 h-48 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-24 h-24 text-destructive/50" aria-hidden="true" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl font-bold text-destructive/20" aria-hidden="true">500</span>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {errorMessage.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {errorMessage.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {errorMessage.canRetry && (
              <Button size="lg" onClick={reset} className="w-full sm:w-auto">
                <RefreshCw className="w-5 h-5 mr-2" />
                Újrapróbálás
              </Button>
            )}
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Főoldal
              </Link>
            </Button>
          </div>

          {/* Error Details Card */}
          <Card className="mt-12 max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5" />
                Hiba részletei
              </CardTitle>
              <CardDescription>
                Technikai információk a fejlesztők számára
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-left space-y-3">
                <div>
                  <p className="text-sm font-medium">Hiba ID:</p>
                  <code className="text-xs text-muted-foreground bg-muted p-2 rounded block font-mono">
                    {errorId}
                  </code>
                </div>
                
                {error.digest && (
                  <div>
                    <p className="text-sm font-medium">Digest:</p>
                    <code className="text-xs text-muted-foreground bg-muted p-2 rounded block font-mono">
                      {error.digest}
                    </code>
                  </div>
                )}

                {process.env.NODE_ENV === 'development' && (
                  <div>
                    <p className="text-sm font-medium">Fejlesztői üzenet:</p>
                    <code className="text-xs text-muted-foreground bg-muted p-2 rounded block font-mono break-all">
                      {error.message}
                    </code>
                  </div>
                )}
              </div>

              {/* Support Contact */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-sm text-blue-900 dark:text-blue-100">
                    Segítségre van szüksége?
                  </p>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  Ha a probléma továbbra is fennáll, lépjen kapcsolatba a fejlesztőkkel.
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Hiba ID: {errorId}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                <Link 
                  href="/app/iranyitopult" 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <span>Irányítópult</span>
                  <span className="text-xs text-muted-foreground">Főmenü</span>
                </Link>
                <Link 
                  href="/technical-details" 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <span>Technikai részletek</span>
                  <span className="text-xs text-muted-foreground">Hibaelhárítás</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} FTV - Kőbányai Szent László Gimnázium</p>
          </div>
        </div>
      </footer>
    </div>
  )
}