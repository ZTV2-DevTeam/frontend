"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { BeosztasSchema, BeosztasDetailSchema, UserDetailSchema, SzerepkorRelacioSchema, SzerepkorSchema, ForgatSchema } from "@/lib/types"
import { apiClient } from "@/lib/api"
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
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  History,
  RefreshCw,
  Plus,
  X,
  ChevronDown
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Role restrictions by year
interface RoleRestriction {
  years: string[]
  optional?: boolean
  count?: number
}

const ROLE_RESTRICTIONS: Record<string, RoleRestriction> = {
  // Regular filming roles
  'Mentor': { years: ['11F'], optional: true },
  'Riporter': { years: ['10F'] },
  'Operatőr': { years: ['9F'] },
  'Asszisztens': { years: ['NYF'] },
  
  // Duck show roles - NYF
  'Kacsa Asszisztens': { years: ['NYF'], count: 4 },
  
  // Duck show roles - 9F  
  'Kacsa Operatőr': { years: ['9F'], count: 3 },
  'Bejátszó': { years: ['9F'] },
  'Feliratozó': { years: ['9F'] },
  
  // Duck show roles - 10F
  'Stábvezető': { years: ['10F'] }, // Only for regular filming
  'Szerkesztő': { years: ['10F'] },
  'Rendező': { years: ['10F', '11F'] },
  'Rendezőasszisztens': { years: ['10F'] },
  'Műsorvezető 1': { years: ['10F', '11F'] },
  'Műsorvezető 2': { years: ['10F'] },
  'Látványtervező': { years: ['10F'] },
  'Vezető operatőr': { years: ['10F', '11F'] },
  'Hangvágó': { years: ['10F'] },
  'Képvágó': { years: ['10F'] },
  'Bejátszó mentor': { years: ['10F'] },
  'Feliratozó mentor': { years: ['10F'] },
  'Technikus 1': { years: ['10F'] },
  'Technikus 2': { years: ['10F'] },
}

