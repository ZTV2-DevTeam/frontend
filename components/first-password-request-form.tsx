'use client'

import { useState } from 'react'
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
import { apiClient } from "@/lib/api"
import { ConnectionIndicator } from "@/components/connection-indicator"
import { Lock, UserCheck, Mail, Shield } from 'lucide-react'

export function FirstPasswordRequestForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await apiClient.requestFirstLoginToken(email)
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hiba történt a kérés feldolgozása során')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="relative">
          <ConnectionIndicator />
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-green-700">Email elküldve</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Elküldtünk egy emailt a megadott címre az első jelszó beállításához szükséges utasításokkal, amennyiben létezik a fiókod.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 dark:border-blue-800 dark:bg-blue-900">
                  <div className="flex items-start gap-3">
                    <UserCheck className="h-5 w-5 text-blue-600 mt-0.5 dark:text-blue-200" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Következő lépések:</p>
                      <ul className="text-xs text-blue-700 mt-1 space-y-1 dark:text-blue-300">
                        <li>1. Ellenőrizd az email fiókod</li>
                        <li>2. Kattints a jelszó beállítási linkre</li>
                        <li>3. Hozd létre az első jelszavad</li>
                        <li>4. Jelentkezz be a rendszerbe</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Ha nem kapod meg az emailt néhány percen belül, ellenőrizd a spam mappát, vagy próbáld újra.
              </p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = '/login'}
                  className="w-full"
                >
                  Vissza a bejelentkezéshez
                </Button>
                <Button
                  type="button"
                  variant="ghost" 
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  className="w-full text-xs"
                >
                  Másik email cím megadása
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative">
        <ConnectionIndicator />
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl">Első jelszó létrehozása</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 dark:bg-blue-900">
              <div className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-200 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1 dark:text-blue-200">Üdvözlünk a FTV rendszerben!</h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Amennyiben fiókod létrehozásra került, de még nem állítottál be jelszót. Az első bejelentkezéshez kérd
                    el a jelszó beállítási linket email címed megadásával.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                {error && (
                  <div className="p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50 dark:bg-red-800 dark:text-red-200">
                    {error}
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email cím</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="pelda@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Küldés...' : 'Első jelszó beállítási link kérése'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = '/login'}
                  disabled={isLoading}
                >
                  Vissza a bejelentkezéshez
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        <p className="mb-2">
          <span className="underline underline-offset-4">Problémád van?</span> Keress fel személyesen vagy írj emailt a rendszergazdának.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Már van jelszavad? <button 
            onClick={() => window.location.href = '/login'} 
            className="underline underline-offset-4 hover:text-primary"
          >
            Bejelentkezés
          </button>
        </p>
      </div>
    </div>
  )
}
