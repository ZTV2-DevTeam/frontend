"use client"

import React, { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useApiQuery, useApiMutation } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { usePermissions } from "@/contexts/permissions-context"
import { useAuth } from "@/contexts/auth-context"
import type { BeosztasSchema, BeosztasDetailSchema, ForgatSchema } from "@/lib/types"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  Eye,
  Star,
  Camera,
  Music,
  Grid3X3,
  List,
  Filter
} from "lucide-react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { toast } from "sonner"

export default function CrewAssignmentsPage() {
  // URL search params for forgatas filter
  const searchParams = useSearchParams()
  const forgatosParam = searchParams.get('forgatas')
  
  // State hooks
  const [selectedForgatosId, setSelectedForgatosId] = useState<number | null>(
    forgatosParam ? parseInt(forgatosParam) : null
  )
  const [selectedAssignment, setSelectedAssignment] = useState<BeosztasDetailSchema | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showUserOnly, setShowUserOnly] = useState(false)
  
  // Context hooks
  const { hasPermission } = usePermissions()
  const { user, isAuthenticated } = useAuth()
  
  // API queries
  const assignmentsQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingAssignments(
      selectedForgatosId || undefined
    ) : Promise.resolve([]),
    [isAuthenticated, selectedForgatosId]
  )
  
  const filmingSessionsQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingSessions() : Promise.resolve([]),
    [isAuthenticated]
  )

  const { data: assignmentsData = [], loading, error } = assignmentsQuery
  const { data: filmingSessionsData = [] } = filmingSessionsQuery

  // Computed values
  const assignments = useMemo(() => Array.isArray(assignmentsData) ? assignmentsData : [], [assignmentsData])
  const filmingSessions = useMemo(() => Array.isArray(filmingSessionsData) ? filmingSessionsData : [], [filmingSessionsData])

  // Filter assignments by user if needed
  const filteredAssignments = useMemo(() => {
    if (!showUserOnly || !user) return assignments
    return assignments.filter(assignment => 
      assignment.roles_summary.some(role => 
        // This would need to be enhanced based on actual user assignment data
        true // Placeholder - implement user filtering logic
      )
    )
  }, [assignments, showUserOnly, user])

  // Group assignments by filming type
  const kacsaAssignments = useMemo(() => 
    filteredAssignments.filter(a => a.forgatas.type === 'kacsa'), 
    [filteredAssignments]
  )
  const rendesAssignments = useMemo(() => 
    filteredAssignments.filter(a => a.forgatas.type === 'rendes'), 
    [filteredAssignments]
  )
  const rendezvenyAssignments = useMemo(() => 
    filteredAssignments.filter(a => a.forgatas.type === 'rendezveny'), 
    [filteredAssignments]
  )
  const egyebAssignments = useMemo(() => 
    filteredAssignments.filter(a => a.forgatas.type === 'egyeb'), 
    [filteredAssignments]
  )

  // Event handlers
  const handleCardClick = async (assignment: BeosztasSchema) => {
    try {
      const details = await apiClient.getFilmingAssignmentDetails(assignment.id)
      setSelectedAssignment(details)
      setDetailsOpen(true)
    } catch (error) {
      toast.error(`Hiba a részletek betöltésekor: ${error}`)
    }
  }

  const handlePhoneCall = (phoneNumber: string, name: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`
      toast.success(`${name} hívása...`)
    } else {
      toast.error("Nincs telefonszám megadva")
    }
  }

  // Helper functions
  const getStatusColor = (status: boolean) => {
    return status 
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "kacsa":
        return "KaCsa"
      case "rendezveny":
        return "Esemény"
      case "rendes":
        return "Rendes"
      default:
        return "Egyéb"
    }
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
            Forgatás stábok betöltése...
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
            Hiba a stábok betöltésekor: {error}
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
          <DebugConsole label="Crew Assignments Data" data={{ 
            assignmentsCount: assignments.length,
            kacsaCount: kacsaAssignments.length,
            rendesCount: rendesAssignments.length,
            rendezvenyCount: rendezvenyAssignments.length
          }} />
          
          <div className="flex-1 space-y-6 p-4 md:p-6 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Forgatás Stábok
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filteredAssignments.length} stáb • KaCsa: {kacsaAssignments.length} • 
                  Rendes: {rendesAssignments.length} • Események: {rendezvenyAssignments.length}
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
                {/* KaCsa Assignments */}
                {kacsaAssignments.length > 0 && (
                  <AssignmentSection
                    title="KaCsa Összejátszások"
                    assignments={kacsaAssignments}
                    icon={Star}
                    iconColor="text-yellow-400 fill-yellow-400"
                    badgeText="Minden második csütörtök"
                    viewMode={viewMode}
                    onCardClick={handleCardClick}
                    onPhoneCall={handlePhoneCall}
                  />
                )}

                {/* Event Assignments */}
                {rendezvenyAssignments.length > 0 && (
                  <AssignmentSection
                    title="Esemény Forgatások"
                    assignments={rendezvenyAssignments}
                    icon={Music}
                    iconColor="text-purple-400"
                    badgeText="Független események"
                    viewMode={viewMode}
                    onCardClick={handleCardClick}
                    onPhoneCall={handlePhoneCall}
                  />
                )}

                {/* Regular Assignments */}
                {rendesAssignments.length > 0 && (
                  <AssignmentSection
                    title="Rendes Forgatások"
                    assignments={rendesAssignments}
                    icon={Camera}
                    iconColor="text-blue-400"
                    badgeText="Hagyományos forgatások"
                    viewMode={viewMode}
                    onCardClick={handleCardClick}
                    onPhoneCall={handlePhoneCall}
                  />
                )}

                {/* Other Assignments */}
                {egyebAssignments.length > 0 && (
                  <AssignmentSection
                    title="Egyéb Forgatások"
                    assignments={egyebAssignments}
                    icon={Camera}
                    iconColor="text-gray-400"
                    badgeText="Speciális forgatások"
                    viewMode={viewMode}
                    onCardClick={handleCardClick}
                    onPhoneCall={handlePhoneCall}
                  />
                )}
              </>
            )}

            {/* Filtered View */}
            {showUserOnly && (
              <AssignmentSection
                title="Saját Forgatások"
                assignments={filteredAssignments}
                icon={Star}
                iconColor="text-yellow-400 fill-yellow-400"
                badgeText={`${filteredAssignments.length} forgatás`}
                viewMode={viewMode}
                onCardClick={handleCardClick}
                onPhoneCall={handlePhoneCall}
              />
            )}
          </div>

          {/* Assignment Details Modal */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedAssignment && (
                <AssignmentDetailsModal 
                  assignment={selectedAssignment}
                  onPhoneCall={handlePhoneCall}
                  onClose={() => setDetailsOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </SidebarInset>
      </SidebarProvider>
    </ApiErrorBoundary>
  )
}

// Assignment Section Component
interface AssignmentSectionProps {
  title: string
  assignments: BeosztasSchema[]
  icon: React.ElementType
  iconColor: string
  badgeText: string
  viewMode: "grid" | "list"
  onCardClick: (assignment: BeosztasSchema) => void
  onPhoneCall: (phoneNumber: string, name: string) => void
}

function AssignmentSection({ 
  title, 
  assignments, 
  icon: Icon, 
  iconColor, 
  badgeText, 
  viewMode, 
  onCardClick,
  onPhoneCall 
}: AssignmentSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <Badge variant="secondary" className="text-xs">
          {assignments.length}
        </Badge>
        <Badge variant="outline" className="text-xs hidden sm:inline-flex">
          {badgeText}
        </Badge>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assignments.map((assignment, index) => (
            <div
              key={assignment.id}
              className="animate-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CrewGridCard assignment={assignment} onClick={() => onCardClick(assignment)} onPhoneCall={onPhoneCall} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment, index) => (
            <div
              key={assignment.id}
              className="animate-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CrewListItem assignment={assignment} onClick={() => onCardClick(assignment)} onPhoneCall={onPhoneCall} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Crew Grid Card Component
interface CrewCardProps {
  assignment: BeosztasSchema
  onClick: () => void
  onPhoneCall: (phoneNumber: string, name: string) => void
}

function CrewGridCard({ assignment, onClick, onPhoneCall }: CrewCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "kacsa": return Star
      case "rendezveny": return Music
      default: return Camera
    }
  }

  const TypeIcon = getTypeIcon(assignment.forgatas.type || 'rendes')

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full"
          onClick={onClick}>
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <TypeIcon
            className={`h-5 w-5 flex-shrink-0 ${
              assignment.forgatas.type === "kacsa"
                ? "text-yellow-400 fill-yellow-400"
                : assignment.forgatas.type === "rendezveny"
                  ? "text-purple-400"
                  : "text-blue-400"
            }`}
          />
          <div className="flex flex-col gap-1 items-end">
            <Badge className={`${assignment.kesz ? 
              "bg-green-500/20 text-green-400 border-green-500/30" : 
              "bg-blue-500/20 text-blue-400 border-blue-500/30"
            } text-xs px-2 py-0`}>
              {assignment.kesz ? "Végleges" : "Tervezet"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {assignment.forgatas.name}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{assignment.forgatas.location?.name || 'Helyszín megadása szükséges'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{format(new Date(assignment.forgatas.date), 'yyyy. MM. dd.', { locale: hu })}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3 flex-shrink-0" />
              <span>{assignment.student_count} fős stáb</span>
            </div>
          </div>

          {/* Crew Members Preview */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Stáb:</p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {assignment.roles_summary.slice(0, 3).map((role, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">{role.role}</span>
                  <Badge variant="outline" className="text-xs h-5">
                    {role.count} fő
                  </Badge>
                </div>
              ))}
              {assignment.roles_summary.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{assignment.roles_summary.length - 3} további szerepkör
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {assignment.forgatas.type === "kacsa" ? "KaCsa" : 
             assignment.forgatas.type === "rendezveny" ? "Esemény" : "Forgatás"}
          </span>
          <Eye className="h-3 w-3 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}

// Crew List Item Component
function CrewListItem({ assignment, onClick, onPhoneCall }: CrewCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "kacsa": return Star
      case "rendezveny": return Music
      default: return Camera
    }
  }

  const TypeIcon = getTypeIcon(assignment.forgatas.type || 'rendes')

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
          onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <TypeIcon
            className={`h-5 w-5 flex-shrink-0 ${
              assignment.forgatas.type === "kacsa"
                ? "text-yellow-400 fill-yellow-400"
                : assignment.forgatas.type === "rendezveny"
                  ? "text-purple-400"
                  : "text-blue-400"
            }`}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">{assignment.forgatas.name}</h3>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{assignment.forgatas.location?.name || 'TBD'}</span>
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                <span className="truncate">{format(new Date(assignment.forgatas.date), 'MM. dd.', { locale: hu })}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{assignment.student_count} fő</span>
              </span>
            </div>

            {/* Roles in list view */}
            <div className="mt-2 flex flex-wrap gap-1">
              {assignment.roles_summary.slice(0, 4).map((role, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {role.role}: {role.count}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status & Action */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Badge className={`${assignment.kesz ? 
              "bg-green-500/20 text-green-400 border-green-500/30" : 
              "bg-blue-500/20 text-blue-400 border-blue-500/30"
            } text-xs px-2 py-1`}>
              {assignment.kesz ? "Végleges" : "Tervezet"}
            </Badge>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Assignment Details Modal Component
interface AssignmentDetailsModalProps {
  assignment: BeosztasDetailSchema
  onPhoneCall: (phoneNumber: string, name: string) => void
  onClose: () => void
}

function AssignmentDetailsModal({ assignment, onPhoneCall, onClose }: AssignmentDetailsModalProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">
          {assignment.forgatas.name} - Részletes stáb információk
        </DialogTitle>
        <DialogDescription>
          Teljes stáb lista és elérhetőségek
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Filming Session Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Forgatás adatok</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                {format(new Date(assignment.forgatas.date), 'yyyy. MMMM dd. (EEEE)', { locale: hu })}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                {assignment.forgatas.time_from} - {assignment.forgatas.time_to}
              </div>
              {assignment.forgatas.location && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{assignment.forgatas.location.name}</span>
                  </div>
                  {assignment.forgatas.location.address && (
                    <p className="text-xs text-muted-foreground ml-6">
                      {assignment.forgatas.location.address}
                    </p>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <Badge variant={assignment.kesz ? "default" : "secondary"}>
                  {assignment.kesz ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Véglegesített
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Tervezet
                    </>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          {assignment.forgatas.contact_person && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kapcsolattartó</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{assignment.forgatas.contact_person.name}</p>
                    <p className="text-sm text-muted-foreground">{assignment.forgatas.contact_person.email}</p>
                  </div>
                  <div className="flex gap-2">
                    {assignment.forgatas.contact_person?.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPhoneCall(
                          assignment.forgatas.contact_person!.phone!, 
                          assignment.forgatas.contact_person!.name
                        )}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    {assignment.forgatas.contact_person?.email && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = `mailto:${assignment.forgatas.contact_person!.email}`}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Crew Members */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Stáb lista ({assignment.student_role_assignments?.length || 0} fő)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignment.student_role_assignments && assignment.student_role_assignments.length > 0 ? (
              <div className="space-y-3">
                {assignment.student_role_assignments.map((roleAssignment) => (
                  <div 
                    key={roleAssignment.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {roleAssignment.user.last_name} {roleAssignment.user.first_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {roleAssignment.szerepkor.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {roleAssignment.user.telefonszam && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPhoneCall(
                            roleAssignment.user.telefonszam!, 
                            `${roleAssignment.user.last_name} ${roleAssignment.user.first_name}`
                          )}
                          className="gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          Hívás
                        </Button>
                      )}
                      {roleAssignment.user.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `mailto:${roleAssignment.user.email}`}
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                Még nincsenek hozzárendelt stábtagok.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Bezárás
        </Button>
      </DialogFooter>
    </>
  )
}