export default function BeosztasPage() {
  // State for filming sessions and assignments
  const [filmingSessions, setFilmingSessions] = useState<ForgatSchema[]>([])
  const [assignments, setAssignments] = useState<BeosztasDetailSchema[]>([])
  const [availableStudents, setAvailableStudents] = useState<UserDetailSchema[]>([])
  const [roles, setRoles] = useState<SzerepkorSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // UI state
  const [selectedSession, setSelectedSession] = useState<ForgatSchema | null>(null)
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set())

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current date for filtering future sessions
      const today = new Date().toISOString().split('T')[0]
      
      console.log('Fetching filming sessions from:', today)
      const [sessionsData, studentsData, rolesData] = await Promise.all([
        apiClient.getFilmingSessions(today), // Only future sessions
        apiClient.getAllUsersDetailed('student'),
        apiClient.getRoles()
      ])
      
      console.log('Filming sessions:', sessionsData)
      console.log('Students:', studentsData)
      console.log('Roles:', rolesData)
      
      setFilmingSessions(sessionsData)
      setAvailableStudents(studentsData)
      setRoles(rolesData)
      
      // Fetch assignments for each session
      const assignmentsPromises = sessionsData.map(async (session) => {
        try {
          // This is a placeholder - we'd need an API to get assignments by filming session
          // For now, we'll get all assignments and filter them
          const allAssignments = await apiClient.getAssignments()
          return allAssignments.map(async (assignment) => {
            return await apiClient.getAssignmentDetails(assignment.id)
          })
        } catch (err) {
          console.error(`Error fetching assignments for session ${session.id}:`, err)
          return []
        }
      })
      
      const allAssignmentPromises = await Promise.all(assignmentsPromises)
      const flatAssignmentPromises = allAssignmentPromises.flat()
      const allDetailedAssignments = await Promise.all(flatAssignmentPromises)
      
      setAssignments(allDetailedAssignments.filter(Boolean))
      
    } catch (err) {
      console.error('Error fetching data:', err)
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

  const getStudentsForRole = (roleName: string) => {
    const restriction = ROLE_RESTRICTIONS[roleName as keyof typeof ROLE_RESTRICTIONS]
    if (!restriction) return availableStudents
    
    return availableStudents.filter(student => {
      const studentClass = student.osztaly?.name || ''
      return restriction.years.some(year => studentClass.includes(year))
    })
  }

  const getStudentHistory = (studentId: number, roleId: number) => {
    // This would be calculated from assignment history
    // For now returning mock data
    return {
      count: Math.floor(Math.random() * 5),
      lastAssignment: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5) // Remove seconds
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/app">Alkalmazás</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Beosztáskezelő</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Beosztáskezelő</h1>
              <p className="text-muted-foreground">
                Jövőbeli forgatások beosztásainak kezelése évfolyam alapú szerepkör korlátozásokkal
              </p>
            </div>
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Frissítés
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
              <Button 
                onClick={() => setError(null)} 
                variant="ghost" 
                size="sm" 
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          )}

          <div className="grid gap-4">
            {filmingSessions.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Nincsenek jövőbeli forgatások</p>
                    <p className="text-muted-foreground">Új forgatások létrehozása után jelennek meg itt a beosztások</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filmingSessions.map(session => (
              <Card key={session.id} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleSessionExpansion(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{session.name}</CardTitle>
                        <Badge variant="outline">{session.type_display}</Badge>
                        {session.related_kacsa && (
                          <Badge variant="secondary">Kacsa kapcsolat</Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {session.description}
                      </CardDescription>
                      <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(session.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(session.time_from)} - {formatTime(session.time_to)}
                        </div>
                        {session.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {session.location.name}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {session.equipment_count} eszköz
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${
                      expandedSessions.has(session.id) ? 'rotate-180' : ''
                    }`} />
                  </div>
                </CardHeader>
                
                {expandedSessions.has(session.id) && (
                  <CardContent className="pt-0">
                    <Separator className="mb-6" />
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          Szerepkör beosztások
                        </h3>
                        
                        <div className="grid gap-4">
                          {Object.entries(ROLE_RESTRICTIONS).map(([roleName, restriction]) => {
                            // Filter roles based on session type
                            const isRegularRole = ['Mentor', 'Riporter', 'Operatőr', 'Asszisztens', 'Stábvezető'].includes(roleName)
                            const isDuckRole = roleName.startsWith('Kacsa') || 
                              ['Szerkesztő', 'Rendező', 'Rendezőasszisztens', 'Műsorvezető 1', 'Műsorvezető 2', 
                               'Látványtervező', 'Vezető operatőr', 'Hangvágó', 'Képvágó', 'Bejátszó mentor', 
                               'Feliratozó mentor', 'Technikus 1', 'Technikus 2', 'Bejátszó', 'Feliratozó'].includes(roleName)
                            
                            // Show regular roles for all sessions, duck roles only for duck sessions
                            if (session.related_kacsa && !isDuckRole) return null
                            if (!session.related_kacsa && !isRegularRole) return null
                            
                            const availableForRole = getStudentsForRole(roleName)
                            
                            return (
                              <Card key={roleName} className="border-l-4 border-l-primary/20">
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle className="text-base">{roleName}</CardTitle>
                                      <CardDescription>
                                        Évfolyamok: {restriction.years.join(', ')}
                                        {restriction.count && ` (${restriction.count} fő)`}
                                        {restriction.optional && ' (opcionális)'}
                                      </CardDescription>
                                    </div>
                                    <Badge variant="secondary">
                                      {availableForRole.length} elérhető
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  {availableForRole.length > 0 ? (
                                    <div className="space-y-2">
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Tanuló kiválasztása..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {availableForRole.map(student => {
                                            const history = getStudentHistory(student.id, 1) // Mock role ID
                                            return (
                                              <SelectItem key={student.id} value={student.id.toString()}>
                                                <div className="flex items-center justify-between w-full">
                                                  <div>
                                                    <div className="font-medium">{student.full_name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                      {student.osztaly?.name || student.username} • 
                                                      {student.stab?.name || student.radio_stab?.name || 'Nincs stáb'}
                                                    </div>
                                                  </div>
                                                  <div className="text-xs text-muted-foreground ml-4">
                                                    <div className="flex items-center gap-1">
                                                      <History className="h-3 w-3" />
                                                      {history.count}x
                                                    </div>
                                                  </div>
                                                </div>
                                              </SelectItem>
                                            )
                                          })}
                                        </SelectContent>
                                      </Select>
                                      
                                      {/* Show currently assigned students (placeholder) */}
                                      <div className="flex flex-wrap gap-2 mt-3">
                                        {/* This would show actually assigned students */}
                                        <div className="text-sm text-muted-foreground italic">
                                          Nincs tanuló beosztva ehhez a szerepkörhöz
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-muted-foreground italic">
                                      Nincsenek elérhető tanulók ehhez a szerepkörhöz
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
