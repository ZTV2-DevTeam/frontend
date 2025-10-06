"use client"

import { useState, useMemo, use } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import type { ForgatSchema, BeosztasDetailSchema, EquipmentSchema, BeosztasSchema } from "@/lib/types"
import { ApiErrorBoundary } from "@/components/api-error-boundary"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import { StabBadge, UserStabBadge } from "@/components/stab-badge"
import { UserAvatar } from "@/components/user-avatar"
import { GoogleCalendarButton } from "@/components/google-calendar-button"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar,
  MapPin,
  Clock,
  Camera,
  Users,
  Phone,
  Mail,
  User,
  Star,
  ArrowLeft,
  CalendarDays,
  FileText,
  AlertCircle,
  Loader2,
  Settings,
  Pin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Date helper for better formatting
const formatSessionDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return format(date, 'yyyy. MMMM dd. (EEEE)', { locale: hu })
  } catch {
    return dateStr
  }
}

// Time helper
const formatTime = (timeStr: string) => {
  try {
    const [hours, minutes] = timeStr.split(':')
    return `${hours}:${minutes}`
  } catch {
    return timeStr
  }
}

interface CrewMember {
  id: number
  name: string
  role: string
  class: string
  stab: string
  phone?: string
  email?: string
  team?: string
  firstName?: string
  lastName?: string
  username?: string
}

