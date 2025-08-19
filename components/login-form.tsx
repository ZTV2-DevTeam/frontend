'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { usePermissions } from "@/contexts/permissions-context"
import { ConnectionIndicator } from "@/components/connection-indicator"
import { EnhancedLoading } from "@/components/enhanced-loading"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const { isLoading: permissionsLoading } = usePermissions()
  const router = useRouter()

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

  // Show enhanced loading screen when navigating after successful login
  if (isNavigating) {
    return (
      <EnhancedLoading
        isLoading={true}
        error={null}
        stage="auth"
        loadingText="Bejelentkezés sikeres, jogosultságok betöltése..."
        timeout={15000}
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
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                {error && (
                  <div className="p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
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
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Jelszó</Label>
                    <Link
                      href="/elfelejtett_jelszo"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                      tabIndex={4}
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
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} tabIndex={3}>
                  {isLoading ? 'Bejelentkezés...' : 'Bejelentkezés'}
                </Button>
                
                <div className="text-center">
                  <Link
                    href="/first-password"
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    tabIndex={5}
                  >
                    Első bejelentkezés? Jelszó beállítási link kérése
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        A folytatásra kattintva elfogadod a <a href="/terms-of-service">Felhasználási feltételeket</a> és az <a href="/privacy-policy">Adatvédelmi szabályzatot</a>.
      </div>
    </div>
  )
}
