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

import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Lock, 
  UserCheck, 
  Info, 
  AlertCircle, 
  Check, 
  X,
  Loader2
} from 'lucide-react'
import { apiClient } from "@/lib/api"
import { OnDemandPasswordValidation, useOnDemandPasswordValidation } from "@/components/ondemand-password-validation"
import { ConnectionIndicator } from "@/components/connection-indicator"

interface FirstPasswordFormProps extends React.ComponentProps<"div"> {
  token: string
}

interface UserInfo {
  first_name: string
  last_name: string
  email: string
  username: string
}

export function FirstPasswordForm({
  token,
  className,
  ...props
}: FirstPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  
  const router = useRouter()
  
  // Use our new on-demand password validation
  const { isValid: passwordValid } = useOnDemandPasswordValidation(
    password,
    {
      username: userInfo?.username,
      email: userInfo?.email,
      first_name: userInfo?.first_name,
      last_name: userInfo?.last_name
    }
  )

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await apiClient.verifyFirstLoginToken(token)
        setTokenValid(result.valid)
        if (result.valid && result.user_info) {
          setUserInfo(result.user_info)
        } else if (result.error) {
          setError(result.error)
        }
      } catch {
        setTokenValid(false)
        setError('Az első bejelentkezési link érvénytelen vagy lejárt.')
      } finally {
        setIsVerifying(false)
      }
    }

    if (token) {
      verifyToken()
    }
  }, [token])

  // Password validation is now handled by the on-demand validation hook

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
      await apiClient.setFirstPassword(token, password, confirmPassword)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hiba történt a jelszó beállítása során.')
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
            <div className="flex justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <CardTitle className="text-xl">Token ellenőrzése...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground">
                Ellenőrizzük az első bejelentkezési linket...
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
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-600">Érvénytelen vagy lejárt link</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <p className="text-sm text-red-600">
                {error || 'Az első bejelentkezési link érvénytelen vagy már lejárt.'}
              </p>
              <p className="text-xs text-muted-foreground">
                Kérj új első bejelentkezési linket.
              </p>
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={() => router.push('/first-password')}
                  className="w-full"
                >
                  Új link kérése
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/login')}
                  className="w-full"
                >
                  Vissza a bejelentkezéshez
                </Button>
              </div>
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
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-green-600">
              Jelszó sikeresen beállítva!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Sikeres regisztráció!</span>
                </div>
                <p className="text-sm text-green-700">
                  A jelszó sikeresen beállításra került. Most már beléphetsz a FTV rendszerbe.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatikusan átirányítjuk a bejelentkezési oldalra...
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <Button
                type="button"
                onClick={() => router.push('/login')}
              >
                Bejelentkezés most
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
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-gradient-to-r from-blue-100 to-purple-100 p-3">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl">
            Első jelszó létrehozása
          </CardTitle>
          <div className="mt-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    Üdvözöljük, {userInfo?.last_name} {userInfo?.first_name}!
                  </h3>
                  <p className="text-xs text-blue-700">
                    Kérem, hozza létre az első jelszavát a FTV rendszerbe való biztonságos belépéshez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
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
              
              <OnDemandPasswordValidation
                password={password}
                userData={{
                  username: userInfo?.username,
                  email: userInfo?.email,
                  first_name: userInfo?.first_name,
                  last_name: userInfo?.last_name
                }}
                showStrengthMeter={true}
                compact={false}
              />
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
              {confirmPassword && password !== confirmPassword && (
                <div className="flex items-center gap-2 text-red-600">
                  <X className="h-4 w-4" />
                  <span className="text-xs">A jelszavak nem egyeznek</span>
                </div>
              )}
              {confirmPassword && password === confirmPassword && password.length > 0 && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-xs">A jelszavak megegyeznek</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Biztonsági jellemzők:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Használj egyedi jelszót, amit máshol nem használsz</li>
                    <li>• Keverd a kis- és nagybetűket, számokat és szimbólumokat</li>
                    <li>• Kerüld a személyes adatokat (név, születési dátum)</li>
                    <li>• Minél hosszabb, annál biztonságosabb</li>
                    <li>• A token biztonságosan kódolt és csak a szerver tudja dekódolni</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !password || !confirmPassword || !passwordValid || password !== confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Beállítás...
                </>
              ) : (
                'Jelszó beállítása'
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/first-password')}
              disabled={isLoading}
              className="w-full"
            >
              Másik email cím
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-muted-foreground text-center text-xs text-balance">
        <p className="mb-2">
          <span className="underline underline-offset-4">Problémád van?</span> Keress fel személyesen vagy írj emailt a rendszergazdának.
        </p>
      </div>
    </div>
  )
}
