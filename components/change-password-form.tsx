'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/contexts/auth-context"
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
import { ArrowLeft, Eye, EyeOff, Lock, Shield } from "lucide-react"

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { user } = useAuth()
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Use our new on-demand password validation
  const { isValid: passwordValid } = useOnDemandPasswordValidation(
    newPassword,
    {
      username: user?.username,
      email: user?.email,
      first_name: user?.first_name,
      last_name: user?.last_name
    }
  )

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // No need for separate validation effect - using on-demand validation

  if (!user) {
    return null // Will redirect via useEffect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Client-side validation
    if (!oldPassword.trim()) {
      setError('Kérjük, adja meg a jelenlegi jelszót.')
      setIsLoading(false)
      return
    }

    if (!newPassword.trim()) {
      setError('Kérjük, adja meg az új jelszót.')
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Az új jelszavak nem egyeznek meg.')
      setIsLoading(false)
      return
    }

    if (oldPassword === newPassword) {
      setError('Az új jelszónak különböznie kell a jelenlegi jelszótól.')
      setIsLoading(false)
      return
    }

    // Check password validation before submitting
    if (!passwordValid) {
      setError('Az új jelszó nem felel meg a biztonsági követelményeknek.')
      setIsLoading(false)
      return
    }

    try {
      await apiClient.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirmNewPassword: confirmPassword
      })
      setSuccess(true)
      setTimeout(() => {
        router.push('/app/beallitasok')
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hiba történt a jelszó módosítása során')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/app/beallitasok')
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="relative">
          <ConnectionIndicator />
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl text-green-600 dark:text-green-400">Jelszó sikeresen módosítva</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground">
                A jelszava sikeresen megváltozott. Mostantól az új jelszóval jelentkezhet be.
              </p>
              <p className="text-xs text-muted-foreground">
                Automatikusan visszairányítjuk a beállítások oldalra...
              </p>
              <Button
                type="button"
                onClick={handleCancel}
              >
                Vissza a beállításokhoz
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
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Jelszó módosítása</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Adja meg a jelenlegi jelszavát, majd állítson be egy újat
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {error && (
                <div className="p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Current Password */}
              <div className="grid gap-3">
                <Label htmlFor="oldPassword">Jelenlegi jelszó</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Adja meg a jelenlegi jelszót"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    disabled={isLoading}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* New Password */}
              <div className="grid gap-3">
                <Label htmlFor="newPassword">Új jelszó</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Adjon meg egy új jelszót"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                {/* Password validation feedback */}
                <OnDemandPasswordValidation
                  password={newPassword}
                  userData={{
                    username: user?.username,
                    email: user?.email,
                    first_name: user?.first_name,
                    last_name: user?.last_name
                  }}
                  showStrengthMeter={true}
                  compact={true}
                />
              </div>

              {/* Confirm New Password */}
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Új jelszó megerősítése</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Írja be újra az új jelszót"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                {/* Password match feedback */}
                {confirmPassword.length > 0 && (
                  <div className={`p-2 text-xs rounded ${
                    newPassword === confirmPassword 
                      ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                  }`}>
                    {newPassword === confirmPassword ? '✓ A jelszavak egyeznek' : '✗ A jelszavak nem egyeznek'}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Mégsem
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !passwordValid || newPassword !== confirmPassword}
                  className="order-1 sm:order-2"
                >
                  {isLoading ? 'Módosítás...' : 'Jelszó módosítása'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}