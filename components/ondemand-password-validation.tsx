'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  XCircle, 
  Shield, 
  Eye, 
  Loader2
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface UserData {
  username?: string
  email?: string
  first_name?: string
  last_name?: string
}

interface OnDemandPasswordValidationProps {
  password: string
  userData?: UserData
  className?: string
  showStrengthMeter?: boolean
  compact?: boolean
}

export function OnDemandPasswordValidation({
  password,
  userData,
  className,
  showStrengthMeter = true,
  compact = false
}: OnDemandPasswordValidationProps) {
  const [validation, setValidation] = useState<{
    valid: boolean
    errors: string[]
    score: number
  } | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // Server-side validation with debouncing
  const validatePassword = useCallback(async (password: string, userData?: UserData) => {
    if (!password) {
      setValidation(null)
      return
    }

    setIsValidating(true)

    try {
      const result = await apiClient.checkPasswordValidation({
        password,
        username: userData?.username,
        email: userData?.email,
        first_name: userData?.first_name,
        last_name: userData?.last_name
      })

      // Calculate strength score based on validation and criteria
      let score = 0
      
      // Base score if password passes server validation
      if (result.valid) score += 50
      
      // Length scoring (progressive)
      if (password.length >= 8) score += 10
      if (password.length >= 12) score += 10
      if (password.length >= 16) score += 5
      
      // Character variety scoring
      if (/[A-Z]/.test(password)) score += 10 // Uppercase
      if (/[a-z]/.test(password)) score += 5  // Lowercase
      if (/\d/.test(password)) score += 10    // Numbers
      if (/[^A-Za-z0-9]/.test(password)) score += 15 // Special characters
      
      // Bonus for complexity combinations
      const hasUpper = /[A-Z]/.test(password)
      const hasLower = /[a-z]/.test(password)
      const hasNumber = /\d/.test(password)
      const hasSpecial = /[^A-Za-z0-9]/.test(password)
      
      // Bonus for having all character types
      if (hasUpper && hasLower && hasNumber && hasSpecial) {
        score += 15
      }
      
      // Additional bonus for very long passwords with all types
      if (password.length >= 20 && hasUpper && hasLower && hasNumber && hasSpecial) {
        score += 10
      }
      
      setValidation({
        valid: result.valid || false,
        errors: result.errors || [],
        score: Math.min(score, 100)
      })
    } catch (error) {
      console.error('Password validation failed:', error)
      setValidation({
        valid: false,
        errors: ['Hiba történt a jelszó ellenőrzése során'],
        score: 0
      })
    } finally {
      setIsValidating(false)
    }
  }, [])

  // Debounced validation
  useEffect(() => {
    if (!password) {
      setValidation(null)
      return
    }

    const timeoutId = setTimeout(() => {
      validatePassword(password, userData)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [password, userData, validatePassword])

  // Get strength info
  const getStrengthInfo = (score: number) => {
    if (score >= 90) return { 
      color: 'bg-green-500 dark:bg-green-600', 
      label: 'Nagyon erős', 
      textColor: 'text-green-700 dark:text-green-300' 
    }
    if (score >= 75) return { 
      color: 'bg-blue-500 dark:bg-blue-600', 
      label: 'Erős', 
      textColor: 'text-blue-700 dark:text-blue-300' 
    }
    if (score >= 60) return { 
      color: 'bg-yellow-500 dark:bg-yellow-600', 
      label: 'Jó', 
      textColor: 'text-yellow-700 dark:text-yellow-300' 
    }
    if (score >= 40) return { 
      color: 'bg-orange-500 dark:bg-orange-600', 
      label: 'Közepes', 
      textColor: 'text-orange-700 dark:text-orange-300' 
    }
    return { 
      color: 'bg-red-500 dark:bg-red-600', 
      label: 'Gyenge', 
      textColor: 'text-red-700 dark:text-red-300' 
    }
  }

  if (!password) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-muted-foreground text-sm",
        !compact && "p-3 bg-muted/30 dark:bg-muted/20 rounded-lg border border-muted dark:border-muted/50",
        className
      )}>
        <Eye className="h-4 w-4" />
        <span>Írd be a jelszót a valós idejű ellenőrzéshez</span>
      </div>
    )
  }

  const strengthInfo = validation ? getStrengthInfo(validation.score) : getStrengthInfo(0)

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        {/* Compact strength meter */}
        {showStrengthMeter && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Jelszó erősség</span>
                {isValidating && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </div>
              <Badge variant="outline" className={cn("text-xs h-5 px-1.5", strengthInfo.textColor)}>
                {strengthInfo.label}
              </Badge>
            </div>
            <div className="h-1.5 bg-muted dark:bg-muted/50 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-700 ease-out", strengthInfo.color)}
                style={{ width: `${validation?.score || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Compact errors */}
        {validation && validation.errors.length > 0 && (
          <div className="space-y-1">
            {validation.errors.slice(0, 2).map((error, index) => (
              <div key={index} className="flex items-start gap-1.5 text-xs text-destructive dark:text-red-400">
                <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
            {validation.errors.length > 2 && (
              <div className="text-xs text-muted-foreground pl-4.5">
                +{validation.errors.length - 2} további probléma
              </div>
            )}
          </div>
        )}

        {/* Success indicator */}
        {validation?.valid && (
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            <span>A jelszó megfelel a biztonsági követelményeknek</span>
          </div>
        )}
      </div>
    )
  }

  // Full version
  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength Meter */}
      {showStrengthMeter && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Jelszó erősség</span>
              {isValidating && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            </div>
            <Badge 
              variant="outline" 
              className={cn("text-xs", strengthInfo.textColor)}
            >
              {strengthInfo.label} ({validation?.score || 0}%)
            </Badge>
          </div>
          <div className="h-2 bg-muted dark:bg-muted/50 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-700 ease-out", strengthInfo.color)}
              style={{ width: `${validation?.score || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Validation Results */}
      {validation && (
        <div className={cn(
          "p-3 rounded-lg border transition-all duration-300",
          validation.valid
            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-300"
            : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300"
        )}>
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              {validation.valid ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {validation.valid 
                  ? "Jelszó elfogadva" 
                  : "Jelszó nem felel meg a követelményeknek"}
              </div>
              {validation.errors.length > 0 && (
                <ul className="text-xs space-y-0.5">
                  {validation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Export validation state for parent components
export function useOnDemandPasswordValidation(
  password: string,
  userData?: UserData
) {
  const [isValid, setIsValid] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)

  // Extract values that matter to avoid object reference issues
  const username = userData?.username
  const email = userData?.email
  const firstName = userData?.first_name
  const lastName = userData?.last_name

  useEffect(() => {
    if (!password) {
      setIsValid(false)
      setErrors([])
      setIsValidating(false)
      return
    }

    setIsValidating(true)

    const validatePassword = async () => {
      try {
        const result = await apiClient.checkPasswordValidation({
          password,
          username,
          email,
          first_name: firstName,
          last_name: lastName
        })

        setIsValid(result.valid || false)
        setErrors(result.errors || [])
      } catch (error) {
        console.error('Password validation failed:', error)
        setIsValid(false)
        setErrors(['Hiba történt a jelszó ellenőrzése során'])
      } finally {
        setIsValidating(false)
      }
    }

    const timeoutId = setTimeout(validatePassword, 300)
    return () => clearTimeout(timeoutId)

  }, [password, username, email, firstName, lastName])

  return { isValid, errors, isValidating }
}