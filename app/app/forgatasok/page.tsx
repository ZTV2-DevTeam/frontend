"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { usePermissions } from "@/contexts/permissions-context"
import { useAuth } from "@/contexts/auth-context"
import { useUserRole } from "@/contexts/user-role-context"
import type { ForgatSchema, ForgatoTipusSchema } from "@/lib/types"
import { ApiErrorBoundary } from "@/components/api-error-boundary"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import { DebugConsole } from "@/components/debug-console"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { CreateForgatásDialog } from "@/components/create-forgatas-dialog"

// Status badge helper
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return { icon: CheckCircle, variant: 'default' as const, label: 'Befejezett', color: 'text-green-600' }
    case 'in_progress':
      return { icon: Clock, variant: 'secondary' as const, label: 'Folyamatban', color: 'text-blue-600' }
    case 'cancelled':
      return { icon: XCircle, variant: 'destructive' as const, label: 'Törölve', color: 'text-red-600' }
    case 'planned':
      return { icon: CalendarDays, variant: 'outline' as const, label: 'Tervezett', color: 'text-gray-600' }
    default:
      return { icon: AlertTriangle, variant: 'outline' as const, label: 'Ismeretlen', color: 'text-gray-600' }
  }
}

// Priority badge helper
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return { variant: 'destructive', label: 'Magas' }
    case 'medium':
      return { variant: 'default', label: 'Közepes' }
    case 'low':
      return { variant: 'secondary', label: 'Alacsony' }
    default:
      return { variant: 'outline', label: 'Nincs' }
  }
}

export default function ShootingsPage() {
  // State hooks - MUST be at the very top
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)
  
  // Context hooks - MUST be called before any conditional returns
  const { hasPermission, permissions } = usePermissions()
  const { user } = useAuth()
  const { currentRole } = useUserRole()
  
  // API hooks - MUST be called before any conditional returns
  const filmingQuery = useApiQuery(() => apiClient.getFilmingSessions())
  const typesQuery = useApiQuery(() => apiClient.getFilmingTypes())

  const { data: filmingData, loading, error } = filmingQuery
  const { data: typesData } = typesQuery

  // Computed values using useMemo - MUST be called before conditional returns
  const sessions = useMemo(() => {
    if (!Array.isArray(filmingData)) return []
    return filmingData
  }, [filmingData])

  const types = useMemo(() => {
    if (!Array.isArray(typesData)) return []
    return typesData
  }, [typesData])

  // Safe data handling - MUST be before conditional returns
  const safeSessions = useMemo(() => {
    return sessions.map((session: any) => {
      try {
        return {
          ...session,
          // Safely extract string values to avoid React object rendering errors
          displayName: String(session.name || 'Ismeretlen forgatás'),
          displayDescription: String(session.description || session.notes || ''),
          displayLocation: typeof session.location === 'object' && session.location?.name ? 
                          String(session.location.name) : String(session.location || 'Nincs helyszín'),
          displayContactPerson: typeof session.contact_person === 'object' && session.contact_person?.name ?
                               String(session.contact_person.name) : String(session.contact_person || ''),
          displayDate: String(session.date || ''),
          // Safely handle phone and email from contact_person object
          phone: typeof session.contact_person === 'object' && session.contact_person?.phone ?
                 String(session.contact_person.phone) : String(session.phone || ''),
          email: typeof session.contact_person === 'object' && session.contact_person?.email ?
                 String(session.contact_person.email) : String(session.email || '')
        }
      } catch (err) {
        console.error('Error processing session:', session, err)
        return {
          ...session,
          displayName: 'Hibás adat',
          displayDescription: '',
          displayLocation: 'Nincs helyszín',
          displayContactPerson: '',
          displayDate: '',
          phone: '',
          email: ''
        }
      }
    })
  }, [sessions])

  // Filtered sessions - MUST be before conditional returns
  const filteredSessions = useMemo(() => {
    return safeSessions.filter((session: any) => {
      const matchesSearch = (session.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (session.displayLocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (session.type || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || session.status === statusFilter
      const matchesType = typeFilter === "all" || session.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [safeSessions, searchTerm, statusFilter, typeFilter])

  // Permission calculations - MUST be before conditional returns
  const classDisplayName = permissions?.role_info?.class_display_name || 
                          permissions?.role_info?.class_assignment?.display_name
  const is10FStudent = currentRole === 'student' && classDisplayName === '10F'
  const canCreate = hasPermission('can_create_forgatas') || hasPermission('is_admin') || is10FStudent

  // NOW we can have conditional returns - ALL HOOKS HAVE BEEN CALLED
  if (loading) {
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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Forgatások betöltése...
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error) {
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
          <DebugConsole label="Forgatasok Page Data" data={{ 
            sessionsCount: safeSessions.length,
            filteredCount: filteredSessions.length,
            hasData: filmingData && Array.isArray(filmingData),
            firstSession: safeSessions[0]
          }} />
          <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Forgatások</h1>
              <Badge variant="secondary">{filteredSessions.length}</Badge>
            </div>
            {canCreate && <CreateForgatásDialog />}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Keresés forgatások között..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Státusz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Minden státusz</SelectItem>
                  <SelectItem value="planned">Tervezett</SelectItem>
                  <SelectItem value="in_progress">Folyamatban</SelectItem>
                  <SelectItem value="completed">Befejezett</SelectItem>
                  <SelectItem value="cancelled">Törölve</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Típus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Minden típus</SelectItem>
                  {types.map((type: any) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                  ? "Nincs találat a keresési feltételeknek megfelelően."
                  : "Még nincsenek forgatások."
                }
              </div>
            ) : (
              filteredSessions.map((session: any) => {
                const status = getStatusBadge(session.status)
                const StatusIcon = status.icon
                
                return (
                  <Card key={session.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">{session.displayName}</CardTitle>
                          {session.displayDescription && (
                            <CardDescription className="mt-1 line-clamp-2">
                              {session.displayDescription}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant={status.variant} className="ml-2 shrink-0">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {/* Date and Time */}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div>
                          <div>{session.displayDate ? format(new Date(session.displayDate), 'yyyy. MM. dd.', { locale: hu }) : 'Nincs dátum'}</div>
                          <span>{session.time_from && session.time_to ? `${session.time_from} - ${session.time_to}` : 'Nincs időpont'}</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                        <span className="font-medium">{session.displayLocation}</span>
                      </div>

                      {/* Contact Person */}
                      {session.displayContactPerson && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                            <div className="text-sm font-medium">{session.displayContactPerson}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            {session.phone && (
                              <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                                <a href={`tel:${session.phone}`}>
                                  <Phone className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {session.email && (
                              <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                                <a href={`mailto:${session.email}`}>
                                  <Mail className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {session.displayLocation && session.displayLocation !== 'Nincs helyszín' && (
                              <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                                <a 
                                  href={`https://maps.google.com/?q=${encodeURIComponent(session.displayLocation)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ApiErrorBoundary>
  )
}
