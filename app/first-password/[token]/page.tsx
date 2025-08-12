/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, CheckCircle, Lock } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface TokenValidation {
  valid: boolean
  user_info?: {
    first_name: string
    last_name: string
    email: string
    user_type: 'student' | 'teacher'
  }
}

export default function FirstPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const [token] = useState(params.token as string)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [userInfo, setUserInfo] = useState<TokenValidation['user_info'] | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validateToken = useCallback(async () => {
    try {
      // This would be a specific endpoint for first-password token validation
      const response = await apiClient.get<TokenValidation>(`first-password/validate/${token}`)
      setTokenValid(response.valid)
      if (response.valid && response.user_info) {
        setUserInfo(response.user_info)
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      setTokenValid(false)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      validateToken()
    }
  }, [token, validateToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek meg.')
      return
    }

    if (password.length < 8) {
      setError('A jelszónak legalább 8 karakter hosszúnak kell lennie.')
      return
    }

    setIsSubmitting(true)

    try {
      await apiClient.post(`first-password/set`, {
        token,
        password,
        confirmPassword
      })
      
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      setError(error.message || 'Hiba történt a jelszó beállítása során.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[^A-Za-z\d]/.test(password)) strength += 1

    const levels = [
      { label: 'Nagyon gyenge', color: 'bg-red-500' },
      { label: 'Gyenge', color: 'bg-orange-500' },
      { label: 'Közepes', color: 'bg-yellow-500' },
      { label: 'Erős', color: 'bg-blue-500' },
      { label: 'Nagyon erős', color: 'bg-green-500' }
    ]

    return { strength, ...levels[Math.min(strength, 4)] }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Token ellenőrzése...</p>
        </div>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Érvénytelen vagy lejárt link</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>A megadott link érvénytelen vagy már lejárt.</p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Bejelentkezéshez
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Jelszó sikeresen beállítva!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>A jelszó sikeresen beállításra került. Automatikusan átirányítjuk a bejelentkezési oldalra...</p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            Első jelszó létrehozása
          </CardTitle>
          <CardDescription className="text-center">
            Üdvözöljük {userInfo?.first_name} {userInfo?.last_name}!
            <br />
            Kérem, hozza létre az első jelszavát a rendszerbe való belépéshez.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email cím</Label>
              <Input
                id="email"
                type="email"
                value={userInfo?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Új jelszó</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Adja meg az új jelszót"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs">{passwordStrength.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A jelszó legalább 8 karakter hosszú legyen, és tartalmazzon kis- és nagybetűket, számot és speciális karaktert.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Jelszó megerősítése</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Erősítse meg a jelszót"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !password || !confirmPassword}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Beállítás...
                </>
              ) : (
                'Jelszó beállítása'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
