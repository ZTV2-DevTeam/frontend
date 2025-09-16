"use client"

import { useState, useMemo } from "react"
import { StandardizedLayout } from "@/components/standardized-layout"
import { useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { ForgatSchema, BeosztasSchema } from "@/lib/types"
import { ApiErrorBoundary } from "@/components/api-error-boundary"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Star, Filter, Grid3X3, List, Music, Camera, Eye, Loader2, AlertCircle, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { useUserRole } from "@/contexts/user-role-context"
import { usePermissions } from "@/contexts/permissions-context"
import { StabBadge } from "@/components/stab-badge"

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

export default function FilmingSessionsPage() {
  // State hooks
  const [showUserOnly, setShowUserOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Context hooks
  const { user, isAuthenticated } = useAuth()
  const { currentRole } = useUserRole()
  const { hasPermission, permissions } = usePermissions()
  
  // API queries
  const filmingQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingSessions() : Promise.resolve([]),
    [isAuthenticated]
  )

  const { data: filmingData = [], loading: sessionsLoading, error } = filmingQuery

  // Computed values
  const sessions = useMemo(() => Array.isArray(filmingData) ? filmingData : [], [filmingData])

  // Fetch assignments for each filming session individually
  const assignmentsQueries = useApiQuery(
    () => {
      if (!isAuthenticated || sessions.length === 0) return Promise.resolve([])
      return Promise.all(
        sessions.map(async (session: ForgatSchema) => {
          try {
            const assignment = await apiClient.getFilmingAssignments(session.id) as BeosztasSchema
            return assignment
          } catch (error) {
            // Some sessions might not have assignments yet
            console.warn(`No assignment found for session ${session.id}:`, error)
            return null
          }
        })
      )
    },
    [isAuthenticated, sessions]
  )

  const { data: assignmentsData = [], loading: assignmentsLoading } = assignmentsQueries

  // Fetch detailed user information for all crew members
  const userDetailsQueries = useApiQuery(
    () => {
      if (!isAuthenticated || !assignmentsData || assignmentsData.length === 0) return Promise.resolve([])
      
      // Collect all unique user IDs from all assignments
      const userIds = new Set<number>()
      assignmentsData.forEach((assignment: BeosztasSchema | null) => {
        if (assignment?.szerepkor_relaciok) {
          assignment.szerepkor_relaciok.forEach((relation: any) => {
            userIds.add(relation.user.id)
          })
        }
      })
      
      // Fetch detailed info for all users
      return Promise.all(
        Array.from(userIds).map(userId => 
          apiClient.getUserDetails(userId).catch(() => null) // Handle errors gracefully
        )
      )
    },
    [isAuthenticated, assignmentsData]
  )

  const { data: userDetailsList = [], loading: usersLoading } = userDetailsQueries

  // Combined loading state
  const loading = sessionsLoading || assignmentsLoading || usersLoading

  // Permission check - use can_create_forgatas permission
  const canCreateForgatás = hasPermission('can_create_forgatas')

  // Create a map of assignments by filming session ID for quick lookup
  const assignmentMap = useMemo(() => {
    const map = new Map<number, BeosztasSchema>()
    if (assignmentsData && Array.isArray(assignmentsData)) {
      assignmentsData.forEach((assignment: BeosztasSchema | null) => {
        if (assignment) {
          map.set(assignment.forgatas.id, assignment)
        }
      })
    }
    return map
  }, [assignmentsData])

  // Helper functions
  const getSessionAssignment = (sessionId: number): BeosztasSchema | undefined => {
    return assignmentMap.get(sessionId)
  }

  const isUserInvolvedInSession = (sessionId: number): boolean => {
    if (!user) return false
    const assignment = getSessionAssignment(sessionId)
    if (!assignment) return false
    
    return assignment.szerepkor_relaciok.some(relation => relation.user.id === user.user_id)
  }

  const isSessionLive = (sessionId: number): boolean => {
    const assignment = getSessionAssignment(sessionId)
    if (!assignment) return false
    
    // Only finalized sessions can be live
    if (!assignment.kesz) return false
    
    const now = new Date()
    const sessionDate = new Date(assignment.forgatas.date)
    
    // Check if it's the same date
    const isToday = sessionDate.toDateString() === now.toDateString()
    if (!isToday) return false
    
    // Check if the session is currently happening (between start and end time)
    if (assignment.forgatas.time_from && assignment.forgatas.time_to) {
      const [startHour, startMin] = assignment.forgatas.time_from.split(':').map(Number)
      const [endHour, endMin] = assignment.forgatas.time_to.split(':').map(Number)
      
      const startTime = new Date(sessionDate)
      startTime.setHours(startHour, startMin, 0, 0)
      
      const endTime = new Date(sessionDate)
      endTime.setHours(endHour, endMin, 0, 0)
      
      // Session is live if current time is between start and end
      return now >= startTime && now <= endTime
    }
    
    // If no time specified, consider it live all day if it's today and finalized
    return true
  }

  const getSessionCrewData = (sessionId: number) => {
    const assignment = getSessionAssignment(sessionId)
    if (!assignment) return { count: 0, roles: [], crewMembers: [], assignmentStab: null }
    
    return {
      count: assignment.student_count,
      roles: assignment.roles_summary,
      assignmentStab: assignment.stab,
      crewMembers: assignment.szerepkor_relaciok.map(relation => {
        // Find detailed user information
        const userDetails = userDetailsList?.find((user: any) => user?.id === relation.user.id)
        
        // Extract class from username as fallback if detailed info not available
        const extractClassFromUsername = (username: string) => {
          const match = username.match(/^(\d{1,2}[a-zA-Z]+)_/)
          if (match) {
            return match[1].toUpperCase()
          }
          return null
        }

        const extractedClass = extractClassFromUsername(relation.user.username)
        
        return {
          id: relation.user.id,
          name: relation.user.full_name || `${relation.user.last_name} ${relation.user.first_name}`,
          role: relation.szerepkor.name,
          class: userDetails?.osztaly_name || extractedClass || 'Osztály nincs megadva',
          team: relation.user.username?.includes('a') ? 'A' : 
                relation.user.username?.includes('b') ? 'B' : undefined
        }
      })
    }
  }

  // Filter sessions by user involvement if needed
  const filteredSessions = useMemo(() => {
    if (!showUserOnly) return sessions
    return sessions.filter(session => isUserInvolvedInSession(session.id))
  }, [sessions, showUserOnly, assignmentMap, user])

  // Group sessions by type
  const kacsaSessions = useMemo(() => filteredSessions.filter((s: ForgatSchema) => s.type === "kacsa"), [filteredSessions])
  const normalSessions = useMemo(() => filteredSessions.filter((s: ForgatSchema) => s.type === "rendes"), [filteredSessions])
  const eventSessions = useMemo(() => filteredSessions.filter((s: ForgatSchema) => s.type === "rendezveny"), [filteredSessions])
  const egyebSessions = useMemo(() => filteredSessions.filter((s: ForgatSchema) => s.type === "egyeb"), [filteredSessions])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tervezett":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Folyamatban":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Befejezve":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "kacsa":
        return Star
      case "rendezveny":
        return Music
      default:
        return Camera
    }
  }

  const ShootingGridCard = ({ session }: { session: ForgatSchema }) => {
    const TypeIcon = getTypeIcon(session.type)
    const isUserInvolved = isUserInvolvedInSession(session.id)
    const isLive = isSessionLive(session.id)
    const crewData = getSessionCrewData(session.id)

    return (
      <Link href={`/app/forgatasok/${session.id}`} className="block">
        <Card
          className={`border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full ${
            isUserInvolved
              ? "bg-blue-500/10 border-blue-500/30 shadow-lg ring-1 ring-blue-500/20"
              : "bg-card/50"
          }`}
        >
          <CardContent className="p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <TypeIcon
                  className={`h-5 w-5 flex-shrink-0 ${
                    session.type === "kacsa"
                      ? "text-yellow-400 fill-yellow-400"
                      : session.type === "rendezveny"
                        ? "text-purple-400"
                        : "text-blue-400"
                  }`}
                />
                {isUserInvolved && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                    <Star className="h-3 w-3 text-blue-400 fill-blue-400" />
                    <span className="text-xs font-medium text-blue-400">Részt veszek</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 items-end">
                {isLive && (
                  <Badge variant="destructive" className="text-xs animate-pulse px-2 py-0">
                    LIVE
                  </Badge>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{session.name}</h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{session.location?.name || 'Hely nincs megadva'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formatSessionDate(session.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span>{crewData.count} fő stáb</span>
                </div>
                {/* Assignment Stab Information */}
                {crewData.assignmentStab && (
                  <div className="flex items-center gap-2 text-xs">
                    <StabBadge stab={crewData.assignmentStab} size="sm" showMemberCount />
                  </div>
                )}
              </div>

              {/* Real Crew Preview - Compact */}
              {crewData.crewMembers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Stáb:</div>
                  <div className="space-y-1">
                    {crewData.crewMembers.slice(0, 3).map((member, index) => (
                      <div key={member.id} className="text-xs">
                        <div className="font-medium truncate">{member.name}</div>
                        <div className="text-muted-foreground text-[10px] flex items-center gap-1">
                          <span className="truncate">{member.role}</span>
                          <span>•</span>
                          <span>{member.class}</span>
                          {member.team && (
                            <>
                              <span>•</span>
                              <Badge
                                variant="outline"
                                className={`text-[8px] px-1 py-0 h-3 ${
                                  member.team === "A"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                    : "bg-green-500/10 text-green-400 border-green-500/30"
                                }`}
                              >
                                {member.team}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {crewData.crewMembers.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{crewData.crewMembers.length - 3} további</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {session.type === "kacsa" ? "KaCsa" : session.type === "rendezveny" ? "Esemény" : "Forgatás"}
              </span>
              <Eye className="h-3 w-3 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  const ShootingListItem = ({ session }: { session: ForgatSchema }) => {
    const TypeIcon = getTypeIcon(session.type)
    const isUserInvolved = isUserInvolvedInSession(session.id)
    const isLive = isSessionLive(session.id)
    const crewData = getSessionCrewData(session.id)

    return (
      <Link href={`/app/forgatasok/${session.id}`} className="block">
        <Card
          className={`border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:scale-[1.01] cursor-pointer ${
            isUserInvolved
              ? "bg-blue-500/10 border-blue-500/30 shadow-lg ring-1 ring-blue-500/20"
              : "bg-card/50"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <TypeIcon
                className={`h-5 w-5 flex-shrink-0 mt-1 ${
                  session.type === "kacsa"
                    ? "text-yellow-400 fill-yellow-400"
                    : session.type === "rendezveny"
                      ? "text-purple-400"
                      : "text-blue-400"
                }`}
              />

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-sm truncate">{session.name}</h3>
                    {isUserInvolved && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                        <Star className="h-3 w-3 text-blue-400 fill-blue-400" />
                        <span className="text-xs font-medium text-blue-400">Részt veszek</span>
                      </div>
                    )}
                    {isLive && (
                      <Badge variant="destructive" className="text-xs animate-pulse px-2 py-0">
                        LIVE
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[120px]">{session.location?.name || 'Hely nincs megadva'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="truncate">{formatSessionDate(session.date)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{crewData.count} fő stáb</span>
                    </span>
                    {/* Assignment Stab Information */}
                    {crewData.assignmentStab && (
                      <span className="flex items-center gap-1">
                        <StabBadge stab={crewData.assignmentStab} size="sm" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Real Crew List - Compact */}
                {crewData.crewMembers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Stáb:</div>
                    <div className="text-xs space-y-1">
                      {crewData.crewMembers.slice(0, 4).map((member, index) => (
                        <span key={member.id} className="inline-block">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-muted-foreground ml-1">
                            ({member.role}
                            {member.team && (
                              <>
                                <span> • </span>
                                <Badge
                                  variant="outline"
                                  className={`text-[8px] px-1 py-0 h-3 inline-flex items-center ${
                                    member.team === "A"
                                      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                      : "bg-green-500/10 text-green-400 border-green-500/30"
                                  }`}
                                >
                                  {member.team}
                                </Badge>
                              </>
                            )}
                            )
                          </span>
                          {index < Math.min(crewData.crewMembers.length, 4) - 1 && (
                            <span className="text-muted-foreground">, </span>
                          )}
                        </span>
                      ))}
                      {crewData.crewMembers.length > 4 && (
                        <span className="text-muted-foreground"> és +{crewData.crewMembers.length - 4} további</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <Eye className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Loading state
  if (loading) {
    return (
      <StandardizedLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Forgatások betöltése...
        </div>
      </StandardizedLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <StandardizedLayout>
        <div className="flex items-center justify-center py-12 text-destructive">
          <AlertCircle className="h-6 w-6 mr-2" />
          Hiba a forgatások betöltésekor: {error}
        </div>
      </StandardizedLayout>
    )
  }

  return (
    <ApiErrorBoundary fallback={ApiErrorFallback}>
      <StandardizedLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl shadow-sm">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Forgatások</h1>
                <p className="text-base text-muted-foreground">
                  {filteredSessions.length} forgatás • KaCsa: {kacsaSessions.length} • Egyéb: {normalSessions.length} •
                  Események: {eventSessions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Create New Button */}
              {canCreateForgatás && (
                <Link href="/app/forgatasok/uj">
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Új forgatás</span>
                  </Button>
                </Link>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center border border-border/50 rounded-lg p-1 bg-background/50">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant={showUserOnly ? "default" : "outline"}
                onClick={() => setShowUserOnly(!showUserOnly)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{showUserOnly ? "Összes" : "Saját"}</span>
              </Button>
            </div>
          </div>

            {!showUserOnly && (
              <>
                {/* KaCsa Összejátszások */}
                {kacsaSessions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <h2 className="text-lg sm:text-xl font-semibold">KaCsa Összejátszások</h2>
                      <Badge variant="secondary" className="text-xs">
                        {kacsaSessions.length}
                      </Badge>
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                        Minden második csütörtök
                      </Badge>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {kacsaSessions.map((session, index) => (
                          <div
                            key={session.id}
                            className="animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ShootingGridCard session={session} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {kacsaSessions.map((session, index) => (
                          <div
                            key={session.id}
                            className="animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ShootingListItem session={session} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Esemény Forgatások */}
                {eventSessions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Music className="h-5 w-5 text-purple-400" />
                      <h2 className="text-lg sm:text-xl font-semibold">Esemény Forgatások</h2>
                      <Badge variant="secondary" className="text-xs">
                        {eventSessions.length}
                      </Badge>
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                        Független események
                      </Badge>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {eventSessions.map((session, index) => (
                          <div
                            key={session.id}
                            className="animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ShootingGridCard session={session} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {eventSessions.map((session, index) => (
                          <div
                            key={session.id}
                            className="animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ShootingListItem session={session} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Rendes Forgatások */}
                {normalSessions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Camera className="h-5 w-5 text-blue-400" />
                      <h2 className="text-lg sm:text-xl font-semibold">KaCsa-hoz Kapcsolódó</h2>
                      <Badge variant="secondary" className="text-xs">
                        {normalSessions.length}
                      </Badge>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {normalSessions.map((session, index) => (
                          <div
                            key={session.id}
                            className="animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ShootingGridCard session={session} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {normalSessions.map((session, index) => (
                          <div
                            key={session.id}
                            className="animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ShootingListItem session={session} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Egyéb Forgatások */}
                {egyebSessions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Camera className="h-5 w-5 text-slate-400" />
                      <h2 className="text-lg sm:text-xl font-semibold">Egyéb Forgatások</h2>
                      <Badge variant="secondary" className="text-xs">
                        {egyebSessions.length}
                      </Badge>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {egyebSessions.map((session, index) => (
                          <div
                            key={session.id}
                            className="animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ShootingGridCard session={session} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {egyebSessions.map((session, index) => (
                          <div
                            key={session.id}
                            className="animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ShootingListItem session={session} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Filtered View */}
            {showUserOnly && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-lg sm:text-xl font-semibold">Saját Forgatások</h2>
                  <Badge variant="secondary" className="text-xs">
                    {filteredSessions.length}
                  </Badge>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredSessions.map((session, index) => (
                      <div
                        key={session.id}
                        className="animate-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ShootingGridCard session={session} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSessions.map((session, index) => (
                      <div
                        key={session.id}
                        className="animate-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ShootingListItem session={session} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
      </StandardizedLayout>
    </ApiErrorBoundary>
  )
}
