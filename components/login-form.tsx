'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Landmark } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"
import { usePermissions } from "@/contexts/permissions-context"
import { ConnectionIndicator } from "@/components/connection-indicator"
import { ProfessionalLoading } from "@/components/professional-loading"

// Hibakódok, amelyekkel a backend az SZLG+ bejelentkezésből visszairányít (?sso_error=...)
const SSO_ERROR_MESSAGES: Record<string, string> = {
  sso_not_configured: 'Az SZLG+ bejelentkezés még nincs beállítva. Értesítsd az adminisztrátort.',
  sso_unavailable: 'Az SZLG+ szolgáltatás jelenleg nem érhető el. Próbáld újra később.',
  sso_issuer_mismatch: 'Az SZLG+ bejelentkezés beállítása hibás (eltérő kiállító). Értesítsd az adminisztrátort.',
  sso_invalid_state: 'A bejelentkezési kérés lejárt vagy érvénytelen. Próbáld újra, és ellenőrizd, hogy a böngészőben engedélyezve vannak a sütik.',
  sso_cancelled: 'Az SZLG+ bejelentkezést megszakítottad.',
  sso_provider_error: 'Az SZLG+ hibát jelzett a bejelentkezés közben. Próbáld újra.',
  sso_token_rejected: 'Az SZLG+ elutasította az alkalmazás hitelesítését. Értesítsd az adminisztrátort.',
  sso_email_not_verified: 'Az SZLG+ fiókod e-mail-címe nincs megerősítve.',
  sso_account_not_linked: 'Ehhez az SZLG+ fiókhoz nem található egyértelműen megfeleltethető FTV felhasználó. Ellenőrizd, hogy az FTV-ben ugyanez az e-mail-cím szerepel.',
  sso_account_disabled: 'A felhasználói fiók le van tiltva.',
  sso_not_allowed: 'A felhasználó nem jelentkezhet be az aktuális tanévben. Fordulj a médiatanárhoz.',
  sso_failed: 'Az SZLG+ bejelentkezés sikertelen. Próbáld újra.',
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [error, setError] = useState('')
  const [ssoRedirecting, setSsoRedirecting] = useState(false)
  const [ssoProcessing, setSsoProcessing] = useState(false)
  const ssoHandled = useRef(false)
  
  const { login, loginWithSSOTicket } = useAuth()
  const { isLoading: permissionsLoading } = usePermissions()
  const router = useRouter()

  // Az SZLG+ bejelentkezésből visszatérve: hibakód megjelenítése, vagy az egyszer
  // használható jegy beváltása. A paramétereket azonnal töröljük az URL-ből, így a
  // jegy nem marad az előzményekben, és a React StrictMode kettős effektfuttatása
  // sem használja fel kétszer.
  useEffect(() => {
    if (ssoHandled.current) return
    const url = new URL(window.location.href)
    const ssoError = url.searchParams.get('sso_error')
    const ssoTicket = url.searchParams.get('sso_ticket')
    if (!ssoError && !ssoTicket) return

    ssoHandled.current = true
    url.searchParams.delete('sso_error')
    url.searchParams.delete('sso_ticket')
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)

    if (ssoError) {
      setError(SSO_ERROR_MESSAGES[ssoError] || SSO_ERROR_MESSAGES.sso_failed)
      return
    }

    if (ssoTicket) {
      setSsoProcessing(true)
      loginWithSSOTicket(ssoTicket)
        .then(() => {
          setIsNavigating(true)
          setSsoProcessing(false)
          setTimeout(() => {
            router.push('/app/iranyitopult')
          }, 100)
        })
        .catch((ssoLoginError) => {
          console.error('SSO login failed:', ssoLoginError)
          setSsoProcessing(false)
          setError(
            ssoLoginError instanceof Error && ssoLoginError.message
              ? ssoLoginError.message
              : 'A bejelentkezés nem fejeződött be. Próbáld újra.'
          )
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSSOLogin = () => {
    setSsoRedirecting(true)
    setError('')
    // A teljes folyamatot a backend vezeti: átirányít az SZLG+ oldalára
    window.location.assign(apiClient.getSSOStartUrl())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validate inputs before making request
      if (!username.trim()) {
        setError('A felhasználónév megadása kötelező')
        return
      }
      
      if (!password.trim()) {
        setError('A jelszó megadása kötelező')
        return
      }

      console.log('Attempting login with username:', username)
      await login({ username: username.trim(), password: password.trim() })
      console.log('Login successful, setting navigation state...')
      
      // Set navigating state to show loading screen
      setIsNavigating(true)
      
      // Small delay to ensure permissions context starts loading
      setTimeout(() => {
        router.push('/app/iranyitopult')
      }, 100)
    } catch (error) {
      console.error('Login error in form:', error)
      
      // Handle different types of errors
      let errorMessage = 'Bejelentkezési hiba'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        errorMessage = String(error) || 'Ismeretlen hiba történt'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Show professional loading screen when navigating after successful login
  if (ssoProcessing) {
    return (
      <ProfessionalLoading
        variant="detailed"
        title="Bejelentkezés SZLG+-szal"
        subtitle="A bejelentkezés befejezése..."
      />
    )
  }

  if (isNavigating) {
    return (
      <ProfessionalLoading
        variant="detailed"
        title="Bejelentkezés sikeres"
        subtitle="Jogosultságok betöltése és átirányítás..."
      />
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative">
        <ConnectionIndicator />
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bejelentkezés</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate aria-label="Bejelentkezési űrlap">
            <div className="grid gap-6">
              <div className="grid gap-6">
                {error && (
                  <div 
                    className="p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                    role="alert"
                    aria-live="polite"
                    id="login-error"
                  >
                    {error}
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="username">Felhasználónév</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="felhasznalonev"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    tabIndex={1}
                    aria-describedby={error ? "login-error" : undefined}
                    aria-invalid={error ? "true" : "false"}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Jelszó</Label>
                    <Link
                      href="/elfelejtett_jelszo"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                      tabIndex={4}
                      aria-label="Elfelejtett jelszó helyreállítás"
                    >
                      Elfelejtett jelszó?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    tabIndex={2}
                    aria-describedby={error ? "login-error" : undefined}
                    aria-invalid={error ? "true" : "false"}
                    autoComplete="current-password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading} 
                  tabIndex={3}
                  aria-describedby={isLoading ? "login-status" : undefined}
                >
                  {isLoading ? 'Bejelentkezés...' : 'Bejelentkezés'}
                </Button>
                {isLoading && (
                  <div id="login-status" className="sr-only" aria-live="polite">
                    Bejelentkezés folyamatban
                  </div>
                )}
                <div className="relative text-sm text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 px-2 bg-card text-muted-foreground">vagy SZLG+</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isLoading || ssoRedirecting}
                  onClick={handleSSOLogin}
                  tabIndex={5}
                >
                  <Landmark className="w-4 h-4 mr-2" aria-hidden="true" />
                  {ssoRedirecting ? 'Átirányítás…' : 'Bejelentkezés SZLG+-szal'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        A folytatásra kattintva elfogadod a <a href="/terms-of-service" className="cursor-pointer" aria-label="Felhasználási feltételek megnyitása">Felhasználási feltételeket</a> és az <a href="/privacy-policy" className="cursor-pointer" aria-label="Adatvédelmi szabályzat megnyitása">Adatvédelmi szabályzatot</a>. A weboldal nem-követő sütiket használ, melyek elengedhetetlenek a weboldal működéséhez.
      </div>
    </div>
  )
}
