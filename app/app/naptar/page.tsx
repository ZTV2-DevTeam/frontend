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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
  import Link from "next/link"
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
  Grid3X3,
  List,
  Loader2,
  ArrowLeft,
  Phone,
  Mail,
  Wrench,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { useApiQuery } from "@/lib/api-helpers"
import { ForgatSchema, EquipmentSchema, EquipmentOverviewSchema } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { ApiError } from "@/components/api-error"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { hu } from "date-fns/locale"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<"month" | "list">("month")
  const [activeTab, setActiveTab] = useState<"general" | "equipment">("general")
  const [selectedSession, setSelectedSession] = useState<ForgatSchema | null>(null)
  const { isAuthenticated } = useAuth()

  // Fetch equipments
  const equipmentQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getEquipment() : Promise.resolve([]),
    [isAuthenticated]
  )
  const equipments = useMemo(() => Array.isArray(equipmentQuery.data) ? equipmentQuery.data : [], [equipmentQuery.data])

  const equipmentOverviewQuery = useApiQuery(
    () => (isAuthenticated && activeTab === "equipment" && selectedDate) 
      ? apiClient.getEquipmentOverview(format(selectedDate, 'yyyy-MM-dd')) 
      : Promise.resolve([]),
    [isAuthenticated, activeTab, selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null]
  )
  const equipmentOverview = useMemo(() => Array.isArray(equipmentOverviewQuery.data) ? equipmentOverviewQuery.data as EquipmentOverviewSchema[] : [], [equipmentOverviewQuery.data])

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
      type: session.type || "filming",
      status: "scheduled",
      description: session.description || "",
      organizer: session.contact_person?.name || "Nem megadott",
      participants: session.equipment_count || 0,
      typeDisplay: session.type_display || "Forgatás",
      rawData: session
    }))
  }, [sessions])

  const filteredSessions = filmingSessions

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
    if (!filteredSessions || filteredSessions.length === 0) {
      return []
    }
    const dayString = format(day, 'yyyy-MM-dd')
    return filteredSessions.filter(event => event.date === dayString)
  }

  // Get events for selected day
  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : []

  // Get upcoming events for list view
  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = useMemo(() => {
    if (!filteredSessions || filteredSessions.length === 0) {
      return []
    }
    return filteredSessions
      .filter(event => event.date && event.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filteredSessions, today])

  const getEventIcon = () => {
    return <Video className="h-4 w-4" />
  }

  const getEventBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'kacsa':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rendezveny':
      case 'rendezvény':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'egyeb':
      case 'egyéb':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        // Default to blue for "forgatás" and other types
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
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
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Naptár</h1>
                <p className="text-base text-muted-foreground">
                  Forgások és események kezelése • {filteredSessions.length} összesen
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

          <Tabs value={activeTab} onValueChange={(v) => {
            setActiveTab(v as "general" | "equipment")
            if (v === "equipment" && !selectedDate) setSelectedDate(new Date())
          }} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="general">Események</TabsTrigger>
                <TabsTrigger value="equipment">Felszerelés naptár</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          {activeTab === "equipment" ? (
          <div className="space-y-4">
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
                        </div>

                        {/* Event indicators (to show equipment usage) */}
                        <div className="space-y-0.5 sm:space-y-1 mt-1">
                          {(() => {
                            const bookedEqList = equipments.filter(eq => 
                              dayEvents.some(evt => (evt.rawData as any)?.equipment_ids?.includes(eq.id))
                            );
                            
                            if (bookedEqList.length === 0) return null;
                            
                            return (
                              <>
                                {/* Mobile: simple dots */}
                                <div className="flex sm:hidden gap-0.5 flex-wrap">
                                  {bookedEqList.slice(0, 6).map((eq) => (
                                    <div
                                      key={eq.id}
                                      className="w-1.5 h-1.5 rounded-full bg-amber-500/80"
                                    />
                                  ))}
                                  {bookedEqList.length > 6 && (
                                    <span className="text-[9px] text-muted-foreground ml-0.5 leading-none">+{bookedEqList.length - 6}</span>
                                  )}
                                </div>
                                
                                {/* Desktop: equipment badges or names */}
                                <div className="hidden sm:flex flex-col gap-0.5 mt-1 overflow-hidden">
                                  {bookedEqList.slice(0, 4).map((eq) => (
                                    <div 
                                      key={eq.id} 
                                      className="truncate text-[10px] 2xl:text-xs px-1 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50 w-full"
                                      title={eq.nickname}
                                    >
                                      {(eq as any).nickname || 'Eszköz'}
                                    </div>
                                  ))}
                                  {bookedEqList.length > 4 && (
                                    <div className="text-[10px] text-muted-foreground text-center font-medium mt-0.5 border-t border-muted pt-0.5">
                                      +{bookedEqList.length - 4} további
                                    </div>
                                  )}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Equipment Daily Overview Grid */}
            {selectedDate && (
              <Card className="border-t-4 border-t-primary/20 shadow-md">
                <CardHeader className="pb-3 border-b bg-muted/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl">
                        {format(selectedDate, 'yyyy. MMMM dd.', { locale: hu })}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Felszerelések napi foglalási állapota
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {equipmentOverviewQuery.loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Betöltés...</span>
                    </div>
                  ) : equipmentOverviewQuery.error ? (
                    <div className="p-4 text-center text-destructive bg-destructive/10 rounded-lg">
                      Hiba történt a felszerelések betöltésekor.
                    </div>
                  ) : equipmentOverview.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground border rounded-lg bg-muted/5">
                      Nincsenek felszerelések a rendszerben.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-2">
                      {equipmentOverview.map((item) => (
                        <div 
                          key={item.equipment_id} 
                          className={`p-4 border rounded-lg transition-colors flex flex-col h-full ${
                            !item.functional ? 'bg-destructive/5 border-destructive/20 shadow-sm' : 
                            item.available_periods && item.bookings.length === 0 ? 'bg-emerald-500/5 border-emerald-500/20 shadow-sm' : 
                            'bg-amber-500/5 border-amber-500/20 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg shrink-0 ${
                                !item.functional ? 'bg-destructive/10 text-destructive' : 
                                item.available_periods && item.bookings.length === 0 ? 'bg-emerald-500/10 text-emerald-600' : 
                                'bg-amber-500/10 text-amber-600'
                              }`}>
                                <Wrench className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 pr-2">
                                <h3 className="font-semibold truncate text-sm sm:text-base">{item.equipment_name}</h3>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  <Badge variant="outline" className="text-[10px] h-[18px] px-1.5 font-normal bg-background/50">
                                    {item.equipment_type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                            {!item.functional ? (
                              <Badge variant="destructive" className="flex items-center gap-1 text-[10px] sm:text-xs">
                                <XCircle className="h-3 w-3" />
                                Hibás
                              </Badge>
                            ) : item.available_periods && item.bookings.length === 0 ? (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center gap-1 text-[10px] sm:text-xs">
                                <CheckCircle2 className="h-3 w-3" />
                                Szabad
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 text-[10px] sm:text-xs">
                                Foglalt
                              </Badge>
                            )}
                            </div>
                          </div>

                          <div className="mt-auto pt-3 flex-1 flex flex-col justify-end">
                            {item.bookings && item.bookings.length > 0 ? (
                              <div className="space-y-2">
                                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70 mb-1 border-t pt-2">Foglalások</div>
                                {item.bookings.map((booking, idx) => (
                                  <div key={`${booking.forgatas_id}-${idx}`} className="flex flex-col text-sm p-2.5 bg-background border rounded-md shadow-sm gap-2">
                                    <div className="font-medium text-sm leading-tight">
                                      {booking.forgatas_name}
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground text-xs">
                                      <span className="flex items-center gap-1 min-w-0 pr-2">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{booking.location || 'Ismeretlen'}</span>
                                      </span>
                                      <span className="flex items-center gap-1 font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] sm:text-xs shrink-0 whitespace-nowrap">
                                        <Clock className="h-3 w-3" />
                                        {formatTime(booking.time_from)}-{formatTime(booking.time_to)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              item.functional && (
                                <div className="py-3 text-center border-t border-dashed">
                                  <span className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/70" />
                                    Nincs foglalás ezen a napon
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          ) : (
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
                                  {dayEvents.slice(0, 4).map((event) => {
                                    const getEventDotColor = (type: string) => {
                                      switch (type?.toLowerCase()) {
                                        case 'kacsa':
                                          return 'bg-yellow-500'
                                        case 'rendezveny':
                                        case 'rendezvény':
                                          return 'bg-purple-500'
                                        case 'egyeb':
                                        case 'egyéb':
                                          return 'bg-gray-500'
                                        default:
                                          return 'bg-blue-500'
                                      }
                                    }
                                    
                                    return (
                                      <div
                                        key={event.id}
                                        className={`w-1.5 h-1.5 rounded-full cursor-pointer ${getEventDotColor(event.type)}`}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedSession(event.rawData)
                                        }}
                                      />
                                    )
                                  })}
                                  {dayEvents.length > 4 && (
                                    <span className="text-xs text-muted-foreground ml-1">+</span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Desktop: Show event cards */}
                            <div className="hidden sm:block">
                              {dayEvents.slice(0, 3).map((event, eventIndex) => {
                                const getEventCardColor = (type: string) => {
                                  switch (type?.toLowerCase()) {
                                    case 'kacsa':
                                      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-300 dark:hover:bg-yellow-900/70 dark:bg-yellow-900/40 dark:text-yellow-300'
                                    case 'rendezveny':
                                    case 'rendezvény':
                                      return 'bg-purple-100 text-purple-800 hover:bg-purple-300 dark:hover:bg-purple-900/70 dark:bg-purple-900/40 dark:text-purple-300'
                                    case 'egyeb':
                                    case 'egyéb':
                                      return 'bg-gray-100 text-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900/70 dark:bg-gray-900/40 dark:text-gray-300'
                                    default:
                                      return 'bg-blue-100 text-blue-800 hover:bg-blue-300 dark:hover:bg-blue-900/70 dark:bg-blue-900/40 dark:text-blue-300'
                                  }
                                }
                                
                                return (
                                  <div
                                    key={event.id}
                                    className={`
                                      text-xs px-2 py-1 rounded-sm cursor-pointer transition-colors
                                      ${getEventCardColor(event.type)}
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
                                )
                              })}
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
                  <CardTitle>Közelgő események</CardTitle>
                  <CardDescription>
                    A következő események időrendi sorrendben
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nincsenek közelgő események.
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
                                {getEventIcon()}
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
                                {getEventIcon()}
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
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
