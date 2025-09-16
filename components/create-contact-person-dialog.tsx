"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Mail, Phone, Save, X, FileText } from "lucide-react"
import { useApiMutation } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { ContactPersonCreateSchema, ContactPersonSchema } from "@/lib/api"

interface CreateContactPersonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContactPersonCreated: (contactPerson: ContactPersonSchema) => void
}

interface ContactPersonFormData {
  name: string
  email: string
  phone: string
  context: string
}

export function CreateContactPersonDialog({
  open,
  onOpenChange,
  onContactPersonCreated,
}: CreateContactPersonDialogProps) {
  const [formData, setFormData] = useState<ContactPersonFormData>({
    name: "",
    email: "",
    phone: "",
    context: "",
  })

  const [validationErrors, setValidationErrors] = useState<Partial<ContactPersonFormData>>({})

  // Create mutation
  const createContactPerson = useApiMutation(
    (data: ContactPersonCreateSchema) => apiClient.createContactPerson(data)
  )

  const handleInputChange = (field: keyof ContactPersonFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<ContactPersonFormData> = {}

    if (!formData.name.trim()) {
      errors.name = "A kapcsolattartó neve kötelező"
    }

    if (!formData.context.trim()) {
      errors.context = "A kontextus kötelező"
    }

    if (formData.email && !isValidEmail(formData.email)) {
      errors.email = "Érvényes email címet adjon meg"
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = "Érvényes telefonszámot adjon meg"
    }

    // At least one contact method is required
    if (!formData.email.trim() && !formData.phone.trim()) {
      errors.email = "Legalább egy elérhetőség (email vagy telefon) kötelező"
      errors.phone = "Legalább egy elérhetőség (email vagy telefon) kötelező"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidPhone = (phone: string): boolean => {
    // Simple phone validation - accepts various formats
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/
    return phone.length >= 8 && phoneRegex.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const apiData: ContactPersonCreateSchema = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        context: formData.context.trim(),
      }

      const result = await createContactPerson.execute(apiData)
      
      // Success! Close dialog and call callback
      onContactPersonCreated(result)
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        context: "",
      })
      setValidationErrors({})
      
    } catch (error) {
      console.error('Error creating contact person:', error)
      // Error is handled by the mutation hook
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      context: "",
    })
    setValidationErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            Új Kapcsolattartó Hozzáadása
          </DialogTitle>
          <DialogDescription>
            Adjon meg egy új kapcsolattartó adatait. A *-gal jelölt mezők kötelezők.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Név *</Label>
            <Input
              id="contact-name"
              placeholder="pl. Dr. Szabó Mária"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={validationErrors.name ? "border-destructive" : ""}
            />
            {validationErrors.name && (
              <p className="text-sm text-destructive">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email cím
            </Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="pl. szabom@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={validationErrors.email ? "border-destructive" : ""}
            />
            {validationErrors.email && (
              <p className="text-sm text-destructive">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefonszám
            </Label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="pl. +36 1 234 5678"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={validationErrors.phone ? "border-destructive" : ""}
            />
            {validationErrors.phone && (
              <p className="text-sm text-destructive">{validationErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-context" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Kontextus *
            </Label>
            <Textarea
              id="contact-context"
              placeholder="Leghasznosabb, ha Intézmény + pozíció (pl. Budapest Főváros Levéltára - Igazgató)"
              value={formData.context}
              onChange={(e) => handleInputChange("context", e.target.value)}
              className={cn("resize-none", validationErrors.context ? "border-destructive" : "")}
              rows={2}
              required
            />
            {validationErrors.context && (
              <p className="text-sm text-destructive">{validationErrors.context}</p>
            )}
          </div>

            {/* Contact Method Requirement Note */}
            <div className="p-3 text-sm text-blue-800 bg-blue-100 border border-blue-300 rounded-md dark:text-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <p className="font-medium">ℹ️ Fontos:</p>
                <p className="mt-1">Legalább egy elérhetőséget (email vagy telefonszám) meg kell adni.</p>
            </div>

          {/* Error Display */}
          {createContactPerson.error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">
              <p className="font-medium">Hiba történt a kapcsolattartó létrehozása során:</p>
              <p className="mt-1">
                {createContactPerson.error && typeof createContactPerson.error === 'object' && 'message' in createContactPerson.error
                  ? (createContactPerson.error as Error).message 
                  : "Ismeretlen hiba történt"}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createContactPerson.loading}
            >
              <X className="h-4 w-4 mr-2" />
              Mégse
            </Button>
            <Button 
              type="submit" 
              disabled={createContactPerson.loading}
              className="min-w-[100px]"
            >
              {createContactPerson.loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mentés...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Létrehozás
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}