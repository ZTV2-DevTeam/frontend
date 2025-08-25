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
  AlertCircle
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white">Forgatási Naptár</h1>
                <p className="text-muted-foreground">
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
              {/* <Button>
                <Plus className="h-4 w-4 mr-2" />
                Új forgatás
              </Button> */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar or List View */}
            <div className="lg:col-span-3">
              {viewMode === "month" ? (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {format(currentDate, 'MMMM yyyy', { locale: hu })}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={goToToday}>
                          Ma
                        </Button>
                        <Button variant="outline" size="sm" onClick={previousMonth}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={nextMonth}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day) => {
                        const dayEvents = getEventsForDay(day)
                        const isCurrentMonth = isSameMonth(day, currentDate)
                        const isToday = isSameDay(day, new Date())
                        const isSelected = selectedDate && isSameDay(day, selectedDate)
                        
                        return (
                          <div
                            key={day.toISOString()}
                            className={`
                              min-h-[100px] p-1 border border-border/20 cursor-pointer transition-colors
                              ${isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                              ${isToday ? 'bg-primary/5 border-primary/30' : ''}
                              ${isSelected ? 'bg-primary/10 border-primary' : ''}
                              hover:bg-muted/50
                            `}
                            onClick={() => setSelectedDate(day)}
                          >
                            <div className={`
                              text-sm font-medium mb-1
                              ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                              ${isToday ? 'text-primary font-bold' : ''}
                            `}>
                              {format(day, 'd')}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map((event) => (
                                <div
                                  key={event.id}
                                  className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                                  title={`${event.title} - ${event.time}`}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{dayEvents.length - 2} további
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Közelgő forgások</CardTitle>
                    <CardDescription>
                      A következő forgások időrendi sorrendben
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Nincsenek közelgő forgások.
                        </div>
                      ) : (
                        upcomingEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                {getEventIcon(event.type)}
                              </div>
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {event.description.substring(0, 100)}
                                  {event.description.length > 100 ? '...' : ''}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {event.time}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {event.participants} eszköz
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={`text-xs ${getEventBadgeColor(event.type)}`}>
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
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Selected Day Details */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate ? format(selectedDate, 'MMMM d., yyyy', { locale: hu }) : 'Válassz napot'}
                  </CardTitle>
                  <CardDescription>
                    {selectedDate ? 
                      `${selectedDayEvents.length} forgatás` : 
                      'Kattints egy napra a részletekért'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate && selectedDayEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDayEvents.map((event) => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm mb-2">{event.title}</div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              {event.participants} eszköz
                            </div>
                          </div>
                          {event.description && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              {event.description}
                            </div>
                          )}
                          <Badge className={`mt-2 text-xs ${getEventBadgeColor(event.type)}`}>
                            {event.typeDisplay}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : selectedDate ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Nincs forgatás ezen a napon.
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Válassz egy napot a naptárból a forgások megtekintéséhez.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
