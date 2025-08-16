"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { ForgatSchema } from "@/lib/types"
import { ApiErrorBoundary } from "@/components/api-error-boundary"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Star, Filter, Grid3X3, List, Music, Camera, Eye, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { hu } from "date-fns/locale"

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
  
  // API queries
  const filmingQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingSessions() : Promise.resolve([]),
    [isAuthenticated]
  )

  const { data: filmingData = [], loading, error } = filmingQuery

  // Computed values
  const sessions = useMemo(() => Array.isArray(filmingData) ? filmingData : [], [filmingData])

  // Filter sessions by user involvement if needed
  const filteredSessions = useMemo(() => {
    if (!showUserOnly) return sessions
    // TODO: Add logic to filter by user involvement
    return sessions
  }, [sessions, showUserOnly])

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

    return (
      <Link href={`/app/forgatasok/${session.id}`} className="block">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full">
          <CardContent className="p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <TypeIcon
                className={`h-5 w-5 flex-shrink-0 ${
                  session.type === "kacsa"
                    ? "text-yellow-400 fill-yellow-400"
                    : session.type === "rendezveny"
                      ? "text-purple-400"
                      : "text-blue-400"
                }`}
              />
              <div className="flex flex-col gap-1 items-end">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0">
                  Aktív
                </Badge>
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
                  <span>{session.equipment_count || 0} eszköz</span>
                </div>
              </div>
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

    return (
      <Link href={`/app/forgatasok/${session.id}`} className="block">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:scale-[1.01] cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <TypeIcon
                className={`h-5 w-5 flex-shrink-0 ${
                  session.type === "kacsa"
                    ? "text-yellow-400 fill-yellow-400"
                    : session.type === "rendezveny"
                      ? "text-purple-400"
                      : "text-blue-400"
                }`}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{session.name}</h3>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                    <span>{session.equipment_count || 0} eszköz</span>
                  </span>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-1">Aktív</Badge>
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
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Forgatások betöltése...
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Error state
  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center py-12 text-destructive">
            <AlertCircle className="h-6 w-6 mr-2" />
            Hiba a forgatások betöltésekor: {error}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <ApiErrorBoundary fallback={ApiErrorFallback}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          
          <div className="flex-1 space-y-6 p-4 md:p-6 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Forgatások
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filteredSessions.length} forgatás • KaCsa: {kacsaSessions.length} • Egyéb: {normalSessions.length} •
                  Események: {eventSessions.length} • Egyéb: {egyebSessions.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
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
                {/* KaCsa Forgatások */}
                {kacsaSessions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <h2 className="text-lg sm:text-xl font-semibold">KaCsa Forgatások</h2>
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
        </SidebarInset>
      </SidebarProvider>
    </ApiErrorBoundary>
  )
}
