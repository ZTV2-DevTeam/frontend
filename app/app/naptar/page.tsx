"use client"

import { useState, useMemo } from "react"
import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
  import Link from "next/link"
import { 
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
  Camera,
  Star,
  Music,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  X,
  ArrowLeft,
  Phone,
  Mail
} from "lucide-react"
import { useApiQuery } from "@/lib/api-helpers"
import { ForgatSchema } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { ApiError } from "@/components/api-error"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, startOfWeek, endOfWeek } from "date-fns"
import { hu } from "date-fns/locale"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<"month" | "list">("month")
  const [selectedSession, setSelectedSession] = useState<ForgatSchema | null>(null)
  const { isAuthenticated } = useAuth()
  
  // Fetch filming sessions data - same approach as forgatasok page
  const filmingQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingSessions() : Promise.resolve([]),
    [isAuthenticated]
  )

  const { data: filmingData = [], loading: filmingLoading, error: filmingError } = filmingQuery

  // Computed values - ensure we have a safe array to work with
  const sessions = useMemo(() => Array.isArray(filmingData) ? filmingData : [], [filmingData])

  // Transform API data into calendar events
  const filmingSessions = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return []
    }
    return sessions.map((session: ForgatSchema) => ({
      id: `filming-${session.id}`,
      title: session.name || "Névtelen forgatás",
      date: session.date || "",
      time: `${session.time_from || "00:00"} - ${session.time_to || "00:00"}`,
      location: session.location?.name || "Nem megadott",
      type: "filming",
      status: "scheduled",
      description: session.description || "",
      organizer: session.contact_person?.name || "Nem megadott",
      participants: session.equipment_count || 0,
      typeDisplay: session.type_display || "Forgatás",
      rawData: session
    }))
  }, [sessions])

  // Calendar navigation
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Generate calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Start week on Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    if (!filmingSessions || filmingSessions.length === 0) {
      return []
    }
    const dayString = format(day, 'yyyy-MM-dd')
    return filmingSessions.filter(event => event.date === dayString)
  }

  // Get events for selected day
  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : []

  // Get upcoming events for list view
  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = useMemo(() => {
    if (!filmingSessions || filmingSessions.length === 0) {
      return []
    }
    return filmingSessions
      .filter(event => event.date && event.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filmingSessions, today])

  const getEventIcon = (type: string) => {
    return <Video className="h-4 w-4" />
  }

  const getEventBadgeColor = (type: string) => {
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  // SessionDetails component for dialog
  const SessionDetails = ({ session }: { session: ForgatSchema }) => {
    return (
      <div className="space-y-6">
        {/* Description */}
        {session.description && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">{session.description}</p>
          </div>
        )}

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">Dátum</div>
              <div className="text-sm text-muted-foreground truncate">
                {formatSessionDate(session.date)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">Időpont</div>
              <div className="text-sm text-muted-foreground truncate">
                {session.time_from && session.time_to 
                  ? `${formatTime(session.time_from)} - ${formatTime(session.time_to)}`
                  : 'Nincs megadva'
                }
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">Helyszín</div>
              <div className="text-sm text-muted-foreground truncate">
                {session.location?.name || 'Nincs megadva'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">Eszközök</div>
              <div className="text-sm text-muted-foreground">
                {session.equipment_count || 0} eszköz
              </div>
            </div>
          </div>
        </div>

        {/* Contact Person */}
        {session.contact_person && (
          <div className="space-y-3">
            <h4 className="text-base font-semibold">Kapcsolattartó</h4>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{session.contact_person.name}</span>
              </div>
              <div className="space-y-2 ml-11 text-sm text-muted-foreground">
                {session.contact_person.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{session.contact_person.phone}</span>
                  </div>
                )}
                {session.contact_person.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{session.contact_person.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Link href={`/app/forgatasok/${session.id}`} className="flex-1">
            <Button className="w-full" size="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Részletek megtekintése
            </Button>
          </Link>
        </div>
      </div>
    )
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

  const weekDays = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']

  if (filmingLoading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 space-y-4 p-4 md:p-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Betöltés...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (filmingError) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 space-y-4 p-4 md:p-6">
            <ApiError 
              error={filmingError}
              title="Hiba a forgatások betöltésekor"
              onRetry={() => window.location.reload()}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl shadow-sm">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Forgatási Naptár</h1>
                <p className="text-base text-muted-foreground">
                  Forgások és események kezelése • {filmingSessions.length} összesen
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border p-1">
                <Button
                  variant={viewMode === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                >
                  <Grid3X3 className="h-4 w-4" />
                  Hónap
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  Lista
                </Button>
              </div>
            </div>
          </div>

          {/* Google/Apple Calendar Style Layout */}
          <div className="space-y-4">
            {viewMode === "month" ? (
              <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold">
                      {format(currentDate, 'MMMM yyyy', { locale: hu })}
                    </h2>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Ma
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={previousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-background">
                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 border-b bg-muted/20">
                    {['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'].map((day) => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.slice(0, 2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7">
                    {calendarDays.map((day, index) => {
                      const dayEvents = getEventsForDay(day)
                      const isCurrentMonth = isSameMonth(day, currentDate)
                      const isToday = isSameDay(day, new Date())
                      const isSelected = selectedDate && isSameDay(day, selectedDate)
                      const isLastRow = Math.floor(index / 7) === Math.floor((calendarDays.length - 1) / 7)
                      
                      return (
                        <div
                          key={day.toISOString()}
                          className={`
                            min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-r border-b last:border-r-0 cursor-pointer transition-all
                            ${!isLastRow ? 'border-b' : ''}
                            ${isCurrentMonth ? 'bg-background hover:bg-muted/20' : 'bg-muted/10 hover:bg-muted/30'}
                            ${isToday ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
                            ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30 z-10 outline-5 scale-105 outline-blue-200 dark:outline-blue-800 rounded-xs' : ''}
                          `}
                          onClick={() => setSelectedDate(day)}
                        >
                          {/* Day Number */}
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`
                                text-xs sm:text-sm font-medium flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full
                                ${!isCurrentMonth ? 'text-muted-foreground' : 'text-foreground'}
                                ${isToday ? 'bg-blue-600 text-white font-bold' : ''}
                              `}
                            >
                              {format(day, 'd')}
                            </span>
                            {dayEvents.length > 0 && (
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                {dayEvents.length}
                              </span>
                            )}
                          </div>

                          {/* Events */}
                          <div className="space-y-0.5 sm:space-y-1">
                            {/* Mobile: Show only dots, Desktop: Show event details */}
                            <div className="sm:hidden">
                              {dayEvents.length > 0 && (
                                <div className="flex gap-0.5 flex-wrap">
                                  {dayEvents.slice(0, 4).map((event) => (
                                    <div
                                      key={event.id}
                                      className={`
                                        w-1.5 h-1.5 rounded-full cursor-pointer
                                        ${event.type === 'kacsa' 
                                          ? 'bg-yellow-500' 
                                          : event.type === 'rendezveny'
                                          ? 'bg-purple-500'
                                          : 'bg-blue-500'
                                        }
                                      `}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedSession(event.rawData)
                                      }}
                                    />
                                  ))}
                                  {dayEvents.length > 4 && (
                                    <span className="text-xs text-muted-foreground ml-1">+</span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Desktop: Show event cards */}
                            <div className="hidden sm:block">
                              {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                <div
                                  key={event.id}
                                  className={`
                                    text-xs px-2 py-1 rounded-sm cursor-pointer transition-colors
                                    ${event.type === 'kacsa' 
                                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-300 dark:hover:bg-yellow-900/70 dark:bg-yellow-900/40 dark:text-yellow-300'
                                      : event.type === 'rendezveny'
                                      ? 'bg-purple-100 text-purple-800 hover:bg-purple-300 dark:hover:bg-purple-900/70 dark:bg-purple-900/40 dark:text-purple-300'
                                      : 'bg-blue-100 text-blue-800 hover:bg-blue-300 dark:hover:bg-blue-900/70 dark:bg-blue-900/40 dark:text-blue-300'
                                    }
                                    ${eventIndex >= 2 ? 'opacity-75' : ''}
                                  `}
                                  title={`${event.title} - ${event.time}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedSession(event.rawData)
                                  }}
                                >
                                  <div className="truncate font-medium">
                                    {event.title}
                                  </div>
                                  <div className="truncate text-xs opacity-75">
                                    {(() => {
                                      const [from, to] = event.time.split(' - ')
                                      const formatShort = (t: string) => t ? t.slice(0, 5) : ''
                                      return `${formatShort(from)} - ${formatShort(to)}`
                                    })()}
                                  </div>
                                </div>
                              ))}
                              {dayEvents.length > 3 && (
                                <div 
                                  className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedDate(day)
                                  }}
                                >
                                  +{dayEvents.length - 3} további
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Közelgő forgatások</CardTitle>
                  <CardDescription>
                    A következő forgatások időrendi sorrendben
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nincsenek közelgő forgatások.
                      </div>
                    ) : (
                      upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedSession(event.rawData)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="p-1 sm:p-2 bg-primary/10 rounded flex-shrink-0">
                                {getEventIcon(event.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm sm:text-base truncate">{event.title}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {event.description.substring(0, 80)}
                                  {event.description.length > 80 ? '...' : ''}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 items-end flex-shrink-0 ml-2">
                              <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                                {event.typeDisplay}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {new Date(event.date).toLocaleDateString('hu-HU', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3 flex-shrink-0" />
                              <span>{event.participants} eszköz</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mobile Selected Day Details - Show below calendar on mobile */}
            {selectedDate && (
              <Card className="sm:hidden">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'MMMM d., yyyy', { locale: hu })}
                  </CardTitle>
                  <CardDescription>
                    {selectedDayEvents.length} forgatás ezen a napon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDayEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDayEvents.map((event) => (
                        <div 
                          key={event.id} 
                          className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedSession(event.rawData)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-primary/10 rounded">
                                {getEventIcon(event.type)}
                              </div>
                              <div className="font-medium text-sm">{event.title}</div>
                            </div>
                            <Badge className={`text-xs ${getEventBadgeColor(event.type)}`}>
                              {event.typeDisplay}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              <span>{event.participants} eszköz</span>
                            </div>
                          </div>
                          
                          {event.description && (
                            <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
                              {event.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Nincs forgatás ezen a napon.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Filming Session Detail Dialog */}
            <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-lg sm:text-xl">
                    {selectedSession?.name || "Forgatás részletei"}
                  </DialogTitle>
                </DialogHeader>
                
                {selectedSession && <SessionDetails session={selectedSession} />}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