export default function FilmingSessionDetail({ params }: PageProps) {
  const { id } = use(params)
  const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMember | null>(null)
  
  // Context hooks
  const { isAuthenticated } = useAuth()
  const { hasPermission } = usePermissions()
  
  // Permission checks
  const canEditAssignments = hasPermission('can_manage_forgatas') || hasPermission('is_admin') || hasPermission('is_teacher_admin')
  
  // API queries
  const sessionQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingSession(parseInt(id)) : Promise.resolve(null),
    [isAuthenticated, id]
  )

  const assignmentsQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingAssignments(parseInt(id)) as Promise<BeosztasSchema | null> : Promise.resolve(null),
    [isAuthenticated, id]
  )

  const { data: session, loading, error } = sessionQuery
  const { data: assignment = null } = assignmentsQuery

  // Equipment queries - fetch equipment details for the session
  const equipmentQueries = useApiQuery(
    () => {
      if (!isAuthenticated || !session?.equipment_ids) return Promise.resolve([])
      return Promise.all(
        session.equipment_ids.map((id: number) => 
          apiClient.getEquipmentDetails(id)
        )
      )
    },
    [isAuthenticated, session]
  )

  // User queries - fetch detailed user info for crew members
  const userQueries = useApiQuery(
    () => {
      if (!isAuthenticated || !assignment?.szerepkor_relaciok) return Promise.resolve([])
      return Promise.all(
        assignment.szerepkor_relaciok.map((relation: any) => 
          apiClient.getUserDetails(relation.user.id)
        )
      )
    },
    [isAuthenticated, assignment]
  )

  // Szerkesztő user details query
  const szerkesztoQuery = useApiQuery(
    () => {
      if (!isAuthenticated || !assignment?.forgatas || !(assignment.forgatas as any).szerkeszto) {
        return Promise.resolve(null)
      }
      return apiClient.getUserDetails((assignment.forgatas as any).szerkeszto.id)
    },
    [isAuthenticated, assignment]
  )

  const { data: equipmentList = [], loading: equipmentLoading } = equipmentQueries
  const { data: userDetailsList = [], loading: usersLoading } = userQueries
  const { data: szerkesztoDetails = null, loading: szerkesztoLoading } = szerkesztoQuery

  // Computed values - get crew from assignment with detailed user info
  const crew: CrewMember[] = useMemo(() => {
    if (!assignment || !assignment.szerepkor_relaciok || !userDetailsList) return []
    
    // Convert role relations to crew members with detailed user info
    return assignment.szerepkor_relaciok.map((relation: any) => {
      const userDetails = userDetailsList.find((user: any) => user.id === relation.user.id)
      
      return {
        id: relation.user.id,
        name: relation.user.full_name || `${relation.user.last_name} ${relation.user.first_name}`,
        role: relation.szerepkor.name,
        class: userDetails?.osztaly_name || 'N/A',
        stab: userDetails?.stab_name || 'N/A',
        phone: userDetails?.telefonszam || '',
        email: userDetails?.email || '',
        team: relation.user.username?.includes('A') ? 'A' : 'B', // Basic team detection
        firstName: relation.user.first_name || userDetails?.first_name || '',
        lastName: relation.user.last_name || userDetails?.last_name || '',
        username: relation.user.username || userDetails?.username || ''
      }
    })
  }, [assignment, userDetailsList])

  if (loading || usersLoading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Forgatás betöltése...
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !session) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tervezett":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Folyamatban":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Befejezve":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "kacsa":
        return Star
      case "rendezveny":
        return CalendarDays
      default:
        return Camera
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "kacsa":
        return "bg-yellow-500/5 border-yellow-500/30"
      case "rendezveny":
        return "bg-purple-500/5 border-purple-500/30"
      default:
        return "bg-card/50"
    }
  }

  const TypeIcon = getTypeIcon(session.type)

  return (
    <ApiErrorBoundary fallback={ApiErrorFallback}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          
          <div className="flex-1 space-y-6 p-4 md:p-6 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link href="/app/forgatasok">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Vissza
                </Button>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <TypeIcon
                    className={`h-6 w-6 ${
                      session.type === "kacsa"
                        ? "text-yellow-400 fill-yellow-400"
                        : session.type === "rendezveny"
                          ? "text-purple-400 fill-purple-400"
                          : "text-blue-400"
                    }`}
                  />
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {session.name}
                  </h1>
                </div>
                <p className="text-muted-foreground">Forgatás részletes információi</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card className={`border-border/50 backdrop-blur-sm ${getTypeColor(session.type)}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      Alapinformációk
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground">Helyszín</div>
                            <div className="font-medium">{session.location?.name || 'Helyszín nincs megadva'}</div>
                            {session.location?.address && (
                              <div className="text-xs text-muted-foreground">{session.location.address}</div>
                            )}
                          {session.location?.address && (
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(session.location.name)}+${encodeURIComponent(session.location.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center mt-2 gap-2 px-3 py-2 rounded-full
                              bg-muted/40 hover:bg-muted/60 border border-border text-muted-foreground
                              transition-colors text-sm font-medium w-fit"
                            >
                              <Image
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/256px-Google_Maps_icon_%282020%29.svg.png"
                              alt="Google Maps"
                              width={16}
                              height={16}
                              className="shrink-0"
                              />
                              Google Maps
                            </a>
                          )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Calendar className="h-4 w-4 text-green-400" />
                          <div>
                            <div className="text-sm text-muted-foreground">Dátum</div>
                            <div className="font-medium">{formatSessionDate(session.date)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Clock className="h-4 w-4 text-orange-400" />
                          <div>
                            <div className="text-sm text-muted-foreground">Időpont</div>
                            <div className="font-medium">
                              {formatTime(session.time_from)} - {formatTime(session.time_to)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Users className="h-4 w-4 text-purple-400" />
                          <div>
                            <div className="text-sm text-muted-foreground">Stáb létszám</div>
                            <div className="font-medium">{crew.length} fő</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Camera className="h-4 w-4 text-blue-400" />
                          <div>
                            <div className="text-sm text-muted-foreground">Eszközök</div>
                            <div className="font-medium">{equipmentList?.length || 0} db</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assignment Status */}
                    {(() => {
                      if (!assignment) {
                        return (
                          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-400" />
                              <span className="font-medium text-orange-400">
                                Nincs beosztás létrehozva ehhez a forgatáshoz
                              </span>
                            </div>
                          </div>
                        )
                      }
                      
                      return (
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-400" />
                              <span className="font-medium text-blue-400">
                                Beosztás: {assignment.student_count} diák hozzárendelve
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={assignment.kesz ? "default" : "outline"}
                                className={assignment.kesz ? 
                                  "bg-green-500/20 text-green-400 border-green-500/30" : 
                                  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                }
                              >
                                {assignment.kesz ? "Végleges" : "Tervezet"}
                              </Badge>
                            </div>
                          </div>
                          {/* Assignment Stab Information */}
                          {assignment.stab && (
                            <div className="mt-2 flex items-center gap-2">
                              <StabBadge stab={assignment.stab} showMemberCount />
                            </div>
                          )}
                          {assignment.roles_summary && assignment.roles_summary.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {assignment.roles_summary.map((role: any, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {role.role}: {role.count}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })()}

                    {session.type === "kacsa" && (
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="font-medium text-yellow-400">
                            KaCsa Összejátszás
                          </span>
                        </div>
                      </div>
                    )}

                    {session.type === "rendezveny" && (
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-purple-400" />
                          <span className="font-medium text-purple-400">Esemény forgatás</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Description */}
                {session.description && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-400" />
                        Leírás
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{session.description}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {session.notes && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-amber-400" />
                        Megjegyzések
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{session.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Person */}
                {session.contact_person && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-400" />
                        Kapcsolattartó
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border/50">
                        <UserAvatar
                          email={session.contact_person.email || ''}
                          firstName={session.contact_person.name?.split(' ')[0] || ''}
                          lastName={session.contact_person.name?.split(' ').slice(1).join(' ') || ''}
                          username=""
                          customSize={48}
                          className="border border-border/50"
                          fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-base font-semibold"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{session.contact_person.name}</div>
                        </div>
                        <div className="flex gap-2">
                          {session.contact_person.phone && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${session.contact_person.phone}`}>
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {session.contact_person.email && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${session.contact_person.email}`}>
                                <Mail className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Equipment */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-blue-400" />
                      Felszerelés
                    </CardTitle>
                    <CardDescription>Szükséges eszközök és berendezések</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {equipmentLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Eszközök betöltése...
                      </div>
                    ) : !equipmentList || equipmentList.length === 0 ? (
                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="font-medium text-sm">
                          Nincs eszköz hozzárendelve
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {equipmentList.map((equipment: EquipmentSchema) => (
                          <div key={equipment.id} className="p-3 rounded-lg bg-background/50 border border-border/50">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{equipment.nickname}</div>
                                <div className="text-xs text-muted-foreground">
                                  {equipment.brand && equipment.model 
                                    ? `${equipment.brand} ${equipment.model}`
                                    : equipment.equipment_type?.name || 'Ismeretlen típus'
                                  }
                                </div>
                                {equipment.equipment_type?.emoji && (
                                  <div className="text-xs mt-1">
                                    {equipment.equipment_type.emoji} {equipment.equipment_type.name}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge 
                                  variant={equipment.functional ? "default" : "destructive"}
                                  className="text-xs"
                                >
                                  {equipment.functional ? "Működik" : "Hibás"}
                                </Badge>
                                {equipment.serial_number && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    SN: {equipment.serial_number}
                                  </div>
                                )}
                              </div>
                            </div>
                            {equipment.notes && (
                              <div className="mt-2 text-xs text-muted-foreground bg-background/30 p-2 rounded">
                                {equipment.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Gyors Műveletek</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <GoogleCalendarButton
                      forgatas={{
                        name: session.name,
                        description: session.description,
                        date: session.date,
                        time_from: session.time_from,
                        time_to: session.time_to,
                        location: session.location
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      Hozzáadás a Naptárhoz
                    </GoogleCalendarButton>
                    {/* Future actions can be uncommented here
                    <Button className="w-full bg-transparent" variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Forgatási Terv
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Stáb Értesítése
                    </Button>
                    {equipmentList && equipmentList.length > 0 && (
                      <Button className="w-full bg-transparent" variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Eszköz Állapot
                      </Button>
                    )}
                    {assignments && assignments.length > 0 && (() => {
                      const sessionAssignment = assignments.find((assignment: BeosztasSchema) => 
                        assignment.forgatas.id === parseInt(id)
                      )
                      return sessionAssignment && (
                        <Button className="w-full bg-transparent" variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          {sessionAssignment.kesz ? 'Beosztás megtekintése' : 'Beosztás szerkesztése'}
                        </Button>
                      )
                    })()} */}
                  </CardContent>
                </Card>

                {/* Crew */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-purple-400" />
                          Stáb ({crew.length} fő)
                        </CardTitle>
                        <CardDescription>
                          Forgatásban résztvevő diákok
                          {assignment && (
                            <span className="ml-2">
                              • {assignment.kesz ? 'Végleges beosztás' : 'Tervezet'}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      {canEditAssignments && assignment && (
                        <Link href={`/app/forgatasok/${id}/beosztas`} className="ml-3 shrink-0">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs hover:bg-purple-500/10 hover:text-purple-400 border border-purple-500/20 hover:border-purple-500/30">
                            <Settings className="h-3 w-3 mr-1" />
                            Szerkesztés
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Show szerkesztő if available */}
                      {assignment?.forgatas && (assignment.forgatas as any).szerkeszto && (
                        <button
                          onClick={() => {
                            const szerkeszto = (assignment.forgatas as any).szerkeszto
                            const szerkesztoMember = {
                              id: szerkeszto.id,
                              name: szerkeszto.full_name,
                              role: 'Szerkesztő',
                              class: szerkesztoDetails?.osztaly_name || 'N/A',
                              stab: szerkesztoDetails?.stab_name || 'N/A',
                              phone: szerkesztoDetails?.telefonszam || '',
                              email: szerkesztoDetails?.email || '',
                              team: szerkeszto.username?.includes('A') ? 'A' : 'B',
                              firstName: szerkeszto.first_name || szerkesztoDetails?.first_name || '',
                              lastName: szerkeszto.last_name || szerkesztoDetails?.last_name || '',
                              username: szerkeszto.username || szerkesztoDetails?.username || ''
                            }
                            setSelectedCrewMember(szerkesztoMember)
                          }}
                          className="w-full p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 hover:from-cyan-500/15 hover:to-blue-500/15 hover:border-cyan-500/40 transition-all text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <UserAvatar
                                email={szerkesztoDetails?.email || ''}
                                firstName={(assignment.forgatas as any).szerkeszto.first_name || szerkesztoDetails?.first_name || ''}
                                lastName={(assignment.forgatas as any).szerkeszto.last_name || szerkesztoDetails?.last_name || ''}
                                username={(assignment.forgatas as any).szerkeszto.username || szerkesztoDetails?.username || ''}
                                customSize={40}
                                className="border border-cyan-500/50"
                                fallbackClassName="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-sm font-semibold"
                              />
                              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                                <Pin className="h-3 w-3 text-white rotate-45 stroke-3" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm flex items-center gap-2">
                                {(assignment.forgatas as any).szerkeszto.full_name}
                                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                                  Szerkesztő
                                </Badge>
                                {szerkesztoDetails?.stab_name && (
                                  <UserStabBadge stabName={szerkesztoDetails.stab_name} size="sm" />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {szerkesztoDetails?.osztaly_name ? `${szerkesztoDetails.osztaly_name} • Szerkesztő` : 'Szerkesztő'}
                              </div>
                            </div>
                          </div>
                        </button>
                      )}
                      
                      {crew.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          Nincs stáb hozzárendelve
                        </div>
                      ) : (
                        crew.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => setSelectedCrewMember(member)}
                            className="w-full p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-accent/50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                email={member.email || ''}
                                firstName={member.firstName || ''}
                                lastName={member.lastName || ''}
                                username={member.username || ''}
                                customSize={40}
                                className="border border-border/50"
                                fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm flex items-center gap-2">
                                  {member.name}
                                  {member.stab && (
                                    <UserStabBadge stabName={member.stab} size="sm" />
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {member.role} • {member.class}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Crew Member Modal */}
            <Dialog open={!!selectedCrewMember} onOpenChange={() => setSelectedCrewMember(null)}>
              <DialogContent className="sm:max-w-md mx-4 w-[calc(100vw-2rem)] sm:w-full">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Kapcsolattartó Információk
                  </DialogTitle>
                  <DialogDescription>Diák elérhetőségei és részletei</DialogDescription>
                </DialogHeader>
                {selectedCrewMember && (
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <UserAvatar
                        email={selectedCrewMember.email || ''}
                        firstName={selectedCrewMember.firstName || ''}
                        lastName={selectedCrewMember.lastName || ''}
                        username={selectedCrewMember.username || ''}
                        customSize={64}
                        className="border-2 border-primary/20 mx-auto"
                        fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-semibold"
                      />
                      <h3 className="text-lg font-semibold">{selectedCrewMember.name}</h3>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="secondary">{selectedCrewMember.role}</Badge>
                        <Badge variant="outline">{selectedCrewMember.class}</Badge>
                        {selectedCrewMember.stab && (
                          <UserStabBadge stabName={selectedCrewMember.stab} />
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedCrewMember.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Phone className="h-4 w-4 text-green-400" />
                          <div>
                            <div className="text-sm text-muted-foreground">Telefon</div>
                            <div className="font-medium">{selectedCrewMember.phone}</div>
                          </div>
                        </div>
                      )}

                      {selectedCrewMember.email && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Mail className="h-4 w-4 text-blue-400" />
                          <div>
                            <div className="text-sm text-muted-foreground">Email</div>
                            <div className="font-medium">{selectedCrewMember.email}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4">
                      {selectedCrewMember.phone && (
                        <Button className="flex-1" size="sm" asChild>
                          <a href={`tel:${selectedCrewMember.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Hívás
                          </a>
                        </Button>
                      )}
                      {selectedCrewMember.email && (
                        <Button variant="outline" className="flex-1 bg-transparent" size="sm" asChild>
                          <a href={`mailto:${selectedCrewMember.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ApiErrorBoundary>
  )
}