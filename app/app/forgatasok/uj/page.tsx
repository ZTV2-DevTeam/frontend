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
import { Camera, MapPin, Clock, FileText, ArrowLeft, Save, Star, CalendarDays, LinkIcon, AlertTriangle, RefreshCw } from "lucide-react"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import { useApiQuery, useApiMutation } from "@/lib/api-helpers"
import { ApiErrorBoundary } from "@/components/api-error-boundary"
import { useErrorToast } from "@/contexts/error-toast-context"
import { CreatePartnerDialog } from "@/components/create-partner-dialog"
import { CreateContactPersonDialog } from "@/components/create-contact-person-dialog"
import { apiClient } from "@/lib/api"
import type { ForgatCreateSchema, PartnerSchema, ContactPersonSchema, ReporterSchema, KacsaAvailableSchema } from "@/lib/api"
import { SystemDatePicker, SystemTimePicker } from "@/components/ui/date-time-components"
import {
  getCurrentSchoolYear,
  getSchoolYearFromDate,
} from "@/lib/config/form-data"
import { useConfetti } from "@/components/confetti"

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
  const { user, isAuthenticated, isLoading } = useAuth()
  const { hasPermission } = usePermissions()
  const { triggerSuccess } = useConfetti()
  const { showErrorToast, showNetworkErrorToast, showPermissionErrorToast } = useErrorToast()

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

  // Modal states
  const [showCreatePartnerDialog, setShowCreatePartnerDialog] = useState(false)
  const [showCreateContactPersonDialog, setShowCreateContactPersonDialog] = useState(false)

  // Local state for newly created items (to update the lists without refetching)
  const [newPartners, setNewPartners] = useState<PartnerSchema[]>([])
  const [newContactPersons, setNewContactPersons] = useState<ContactPersonSchema[]>([])

  // Handle successful partner creation
  const handlePartnerCreated = (newPartner: PartnerSchema) => {
    // Add to local state to update the options list
    setNewPartners((prev) => [...prev, newPartner])
    
    // Auto-select the newly created partner
    setFormData((prev) => ({
      ...prev,
      locationId: newPartner.id.toString()
    }))
    
    console.log('New partner created:', newPartner)
  }

  // Handle successful contact person creation
  const handleContactPersonCreated = (newContactPerson: ContactPersonSchema) => {
    // Add to local state to update the options list
    setNewContactPersons((prev) => [...prev, newContactPerson])
    
    // Auto-select the newly created contact person
    setFormData((prev) => ({
      ...prev,
      contactId: newContactPerson.id.toString()
    }))
    
    console.log('New contact person created:', newContactPerson)
  }

  // API queries - Always call hooks unconditionally
  const skipQueries = isLoading || !isAuthenticated || !user

  const { data: partners, loading: _partnersLoading, error: partnersError } = useApiQuery(
    async () => {
      if (skipQueries) return []
      return await apiClient.getPartners()
    },
    [skipQueries]
  )
  
  const { data: contactPersons, loading: contactPersonsLoading, error: contactPersonsError } = useApiQuery(
    async () => {
      if (skipQueries) return []
      return await apiClient.getContactPersons()
    },
    [skipQueries]
  )
  
  // Fetch filming types from API
  const { data: filmingTypes, loading: _typesLoading, error: typesError } = useApiQuery(
    async () => {
      if (skipQueries) return []
      return await apiClient.getFilmingTypes()
    },
    [skipQueries]
  )

  // Fetch students from API - only if user has basic permission to see reporters
  const { data: students, loading: studentsLoading, error: studentsError } = useApiQuery(
    async () => {
      if (skipQueries) return []
      // Szerkesztők are public info for anyone who can access forgatasok pages - no additional check needed
      return await apiClient.getReporters()
    },
    [skipQueries]
  )

  // Fetch kacsa sessions from API
  const { data: kacsaSessions, loading: kacsaLoading, error: kacsaError } = useApiQuery(
    async () => {
      if (skipQueries) return []
      return await apiClient.getKacsaAvailableSessions()
    },
    [skipQueries]
  )

  // Create mutation
  const createForgatás = useApiMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => apiClient.createFilmingSession(data)
  )

  // Filter shooting types based on role - use real API data where available
  const availableShootingTypes = useMemo(() => {
    if (typesError || !filmingTypes) {
      // Return minimal default types if API fails
      return [
        { value: 'rendes', label: 'KaCsa forgatás', description: 'Normál forgatási típus' }
      ]
    }
    
    const types = filmingTypes
    
    // Students should NOT see 'kacsa' type - only admin roles (admin, class-teacher) can create it
    if (currentRole === 'student') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return types.filter((type: any) => type.value !== 'kacsa')
    }

    return types
  }, [filmingTypes, typesError, currentRole, hasPermission])

  // Redirect to login if not authenticated (but wait for loading to complete)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push('/login?redirect=/app/forgatasok/uj')
      return
    }
  }, [isLoading, isAuthenticated, user, router])

  // Process data for reporter options - need this before the useEffect below
  const reporterOptions = students && !studentsError ? students.map((student: any) => {
    // Use the reason field from the API, fallback to 'Lehetséges Szerkesztő' if not provided
    const statusDescription = student.reason || 'Lehetséges Szerkesztő'
    
    return {
      value: student.id.toString(),
      label: student.full_name,
      description: `${student.osztaly_display || student.oszta} • ${statusDescription}`,
    }
  }) : []

  // Auto-select current user as szerkesztő if they are a student and in the reporters list
  const isStudentUser = currentRole === 'student'
  
  // More robust user matching - try multiple approaches to find current user
  const currentUserInReporters = reporterOptions.find(reporter => {
    if (!user) return false
    
    // Try matching by various user properties
    const userId = (user as any).id || (user as any).user_id || user.username
    const userFullName = (user as any).full_name || (user as any).name
    const userUsername = user.username
    
    // Match by ID (most reliable)
    if (userId && reporter.value === userId.toString()) {
      return true
    }
    
    // Match by full name
    if (userFullName && reporter.label === userFullName) {
      return true
    }
    
    // Match by username (fallback)
    if (userUsername && reporter.label.includes(userUsername)) {
      return true
    }
    
    return false
  })

  // Effect to auto-select student user
  useEffect(() => {
    console.log('🔄 Auto-select effect running:', {
      isStudentUser,
      currentUserInReporters: currentUserInReporters?.label,
      currentReporterId: formData.reporterId,
      shouldAutoSelect: isStudentUser && currentUserInReporters && !formData.reporterId
    })
    
    if (isStudentUser && currentUserInReporters && !formData.reporterId) {
      console.log('✅ Auto-selecting user:', currentUserInReporters.label, 'with ID:', currentUserInReporters.value)
      setFormData(prev => ({
        ...prev,
        reporterId: currentUserInReporters.value
      }))
    }
  }, [isStudentUser, currentUserInReporters, formData.reporterId])

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <StandardizedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
            <p className="text-muted-foreground">Betöltés...</p>
          </div>
        </div>
      </StandardizedLayout>
    )
  }

  // Don't render form if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <StandardizedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Átirányítás a bejelentkezéshez...</p>
          </div>
        </div>
      </StandardizedLayout>
    )
  }

  // Permission check - use can_create_forgatas permission
  const canCreateForgatás = hasPermission('can_create_forgatas')

  if (!canCreateForgatás) {
    // Show permission error toast and redirect
    showPermissionErrorToast('Nincs jogosultsága forgatás létrehozására. Ez a funkció csak engedéllyel rendelkező felhasználóknak elérhető.')
    
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
          
          <Card className="border-orange-500/50 bg-orange-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4 text-center">
                <Camera className="h-12 w-12 opacity-50" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Nincs jogosultság</h3>
                  <p className="text-sm text-muted-foreground">
                    Nincs megfelelő jogosultsága forgatás létrehozására.
                  </p>
                </div>
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

    try {
      // Ensure user is authenticated before proceeding
      if (!isAuthenticated || !user) {
        throw new Error("Nem vagy bejelentkezve. Kérjük, jelentkezz be újra.")
      }

      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("A forgatás neve kötelező")
      }
      if (!formData.description.trim()) {
        throw new Error("A leírás kötelező")
      }
      if (!formData.date) {
        throw new Error("A dátum kötelező")
      }
      if (!formData.startTime.trim()) {
        throw new Error("A kezdési idő kötelező")
      }
      if (!formData.endTime.trim()) {
        throw new Error("A befejezés ideje kötelező")
      }
      if (!formData.type) {
        throw new Error("A forgatás típusa kötelező")
      }

      // Validate location (this should be available due to critical error handling above)
      if (!formData.locationId) {
        throw new Error("A helyszín kiválasztása kötelező")
      }

      // Reporter is optional - only validate if API is working and user tries to select invalid option
      if (!studentsError && formData.reporterId && reporterOptions.length > 0) {
        const validReporter = reporterOptions.find(r => r.value === formData.reporterId)
        if (!validReporter) {
          throw new Error("A kiválasztott szerkesztő nem érvényes")
        }
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
        szerkeszto_id: formData.reporterId ? parseInt(formData.reporterId) : undefined,
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
      
      // Debug authentication state before API call
      const token = apiClient.getToken()
      const isAuth = apiClient.isAuthenticated()
      console.log('🔐 Auth state before forgatás creation:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
        isAuthenticated: isAuth,
        user: user?.username || 'none'
      })
      
      const result = await createForgatás.execute(apiData)
      
      // Success - show confetti celebration!
      triggerSuccess()
      
      // Delay redirect slightly to allow confetti animation to start
      setTimeout(() => {
        router.push(`/app/forgatasok/${result.id}`)
      }, 500) // 500ms delay gives time for confetti to start
      
    } catch (error) {
      console.error('Error creating forgatás:', error)
      
      // Extract error message
      let errorMessage = 'Hiba történt a forgatás létrehozásakor'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as { message: string }).message
      }
      
      // Use global error toast system instead of local state
      if (errorMessage.includes('Network') || errorMessage.includes('fetch') || errorMessage.includes('timeout')) {
        showNetworkErrorToast(errorMessage)
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('munkamenet lejárt')) {
        showPermissionErrorToast(errorMessage)
      } else {
        showErrorToast(errorMessage)
      }
      
      setIsSubmitting(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setToday = () => {
    const today = new Date()
    handleInputChange("date", today)
  }

  // Transform data for comboboxes with proper error handling
  
  console.log('🔍 User matching debug:', {
    user: user,
    currentUserInReporters: currentUserInReporters,
    isStudentUser,
    reporterOptionsCount: reporterOptions.length,
    firstReporter: reporterOptions[0]
  })
  
  const isReporterFieldDisabled = isStudentUser && !!currentUserInReporters

  // Locations - only show if API data is available, including newly created partners
  const allPartners = [...(partners || []), ...newPartners]
  const locationOptions = allPartners.length > 0 && !partnersError ? allPartners.map((partner: PartnerSchema) => ({
    value: partner.id.toString(),
    label: partner.name,
    description: `${partner.institution || 'Partnerintézmény'} • ${partner.address || 'Cím nincs megadva'}`,
  })) : []

  // Contact persons - only show if API data is available, including newly created contact persons
  const allContactPersons = [...(contactPersons || []), ...newContactPersons]
  const contactOptions = allContactPersons.length > 0 && !contactPersonsError ? allContactPersons.map((contact: ContactPersonSchema) => ({
    value: contact.id.toString(),
    label: contact.name,
    description: contact.context 
      ? `${contact.context} | ${contact.email || 'Email nincs megadva'} • ${contact.phone || 'Telefon nincs megadva'}`
      : `${contact.email || 'Email nincs megadva'} • ${contact.phone || 'Telefon nincs megadva'}`,
  })) : []

  // KaCsa sessions - only show if API data is available
  const kacsaOptions = kacsaSessions && !kacsaError ? kacsaSessions.map((kacsa: KacsaAvailableSchema) => ({
    value: kacsa.id.toString(),
    label: kacsa.name,
    description: `${kacsa.date} • ${kacsa.can_link ? 'Linkelhető' : 'Már hozzárendelve'}`,
  })) : []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedType = availableShootingTypes.find((t: any) => t.value === formData.type)
  const showKacsaConnection = formData.type === "rendes"

  // Handle critical API errors (those that prevent form functionality)
  const criticalErrors = []
  if (partnersError) criticalErrors.push("Helyszínek betöltése sikertelen")
  if (typesError) criticalErrors.push("Forgatás típusok betöltése sikertelen")
  
  if (criticalErrors.length > 0) {
    // Show network error toast for critical issues
    criticalErrors.forEach(error => showNetworkErrorToast(error))
    
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
          
          <Card className="border-destructive/50 bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Kritikus hiba
              </CardTitle>
              <CardDescription>
                A forgatás létrehozásához szükséges adatok nem tölthetők be.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {criticalErrors.map((error, index) => (
                  <div key={index} className="p-2 text-sm bg-destructive/20 rounded border border-destructive/30">
                    • {error}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => window.location.reload()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Újra próbálkozás
                </Button>
                <Button onClick={() => router.push('/app/forgatasok')} variant="default">
                  Vissza a forgatásokhoz
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

          {/* API Status Warnings */}
          {(studentsError || contactPersonsError || kacsaError) && (
            <Card className="border-amber-500/50 bg-amber-500/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-amber-500 text-lg">⚠️</div>
                  <div className="flex-1">
                    <p className="font-medium text-amber-800">Néhány mező jelenleg nem elérhető</p>
                    <div className="text-sm text-amber-700 mt-1 space-y-1">
                      {studentsError && <div>• Szerkesztők betöltése sikertelen</div>}
                      {contactPersonsError && <div>• Kapcsolattartók betöltése sikertelen</div>}
                      {kacsaError && <div>• KaCsa összejátszások betöltése sikertelen</div>}
                    </div>
                    <p className="text-sm text-amber-700 mt-2">
                      Ezek a mezők opcionálisak vagy később módosíthatók. A forgatás továbbra is létrehozható.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                        {selectedType.value === "rendezveny" && <CalendarDays className="h-4 w-4 text-purple-400" />}
                        {selectedType.value === "rendes" && <Camera className="h-4 w-4 text-blue-400" />}
                        <Badge variant="outline" className="text-xs">
                          {(selectedType as any).description || selectedType.label}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Leírás *</Label>
                  <Textarea
                    id="description"
                    placeholder="A forgatás részletes leírása (maximum 500 karakter)"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    maxLength={500}
                    className="bg-transparent resize-none"
                    rows={3}
                    required
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
                    <Label htmlFor="reporter">Szerkesztő</Label>
                    {studentsError ? (
                      <div className="space-y-2">
                        <div className="p-3 text-sm text-amber-800 bg-amber-100 border border-amber-300 rounded-md">
                          ⚠️ Szerkesztők betöltése sikertelen. Ez a mező opcionális - a forgatás létrehozható szerkesztő nélkül.
                        </div>
                        <input 
                          disabled 
                          placeholder="Szerkesztők betöltése sikertelen - mező opcionális" 
                          className="w-full px-3 py-2 border border-amber-300 rounded-md bg-amber-50 text-amber-700 cursor-not-allowed"
                        />
                      </div>
                    ) : studentsLoading ? (
                      <div className="space-y-2">
                        <div className="w-full px-3 py-2 border rounded-md bg-muted animate-pulse">
                          Szerkesztők betöltése...
                        </div>
                      </div>
                    ) : reporterOptions.length === 0 ? (
                      <div className="space-y-2">
                        <div className="p-3 text-sm text-amber-800 bg-amber-100 border border-amber-300 rounded-md">
                          ℹ️ Nincs elérhető szerkesztő. Ez opcionális mező - a forgatás létrehozható szerkesztő nélkül.
                        </div>
                        <input 
                          disabled 
                          placeholder="Nincs elérhető szerkesztő - mező opcionális" 
                          className="w-full px-3 py-2 border border-muted rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                    ) : (
                      <Combobox
                        options={reporterOptions}
                        value={formData.reporterId}
                        onValueChange={(value) => handleInputChange("reporterId", value)}
                        placeholder="Válassz szerkesztőt..."
                        searchPlaceholder="Szerkesztő keresése..."
                        disabled={isReporterFieldDisabled}
                      />
                    )}
                    {isReporterFieldDisabled && currentUserInReporters && (
                      <p className="text-xs text-muted-foreground mt-2">
                        ℹ️ Automatikusan kiválasztva. Ha ez az információ helytelen, kérjük írja le a megjegyzések mezőben.
                      </p>
                    )}
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
                  <SystemDatePicker
                    date={formData.date}
                    onSelect={handleDateChange}
                    placeholder="Válassz dátumot"
                    className="w-full"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Kezdés ideje *</Label>
                    <SystemTimePicker
                      time={formData.startTime}
                      onTimeChange={(time: string) => handleTimeChange("startTime", time)}
                      placeholder="Kezdés ideje"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">Befejezés ideje *</Label>
                    <SystemTimePicker
                      time={formData.endTime}
                      onTimeChange={(time: string) => handleTimeChange("endTime", time)}
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
                      allowCustomAdd={true}
                      customAddLabel="Új Partner hozzáadása"
                      onCustomAdd={() => setShowCreatePartnerDialog(true)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Kapcsolattartó</Label>
                    {contactPersonsError ? (
                      <div className="space-y-2">
                        <div className="p-3 text-sm text-amber-800 bg-amber-100 border border-amber-300 rounded-md">
                          ⚠️ Kapcsolattartók betöltése sikertelen. Ez a mező jelenleg nem használható.
                        </div>
                        <input 
                          disabled 
                          placeholder="Kapcsolattartók betöltése sikertelen" 
                          className="w-full px-3 py-2 border border-destructive/30 rounded-md bg-destructive/10 text-destructive cursor-not-allowed"
                        />
                      </div>
                    ) : contactPersonsLoading ? (
                      <div className="space-y-2">
                        <div className="w-full px-3 py-2 border rounded-md bg-muted animate-pulse">
                          Kapcsolattartók betöltése...
                        </div>
                      </div>
                    ) : contactOptions.length === 0 ? (
                      <div className="space-y-2">
                        <div className="p-3 text-sm text-blue-800 bg-blue-100 border border-blue-300 rounded-md">
                          ℹ️ Nincs elérhető kapcsolattartó. Ez opcionális mező.
                        </div>
                        <input 
                          disabled 
                          placeholder="Nincs elérhető kapcsolattartó" 
                          className="w-full px-3 py-2 border border-muted rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                    ) : (
                      <Combobox
                        options={contactOptions}
                        value={formData.contactId}
                        onValueChange={(value) => handleInputChange("contactId", value)}
                        placeholder="Válassz kapcsolattartót..."
                        searchPlaceholder="Kapcsolattartó keresése..."
                        allowCustomAdd={true}
                        customAddLabel="Új Kapcsolattartó hozzáadása"
                        onCustomAdd={() => setShowCreateContactPersonDialog(true)}
                      />
                    )}
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
                    Kapcsolódó KaCsa
                  </CardTitle>
                  <CardDescription>Kapcsolódó KaCsa Összejátszás kiválasztása</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="relatedKacsa">Kapcsolódó KaCsa</Label>
                    {kacsaError ? (
                      <div className="space-y-2">
                        <div className="p-3 text-sm text-amber-800 bg-amber-100 border border-amber-300 rounded-md">
                          ⚠️ KaCsa Összejátszások betöltése sikertelen. Ez a mező jelenleg nem használható.
                        </div>
                        <input 
                          disabled 
                          placeholder="KaCsa Összejátszások betöltése sikertelen" 
                          className="w-full px-3 py-2 border border-destructive/30 rounded-md bg-destructive/10 text-destructive cursor-not-allowed"
                        />
                      </div>
                    ) : kacsaLoading ? (
                      <div className="space-y-2">
                        <div className="w-full px-3 py-2 border rounded-md bg-muted animate-pulse">
                          KaCsa Összejátszások betöltése...
                        </div>
                      </div>
                    ) : kacsaOptions.length === 0 ? (
                      <div className="space-y-2">
                        <div className="p-3 text-sm text-blue-800 bg-blue-100 border border-blue-300 rounded-md">
                          ℹ️ Nincs linkelhető KaCsa Összejátszás. Ez opcionális mező.
                        </div>
                        <input 
                          disabled 
                          placeholder="Nincs linkelhető KaCsa Összejátszás" 
                          className="w-full px-3 py-2 border border-muted rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                    ) : (
                      <Combobox
                        options={kacsaOptions}
                        value={formData.relatedKacsaId}
                        onValueChange={(value) => handleInputChange("relatedKacsaId", value)}
                        placeholder="Válassz KaCsa Összejátszást..."
                        searchPlaceholder="KaCsa keresése..."
                      />
                    )}
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

            {/* Error Display - Now handled by global error toasts */}
            {/* Removed ForgatásErrorHandler - errors now shown via toast notifications */}

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

        {/* Modal Dialogs */}
        <CreatePartnerDialog
          open={showCreatePartnerDialog}
          onOpenChange={setShowCreatePartnerDialog}
          onPartnerCreated={handlePartnerCreated}
        />
        
        <CreateContactPersonDialog
          open={showCreateContactPersonDialog}
          onOpenChange={setShowCreateContactPersonDialog}
          onContactPersonCreated={handleContactPersonCreated}
        />
      </StandardizedLayout>
    </ApiErrorBoundary>
  )
}
