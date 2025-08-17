"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { StandardizedLayout } from "@/components/standardized-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, Clock, FileText, ArrowLeft, Save, Star, Music, LinkIcon } from "lucide-react"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import { useApiQuery, useApiMutation } from "@/lib/api-helpers"
import { ApiErrorBoundary } from "@/components/api-error-boundary"
import { apiClient } from "@/lib/api"
import type { ForgatCreateSchema, PartnerSchema, ContactPersonSchema, ForgatoTipusSchema, ReporterSchema, KacsaAvailableSchema } from "@/lib/api"
import { DatePicker, TimePicker } from "@/components/ui/date-time-components"
import {
  reporters,
  locations,
  contacts,
  kacsaShootings,
  shootingTypes,
  getCurrentSchoolYear,
  getSchoolYearFromDate,
} from "@/lib/config/form-data"

interface ShootingFormData {
  name: string
  description: string
  type: string
  schoolYear: string
  reporterId: string
  date: Date | undefined
  startTime: string
  endTime: string
  locationId: string
  contactId: string
  relatedKacsaId: string
  notes: string
}

export default function NewShooting() {
  const router = useRouter()
  const { currentRole } = useUserRole()
  const { user } = useAuth()
  const { hasPermission, permissions } = usePermissions()

  const [formData, setFormData] = useState<ShootingFormData>({
    name: "",
    description: "",
    type: "",
    schoolYear: getCurrentSchoolYear(),
    reporterId: "",
    date: new Date(),
    startTime: new Date().toTimeString().slice(0, 5),
    endTime: "",
    locationId: "",
    contactId: "",
    relatedKacsaId: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // API queries
  const { data: partners, loading: partnersLoading, error: partnersError } = useApiQuery(
    () => apiClient.getPartners()
  )
  
  const { data: contactPersons, loading: contactPersonsLoading, error: contactPersonsError } = useApiQuery(
    () => apiClient.getContactPersons()
  )
  
  // Fetch filming types from API
  const { data: filmingTypes, loading: typesLoading, error: typesError } = useApiQuery(
    () => apiClient.getFilmingTypes(),
    []
  )

  // Fetch students/reporters
  const { data: students, loading: studentsLoading, error: studentsError } = useApiQuery(
    () => apiClient.getReporters(),
    []
  )

  // Fetch available KaCsa sessions
  const { data: kacsaSessions, loading: kacsaLoading, error: kacsaError } = useApiQuery(
    () => apiClient.getKacsaAvailableSessions(),
    []
  )

  // Create mutation
  const createForgatás = useApiMutation(
    (data: ForgatCreateSchema) => apiClient.createFilmingSession(data)
  )

  // Permission check - students can only create 'rendes', admins can create any type
  const classDisplayName = permissions?.role_info?.class_display_name || permissions?.role_info?.class_assignment?.display_name
  const is10FStudent = currentRole === 'student' && classDisplayName === '10F'
  const canCreateForgatás = hasPermission('can_create_forgatas') || hasPermission('is_admin') || currentRole === 'admin' || is10FStudent

  if (!canCreateForgatás) {
    return (
      <StandardizedLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          <div className="flex items-center gap-4">
            <Link href="/app/forgatasok">
              <Button variant="outline" size="sm" className="bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza
              </Button>
            </Link>
          </div>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Forgatás létrehozása
              </CardTitle>
              <CardDescription>
                Ez a funkció csak 10F-es diákoknak és adminisztrátoroknak elérhető.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nincs jogosultságod forgatás létrehozására.</p>
                <p className="text-sm mt-2">Csak jogosult felhasználók (admin vagy 10F-es diák) hozhatnak létre forgatásokat.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </StandardizedLayout>
    )
  }

  const handleInputChange = (field: keyof ShootingFormData, value: string | Date | undefined) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-update school year when date changes
      if (field === "date" && value instanceof Date) {
        updated.schoolYear = getSchoolYearFromDate(value)
      }

      return updated
    })
  }

  const handleDateChange = (date: Date | undefined) => {
    handleInputChange("date", date)
  }

  const handleTimeChange = (field: "startTime" | "endTime", time: string) => {
    handleInputChange(field, time)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("A forgatás neve kötelező")
      }
      if (!formData.date) {
        throw new Error("A dátum kötelező")
      }
      if (!formData.startTime.trim()) {
        throw new Error("A kezdési idő kötelező")
      }
      if (!formData.type) {
        throw new Error("A forgatás típusa kötelező")
      }

      // Convert form data to API format with Django-compatible formatting
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      const formatTime = (timeStr: string) => {
        if (!timeStr) return ""
        // Ensure HH:MM:SS format for Django
        if (timeStr.includes(':')) {
          const parts = timeStr.split(':')
          if (parts.length === 2) {
            return `${parts[0]}:${parts[1]}:00`
          }
          return timeStr
        }
        return timeStr
      }

      const apiData: ForgatCreateSchema = {
        name: formData.name,
        description: formData.description || "",
        date: formData.date ? formatDate(formData.date) : "",
        time_from: formData.startTime ? formatTime(formData.startTime) : "",
        time_to: formData.endTime ? formatTime(formData.endTime) : "",
        type: formData.type,
        location_id: formData.locationId ? parseInt(formData.locationId) : undefined,
        contact_person_id: formData.contactId ? parseInt(formData.contactId) : undefined,
        riporter_id: formData.reporterId ? parseInt(formData.reporterId) : undefined,
        notes: formData.notes || "",
        related_kacsa_id: formData.relatedKacsaId ? parseInt(formData.relatedKacsaId) : undefined,
        equipment_ids: []
      }

      console.log('Form data before formatting:', {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime
      })
      console.log('Submitting forgatás data:', apiData) // Debug log
      
      const result = await createForgatás.execute(apiData)
      
      // Success - redirect to the created session
      router.push(`/app/forgatasok/${result.id}`)
      
    } catch (error) {
      console.error('Error creating forgatás:', error)
      
      // Extract error message
      let errorMessage = 'Hiba történt a forgatás létrehozásakor'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as any).message
      }
      
      setSubmitError(errorMessage)
      setIsSubmitting(false)
    }
  }

  const setToday = () => {
    const today = new Date()
    handleInputChange("date", today)
  }

  // Transform data for comboboxes - use real API data where available
  
  // Use real API data for students/reporters, fallback to mock data
  const reporterOptions = students && students.length > 0 ? students.map((student: ReporterSchema) => ({
    value: student.id.toString(),
    label: student.full_name,
    description: `${student.osztaly_display} • ${student.is_experienced ? 'Tapasztalt' : 'Új'} riporter`,
  })) : reporters.map((r) => ({
    value: r.id,
    label: r.name,
    description: `${r.class} • ${r.email}`,
  }))

  // Use real API data for partners (locations)
  const locationOptions = partners ? partners.map((partner: PartnerSchema) => ({
    value: partner.id.toString(),
    label: partner.name,
    description: `${partner.institution || 'Partnerintézmény'} • ${partner.address || 'Cím nincs megadva'}`,
  })) : locations.map((l) => ({
    value: l.id,
    label: l.name,
    description: `${l.address} • ${l.type === "internal" ? "Belső" : "Külső"}`,
  }))

  // Use real API data for contact persons
  const contactOptions = contactPersons ? contactPersons.map((contact: ContactPersonSchema) => ({
    value: contact.id.toString(),
    label: contact.name,
    description: `${contact.email || 'Email nincs megadva'} • ${contact.phone || 'Telefon nincs megadva'}`,
  })) : contacts.map((c) => ({
    value: c.id,
    label: c.name,
    description: `${c.organization} • ${c.phone}`,
  }))

  // Use real API data for KaCsa sessions, fallback to mock data
  const kacsaOptions = kacsaSessions && kacsaSessions.length > 0 ? kacsaSessions.map((kacsa: KacsaAvailableSchema) => ({
    value: kacsa.id.toString(),
    label: kacsa.name,
    description: `${kacsa.date} • ${kacsa.can_link ? 'Linkelhető' : 'Már hozzárendelve'}`,
  })) : kacsaShootings.map((k) => ({
    value: k.id,
    label: k.title,
    description: `${k.date} • ${k.week === "first" ? "Első" : "Második"} hét`,
  }))

  // Filter shooting types based on role - use real API data where available
  const availableShootingTypes = useMemo(() => {
    const types = filmingTypes && filmingTypes.length > 0 ? filmingTypes : shootingTypes
    
    if (currentRole === 'admin' || hasPermission('is_admin')) {
      return types
    } else {
      // Students can only create 'rendes' type
      return types.filter((type: any) => type.value === 'rendes')
    }
  }, [filmingTypes, currentRole, hasPermission])

  const selectedType = availableShootingTypes.find((t: any) => t.value === formData.type)
  const showKacsaConnection = formData.type === "rendes"

  // Handle API errors
  if (partnersError || contactPersonsError || typesError) {
    return (
      <StandardizedLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          <div className="flex items-center gap-4">
            <Link href="/app/forgatasok">
              <Button variant="outline" size="sm" className="bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza
              </Button>
            </Link>
          </div>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto text-destructive mb-4">⚠️</div>
                <p className="text-lg font-medium text-destructive">Hiba történt az adatok betöltésekor</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {partnersError || contactPersonsError || typesError}
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
        </div>
      </StandardizedLayout>
    )
  }

  return (
    <ApiErrorBoundary>
      <StandardizedLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/app/forgatasok">
              <Button variant="outline" size="sm" className="bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Új Forgatás
              </h1>
              <p className="text-sm text-muted-foreground">Új forgatás létrehozása a rendszerben</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-400" />
                  Forgatás alapadatok
                </CardTitle>
                <CardDescription>A forgatás alapvető információi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Forgatás neve *</Label>
                    <Input
                      id="name"
                      placeholder="A forgatás egyedi neve"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Forgatás típusa *</Label>
                    <Combobox
                      options={availableShootingTypes}
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                      placeholder="Válassz típust..."
                      searchPlaceholder="Típus keresése..."
                    />
                    {selectedType && (
                      <div className="flex items-center gap-2 mt-2">
                        {selectedType.value === "kacsa" && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                        {selectedType.value === "rendezveny" && <Music className="h-4 w-4 text-purple-400" />}
                        {selectedType.value === "rendes" && <Camera className="h-4 w-4 text-blue-400" />}
                        <Badge variant="outline" className="text-xs">
                          {(selectedType as any).description || selectedType.label}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Leírás</Label>
                  <Textarea
                    id="description"
                    placeholder="A forgatás részletes leírása (maximum 500 karakter)"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    maxLength={500}
                    className="bg-transparent resize-none"
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {formData.description.length}/500 karakter
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="schoolYear">Tanév</Label>
                    <Input id="schoolYear" value={formData.schoolYear} className="bg-transparent" disabled />
                    <p className="text-xs text-muted-foreground">Automatikusan meghatározva a dátum alapján</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reporter">Riporter *</Label>
                    <Combobox
                      options={reporterOptions}
                      value={formData.reporterId}
                      onValueChange={(value) => handleInputChange("reporterId", value)}
                      placeholder="Válassz riportert..."
                      searchPlaceholder="Riporter keresése..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timing */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  Időpont
                </CardTitle>
                <CardDescription>A forgatás időbeli paraméterei</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Dátum *</Label>
                  <DatePicker
                    date={formData.date}
                    onSelect={handleDateChange}
                    placeholder="Válassz dátumot"
                    className="w-full"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Kezdés ideje *</Label>
                    <TimePicker
                      time={formData.startTime}
                      onTimeChange={(time) => handleTimeChange("startTime", time)}
                      placeholder="Kezdés ideje"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">Befejezés ideje</Label>
                    <TimePicker
                      time={formData.endTime}
                      onTimeChange={(time) => handleTimeChange("endTime", time)}
                      placeholder="Befejezés ideje"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location and Contacts */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-400" />
                  Helyszín és kapcsolatok
                </CardTitle>
                <CardDescription>Helyszín és kapcsolattartó adatok</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Helyszín *</Label>
                    <Combobox
                      options={locationOptions}
                      value={formData.locationId}
                      onValueChange={(value) => handleInputChange("locationId", value)}
                      placeholder="Válassz helyszínt..."
                      searchPlaceholder="Helyszín keresése..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Kapcsolattartó</Label>
                    <Combobox
                      options={contactOptions}
                      value={formData.contactId}
                      onValueChange={(value) => handleInputChange("contactId", value)}
                      placeholder="Válassz kapcsolattartót..."
                      searchPlaceholder="Kapcsolattartó keresése..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related KaCsa (only for normal shootings) */}
            {showKacsaConnection && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-yellow-400" />
                    Kapcsolódó forgatás
                  </CardTitle>
                  <CardDescription>Rendes forgatások esetében, a kapcsolódó KaCsa Összejátszás</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="relatedKacsa">Kapcsolódó KaCsa</Label>
                    <Combobox
                      options={kacsaOptions}
                      value={formData.relatedKacsaId}
                      onValueChange={(value) => handleInputChange("relatedKacsaId", value)}
                      placeholder="Válassz KaCsa forgatást..."
                      searchPlaceholder="KaCsa keresése..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Megjegyzések
                </CardTitle>
                <CardDescription>További információk és megjegyzések</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Megjegyzések</Label>
                  <Textarea
                    id="notes"
                    placeholder="További megjegyzések a forgatáshoz (maximum 500 karakter)"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    maxLength={500}
                    className="bg-transparent resize-none"
                    rows={4}
                  />
                  <div className="text-xs text-muted-foreground text-right">{formData.notes.length}/500 karakter</div>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {(createForgatás.error || submitError) && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="p-4">
                  <div className="text-destructive">
                    Hiba: {submitError || createForgatás.error}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link href="/app/forgatasok">
                <Button variant="outline" className="bg-transparent">
                  Mégse
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mentés...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Forgatás Létrehozása
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </StandardizedLayout>
    </ApiErrorBoundary>
  )
}
