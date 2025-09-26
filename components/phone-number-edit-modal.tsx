"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Phone, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api"

interface PhoneNumberEditModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentPhoneNumber?: string
  onPhoneNumberUpdate: (newPhoneNumber?: string) => void
}

interface UpdatePhoneNumberRequest {
  telefonszam?: string | null
}

interface UpdatePhoneNumberResponse {
  message: string
  telefonszam?: string
}

export function PhoneNumberEditModal({
  isOpen,
  onOpenChange,
  currentPhoneNumber,
  onPhoneNumberUpdate
}: PhoneNumberEditModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare the request data
      const requestData: UpdatePhoneNumberRequest = {
        telefonszam: phoneNumber.trim() || null
      }

      // Make the API call
      const response = await apiClient.patch<UpdatePhoneNumberResponse>('users/me/phone', requestData as Record<string, unknown>)

      if (response.message) {
        setSuccess(response.message)
        onPhoneNumberUpdate(response.telefonszam || undefined)
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onOpenChange(false)
          setSuccess(null)
        }, 1500)
      }
    } catch (err: unknown) {
      console.error('Phone number update error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Hiba történt a telefonszám frissítése során'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setPhoneNumber(currentPhoneNumber || '')
    setError(null)
    setSuccess(null)
    onOpenChange(false)
  }

  const validatePhoneNumber = (phone: string): string | null => {
    if (!phone.trim()) {
      return null // Empty is allowed (will clear the phone number)
    }

    // Basic validation: should only contain digits, spaces, hyphens, plus sign, parentheses
    const phoneRegex = /^[+\d\s\-\(\)]+$/
    if (!phoneRegex.test(phone)) {
      return 'A telefonszám csak számokat, szóközöket, kötőjeleket, plusz jelet és zárójeleket tartalmazhat'
    }

    // Check length (should be reasonable)
    if (phone.length > 20) {
      return 'A telefonszám túl hosszú (maximum 20 karakter)'
    }

    if (phone.replace(/[\s\-\(\)+]/g, '').length < 6) {
      return 'A telefonszám túl rövid (minimum 6 számjegy)'
    }

    return null
  }

  const validationError = validatePhoneNumber(phoneNumber)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Telefonszám módosítása
          </DialogTitle>
          <DialogDescription>
            Módosítsd a profilodhoz tartozó telefonszámot. Ha üresen hagyod, a telefonszám törölve lesz.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Telefonszám</Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="pl. +36 30 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
                disabled={isLoading}
              />
              {validationError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationError}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Mégse
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !!validationError}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mentés...
                </>
              ) : (
                'Mentés'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}