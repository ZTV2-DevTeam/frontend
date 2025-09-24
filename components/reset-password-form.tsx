'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { OnDemandPasswordValidation, useOnDemandPasswordValidation } from "@/components/ondemand-password-validation"

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  token: string
}

export function ResetPasswordForm({
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  
  const router = useRouter()
  
  // Use our new on-demand password validation
  const { isValid: passwordValid } = useOnDemandPasswordValidation(password)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await apiClient.verifyResetToken(token)
        setTokenValid(result.valid)
      } catch {
        setTokenValid(false)
        setError('A jelszó visszaállítási link érvénytelen vagy lejárt.')
      } finally {
        setIsVerifying(false)
      }
    }

    if (token) {
      verifyToken()
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek meg.')
      return
    }

    if (!passwordValid) {
      setError('A jelszó nem felel meg a biztonsági követelményeknek.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await apiClient.resetPassword({
        token,
        password,
        confirmPassword
      })
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hiba történt a jelszó módosítása során')
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="relative">
          <ConnectionIndicator />
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Token ellenőrzése...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground">
                Ellenőrizzük a jelszó visszaállítási linket...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="relative">
          <ConnectionIndicator />
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Érvénytelen link</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <p className="text-sm text-red-600">
                {error || 'A jelszó visszaállítási link érvénytelen vagy lejárt.'}
              </p>
              <p className="text-xs text-muted-foreground">
                Kérj új jelszó visszaállítási linket.
              </p>
              <Button
                type="button"
                onClick={() => router.push('/elfelejtett_jelszo')}
              >
                Új link kérése
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/login')}
              >
                Vissza a bejelentkezéshez
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="relative">
          <ConnectionIndicator />
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Jelszó sikeresen módosítva</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <p className="text-sm text-green-600">
                A jelszavad sikeresen megváltozott. Átirányítunk a bejelentkezési oldalra...
              </p>
              <Button
                type="button"
                onClick={() => router.push('/login')}
              >
                Bejelentkezés
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
          <CardTitle className="text-xl">Új jelszó beállítása</CardTitle>
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
                  <Label htmlFor="password">Új jelszó</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Adjon meg egy erős jelszót"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                {/* Password validation feedback */}
                <OnDemandPasswordValidation
                  password={password}
                  showStrengthMeter={true}
                  compact={true}
                />
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Jelszó megerősítése</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Írd be újra a jelszót"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !passwordValid || password !== confirmPassword}
                >
                  {isLoading ? 'Módosítás...' : 'Jelszó módosítása'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/login')}
                  disabled={isLoading}
                >
                  Mégsem
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
