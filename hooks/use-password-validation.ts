'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

interface PasswordRule {
  name: string
  description?: string
  help_text?: string
  min_length?: number
}

interface PasswordValidationRules {
  rules: PasswordRule[]
  minimum_length: number
  help_text: string
}

interface PasswordValidationResult {
  valid: boolean
  errors: string[]
}

export function usePasswordValidation() {
  const [rules, setRules] = useState<PasswordValidationRules | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const result = await apiClient.getPasswordValidationRules()
        setRules(result as PasswordValidationRules)
      } catch (error) {
        console.error('Failed to fetch password rules:', error)
        // Fallback rules
        setRules({
          rules: [
            {
              name: 'MinimumLengthValidator',
              min_length: 8,
              description: 'A jelszónak legalább 8 karakter hosszúnak kell lennie'
            }
          ],
          minimum_length: 8,
          help_text: 'A jelszónak legalább 8 karakter hosszúnak kell lennie.'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRules()
  }, [])

  const validatePassword = async (
    password: string,
    userData?: {
      username?: string
      email?: string
      first_name?: string
      last_name?: string
    }
  ): Promise<PasswordValidationResult> => {
    try {
      const result = await apiClient.checkPasswordValidation({
        password,
        ...userData
      })
      return result as PasswordValidationResult
    } catch (error) {
      console.error('Password validation failed:', error)
      // Fallback validation
      const errors: string[] = []
      if (password.length < 8) {
        errors.push('A jelszónak legalább 8 karakter hosszúnak kell lennie.')
      }
      return { valid: errors.length === 0, errors }
    }
  }

  const getPasswordStrength = (password: string): { 
    strength: number
    label: string
    color: string
    description: string
  } => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[^A-Za-z\d]/.test(password)
    }

    strength = Object.values(checks).filter(Boolean).length

    const levels = [
      { 
        label: 'Nagyon gyenge', 
        color: 'bg-red-500', 
        description: 'A jelszó túl egyszerű és könnyen feltörhető' 
      },
      { 
        label: 'Gyenge', 
        color: 'bg-orange-500', 
        description: 'A jelszó gyenge, további karaktertípusok szükségesek' 
      },
      { 
        label: 'Közepes', 
        color: 'bg-yellow-500', 
        description: 'A jelszó elfogadható, de javítható' 
      },
      { 
        label: 'Erős', 
        color: 'bg-blue-500', 
        description: 'A jelszó erős és biztonságos' 
      },
      { 
        label: 'Nagyon erős', 
        color: 'bg-green-500', 
        description: 'Kiváló jelszó, maximális biztonság' 
      }
    ]

    return { strength, ...levels[Math.min(strength, 4)] }
  }

  const getPasswordRequirements = () => {
    if (!rules) return []

    const requirements = [
      `Legalább ${rules.minimum_length} karakter hosszú`,
      'Tartalmaz kis- és nagybetűket',
      'Tartalmaz számokat', 
      'Tartalmaz speciális karaktereket (!@#$%^&* stb.)',
      'Nem hasonlít a személyes adataidra',
      'Nem közismert gyenge jelszó'
    ]

    return requirements
  }

  return {
    rules,
    isLoading,
    validatePassword,
    getPasswordStrength,
    getPasswordRequirements
  }
}
