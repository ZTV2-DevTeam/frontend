"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Megaphone,
  AlertCircle,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CalendarDays,
  List,
  Grid3x3
} from "lucide-react"

// Mock data for calendar events
const mockEvents = [
  {
    id: 1,
    title: "Évkönyv fotózás - 12. osztály",
    date: "2025-01-15",
    time: "09:00 - 15:00",
    location: "Tornaterem",
    type: "photography",
    status: "scheduled",
    participants: 24,
    crew: "A",
    description: "Érettségiző diákok évkönyv fotózása. Minden diák egyéni és csoportos képeket készít.",
    organizer: "Nagy Péter",
    equipment: ["Canon EOS R5", "Stúdió világítás", "Háttérszövet"]
  },
  {
    id: 2,
    title: "UNESCO Műsor - ÉLŐ közvetítés",
    date: "2025-01-16",
    time: "14:00 - 17:00",
    location: "Körösi Kulturális Központ",
    type: "live",
    status: "confirmed",
    participants: 12,
    crew: "A",
    description: "Élő közvetítés az UNESCO világnap alkalmából rendezett kulturális műsorról.",
    organizer: "Kiss Anna",
    equipment: ["4K kamerák", "Streaming eszközök", "Mikrofon szett"]
  },
  {
    id: 3,
    title: "BRFK Sportnap felvétel",
    date: "2025-01-18",
    time: "08:30 - 16:00",
    location: "Vörösmarty Mihály Gimnázium",
    type: "event",
    status: "scheduled",
    participants: 18,
    crew: "B",
    description: "Budapesti rendőrség sportnapjának dokumentálása és videó készítés.",
    organizer: "Szabó János",
    equipment: ["Mobil kamerák", "Drón", "Mikrofon készlet"]
  },
  {
    id: 4,
    title: "Jazz koncert - Magyar Zene Háza",
    date: "2025-01-20",
    time: "19:00 - 22:00",
    location: "Magyar Zene Háza - Városliget",
    type: "concert",
    status: "pending",
    participants: 15,
    crew: "A",
    description: "Kőbányai diákok jazz koncertjének felvétele és utómunka.",
    organizer: "Tóth Mária",
    equipment: ["Koncert kamerák", "Audio interface", "Tripodok"]
  },
  {
    id: 5,
    title: "Téli szünet előtti összefoglaló",
    date: "2025-01-22",
    time: "10:00 - 12:00",
    location: "Média terem",
    type: "meeting",
    status: "scheduled",
    participants: 45,
    crew: "Mind",
    description: "Féléves munka értékelése és következő félév tervezése.",
    organizer: "Dr. Kovács János",
    equipment: ["Projektor", "Laptopok"]
  },
  {
    id: 6,
    title: "Iskolai bemutató videó",
    date: "2025-01-25",
    time: "13:00 - 16:00",
    location: "Iskola területe",
    type: "video",
    status: "scheduled",
    participants: 20,
    crew: "B",
    description: "Promóciós videó készítése az iskola bemutatásához.",
    organizer: "Kovács Eszter",
    equipment: ["DSLR kamerák", "Stabilizátor", "Világítás"]
  }
]

