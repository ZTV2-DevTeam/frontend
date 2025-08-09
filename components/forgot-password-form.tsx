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

export function ForgotPasswordForm({
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
      await apiClient.forgotPassword({ email })
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
            <CardTitle className="text-xl">Email elküldve</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground">
                Elküldtünk egy emailt a megadott címre a jelszó visszaállításához szükséges utasításokkal.
              </p>
              <p className="text-xs text-muted-foreground">
                Ha nem kapod meg az emailt néhány percen belül, ellenőrizd a spam mappát.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.href = '/login'}
              >
                Vissza a bejelentkezéshez
              </Button>
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
          <CardTitle className="text-xl">Elfelejtett jelszó</CardTitle>
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
                <p className="text-xs text-muted-foreground">
                  Add meg a fiókodhoz tartozó email címet. Küldünk egy linket a jelszó visszaállításához.
                </p>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Küldés...' : 'Jelszó visszaállítása'}
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
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Problémád van? Keress fel személyesen vagy írj emailt a rendszergazdának.
      </div>
    </div>
  )
}
