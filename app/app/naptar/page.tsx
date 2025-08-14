"use client"

import { useState } from "react"
import * as React from "react"
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
  Camera
} from "lucide-react"
import { useApiQuery } from "@/lib/api-helpers"
import { ForgatSchema } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { ApiError } from "@/components/api-error"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month")
  
  // Fetch only filming data from API
  const { data: filmingData = [], loading: filmingLoading, error: filmingError } = useApiQuery(
    () => apiClient.getFilmingSessions()
  )

  if (filmingLoading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 space-y-4 p-4 md:p-6">
            <div className="text-center">Betöltés...</div>
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

  // Transform API data into calendar events - only filming sessions
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

  // Get events for today and upcoming - only filming sessions
  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = filmingSessions
    .filter(event => event.date >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const getEventIcon = (type: string) => {
    return <Video className="h-4 w-4" />
  }

  const getEventBadgeColor = (type: string) => {
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Forgatási Naptár
              </h1>
              <p className="text-muted-foreground">
                Forgások és események kezelése • {upcomingEvents.length} közelgő forgatás
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Új forgatás
              </Button>
            </div>
          </div>

          {/* Events List */}
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
