/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/rules-of-hooks */
'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Clock, MapPin, Users, Camera, AlertCircle } from "lucide-react"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import { useApiQuery, useApiMutation } from "@/lib/api-helpers"
import { ApiErrorBoundary } from "@/components/api-error-boundary"
import { apiClient } from "@/lib/api"
import { use24HourFormat } from "@/lib/24hour-format-enforcer"
import { useConfetti } from "@/components/confetti"
import type { ForgatCreateSchema, PartnerSchema, ContactPersonSchema } from "@/lib/api"
import { FilmingSessionTypeSelector } from "@/components/filming-session-type-selector"

export function CreateForgatásForm() {
  const [formData, setFormData] = useState<ForgatCreateSchema>({
    name: "",
    description: "",
    date: "",
    time_from: "",
    time_to: "",
    type: "",
    location_id: undefined,
    contact_person_id: undefined,
    notes: "",
    related_kacsa_id: undefined,
    equipment_ids: []
  })

  // Custom partner input state
  const [partnerInput, setPartnerInput] = useState("")
  const [contactPersonInput, setContactPersonInput] = useState("")

  const { currentRole } = useUserRole()
  const { user } = useAuth()
  const { hasPermission, permissions } = usePermissions()
  const { triggerSuccess } = useConfetti()

  // Enforce 24-hour format on all time inputs
  use24HourFormat()

  // API queries
  const { data: partners, loading: partnersLoading, error: partnersError } = useApiQuery(
    () => apiClient.getPartners()
  )
  
  const { data: contactPersons, loading: contactPersonsLoading, error: contactPersonsError } = useApiQuery(
    () => apiClient.getContactPersons()
  )
  


  // Create mutation
  const createForgatás = useApiMutation(
    (data: ForgatCreateSchema) => apiClient.createFilmingSession(data)
  )

  // Handle API errors
  if (partnersError || contactPersonsError) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">Hiba történt az adatok betöltésekor</p>
            <p className="text-sm text-muted-foreground mt-2">
              {partnersError || contactPersonsError}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Újra próbálkozás
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Permission check - only users with can_create_forgatas permission can create
  const canCreateForgatás = hasPermission('can_create_forgatas')

  if (!canCreateForgatás) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Forgatás létrehozása
          </CardTitle>
          <CardDescription>
            Ez a funkció csak engedéllyel rendelkező felhasználóknak érhető el.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nincs jogosultságod forgatás létrehozására.</p>
            <p className="text-sm mt-2">Csak engedéllyel rendelkező felhasználók hozhatnak létre forgatásokat.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Prepare submission data
      const submissionData = { ...formData }

      // Handle manual partner institution input
      if (partnerInput && !formData.location_id) {
        // If user entered manual text but no existing partner was selected,
        // we'll submit without location_id but include partner info in notes
        const existingNotes = submissionData.notes || ""
        const partnerNote = `Partnerintézmény: ${partnerInput}`
        submissionData.notes = existingNotes ? `${existingNotes}\n${partnerNote}` : partnerNote
      }

      // Handle manual contact person input
      if (contactPersonInput && !formData.contact_person_id) {
        // If user entered manual text but no existing contact was selected,
        // we'll include contact info in notes
        const existingNotes = submissionData.notes || ""
        const contactNote = `Kapcsolattartó: ${contactPersonInput}`
        submissionData.notes = existingNotes ? `${existingNotes}\n${contactNote}` : contactNote
      }

      const result = await createForgatás.execute(submissionData)
      
      // Success feedback with confetti!
      triggerSuccess()
      alert('Forgatás sikeresen létrehozva!')
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        date: "",
        time_from: "",
        time_to: "",
        type: "",
        location_id: undefined,
        contact_person_id: undefined,
        notes: "",
        related_kacsa_id: undefined,
        equipment_ids: []
      })
      
      // Reset custom inputs
      setPartnerInput("")
      setContactPersonInput("")
      
    } catch (error) {
      console.error('Error creating forgatás:', error)
      // Error is already handled by the mutation hook
    }
  }

  const updateFormData = (field: keyof ForgatCreateSchema, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Sync input fields with selected partners/contacts
  useEffect(() => {
    if (formData.location_id && partners) {
      const selectedPartner = partners.find(p => p.id.toString() === formData.location_id?.toString())
      if (selectedPartner && partnerInput !== selectedPartner.name) {
        setPartnerInput(selectedPartner.name)
      }
    }
  }, [formData.location_id, partners, partnerInput])

  useEffect(() => {
    if (formData.contact_person_id && contactPersons) {
      const selectedContact = contactPersons.find(p => p.id.toString() === formData.contact_person_id?.toString())
      if (selectedContact && contactPersonInput !== selectedContact.name) {
        setContactPersonInput(selectedContact.name)
      }
    }
  }, [formData.contact_person_id, contactPersons, contactPersonInput])

  return (
    <ApiErrorBoundary>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Új forgatás létrehozása
          </CardTitle>
          <CardDescription>
            Hozz létre egy új forgatás projektet. A stáb beosztását a tanárok fogják elvégezni.
          </CardDescription>
        </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Forgatás neve *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="pl. Ballagási ünnepség 2025"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Leírás *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Részletes leírás a forgatásról, célokról, elvárásokról..."
                required
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Dátum *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="time_from" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Kezdés *
              </Label>
              <Input
                id="time_from"
                type="time"
                value={formData.time_from}
                onChange={(e) => updateFormData('time_from', e.target.value)}
                required
                className="mt-1 [&::-webkit-datetime-edit-ampm-field]:hidden [&::-webkit-datetime-edit-ampm-field]:!w-0 [&::-webkit-datetime-edit-ampm-field]:!opacity-0"
                step="900"
                lang="en-GB"
                data-format="24"
                data-hour-format="24"
                style={{ 
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                } as React.CSSProperties}
              />
            </div>

            <div>
              <Label htmlFor="time_to">Befejezés *</Label>
              <Input
                id="time_to"
                type="time"
                value={formData.time_to}
                onChange={(e) => updateFormData('time_to', e.target.value)}
                required
                className="mt-1 [&::-webkit-datetime-edit-ampm-field]:hidden [&::-webkit-datetime-edit-ampm-field]:!w-0 [&::-webkit-datetime-edit-ampm-field]:!opacity-0"
                step="900"
                lang="en-GB"
                data-format="24"
                data-hour-format="24"
                style={{ 
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Type and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FilmingSessionTypeSelector
                value={formData.type}
                onValueChange={(value) => updateFormData('type', value || '')}
                label="Forgatás típusa *"
                placeholder="Válassz típust"
                required={true}
                showAllOption={false}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Partnerintézmény
              </Label>
              <div className="relative mt-1">
                <Input
                  value={partnerInput}
                  onChange={(e) => {
                    setPartnerInput(e.target.value)
                    // Try to find exact match and update location_id
                    const exactMatch = partners?.find(p => p.name === e.target.value)
                    if (exactMatch) {
                      updateFormData('location_id', exactMatch.id.toString())
                    } else if (e.target.value === "") {
                      updateFormData('location_id', undefined)
                    }
                  }}
                  placeholder="Válassz vagy írj be intézményt..."
                  list="partners-list"
                />
                <datalist id="partners-list">
                  {partners?.map((partner: PartnerSchema) => (
                    <option key={partner.id} value={partner.name}>
                      {partner.institution ? `${partner.name} - ${partner.institution}` : partner.name}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Kapcsolattartó
            </Label>
            <div className="relative mt-1">
              <Input
                value={contactPersonInput}
                onChange={(e) => {
                  setContactPersonInput(e.target.value)
                  // Try to find exact match and update contact_person_id
                  const exactMatch = contactPersons?.find(p => p.name === e.target.value)
                  if (exactMatch) {
                    updateFormData('contact_person_id', exactMatch.id.toString())
                  } else if (e.target.value === "") {
                    updateFormData('contact_person_id', undefined)
                  }
                }}
                placeholder="Válassz vagy írj be kapcsolattartót..."
                list="contacts-list"
              />
              <datalist id="contacts-list">
                {contactPersons?.map((person: ContactPersonSchema) => (
                  <option key={person.id} value={person.name}>
                    {person.name}
                    {person.context && ` - ${person.context}`}
                    {person.email && ` (${person.email})`}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">További megjegyzések</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="További információk, különleges igények, technikai követelmények..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Error Display */}
          {createForgatás.error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              Hiba: {createForgatás.error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={createForgatás.loading}
              className="flex-1"
            >
              {createForgatás.loading ? "Létrehozás..." : "Forgatás létrehozása"}
            </Button>
          </div>

          {/* Info Notice */}
          <div className="p-3 text-sm text-muted-foreground bg-muted/50 rounded-md">
            <p className="font-medium mb-1">📝 Fontos információk:</p>
            <ul className="space-y-1 text-xs">
              <li>• A forgatás létrehozása után a tanárok fogják elvégezni a stáb beosztását</li>
              <li>• Minden kötelező mezőt ki kell tölteni a sikeres létrehozáshoz</li>
              <li>• A partnerintézmény és kapcsolattartó megadása opcionális - választhatsz a listából vagy kézzel is beírhatod</li>
              <li>• A további részleteket a megjegyzések mezőben adhatod meg</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
    </ApiErrorBoundary>
  )
}