const getEventTypeInfo = (type: string) => {
  switch (type) {
    case 'photography':
      return { color: 'bg-blue-500', icon: Camera, label: 'Fotózás', textColor: 'text-blue-700' }
    case 'live':
      return { color: 'bg-red-500', icon: Megaphone, label: 'Élő', textColor: 'text-red-700' }
    case 'event':
      return { color: 'bg-green-500', icon: Video, label: 'Esemény', textColor: 'text-green-700' }
    case 'concert':
      return { color: 'bg-purple-500', icon: Video, label: 'Koncert', textColor: 'text-purple-700' }
    case 'meeting':
      return { color: 'bg-orange-500', icon: Users, label: 'Megbeszélés', textColor: 'text-orange-700' }
    case 'video':
      return { color: 'bg-indigo-500', icon: Video, label: 'Videó', textColor: 'text-indigo-700' }
    default:
      return { color: 'bg-gray-500', icon: Calendar, label: 'Általános', textColor: 'text-gray-700' }
  }
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { variant: 'default', label: 'Megerősítve' }
    case 'scheduled':
      return { variant: 'secondary', label: 'Ütemezve' }
    case 'pending':
      return { variant: 'outline', label: 'Függőben' }
    case 'cancelled':
      return { variant: 'destructive', label: 'Törölve' }
    default:
      return { variant: 'outline', label: 'Ismeretlen' }
  }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)) // January 2025
  const [selectedView, setSelectedView] = useState("month")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()
    
    const days = []
    
    // Previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false, events: [] })
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split('T')[0]
      const dayEvents = mockEvents.filter(event => event.date === dateString)
      days.push({ date, isCurrentMonth: true, events: dayEvents })
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({ date, isCurrentMonth: false, events: [] })
    }
    
    return days
  }

  const monthNames = [
    "Január", "Február", "Március", "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember", "Október", "November", "December"
  ]

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const calendarDays = generateCalendarDays()
  const upcomingEvents = mockEvents.slice(0, 5) // Show first 5 events

  const stats = {
    totalEvents: mockEvents.length,
    confirmedEvents: mockEvents.filter(event => event.status === 'confirmed').length,
    pendingEvents: mockEvents.filter(event => event.status === 'pending').length,
    thisWeekEvents: mockEvents.filter(event => {
      const eventDate = new Date(event.date)
      const now = new Date()
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      return eventDate >= weekStart && eventDate < weekEnd
    }).length
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Naptár</h1>
                <p className="text-muted-foreground">
                  Forgatások és események ütemezése
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Szűrés
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Új esemény
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalEvents}</p>
                    <p className="text-sm text-muted-foreground">Összes esemény</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.thisWeekEvents}</p>
                    <p className="text-sm text-muted-foreground">Ezen a héten</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.confirmedEvents}</p>
                    <p className="text-sm text-muted-foreground">Megerősítve</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingEvents}</p>
                    <p className="text-sm text-muted-foreground">Függőben</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Views */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-xl font-semibold">
                          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant={selectedView === "month" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSelectedView("month")}
                      >
                        <Grid3x3 className="h-4 w-4 mr-1" />
                        Havi
                      </Button>
                      <Button 
                        variant={selectedView === "list" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSelectedView("list")}
                      >
                        <List className="h-4 w-4 mr-1" />
                        Lista
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedView === "month" ? (
                    <div className="space-y-4">
                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {/* Weekday headers */}
                        {['Vas', 'Hét', 'Kedd', 'Szer', 'Csüt', 'Pén', 'Szom'].map(day => (
                          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                            {day}
                          </div>
                        ))}
                        
                        {/* Calendar days */}
                        {calendarDays.map((day, index) => {
                          const isToday = new Date().toDateString() === day.date.toDateString()
                          
                          return (
                            <div
                              key={index}
                              className={`p-1 min-h-[80px] border rounded-lg transition-colors hover:bg-accent cursor-pointer ${
                                !day.isCurrentMonth ? 'text-muted-foreground bg-muted/50' : ''
                              } ${isToday ? 'bg-primary/10 border-primary' : ''}`}
                            >
                              <div className="text-sm font-medium p-1">
                                {day.date.getDate()}
                              </div>
                              <div className="space-y-1">
                                {day.events.slice(0, 2).map(event => {
                                  const eventInfo = getEventTypeInfo(event.type)
                                  return (
                                    <div
                                      key={event.id}
                                      className={`text-xs p-1 rounded text-white truncate ${eventInfo.color}`}
                                      onClick={() => setSelectedEvent(event)}
                                      title={event.title}
                                    >
                                      {event.title}
                                    </div>
                                  )
                                })}
                                {day.events.length > 2 && (
                                  <div className="text-xs text-muted-foreground p-1">
                                    +{day.events.length - 2} további
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockEvents.map(event => {
                        const eventInfo = getEventTypeInfo(event.type)
                        const statusInfo = getStatusInfo(event.status)
                        const EventIcon = eventInfo.icon
                        
                        return (
                          <div
                            key={event.id}
                            className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`p-2 rounded-lg ${eventInfo.color}`}>
                                  <EventIcon className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{event.title}</h3>
                                    <Badge variant={statusInfo.variant as any}>
                                      {statusInfo.label}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{event.date} {event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      <span>{event.participants} résztvevő</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with upcoming events */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Közelgő események</CardTitle>
                  <CardDescription>
                    A következő forgatások és események
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map(event => {
                      const eventInfo = getEventTypeInfo(event.type)
                      const EventIcon = eventInfo.icon
                      
                      return (
                        <div key={event.id} className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded ${eventInfo.color}`}>
                              <EventIcon className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h4 className="font-medium text-sm leading-tight">{event.title}</h4>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Legend */}
              <Card>
                <CardHeader>
                  <CardTitle>Esemény típusok</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'photography', label: 'Fotózás' },
                      { type: 'live', label: 'Élő közvetítés' },
                      { type: 'event', label: 'Esemény' },
                      { type: 'concert', label: 'Koncert' },
                      { type: 'meeting', label: 'Megbeszélés' },
                      { type: 'video', label: 'Videó készítés' }
                    ].map(item => {
                      const info = getEventTypeInfo(item.type)
                      return (
                        <div key={item.type} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded ${info.color}`} />
                          <span className="text-sm">{info.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
