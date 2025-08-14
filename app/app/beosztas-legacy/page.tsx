"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { UserDetailSchema, UserPermissionsSchema } from "@/lib/types"
import { apiClient, LegacyForgatBeosztasSchema, LegacyBeosztasItemSchema, LegacyBeosztasCreateSchema } from "@/lib/api"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Plus,
  X,
  ChevronDown,
  Camera,
  Radio,
  UserPlus,
  ArrowLeft
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LegacyBeosztasPage() {
  const searchParams = useSearchParams()
  const forgatásId = searchParams.get('forgatas')
  
  // State for filming sessions and assignments
  const [forgatBeosztasok, setForgatBeosztasok] = useState<LegacyForgatBeosztasSchema[]>([])
  const [availableStudents, setAvailableStudents] = useState<UserDetailSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // UI state
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set())
  const [permissions, setPermissions] = useState<UserPermissionsSchema | null>(null)
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)
  const [selectedForgatForAssignment, setSelectedForgatForAssignment] = useState<LegacyForgatBeosztasSchema | null>(null)
  const [newAssignmentRole, setNewAssignmentRole] = useState("")
  const [newAssignmentStudent, setNewAssignmentStudent] = useState<UserDetailSchema | null>(null)

  // Check if user has admin permissions for assignments
  const canManageAssignments = () => {
    if (!permissions) return false
    return permissions.permissions.can_manage_forgatas || 
           permissions.permissions.is_developer_admin || 
           permissions.permissions.is_teacher_admin || 
           permissions.permissions.is_system_admin
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching legacy beosztas data...')
      const [forgatData, studentsData, permissionsData] = await Promise.all([
        apiClient.getLegacyBeosztasView().catch(() => []),
        apiClient.getAllUsersDetailed('student').catch(() => []),
        apiClient.getPermissions().catch(() => null)
      ])
      
      console.log('Legacy forgat beosztas data:', forgatData)
      console.log('Students:', studentsData)
      console.log('Permissions:', permissionsData)
      
      // Filter by specific forgatás ID if provided
      const filteredData = forgatásId 
        ? forgatData.filter(forgat => forgat.id.toString() === forgatásId)
        : forgatData
      
      setForgatBeosztasok(filteredData)
      setAvailableStudents(studentsData)
      setPermissions(permissionsData)
      
      // Auto-expand the specific forgatás if provided
      if (forgatásId && filteredData.length > 0) {
        setExpandedSessions(new Set([parseInt(forgatásId)]))
      }
      
    } catch (err) {
      console.error('Error fetching legacy data:', err)
      if (err instanceof Error) {
        setError(`Hiba történt az adatok betöltése során: ${err.message}`)
      } else {
        setError('Hiba történt az adatok betöltése során')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toggleSessionExpansion = (sessionId: number) => {
    const newExpanded = new Set(expandedSessions)
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId)
    } else {
      newExpanded.add(sessionId)
    }
    setExpandedSessions(newExpanded)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'N/A'
    return timeString.slice(0, 5) // Remove seconds
  }

  const createNewAssignment = async () => {
    try {
      if (!selectedForgatForAssignment || !newAssignmentRole || !newAssignmentStudent) {
        setError("Minden mező kitöltése kötelező.")
        return
      }

      const newAssignment: LegacyBeosztasCreateSchema = {
        beosztas: 1, // This seems to be a fixed value based on the API doc
        forgatas: selectedForgatForAssignment.id,
        user: newAssignmentStudent.id,
        role: newAssignmentRole,
      }

      await apiClient.createLegacyBeosztas(newAssignment)
      setIsAssignmentModalOpen(false)
      setNewAssignmentRole("")
      setNewAssignmentStudent(null)
      setSelectedForgatForAssignment(null)
      await fetchData()
      
      console.log('New assignment created successfully')
    } catch (err) {
      console.error("Error creating new assignment:", err)
      setError("Hiba történt az új beosztás létrehozása során.")
    }
  }

  const openAssignmentModal = (forgat: LegacyForgatBeosztasSchema) => {
    setSelectedForgatForAssignment(forgat)
    setIsAssignmentModalOpen(true)
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'kacsa':
        return <Radio className="h-4 w-4" />
      case 'rendes':
        return <Camera className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getSessionTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'kacsa':
        return 'default'
      case 'rendes':
        return 'secondary'
      case 'rendezveny':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStudentById = (userId: number): UserDetailSchema | null => {
    return availableStudents.find(student => student.id === userId) || null
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2">Adatok betöltése...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/app">Alkalmazás</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Beosztás (Legacy)</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {forgatásId && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/app/forgatasok'}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Vissza a forgatásokhoz
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold">
                  {forgatásId ? 'Beosztás szerkesztése' : 'Beosztáskezelő (Legacy API)'}
                </h1>
                <p className="text-muted-foreground">
                  {forgatásId 
                    ? 'Szerkeszd a kiválasztott forgatás beosztásait'
                    : 'Jövőbeli forgatások diákbeosztásainak kezelése legacy API-val'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 pb-20 max-w-full overflow-hidden">
            {forgatBeosztasok.map((forgat) => {
              const assignmentCount = forgat.beosztas.length
              const uniqueStudents = new Set(forgat.beosztas.map(b => b.user_id)).size

              return (
                <Card key={forgat.id} className="overflow-hidden border-l-4 border-l-primary/30 hover:border-l-primary transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getSessionTypeIcon(forgat.type)}
                            {forgat.name}
                          </CardTitle>
                          <Badge variant={getSessionTypeBadgeVariant(forgat.type)} className="text-xs">
                            {forgat.type_display}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {formatDate(forgat.date)}
                          </Badge>
                          {forgat.time_from && forgat.time_to && (
                            <Badge variant="outline" className="text-xs">
                              {formatTime(forgat.time_from)} - {formatTime(forgat.time_to)}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">{forgat.description}</CardDescription>
                        
                        {/* Location and Contact Info */}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {forgat.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{forgat.location.name}</span>
                            </div>
                          )}
                          {forgat.equipment_count > 0 && (
                            <div className="flex items-center gap-1">
                              <Camera className="h-3 w-3" />
                              <span>{forgat.equipment_count} eszköz</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{uniqueStudents} diák, {assignmentCount} beosztás</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {canManageAssignments() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAssignmentModal(forgat)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Hozzáadás
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleSessionExpansion(forgat.id)}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSessions.has(forgat.id) ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedSessions.has(forgat.id) && (
                    <CardContent className="pt-0">
                      {/* Assignment List */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Beosztások:</h4>
                        
                        {forgat.beosztas.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <User className="h-8 w-8 mx-auto mb-2" />
                            <p>Még nincsenek beosztások ehhez a forgatáshoz</p>
                          </div>
                        ) : (
                          <div className="grid gap-2">
                            {forgat.beosztas.map((beosztas, index) => {
                              const student = getStudentById(beosztas.user_id)
                              return (
                                <div key={`${beosztas.id}-${index}`} className="flex items-center justify-between bg-muted/50 rounded px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <span className="font-medium">
                                        {student ? student.full_name : `User ID: ${beosztas.user_id}`}
                                      </span>
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        {beosztas.role}
                                      </Badge>
                                    </div>
                                  </div>
                                  {student?.osztaly && (
                                    <Badge variant="secondary" className="text-xs">
                                      {student.osztaly.name}
                                    </Badge>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Additional Info */}
                      {(forgat.related_kacsa || forgat.tanev || forgat.notes) && (
                        <div className="mt-4 pt-4 border-t space-y-2">
                          {forgat.related_kacsa && (
                            <div className="flex items-center gap-2 text-sm">
                              <Radio className="h-4 w-4 text-muted-foreground" />
                              <span>Kapcsolódó KaCsa: {forgat.related_kacsa.name} ({formatDate(forgat.related_kacsa.date)})</span>
                            </div>
                          )}
                          
                          {forgat.tanev && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Tanév: {forgat.tanev.display_name}</span>
                              {forgat.tanev.is_active && (
                                <Badge variant="default" className="text-xs">Aktív</Badge>
                              )}
                            </div>
                          )}
                          
                          {forgat.notes && (
                            <div className="text-sm text-muted-foreground">
                              <strong>Megjegyzések:</strong> {forgat.notes}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              )
            })}

            {/* Empty State */}
            {forgatBeosztasok.length === 0 && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nincsenek közelgő forgatások</h3>
                  <p className="text-muted-foreground mb-4">
                    Jelenleg nincsenek beosztható forgatások a rendszerben.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="fixed bottom-4 right-4 max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Create Assignment Modal */}
          <Dialog open={isAssignmentModalOpen} onOpenChange={setIsAssignmentModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Új beosztás hozzáadása</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="forgatás">Forgatás</Label>
                  <Input
                    id="forgatás"
                    value={selectedForgatForAssignment?.name || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div>
                  <Label htmlFor="student">Diák</Label>
                  <Select onValueChange={(value) => {
                    const student = availableStudents.find(s => s.id === parseInt(value))
                    setNewAssignmentStudent(student || null)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Diák kiválasztása..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStudents.map(student => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <span>{student.full_name}</span>
                            {student.osztaly && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {student.osztaly.name}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="role">Szerepkör</Label>
                  <Input
                    id="role"
                    value={newAssignmentRole}
                    onChange={(e) => setNewAssignmentRole(e.target.value)}
                    placeholder="pl. Operatőr, Riporter, Asszisztens..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setIsAssignmentModalOpen(false)
                    setNewAssignmentRole("")
                    setNewAssignmentStudent(null)
                    setSelectedForgatForAssignment(null)
                  }}>
                    Mégse
                  </Button>
                  <Button onClick={createNewAssignment}>
                    Létrehozás
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
