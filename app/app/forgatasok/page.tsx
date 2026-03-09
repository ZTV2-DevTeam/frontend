"use client"

import { useState, useMemo, useCallback } from "react"
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
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Filter, 
  Grid3X3, 
  List, 
  Camera, 
  Eye, 
  AlertCircle, 
  Plus, 
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Type,
  Calendar as CalendarSort,
  CalendarDays
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format } from "date-fns"
import { hu } from "date-fns/locale"

import { usePermissions } from "@/contexts/permissions-context"
import { StabBadge } from "@/components/stab-badge"
import { ForgatásokLoading } from "@/components/forgatasok-loading"

// Date helper for better formatting
const formatSessionDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return format(date, 'yyyy. MMMM dd. (EEEE)', { locale: hu })
  } catch {
    return dateStr
  }
}

type CrewMember = {
  id: number
  name: string
  role: string
  class: string
  team?: 'A' | 'B'
}

type SortOption = 'type' | 'date' | 'name' | 'relevance'

export default function FilmingSessionsPage() {
  // State hooks
  const [showUserOnly, setShowUserOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [showPastEvents, setShowPastEvents] = useState(false)

  
  // Context hooks
  const { user, isAuthenticated } = useAuth()
  const { hasPermission } = usePermissions()

  // Format time to remove seconds (HH:MM:SS -> HH:MM)
  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':')
      return `${hours}:${minutes}`
    } catch {
      return timeStr
    }
  }
  
  // API queries - fetch optimized data with all relations in one call
  const filmingQuery = useApiQuery(
    () => {
      if (!isAuthenticated) return Promise.resolve([])
      
      // Use optimized endpoint that returns sessions with assignments, equipment, and users
      return apiClient.getFilmingSessionsOptimized(undefined, undefined, 'rendes')
    },
    [isAuthenticated]
  )

  const { data: filmingData = [], loading, error } = filmingQuery

  // Computed values - data already includes all related information
  const sessions = useMemo(() => Array.isArray(filmingData) ? filmingData : [], [filmingData])

  // Permission check - use can_create_forgatas permission
  const canCreateForgatás = hasPermission('can_create_forgatas')

  // Create a map of assignments by filming session ID for quick lookup
  const assignmentMap = useMemo(() => {
    const map = new Map<number, any>()
    sessions.forEach((session: any) => {
      if (session.assignment) {
        map.set(session.id, session.assignment)
      }
    })
    return map
  }, [sessions])

  // Helper functions
  const getSessionAssignment = useCallback((sessionId: number): any => {
    return assignmentMap.get(sessionId)
  }, [assignmentMap])

  const isUserInvolvedInSession = useCallback((sessionId: number): boolean => {
    if (!user) return false
    const assignment = getSessionAssignment(sessionId)
    if (!assignment) return false
    
    return assignment.assigned_users?.some((assignedUser: any) => assignedUser.id === user.user_id) || false
  }, [user, getSessionAssignment])

  const isSessionLive = useCallback((sessionId: number): boolean => {
    const session = sessions.find((s: any) => s.id === sessionId)
    const assignment = getSessionAssignment(sessionId)
    if (!assignment || !session) return false
    
    // Only finalized sessions can be live
    if (!assignment.finalized) return false
    
    const now = new Date()
    const sessionDate = new Date(session.date)
    
    // Check if it's the same date
    const isToday = sessionDate.toDateString() === now.toDateString()
    if (!isToday) return false
    
    // Check if the session is currently happening (between start and end time)
    if (session.time_from && session.time_to) {
      const [startHour, startMin] = session.time_from.split(':').map(Number)
      const [endHour, endMin] = session.time_to.split(':').map(Number)
      
      const startTime = new Date(sessionDate)
      startTime.setHours(startHour, startMin, 0, 0)
      
      const endTime = new Date(sessionDate)
      endTime.setHours(endHour, endMin, 0, 0)
      
      // Session is live if current time is between start and end
      return now >= startTime && now <= endTime
    }
    
    // If no time specified, consider it live all day if it's today and finalized
    return true
  }, [sessions, getSessionAssignment])

  const getSessionCrewData = useCallback((sessionId: number) => {
    const assignment = getSessionAssignment(sessionId)
    if (!assignment) return { count: 0, roles: [], crewMembers: [], assignmentStab: null }
    
    return {
      count: assignment.student_count || 0,
      roles: assignment.roles_summary || [],
      assignmentStab: assignment.stab || null,
      crewMembers: ((assignment as any).assigned_users || []).map((assignedUser: any) => ({
        id: assignedUser.id,
        name: assignedUser.full_name,
        role: assignedUser.role?.name,
        class: assignedUser.profile?.osztaly_name || assignedUser.username?.match(/^(\d{1,2}[a-zA-Z]+)_/)?.[1]?.toUpperCase() || 'Osztály nincs megadva',
        team: assignedUser.username?.includes('a') ? 'A' : assignedUser.username?.includes('b') ? 'B' : undefined
      }))
    }
  }, [getSessionAssignment])

  const getSessionEquipmentData = useCallback((session: any) => {
    // Equipment details are already included in the optimized response
    return session.equipment_details || []
  }, [])

  // Helper function to check if an event is in the past
  const isEventPast = useCallback((dateStr: string): boolean => {
    const eventDate = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day for comparison
    return eventDate < today
  }, [])

  // Sorting functions - moved to useMemo to prevent dependency issues
  const sortSessions = useMemo(() => {
    return (sessions: ForgatSchema[], sortBy: SortOption): ForgatSchema[] => {
      const sorted = [...sessions]
      switch (sortBy) {
        case 'date':
          return sorted.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA.getTime() - dateB.getTime() // Earliest first (upcoming events)
          })
        case 'name':
          return sorted.sort((a, b) => a.name.localeCompare(b.name, 'hu'))
        case 'relevance':
          return sorted.sort((a, b) => {
            // Sort by past/future first
            const isPastA = isEventPast(a.date)
            const isPastB = isEventPast(b.date)
            if (isPastA !== isPastB) {
              return isPastA ? 1 : -1 // Future events first
            }
            
            // Then sort by user involvement
            const userInvolvedA = isUserInvolvedInSession(a.id) ? 1 : 0
            const userInvolvedB = isUserInvolvedInSession(b.id) ? 1 : 0
            if (userInvolvedA !== userInvolvedB) {
              return userInvolvedB - userInvolvedA
            }
            
            // Finally by date (earliest first for future, latest first for past)
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return isPastA ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
          })
        case 'type':
        default:
          // Keep original type grouping - no sorting needed here
          return sessions
      }
    }
  }, [isUserInvolvedInSession, isEventPast])

  // Filter sessions by user involvement (only rendes type fetched by API)
  const filteredSessions = useMemo(() => {
    // Start with sessions (already filtered to rendes only by API)
    let filtered = sessions
    
    // Filter by user involvement if needed
    if (showUserOnly) {
      filtered = filtered.filter(session => isUserInvolvedInSession(session.id))
    }
    
    // Apply sorting
    if (sortBy !== 'type') {
      filtered = sortSessions(filtered, sortBy)
    }
    
    return filtered
  }, [sessions, showUserOnly, sortBy, sortSessions, isUserInvolvedInSession])

  // Separate current and past events for relevance view
  const { currentSessions, pastSessions } = useMemo(() => {
    if (sortBy !== 'relevance') {
      return { currentSessions: filteredSessions, pastSessions: [] }
    }
    
    const current: ForgatSchema[] = []
    const past: ForgatSchema[] = []
    
    filteredSessions.forEach(session => {
      if (isEventPast(session.date)) {
        past.push(session)
      } else {
        current.push(session)
      }
    })
    
    return { currentSessions: current, pastSessions: past }
  }, [filteredSessions, sortBy, isEventPast])

  // Group sessions by type (only used when sortBy === 'type')
  const kacsaSessions = useMemo(() => {
    const filtered = filteredSessions.filter((s: ForgatSchema) => s.type === "kacsa")
    return sortBy === 'type' ? filtered : sortSessions(filtered, sortBy)
  }, [filteredSessions, sortBy, sortSessions])
  
  const normalSessions = useMemo(() => {
    const filtered = filteredSessions.filter((s: ForgatSchema) => s.type === "rendes")
    return sortBy === 'type' ? filtered : sortSessions(filtered, sortBy)
  }, [filteredSessions, sortBy, sortSessions])

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
                  <span className="truncate">
                    {formatSessionDate(session.date)}
                    {session.time_from && session.time_to && (
                      <span className="ml-2 font-medium">
                        {formatTime(session.time_from)} - {formatTime(session.time_to)}
                      </span>
                    )}
                  </span>
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
                  <div className="text-xs font-medium text-muted-foreground">Stáb ({crewData.count} fő):</div>
                  <div className="space-y-1">
                    {crewData.crewMembers.slice(0, 4).map((member: CrewMember) => (
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
                    {crewData.crewMembers.length > 4 && (
                      <div className="text-xs text-muted-foreground">+{crewData.crewMembers.length - 4} további</div>
                    )}
                  </div>
                </div>
              )}

              {/* Equipment Preview */}
              {(() => {
                const equipmentData = getSessionEquipmentData(session)
                return equipmentData.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {equipmentData.slice(0, 6).map((equipment: any) => (
                      <Badge
                        key={equipment.id}
                        variant="outline"
                        className="text-xs px-2 py-1 bg-orange-500/10 text-orange-400 border-orange-500/30"
                      >
                        {equipment.emoji} {equipment.name}
                      </Badge>
                    ))}
                    {equipmentData.length > 6 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 bg-gray-500/10 text-gray-400 border-gray-500/30"
                      >
                        +{equipmentData.length - 6}
                      </Badge>
                    )}
                  </div>
                )
              })()}
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
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <TypeIcon
                  className={`h-5 w-5 flex-shrink-0 ${
                    session.type === "kacsa"
                      ? "text-yellow-400 fill-yellow-400"
                      : session.type === "rendezveny"
                        ? "text-purple-400"
                        : "text-blue-400"
                  }`}
                />
              </div>

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
                      <span className="truncate">
                        {formatSessionDate(session.date)}
                        {session.time_from && session.time_to && (
                          <span className="ml-2 font-medium">
                            {formatTime(session.time_from)} - {formatTime(session.time_to)}
                          </span>
                        )}
                      </span>
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
                      {crewData.crewMembers.slice(0, 4).map((member: CrewMember, index: number) => (
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
                    
                    {/* Equipment section for list view */}
                    {(() => {
                      const equipmentData = getSessionEquipmentData(session)
                      return equipmentData.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1.5">
                            {equipmentData.slice(0, 8).map((equipment: any) => (
                              <Badge
                                key={equipment.id}
                                variant="outline"
                                className="text-xs px-2 py-1 bg-orange-500/10 text-orange-400 border-orange-500/30"
                              >
                                {equipment.emoji} {equipment.name}
                              </Badge>
                            ))}
                            {equipmentData.length > 8 && (
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-1 bg-gray-500/10 text-gray-400 border-gray-500/30"
                              >
                                +{equipmentData.length - 8}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })()}
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
        <ForgatásokLoading
          sessionCount={sessions.length}
          variant="detailed"
        />
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
              <div className="p-3 bg-blue-500 rounded-xl shadow-sm">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Forgatások</h1>
                <p className="text-base text-muted-foreground">
                  {filteredSessions.length} forgatás • KaCsa: {kacsaSessions.length} • Rendes: {normalSessions.length} • Fő produkciós folyamat
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

              {/* Sort Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="hidden sm:inline">Rendezés</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Rendezés módja</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSortBy('type')}
                    className={sortBy === 'type' ? 'bg-accent' : ''}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Típus szerint
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('date')}
                    className={sortBy === 'date' ? 'bg-accent' : ''}
                  >
                    <CalendarSort className="h-4 w-4 mr-2" />
                    Dátum szerint
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('name')}
                    className={sortBy === 'name' ? 'bg-accent' : ''}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Név szerint
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('relevance')}
                    className={sortBy === 'relevance' ? 'bg-accent' : ''}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Relevancia szerint
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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

            {!showUserOnly && sortBy === 'type' && (
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


              </>
            )}

            {/* Non-Type Sorted View */}
            {!showUserOnly && sortBy !== 'type' && sortBy !== 'relevance' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <ArrowUpDown className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Forgatások - {
                      sortBy === 'date' ? 'Dátum szerint' :
                      sortBy === 'name' ? 'Név szerint' :
                      'Rendezve'
                    }
                  </h2>
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

            {/* Relevance View with Past Events Separation */}
            {!showUserOnly && sortBy === 'relevance' && (
              <div className="space-y-6">
                {/* Current Events */}
                {currentSessions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Star className="h-5 w-5 text-green-400 fill-green-400" />
                      <h2 className="text-lg sm:text-xl font-semibold">Aktuális & Jövőbeli Forgatások</h2>
                      <Badge variant="secondary" className="text-xs">
                        {currentSessions.length}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                        Relevancia szerint
                      </Badge>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {currentSessions.map((session, index) => (
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
                        {currentSessions.map((session, index) => (
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

                {/* Past Events - Collapsible */}
                {pastSessions.length > 0 && (
                  <div className="space-y-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPastEvents(!showPastEvents)}
                      className="flex items-center gap-2 h-auto p-3 w-full justify-start bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {showPastEvents ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg sm:text-xl font-semibold">Elmúlt Forgatások</h2>
                        <Badge variant="secondary" className="text-xs">
                          {pastSessions.length}
                        </Badge>
                      </div>
                    </Button>

                    {showPastEvents && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        {viewMode === "grid" ? (
                          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 opacity-70">
                            {pastSessions.map((session, index) => (
                              <div
                                key={session.id}
                                className="animate-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <ShootingGridCard session={session} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3 opacity-70">
                            {pastSessions.map((session, index) => (
                              <div
                                key={session.id}
                                className="animate-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <ShootingListItem session={session} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Filtered View */}
            {showUserOnly && sortBy !== 'relevance' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Saját Forgatások - {
                      sortBy === 'type' ? 'Típus szerint' :
                      sortBy === 'date' ? 'Dátum szerint' :
                      sortBy === 'name' ? 'Név szerint' :
                      'Rendezve'
                    }
                  </h2>
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

            {/* Personal Relevance View with Past Events Separation */}
            {showUserOnly && sortBy === 'relevance' && (
              <div className="space-y-6">
                {/* Current Personal Events */}
                {currentSessions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <h2 className="text-lg sm:text-xl font-semibold">Saját Aktuális Forgatások</h2>
                      <Badge variant="secondary" className="text-xs">
                        {currentSessions.length}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                        Relevancia szerint
                      </Badge>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {currentSessions.map((session, index) => (
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
                        {currentSessions.map((session, index) => (
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

                {/* Past Personal Events - Collapsible */}
                {pastSessions.length > 0 && (
                  <div className="space-y-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPastEvents(!showPastEvents)}
                      className="flex items-center gap-2 h-auto p-3 w-full justify-start bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {showPastEvents ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg sm:text-xl font-semibold">Saját Elmúlt Forgatások</h2>
                        <Badge variant="secondary" className="text-xs">
                          {pastSessions.length}
                        </Badge>
                      </div>
                    </Button>

                    {showPastEvents && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        {viewMode === "grid" ? (
                          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 opacity-70">
                            {pastSessions.map((session, index) => (
                              <div
                                key={session.id}
                                className="animate-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <ShootingGridCard session={session} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3 opacity-70">
                            {pastSessions.map((session, index) => (
                              <div
                                key={session.id}
                                className="animate-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <ShootingListItem session={session} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
      </StandardizedLayout>
    </ApiErrorBoundary>
  )
}
