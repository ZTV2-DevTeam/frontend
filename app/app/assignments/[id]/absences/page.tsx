"use client"

import React, { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useApiQuery, useApiMutation } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { usePermissions } from "@/contexts/permissions-context"
import { useAuth } from "@/contexts/auth-context"
import type { AbsenceFromAssignmentSchema, BeosztasDetailSchema } from "@/lib/types"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  AlertCircle,
  Plus,
  ArrowLeft,
  UserCheck,
  UserX,
  FileText
} from "lucide-react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { toast } from "sonner"

export default function AssignmentAbsencesPage() {
  const params = useParams()
  const assignmentId = parseInt(params.id as string)
  
  // State hooks
  const [createAbsenceOpen, setCreateAbsenceOpen] = useState(false)
  
  // Context hooks
  const { hasPermission } = usePermissions()
  const { user, isAuthenticated } = useAuth()
  
  // API queries
  const assignmentQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingAssignmentDetails(assignmentId) : Promise.resolve(null),
    [isAuthenticated, assignmentId]
  )
  
  const absencesQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingAssignmentAbsences(assignmentId) : Promise.resolve([]),
    [isAuthenticated, assignmentId]
  )

  const { data: assignment, loading: assignmentLoading } = assignmentQuery
  const { data: absencesData = [], loading: absencesLoading, error } = absencesQuery

  // Mutations
  const createAbsenceMutation = useApiMutation(
    (data: any) => apiClient.createAbsenceFromAssignment(data)
  )

  // Computed values
  const absences = useMemo(() => Array.isArray(absencesData) ? absencesData : [], [absencesData])
  const loading = assignmentLoading || absencesLoading

  // Permission calculations
  const canManage = hasPermission('can_manage_forgatas') || hasPermission('is_admin')

  // Event handlers
  const handleCreateAbsence = async (studentId: number, reason: string) => {
    try {
      await createAbsenceMutation.execute({
        assignment_id: assignmentId,
        student_id: studentId,
        reason: reason
      })
      toast.success("Hiányzás sikeresen rögzítve")
      setCreateAbsenceOpen(false)
      window.location.reload()
    } catch (error) {
      toast.error(`Hiba a hiányzás rögzítésekor: ${error}`)
    }
  }

  const handleCreateSuccess = () => {
    setCreateAbsenceOpen(false)
    window.location.reload()
    toast.success("Hiányzás sikeresen rögzítve")
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
            Hiányzások betöltése...
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Error state
  if (error || !assignment) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center py-12 text-destructive">
            <AlertCircle className="h-6 w-6 mr-2" />
            Hiba az adatok betöltésekor: {error || "Beosztás nem található"}
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
          <DebugConsole label="Assignment Absences Data" data={{ 
            assignmentId,
            assignmentName: assignment?.forgatas.name,
            absencesCount: absences.length,
            canManage
          }} />
          
          <div className="flex-1 space-y-4 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Vissza
                  </Button>
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Beosztás hiányzások
                </h1>
                <p className="text-muted-foreground">
                  {assignment.forgatas.name} • {absences.length} hiányzás
                </p>
              </div>
              {canManage && (
                <CreateAbsenceDialog
                  open={createAbsenceOpen}
                  onOpenChange={setCreateAbsenceOpen}
                  onSuccess={handleCreateSuccess}
                  assignment={assignment}
                />
              )}
            </div>

            {/* Assignment Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Forgatás információk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium">{assignment.forgatas.name}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.forgatas.description}</p>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {format(new Date(assignment.forgatas.date), 'yyyy. MMMM dd.', { locale: hu })}
                    <Clock className="h-4 w-4 ml-4 mr-2" />
                    {assignment.forgatas.time_from} - {assignment.forgatas.time_to}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      {assignment.student_count} diák
                    </div>
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
                </div>
              </CardContent>
            </Card>

            {/* Absences Table */}
            <Card>
              <CardHeader>
                <CardTitle>Hiányzások listája</CardTitle>
                <CardDescription>
                  Ebből a beosztásból rögzített hiányzások
                </CardDescription>
              </CardHeader>
              <CardContent>
                {absences.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    Ehhez a beosztáshoz még nincsenek hiányzások rögzítve.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Diák</TableHead>
                        <TableHead>Szerepkör</TableHead>
                        <TableHead>Hiányzás oka</TableHead>
                        <TableHead>Rögzítés dátuma</TableHead>
                        <TableHead>Rögzítette</TableHead>
                        <TableHead className="text-right">Művelet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {absences.map((absence) => (
                        <TableRow key={absence.id}>
                          <TableCell className="font-medium">
                            {absence.student.first_name} {absence.student.last_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {absence.assignment_role?.role || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{absence.reason}</TableCell>
                          <TableCell>
                            {format(new Date(absence.created_at), 'yyyy. MM. dd. HH:mm', { locale: hu })}
                          </TableCell>
                          <TableCell>
                            {absence.created_by 
                              ? `${absence.created_by.first_name} ${absence.created_by.last_name}` 
                              : 'Rendszer'
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            {canManage && (
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ApiErrorBoundary>
  )
}

// Create Absence Dialog - placeholder
function CreateAbsenceDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  assignment
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  assignment: BeosztasDetailSchema
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Hiányzás rögzítése
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hiányzás rögzítése</DialogTitle>
          <DialogDescription>
            Új hiányzás hozzáadása ehhez a beosztáshoz
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-8 text-muted-foreground">
          Hiányzás rögzítés űrlap implementálása...
          <br />
          Beosztott diákok: {assignment.student_count}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Mégse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
