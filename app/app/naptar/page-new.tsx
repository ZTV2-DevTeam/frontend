"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  CalendarDays,
  List,
  Grid3x3
} from "lucide-react"
import { useApiQuery } from "@/lib/api-helpers"
import { ForgatSchema, AnnouncementSchema } from "@/lib/types"
import { apiClient } from "@/lib/api"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month")
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all")
  
  // Fetch data from API
  const { data: filmingData = [], loading: filmingLoading, error: filmingError } = useApiQuery(
    () => apiClient.getFilmingSessions()
  )
  
  const { data: announcementsData = [], loading: announcementsLoading, error: announcementsError } = useApiQuery(
    () => apiClient.getAnnouncements()
  )

  if (filmingLoading || announcementsLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center">Betöltés...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (filmingError || announcementsError) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center text-red-500">
              Hiba történt az adatok betöltésekor: {filmingError || announcementsError}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Transform API data into calendar events
  const filmingSessions = (filmingData as ForgatSchema[]).map((session: ForgatSchema) => ({
    id: `filming-${session.id}`,
    title: session.name,
    date: session.date,
    time: `${session.time_from} - ${session.time_to}`,
    location: session.location?.name || "Nem megadott",
    type: "filming",
    status: "scheduled",
    description: session.description,
    organizer: session.contact_person?.name || "Nem megadott",
    participants: session.equipment_count,
    typeDisplay: session.type_display
  }))

  const announcements = (announcementsData as AnnouncementSchema[]).map((announcement: AnnouncementSchema) => ({
    id: `announcement-${announcement.id}`,
    title: announcement.title,
    date: announcement.created_at.split('T')[0],
    time: "Egész nap",
    location: "Online",
    type: "announcement",
    status: "published",
    description: announcement.body,
    organizer: announcement.author?.full_name || "Rendszer",
    participants: announcement.recipient_count,
    typeDisplay: "Közlemény"
  }))

  const allEvents = [...filmingSessions, ...announcements]

  // Filter events based on type
  const filteredEvents = eventTypeFilter === "all" 
    ? allEvents 
    : allEvents.filter(event => event.type === eventTypeFilter)

  // Get events for today and upcoming
  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = filteredEvents
    .filter(event => event.date >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'filming':
        return <Video className="h-4 w-4" />
      case 'announcement':
        return <Megaphone className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'filming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'announcement':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Naptár</h1>
              <p className="text-muted-foreground">Forgások és események kezelése</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Esemény típusa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Minden esemény</SelectItem>
                  <SelectItem value="filming">Forgások</SelectItem>
                  <SelectItem value="announcement">Közlemények</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Új esemény
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Összes esemény</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredEvents.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forgások</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filmingSessions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Közlemények</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{announcements.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mai események</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredEvents.filter(event => event.date === today).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle>Közelgő események</CardTitle>
              <CardDescription>
                A következő események és forgások időrendi sorrendben
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nincsenek közelgő események.
                  </div>
                ) : (
                  upcomingEvents.slice(0, 10).map((event) => (
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
                              {event.participants} résztvevő
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
