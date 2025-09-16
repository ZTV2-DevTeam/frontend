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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building, MapPin, Save, X, Tag } from "lucide-react"
import { useApiMutation, useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { PartnerCreateSchema, PartnerSchema, PartnerTipusSchema } from "@/lib/api"

interface CreatePartnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPartnerCreated: (partner: PartnerSchema) => void
}

interface PartnerFormData {
  name: string
  address: string
  typeId: string
}

export function CreatePartnerDialog({
  open,
  onOpenChange,
  onPartnerCreated,
}: CreatePartnerDialogProps) {
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    address: "",
    typeId: "",
  })

  const [validationErrors, setValidationErrors] = useState<Partial<PartnerFormData>>({})

  // API integrations
  const createPartner = useApiMutation(
    (data: PartnerCreateSchema) => apiClient.createPartner(data)
  )
  const partnerTypesQuery = useApiQuery(() => apiClient.getPartnerTypes())

  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<PartnerFormData> = {}

    if (!formData.name.trim()) {
      errors.name = "A partner neve kötelező"
    }

    if (!formData.address.trim()) {
      errors.address = "A cím kötelező"
    }

    if (!formData.typeId.trim()) {
      errors.typeId = "Partner típus kiválasztása kötelező"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const apiData: PartnerCreateSchema = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        type_id: parseInt(formData.typeId),
      }

      const result = await createPartner.execute(apiData)
      
      // Success! Close dialog and call callback
      onPartnerCreated(result)
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: "",
        address: "",
        typeId: "",
      })
      setValidationErrors({})
      
    } catch (error) {
      console.error('Error creating partner:', error)
      // Error is handled by the mutation hook
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      address: "",
      typeId: "",
    })
    setValidationErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            Új Partner Hozzáadása
          </DialogTitle>
          <DialogDescription>
            Adjon meg egy új partner adatait. A *-gal jelölt mezők kötelezők.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner-name">Partner neve *</Label>
            <Input
              id="partner-name"
              placeholder="pl. Művelődési Központ"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={validationErrors.name ? "border-destructive" : ""}
            />
            {validationErrors.name && (
              <p className="text-sm text-destructive">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner-address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Cím *
            </Label>
            <Input
              id="partner-address"
              placeholder="pl. Budapest, Fő tér 1."
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={validationErrors.address ? "border-destructive" : ""}
            />
            {validationErrors.address && (
              <p className="text-sm text-destructive">{validationErrors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner-type">Partner típusa *</Label>
            <Select 
              value={formData.typeId} 
              onValueChange={(value: string) => handleInputChange("typeId", value)}
            >
              <SelectTrigger className={cn(
                "w-full", 
                validationErrors.typeId ? "border-destructive" : ""
              )}>
                <SelectValue placeholder="Válassza ki a partner típusát..." />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                {partnerTypesQuery.loading ? (
                  <SelectItem value="loading" disabled>
                    Betöltés...
                  </SelectItem>
                ) : partnerTypesQuery.data && partnerTypesQuery.data.length > 0 ? (
                  partnerTypesQuery.data.map(type => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>
                    Nincs elérhető partner típus
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {validationErrors.typeId && (
              <p className="text-sm text-destructive">{validationErrors.typeId}</p>
            )}
          </div>

          {/* Error Display */}
          {createPartner.error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">
              <p className="font-medium">Hiba történt a partner létrehozása során:</p>
              <p className="mt-1">
                {createPartner.error && typeof createPartner.error === 'object' && 'message' in createPartner.error
                  ? (createPartner.error as Error).message 
                  : "Ismeretlen hiba történt"}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createPartner.loading}
            >
              <X className="h-4 w-4 mr-2" />
              Mégse
            </Button>
            <Button 
              type="submit" 
              disabled={createPartner.loading}
              className="min-w-[100px]"
            >
              {createPartner.loading ? (
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