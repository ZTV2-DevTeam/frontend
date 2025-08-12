"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { usePermissions } from "@/contexts/permissions-context"
import { useAuth } from "@/contexts/auth-context"
import { useUserRole } from "@/contexts/user-role-context"
import type { ForgatSchema, ForgatoTipusSchema } from "@/lib/types"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateForgatásForm } from "@/components/create-forgatas-form"
import { 
  Video,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react"

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { variant: 'default', label: 'Megerősítve', icon: CheckCircle, color: 'text-green-600' }
    case 'scheduled':
      return { variant: 'secondary', label: 'Ütemezve', icon: Clock, color: 'text-blue-600' }
    case 'pending':
      return { variant: 'outline', label: 'Függőben', icon: AlertCircle, color: 'text-yellow-600' }
    case 'draft':
      return { variant: 'outline', label: 'Tervezet', icon: Edit, color: 'text-gray-600' }
    case 'cancelled':
      return { variant: 'destructive', label: 'Törölve', icon: XCircle, color: 'text-red-600' }
    default:
      return { variant: 'outline', label: 'Ismeretlen', icon: AlertCircle, color: 'text-gray-600' }
  }
}

const getPriorityInfo = (priority: string) => {
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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)
  const { hasPermission, permissions } = usePermissions()
  const { user } = useAuth()
  const { currentRole } = useUserRole()
  const classDisplayName = permissions?.role_info?.class_display_name || permissions?.role_info?.class_assignment?.display_name
  const is10FStudent = currentRole === 'student' && classDisplayName === '10F'
  const canCreate = hasPermission('can_create_forgatas') || hasPermission('is_admin') || is10FStudent

  // Debug logging
  console.log('🔍 Create Button Debug:', {
    currentRole,
    username: user?.username,
    classDisplayName,
    is10FStudent,
    hasCreatePermission: hasPermission('can_create_forgatas'),
    hasAdminPermission: hasPermission('is_admin'),
    canCreate
  })

  // Fetch filming sessions from API
  const { data: filmingData, loading, error } = useApiQuery(
    () => apiClient.getFilmingSessions()
  )

  // Fetch filming types for filter
  const { data: typesData } = useApiQuery(
    () => apiClient.getFilmingTypes()
  )

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

  const sessions = Array.isArray(filmingData) ? filmingData : []
  const types = Array.isArray(typesData) ? typesData : []

  // Ensure safe data handling - avoid passing objects to React text rendering
  const safeSessions = sessions.map((session: any) => ({
    ...session,
    // Safely extract string values to avoid React object rendering errors
    displayName: session.name || 'Ismeretlen forgatás',
    displayDescription: session.description || session.notes || '',
    displayLocation: typeof session.location === 'object' && session.location?.name ? 
                    session.location.name : (session.location || 'Nincs helyszín'),
    displayContactPerson: typeof session.contact_person === 'object' && session.contact_person?.name ?
                         session.contact_person.name : (session.contact_person || ''),
    displayDate: session.date || ''
  }))

  // Filter sessions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredSessions = safeSessions.filter((session: any) => {
    const matchesSearch = (session.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.displayLocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.type || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    const matchesType = typeFilter === "all" || session.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Stats - temporary disable for build
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stats = {
    total: safeSessions.length,
    confirmed: safeSessions.filter((s: any) => s.status === 'confirmed').length, // eslint-disable-line @typescript-eslint/no-explicit-any
    pending: safeSessions.filter((s: any) => s.status === 'pending').length, // eslint-disable-line @typescript-eslint/no-explicit-any
    thisWeek: safeSessions.filter((s: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!s.displayDate) return false
      const sessionDate = new Date(s.displayDate)
      const now = new Date()
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      return sessionDate >= weekStart && sessionDate < weekEnd
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-md">
                <Video className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Forgatások</h1>
                <p className="text-sm text-muted-foreground">
                  Videó és fotózási projektek kezelése
                </p>
              </div>
            </div>
            {canCreate && (
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-1 h-3 w-3" />
                Új forgatás
              </Button>
            )}
          </div>
          {canCreate && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                  <DialogTitle>Új forgatás létrehozása</DialogTitle>
                </DialogHeader>
                <CreateForgatásForm />
              </DialogContent>
            </Dialog>
          )}

          {/* Filters - Compact */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Forgatás keresése..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-8 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="Státusz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden</SelectItem>
                <SelectItem value="confirmed">Megerősítve</SelectItem>
                <SelectItem value="scheduled">Ütemezve</SelectItem>
                <SelectItem value="pending">Függőben</SelectItem>
                <SelectItem value="draft">Tervezet</SelectItem>
                <SelectItem value="cancelled">Törölve</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="Típus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden</SelectItem>
                {types.map((type: ForgatoTipusSchema) => (
                  <SelectItem key={type.value || type.label} value={type.value || type.label}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shootings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSessions.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Video className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Nincs találat</p>
                <p className="text-sm text-muted-foreground">Próbálj meg más keresési feltételekkel</p>
              </div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filteredSessions.map((session: any) => {
                const statusInfo = getStatusInfo('confirmed') // Default status since not available
                const priorityInfo = getPriorityInfo('medium') // Default priority since not available
                const StatusIcon = statusInfo.icon
                
                return (
                  <Card key={session.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex gap-2">
                          <Badge variant={statusInfo.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {session.type || 'Forgatás'}
                          </Badge>
                          <Badge variant={priorityInfo.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                            {priorityInfo.label}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{session.displayName}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {session.displayDescription || 'Nincs leírás'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Date and Duration */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{session.displayDate || 'Nincs dátum'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{session.time_from && session.time_to ? `${session.time_from} - ${session.time_to}` : 'Nincs időpont'}</span>
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{session.displayLocation}</span>
                      </div>
                      
                      {/* Contact */}
                      {session.displayContactPerson && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">{session.displayContactPerson}</div>
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
                            {session.location && (
                              <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                                <a 
                                  href={`https://maps.google.com/?q=${encodeURIComponent(session.location)}`}
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
                      
                      {/* Staff Assignment */}
                      <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Stáb beosztás</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {session.assigned_users?.length || 0} fő
                          </Badge>
                        </div>
                        {session.assigned_users && session.assigned_users.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">Beosztott stábtagok:</div>
                            <div className="flex flex-wrap gap-1">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {session.assigned_users?.slice(0, 3).map((user: any, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {user.name || user}
                                </Badge>
                              ))}
                              {session.assigned_users.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{session.assigned_users.length - 3} további
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Részletek
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

