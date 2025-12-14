"use client"

import { useState, useMemo, use, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useApiQuery, useApiMutation } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import type { SzerepkorSchema, BeosztasWithAvailabilitySchema } from "@/lib/types"
import { ApiErrorBoundary } from "@/components/api-error-boundary"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import { StabBadge, UserStabBadge } from "@/components/stab-badge"
import { UserAvatar } from "@/components/user-avatar"
import { RemoveStudentConfirmation } from "@/components/remove-student-confirmation"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Edit,
  Loader2,
  Save,
  X,
  Settings,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
  CheckSquare,
  Square,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    id: string
  }>
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

interface CrewMember {
  id: number
  name: string
  role: string
  roleId: number
  class: string
  stab: string
  phone?: string
  email?: string
  firstName?: string
  lastName?: string
  username?: string
}

// Helper component for availability status with enhanced details
const AvailabilityIndicator = ({ userId, availabilityData, showInEditMode = false }: { 
  userId: number, 
  availabilityData: BeosztasWithAvailabilitySchema['user_availability'] | undefined,
  showInEditMode?: boolean
}) => {
  if (!availabilityData) return null

  // Find user in availability data
  const userAvailable = availabilityData.users_available?.find((u) => u.user.id === userId)
  const userOnVacation = availabilityData.users_on_vacation?.find((u) => u.user.id === userId)
  const userWithRadio = availabilityData.users_with_radio_session?.find((u) => u.user.id === userId)

  // Check for conflicts in available users too
  const conflicts = userOnVacation?.availability?.conflicts || userWithRadio?.availability?.conflicts || userAvailable?.availability?.conflicts || []
  const hasConflicts = conflicts.length > 0

  if (userOnVacation) {
    const vacationConflict = conflicts.find((c) => c.type === 'vacation')
    const tooltipText = vacationConflict && vacationConflict.start_date && vacationConflict.end_date 
      ? `Távollét: ${vacationConflict.reason}\n${new Date(vacationConflict.start_date).toLocaleDateString('hu-HU')} - ${new Date(vacationConflict.end_date).toLocaleDateString('hu-HU')}` 
      : 'Szabadság'
    return (
      <div className={`flex items-center gap-1 ${showInEditMode ? 'px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20' : ''}`} title={tooltipText}>
        <AlertCircle className="h-4 w-4 text-orange-500" />
        <span className="text-xs font-medium text-orange-600">Távollét</span>
      </div>
    )
  }

  if (userWithRadio) {
    const radioConflict = conflicts.find((c) => c.type === 'radio_session')
    const tooltipText = radioConflict && radioConflict.date 
      ? `Rádiós összejátszás: ${radioConflict.radio_stab}\n${radioConflict.date} ${radioConflict.time_from} - ${radioConflict.time_to}` 
      : 'Rádió'
    return (
      <div className={`flex items-center gap-1 ${showInEditMode ? 'px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20' : ''}`} title={tooltipText}>
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <span className="text-xs font-medium text-blue-600">Rádiós</span>
      </div>
    )
  }

  if (userAvailable && !hasConflicts) {
    return (
      <div className={`flex items-center gap-1 ${showInEditMode ? 'px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20' : ''}`} title="Elérhető">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-xs font-medium text-green-600">Elérhető</span>
      </div>
    )
  }

  return null
}

export default function BeosztasDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMember | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [stabFilter, setStabFilter] = useState<string>("all")
  const [editedCrew, setEditedCrew] = useState<CrewMember[]>([])
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [selectedNewUser, setSelectedNewUser] = useState<string>("")
  const [selectedNewRole, setSelectedNewRole] = useState<string>("")
  
  // Context hooks
  const { isAuthenticated } = useAuth()
  const { hasPermission } = usePermissions()
  
  // Permission checks
  const canEditAssignments = hasPermission('can_manage_forgatas') || hasPermission('is_admin') || hasPermission('is_teacher_admin')
  
  // API queries
  const sessionQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingSession(parseInt(id)) : Promise.resolve(null),
    [isAuthenticated, id]
  )

  // Use new availability-aware assignment endpoint
  const assignmentQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingAssignmentAvailability(parseInt(id)) : Promise.resolve(null),
    [isAuthenticated, id]
  )

  // Get roles grouped by year for better organization
  const rolesQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getRoles() : Promise.resolve([]),
    [isAuthenticated]
  )

  const usersQuery = useApiQuery(
    () => isAuthenticated ? apiClient.getAllUsersDetailed() : Promise.resolve([]),
    [isAuthenticated]
  )

  // Get role statistics for selected crew member
  const userStatsQuery = useApiQuery(
    () => {
      if (!isAuthenticated || !selectedCrewMember) return Promise.resolve(null)
      return apiClient.getUserRoleStatistics(selectedCrewMember.id)
    },
    [isAuthenticated, selectedCrewMember]
  )

  const { data: session, loading: sessionLoading, error } = sessionQuery
  const { data: assignmentWithAvailability, loading: assignmentLoading } = assignmentQuery
  const { data: availableRoles = [], loading: rolesLoading } = rolesQuery
  const { data: allUsers = [], loading: usersLoading } = usersQuery
  const { data: userStats, loading: userStatsLoading } = userStatsQuery

  // Get absences for finalized assignments (after data is available)
  const absencesQuery = useApiQuery(
    () => {
      if (!isAuthenticated || !assignmentWithAvailability?.id || !assignmentWithAvailability?.kesz) return Promise.resolve([])
      return apiClient.getFilmingAssignmentAbsences(assignmentWithAvailability.id)
    },
    [isAuthenticated, assignmentWithAvailability?.id, assignmentWithAvailability?.kesz]
  )

  const { data: absences = [], loading: absencesLoading } = absencesQuery

  // Mutations for marking assignment as done/draft
  const markAsDoneMutation = useApiMutation(
    (assignmentId: number) => apiClient.markFilmingAssignmentDone(assignmentId)
  )

  const markAsDraftMutation = useApiMutation(
    (assignmentId: number) => apiClient.markFilmingAssignmentDraft(assignmentId)
  )

  // Handlers for status changes
  const handleMarkAsDone = async () => {
    if (!assignment?.id) return
    
    try {
      // First save any crew changes if in edit mode
      if (isEditMode && editedCrew.length !== crew.length || 
          isEditMode && editedCrew.some(editedMember => 
            !crew.find(originalMember => 
              originalMember.id === editedMember.id && originalMember.roleId === editedMember.roleId
            )
          )) {
        // Convert editedCrew to the format expected by the API
        const student_role_pairs = editedCrew.map(member => ({
          user_id: member.id,
          szerepkor_id: member.roleId
        }))
        
        await updateAssignmentMutation.execute({
          student_role_pairs,
          kesz: true  // Mark as done
        })
        toast.success('Beosztás módosításai mentve és lezárva')
      } else {
        await markAsDoneMutation.execute(assignment.id)
        toast.success('Beosztás sikeresen lezárva')
      }
      
      // Refetch the assignment data
      window.location.reload() // Simple refresh for now
    } catch (error) {
      toast.error(`Hiba a beosztás lezárásakor: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`)
    }
  }

  const handleMarkAsDraft = async () => {
    if (!assignment?.id) return
    
    try {
      await markAsDraftMutation.execute(assignment.id)
      toast.success('Beosztás visszaállítva módosításra')
      // Refetch the assignment data
      window.location.reload() // Simple refresh for now
    } catch (error) {
      toast.error(`Hiba a beosztás visszaállításakor: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`)
    }
  }

  // Extract assignment from availability data with memoization
  const assignment = useMemo(() => {
    if (!assignmentWithAvailability) return null
    return {
      id: assignmentWithAvailability.id,
      forgatas: assignmentWithAvailability.forgatas,
      szerepkor_relaciok: assignmentWithAvailability.szerepkor_relaciok,
      kesz: assignmentWithAvailability.kesz,
      author: assignmentWithAvailability.author,
      stab: assignmentWithAvailability.stab,
      created_at: assignmentWithAvailability.created_at,
      student_count: assignmentWithAvailability.student_count,
      roles_summary: assignmentWithAvailability.roles_summary
    }
  }, [assignmentWithAvailability])

  // Extract availability data
  const availabilityData = useMemo(() => 
    assignmentWithAvailability?.user_availability, 
    [assignmentWithAvailability]
  )

  // User queries - fetch detailed user info for crew members
  const userQueries = useApiQuery(
    () => {
      if (!isAuthenticated || !assignment?.szerepkor_relaciok) return Promise.resolve([])
      return Promise.all(
        assignment.szerepkor_relaciok.map((relation: any) => // eslint-disable-line @typescript-eslint/no-explicit-any 
          apiClient.getUserDetails(relation.user.id)
        )
      )
    },
    [isAuthenticated, assignment]
  )

  const { data: userDetailsList = [], loading: usersDetailsLoading } = userQueries

  // Update assignment mutation
  const updateAssignmentMutation = useApiMutation(
    (data: { student_role_pairs: { user_id: number, szerepkor_id: number }[], kesz?: boolean }) =>
      apiClient.updateFilmingAssignment(assignment!.id, data)
  )

  // Computed values - get crew from assignment with detailed user info
  const crew: CrewMember[] = useMemo(() => {
    if (!assignment || !assignment.szerepkor_relaciok || !userDetailsList) return []
    
    // Convert role relations to crew members with detailed user info
    return assignment.szerepkor_relaciok.map((relation: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const userDetails = userDetailsList.find((user: any) => user.id === relation.user.id) // eslint-disable-line @typescript-eslint/no-explicit-any
      
      return {
        id: relation.user.id,
        name: relation.user.full_name || `${relation.user.last_name} ${relation.user.first_name}`,
        role: relation.szerepkor.name,
        roleId: relation.szerepkor.id,
        class: userDetails?.osztaly_name || 'N/A',
        stab: userDetails?.stab_name || 'N/A',
        phone: userDetails?.telefonszam || '',
        email: userDetails?.email || '',
        firstName: relation.user.first_name || userDetails?.first_name || '',
        lastName: relation.user.last_name || userDetails?.last_name || '',
        username: relation.user.username || userDetails?.username || ''
      }
    })
  }, [assignment, userDetailsList])

  // Working crew - either edited crew in edit mode or original crew
  const workingCrew = useMemo(() => {
    return isEditMode ? editedCrew : crew
  }, [isEditMode, editedCrew, crew])

  // Initialize edited crew when entering edit mode
  useEffect(() => {
    if (isEditMode && crew.length > 0) {
      setEditedCrew([...crew])
    }
  }, [isEditMode, crew])

  // Available users for adding (exclude current crew members)
  const availableUsers = useMemo(() => {
    const currentUserIds = workingCrew.map(member => member.id)
    return (allUsers || []).filter((user: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
      !currentUserIds.includes(user.id) && user.is_active
    )
  }, [allUsers, workingCrew])

  // Filtered crew for display
  const filteredCrew = useMemo(() => {
    return workingCrew.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.class.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === "all" || member.role === roleFilter
      const matchesStab = stabFilter === "all" || member.stab === stabFilter
      
      return matchesSearch && matchesRole && matchesStab
    })
  }, [workingCrew, searchTerm, roleFilter, stabFilter])

  // Get unique roles and stabs for filtering
  const uniqueRoles = useMemo(() => [...new Set(workingCrew.map(member => member.role))], [workingCrew])
  const uniqueStabs = useMemo(() => [...new Set(workingCrew.map(member => member.stab))], [workingCrew])

  // Crew management functions
  const handleRoleChange = (memberId: number, newRoleId: string) => {
    const roleId = parseInt(newRoleId)
    const role = availableRoles?.find(r => r.id === roleId)
    if (!role) return

    setEditedCrew(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, roleId, role: role.name }
        : member
    ))
  }

  const handleRemoveMember = (memberId: number) => {
    setEditedCrew(prev => prev.filter(member => member.id !== memberId))
  }

  // Helper function to check user availability when adding
  const checkUserAvailabilityForAdd = async (userId: number) => {
    if (!availabilityData || !assignment?.forgatas) {
      return { hasConflict: false, message: '' }
    }

    // Check existing availability data if user is already there
    const existingOnVacation = availabilityData.users_on_vacation?.find(u => u.user.id === userId)
    const existingWithRadio = availabilityData.users_with_radio_session?.find(u => u.user.id === userId)
    
    if (existingOnVacation) {
      const conflicts = existingOnVacation.availability?.conflicts || []
      const vacationConflict = conflicts.find((c) => c.type === 'vacation')
      return {
        hasConflict: true,
        message: vacationConflict && vacationConflict.start_date && vacationConflict.end_date
          ? `Távollét: ${vacationConflict.reason}\n${new Date(vacationConflict.start_date).toLocaleDateString('hu-HU')} - ${new Date(vacationConflict.end_date).toLocaleDateString('hu-HU')}` 
          : 'A felhasználó távol lesz'
      }
    }
    
    if (existingWithRadio) {
      const conflicts = existingWithRadio.availability?.conflicts || []
      const radioConflict = conflicts.find((c) => c.type === 'radio_session')
      return {
        hasConflict: true,
        message: radioConflict ?
          `Rádiós összejátszás: ${radioConflict.radio_stab}\n${radioConflict.date} ${radioConflict.time_from} - ${radioConflict.time_to}` :
          'A felhasználó rádiós összejátszáson vesz részt'
      }
    }

    // For users not in the current availability data, we could call the API to check
    // but for simplicity, we'll assume no conflict
    return { hasConflict: false, message: '' }
  }

  const handleSaveChanges = async () => {
    if (!assignment?.id || !isEditMode) return
    
    // Check for conflicts before saving
    const membersWithConflicts = editedCrew.filter(member => {
      const userOnVacation = availabilityData?.users_on_vacation?.find((u) => u.user.id === member.id)
      const userWithRadio = availabilityData?.users_with_radio_session?.find((u) => u.user.id === member.id)
      return userOnVacation || userWithRadio
    })
    
    if (membersWithConflicts.length > 0) {
      const conflictDetails = membersWithConflicts.map(m => {
        const userOnVacation = availabilityData?.users_on_vacation?.find((u) => u.user.id === m.id)
        const userWithRadio = availabilityData?.users_with_radio_session?.find((u) => u.user.id === m.id)
        
        let conflictType = ''
        if (userOnVacation) conflictType = 'Távollét'
        else if (userWithRadio) conflictType = 'Rádiós összejátszás'
        
        return `${m.name} - ${conflictType}`
      }).join('\n')
      
      const confirmSave = window.confirm(
        `Figyelem! A következő stábtagoknak konfliktusuk van:\n\n${conflictDetails}\n\nBiztosan véglegesíted a beosztást ezekkel a konfliktusokkal?`
      )
      
      if (!confirmSave) {
        return
      }
    }
    
    try {
      console.log('Saving and finalizing assignment...')
      console.log('Original crew:', crew)
      console.log('Edited crew:', editedCrew)
      
      // Convert editedCrew to the format expected by the API
      const student_role_pairs = editedCrew.map(member => ({
        user_id: member.id,
        szerepkor_id: member.roleId
      }))
      
      console.log('Student role pairs to send:', student_role_pairs)
      
      // Save and mark as done (finalize) in one action
      const result = await updateAssignmentMutation.execute({
        student_role_pairs,
        kesz: true  // Always finalize on save
      })
      
      console.log('Save result:', result)
      toast.success('Beosztás sikeresen véglegesítve!')
      // Refetch the assignment data
      window.location.reload() // Simple refresh for now
    } catch (error) {
      console.error('Save error:', error)
      toast.error(`Hiba a mentés során: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`)
    }
  }

  const handleAddMember = async () => {
    if (!selectedNewUser || !selectedNewRole) return

    const userId = parseInt(selectedNewUser)
    const roleId = parseInt(selectedNewRole)
    
    const user = availableUsers.find((u: any) => u.id === userId) // eslint-disable-line @typescript-eslint/no-explicit-any
    const role = availableRoles?.find(r => r.id === roleId)
    
    if (!user || !role) return

    // Check if user has conflicts
    const userConflicts = await checkUserAvailabilityForAdd(userId)
    if (userConflicts.hasConflict) {
      const confirmAdd = window.confirm(
        `Figyelem! ${user.full_name || user.username} felhasználónak konfliktusa van:\n\n${userConflicts.message}\n\nBiztosan hozzáadod?`
      )
      
      if (!confirmAdd) {
        return
      }
    }

    // Get detailed user info
    try {
      const userDetails = await apiClient.getUserDetails(userId)
      
      const newMember: CrewMember = {
        id: user.id,
        name: user.full_name || `${user.last_name} ${user.first_name}`,
        role: role.name,
        roleId: role.id,
        class: userDetails?.osztaly_name || 'N/A',
        stab: userDetails?.stab_name || 'N/A',
        phone: userDetails?.telefonszam || '',
        email: userDetails?.email || '',
        firstName: user.first_name || userDetails?.first_name || '',
        lastName: user.last_name || userDetails?.last_name || '',
        username: user.username || userDetails?.username || ''
      }

      setEditedCrew(prev => [...prev, newMember])
      setSelectedNewUser("")
      setSelectedNewRole("")
      setShowAddMemberDialog(false)
      toast.success(`${newMember.name} hozzáadva a stábhoz`)
    } catch (error) {
      console.error('Failed to add member:', error)
      toast.error("Hiba történt a tag hozzáadása közben")
    }
  }

  // Loading state
  const loading = sessionLoading || assignmentLoading || rolesLoading || usersLoading || usersDetailsLoading

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Beosztás betöltése...
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !session) {
    notFound()
  }

  // Handle save assignment
  const handleSaveAssignment = async () => {
    if (!assignment) return

    try {
      // Convert edited crew to student_role_pairs format
      const student_role_pairs = workingCrew.map(member => ({
        user_id: member.id,
        szerepkor_id: member.roleId
      }))

      await updateAssignmentMutation.execute({
        student_role_pairs,
        kesz: assignment.kesz
      })

      toast.success("Beosztás sikeresen mentve!")
      setIsEditMode(false)
      setEditedCrew([]) // Clear edited crew
      
      // Refresh the data
      window.location.reload()
    } catch (error) {
      console.error('Failed to save assignment:', error)
      toast.error("Hiba történt a beosztás mentése közben")
    }
  }

  // Get assignment status info
  const getAssignmentStatusInfo = () => {
    if (!assignment) {
      return {
        status: "missing",
        color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        icon: AlertCircle,
        text: "Nincs beosztás létrehozva"
      }
    }

    if (assignment.kesz) {
      return {
        status: "finalized",
        color: "bg-green-500/10 text-green-400 border-green-500/20",
        icon: CheckCircle,
        text: "Végleges beosztás"
      }
    }

    return {
      status: "draft",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: Info,
      text: "Tervezet beosztás"
    }
  }

  const statusInfo = getAssignmentStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <ApiErrorBoundary fallback={ApiErrorFallback}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          
          <div className="flex-1 space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <Link href={`/app/forgatasok/${id}`} className="inline-block">
                <Button variant="outline" size="sm" className="bg-transparent w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Vissza a forgatáshoz
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start sm:items-center gap-3 mb-2">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0 mt-1 sm:mt-0" />
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent break-words">
                      Beosztás - {session.name}
                    </h1>
                  </div>
                </div>
                <p className="text-sm md:text-base text-muted-foreground">Stáb beosztás és szerepkörök kezelése</p>
              </div>
              {canEditAssignments && assignment && (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {isEditMode ? (
                    <>
                      <Button onClick={handleSaveChanges} disabled={updateAssignmentMutation.loading} className="w-full sm:w-auto">
                        {updateAssignmentMutation.loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Mentés és Véglegesítés
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setIsEditMode(false)
                        setEditedCrew([]) // Reset edited crew
                      }} className="w-full sm:w-auto">
                        <X className="h-4 w-4 mr-2" />
                        Mégse
                      </Button>
                    </>
                  ) : (
                    // Only show edit button if assignment is not marked as done
                    !assignment.kesz && (
                      <Button onClick={() => setIsEditMode(true)} className="w-full sm:w-auto">
                        <Edit className="h-4 w-4 mr-2" />
                        Szerkesztés
                      </Button>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:gap-6 xl:grid-cols-4">
              {/* Main Content */}
              <div className="xl:col-span-3 space-y-4 md:space-y-6">
                {/* Session Info Summary */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Info className="h-5 w-5 text-blue-400" />
                      Forgatás Információk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                        <Calendar className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-muted-foreground">Dátum</div>
                          <div className="font-medium text-sm sm:text-base truncate">{formatSessionDate(session.date)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                        <Clock className="h-4 w-4 text-orange-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-muted-foreground">Időpont</div>
                          <div className="font-medium text-sm sm:text-base">
                            {formatTime(session.time_from)} - {formatTime(session.time_to)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 sm:col-span-2 lg:col-span-1">
                        <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-muted-foreground">Helyszín</div>
                          <div className="font-medium text-sm sm:text-base truncate">{session.location?.name || 'Nincs megadva'}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Availability Summary */}
                {availabilityData && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Users className="h-5 w-5 text-green-400" />
                        Elérhetőség Áttekintés
                      </CardTitle>
                      <CardDescription className="text-sm">Diákok elérhetősége és konfliktusai</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm text-muted-foreground">Elérhető</div>
                            <div className="font-medium text-green-400 text-sm sm:text-base">
                              {availabilityData.summary.available_count} diák
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                          <AlertCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm text-muted-foreground">Távollét</div>
                            <div className="font-medium text-orange-400 text-sm sm:text-base">
                              {availabilityData.summary.vacation_count} diák
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 sm:col-span-2 lg:col-span-1">
                          <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm text-muted-foreground">Rádiós konfliktus</div>
                            <div className="font-medium text-blue-400 text-sm sm:text-base">
                              {availabilityData.summary.radio_session_count} diák
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Assignment Status & Controls */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Settings className="h-5 w-5 text-purple-400" />
                      Beosztás Állapot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-3 rounded-lg border ${statusInfo.color}`}>
                      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-sm sm:text-base">{statusInfo.text}</span>
                          {assignment && (
                            <Badge variant="secondary" className="text-xs">
                              {crew.length} fő
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          {assignment?.stab && (
                            <StabBadge stab={assignment.stab} showMemberCount />
                          )}
                          {canEditAssignments && assignment && (
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              {!isEditMode ? (
                                // Only show edit button if assignment is not marked as done
                                !assignment.kesz && (
                                  <Button
                                    onClick={() => setIsEditMode(true)}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 w-full sm:w-auto text-xs sm:text-sm"
                                  >
                                    <Edit className="h-4 w-4" />
                                    Szerkesztés
                                  </Button>
                                )
                              ) : (
                                <Badge variant="outline" className="px-2 py-1 text-xs">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Szerkesztési mód
                                </Badge>
                              )}
                              {/* Only show mark as done/draft buttons when not in edit mode */}
                              {!isEditMode && (
                                <div className="flex gap-2 w-full sm:w-auto">
                                  {assignment.kesz ? (
                                    <Button
                                      onClick={handleMarkAsDraft}
                                      disabled={markAsDraftMutation.loading}
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1 flex-1 sm:flex-none text-xs sm:text-sm"
                                    >
                                      {markAsDraftMutation.loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Square className="h-4 w-4" />
                                      )}
                                      Módosítás
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={handleMarkAsDone}
                                      disabled={markAsDoneMutation.loading}
                                      variant="default"
                                      size="sm"
                                      className="flex items-center gap-1 flex-1 sm:flex-none text-xs sm:text-sm"
                                    >
                                      {markAsDoneMutation.loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <CheckSquare className="h-4 w-4" />
                                      )}
                                      Lezár
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {assignment && assignment.roles_summary && assignment.roles_summary.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {assignment.roles_summary.map((role: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                            <Badge key={index} variant="outline" className="text-xs">
                              {role.role}: {role.count}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Absences */}
                {assignment?.kesz && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Calendar className="h-5 w-5 text-orange-400" />
                        Automatikusan Létrehozott Hiányzások
                      </CardTitle>
                      <CardDescription className="text-sm">
                        A véglegesített beosztás alapján automatikusan létrehozott hiányzások
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {absencesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm text-muted-foreground">Hiányzások betöltése...</span>
                        </div>
                      ) : !absences || absences.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                          <div className="text-sm">Nincsenek hiányzások</div>
                          <div className="text-xs">Lehet, hogy még nem lettek létrehozva</div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground mb-3">
                            {absences.length} hiányzás létrehozva {assignment.student_count} diákhoz
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {absences.map((absence: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                              <div key={absence.id} className="flex items-start sm:items-center gap-3 p-2 rounded-lg bg-background/50 border border-border/50">
                                <UserAvatar
                                  email={absence.student.email || ''}
                                  firstName={absence.student.first_name || ''}
                                  lastName={absence.student.last_name || ''}
                                  username={absence.student.username || ''}
                                  customSize={32}
                                  className="border border-border/50 flex-shrink-0"
                                  fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-semibold"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">
                                    {absence.student.full_name || `${absence.student.last_name} ${absence.student.first_name}`}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatTime(absence.time_from)} - {formatTime(absence.time_to)}
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0">
                                  <Badge variant={absence.excused ? "default" : absence.unexcused ? "destructive" : "secondary"} className="text-xs">
                                    {absence.excused ? "Igazolt" : absence.unexcused ? "Igazolatlan" : "Függőben"}
                                  </Badge>
                                  {absence.affected_classes && absence.affected_classes.length > 0 && (
                                    <div className="text-xs text-muted-foreground" title={`Érintett órák: ${absence.affected_classes.join(', ')}`}>
                                      {absence.affected_classes.length} óra
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Crew Management */}
                {assignment && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Users className="h-5 w-5 text-purple-400" />
                            Stáb Beosztás ({filteredCrew.length}/{workingCrew.length} fő)
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Forgatásban résztvevő diákok és szerepkörük
                          </CardDescription>
                        </div>
                        {isEditMode && !assignment.kesz && (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={handleSaveChanges}
                              disabled={updateAssignmentMutation.loading}
                              className="w-full sm:w-auto text-xs sm:text-sm"
                            >
                              {updateAssignmentMutation.loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Mentés és Véglegesítés
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setIsEditMode(false)
                                setEditedCrew([])
                              }}
                              className="w-full sm:w-auto text-xs sm:text-sm"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Mégse
                            </Button>
                            <Button size="sm" onClick={() => setShowAddMemberDialog(true)} className="w-full sm:w-auto text-xs sm:text-sm">
                              <UserPlus className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">Új tag hozzáadása</span>
                              <span className="sm:hidden">Hozzáadás</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Search and Filters */}
                      <div className="flex flex-col gap-3">
                        <div className="w-full">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Keresés név, szerepkör vagy osztály szerint..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                              <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                              <SelectValue placeholder="Szerepkör" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Minden szerepkör</SelectItem>
                              {uniqueRoles.map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={stabFilter} onValueChange={setStabFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                              <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                              <SelectValue placeholder="Stáb" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Minden stáb</SelectItem>
                              {uniqueStabs.map(stab => (
                                <SelectItem key={stab} value={stab}>{stab}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      {/* Conflict Warning Panel in Edit Mode */}
                      {isEditMode && availabilityData && (
                        <>
                          {(availabilityData.users_on_vacation.length > 0 || 
                            availabilityData.users_with_radio_session.length > 0) && (
                            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 space-y-2">
                                  <div className="font-medium text-sm text-orange-600">
                                    Konfliktusok észlelve
                                  </div>
                                  {availabilityData.users_on_vacation.length > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                      <span className="font-medium text-orange-600">{availabilityData.users_on_vacation.length}</span> fő távollét miatt
                                    </div>
                                  )}
                                  {availabilityData.users_with_radio_session.length > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                      <span className="font-medium text-blue-600">{availabilityData.users_with_radio_session.length}</span> fő rádiós összejátszás miatt
                                    </div>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    A konfliktusokkal rendelkező stábtagok jelölve vannak. A mentéskor megerősítést kérünk.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Crew List */}
                      <div className="space-y-3">
                        {filteredCrew.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            {workingCrew.length === 0 ? (
                              <>
                                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-lg font-medium">Nincs stáb hozzárendelve</p>
                                <p className="text-sm">
                                  {canEditAssignments ? "Használd a szerkesztés módot stáb hozzáadásához." : ""}
                                </p>
                              </>
                            ) : (
                              <>
                                <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                                <p>Nincs találat a szűrési feltételeknek</p>
                              </>
                            )}
                          </div>
                        ) : (
                          filteredCrew.map((member) => (
                            <div
                              key={member.id}
                              className={`p-3 sm:p-4 rounded-lg border transition-colors ${
                                isEditMode && !assignment.kesz
                                  ? "bg-accent/50 border-border/50 hover:bg-accent/70" 
                                  : "bg-background/50 border-border/50 hover:bg-accent/50 cursor-pointer"
                              }`}
                              onClick={() => !isEditMode && setSelectedCrewMember(member)}
                            >
                              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                <UserAvatar
                                  email={member.email || ''}
                                  firstName={member.firstName || ''}
                                  lastName={member.lastName || ''}
                                  username={member.username || ''}
                                  customSize={40}
                                  className="border border-border/50 flex-shrink-0 sm:w-12 sm:h-12"
                                  fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-sm sm:text-base font-semibold"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                    <span className="font-semibold text-sm sm:text-base truncate">{member.name}</span>
                                    {member.stab && (
                                      <UserStabBadge stabName={member.stab} size="sm" />
                                    )}
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge variant="secondary" className="text-xs">
                                        {member.role}
                                      </Badge>
                                      <span className="whitespace-nowrap">{member.class}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {member.username && (
                                        <span className="font-mono text-xs truncate">@{member.username}</span>
                                      )}
                                      <AvailabilityIndicator 
                                        userId={member.id} 
                                        availabilityData={availabilityData} 
                                        showInEditMode={isEditMode}
                                      />
                                    </div>
                                  </div>
                                </div>
                                {isEditMode && !assignment.kesz && (
                                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                                    <Select
                                      value={member.roleId.toString()}
                                      onValueChange={(value) => handleRoleChange(member.id, value)}
                                    >
                                      <SelectTrigger className="w-full sm:w-[140px] text-xs sm:text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {(availableRoles || []).map((role: SzerepkorSchema) => (
                                          <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <RemoveStudentConfirmation
                                      student={member}
                                      onConfirm={handleRemoveMember}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4 md:space-y-6">
                {/* Quick Stats */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Statisztikák</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Összes stáb</span>
                      <Badge variant="secondary">{workingCrew.length} fő</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Szerepkörök</span>
                      <Badge variant="secondary">{uniqueRoles.length} db</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Stábok</span>
                      <Badge variant="secondary">{uniqueStabs.length} db</Badge>
                    </div>
                    {assignment && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Állapot</span>
                        <Badge variant={assignment.kesz ? "default" : "outline"} className="text-xs">
                          {assignment.kesz ? "Végleges" : "Tervezet"}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Role Distribution */}
                {uniqueRoles.length > 0 && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">Szerepkör Eloszlás</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {uniqueRoles.map(role => {
                        const count = workingCrew.filter(member => member.role === role).length
                        return (
                          <div key={role} className="flex justify-between items-center text-sm">
                            <span className="truncate flex-1 pr-2">{role}</span>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {count} fő
                            </Badge>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Crew Member Detail Modal */}
            <Dialog open={!!selectedCrewMember} onOpenChange={() => setSelectedCrewMember(null)}>
              <DialogContent className="mx-2 w-[calc(100vw-1rem)] max-w-md sm:mx-4 sm:w-[calc(100vw-2rem)] sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Stáb tag részletek
                  </DialogTitle>
                  <DialogDescription>Kapcsolattartó információk és szerepkör</DialogDescription>
                </DialogHeader>
                {selectedCrewMember && (
                  <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="text-center space-y-2">
                      <UserAvatar
                        email={selectedCrewMember.email || ''}
                        firstName={selectedCrewMember.firstName || ''}
                        lastName={selectedCrewMember.lastName || ''}
                        username={selectedCrewMember.username || ''}
                        customSize={64}
                        className="border-2 border-primary/20 mx-auto"
                        fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-semibold"
                      />
                      <h3 className="text-lg font-semibold break-words">{selectedCrewMember.name}</h3>
                      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                        <Badge variant="secondary" className="text-xs">{selectedCrewMember.role}</Badge>
                        <Badge variant="outline" className="text-xs">{selectedCrewMember.class}</Badge>
                        {selectedCrewMember.stab && (
                          <UserStabBadge stabName={selectedCrewMember.stab} />
                        )}
                      </div>
                    </div>

                    {/* Role Statistics */}
                    {userStats && (
                      <div className="space-y-3">
                        <Separator />
                        <div>
                          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Forgatási Statisztikák
                          </h4>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                              <div className="text-sm text-muted-foreground">Összes forgatás</div>
                              <div className="font-semibold text-lg">{userStats.summary.total_assignments}</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                              <div className="text-sm text-muted-foreground">Különböző szerepek</div>
                              <div className="font-semibold text-lg">{userStats.summary.total_different_roles}</div>
                            </div>
                          </div>
                          {userStats.summary.most_used_role && (
                            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                              <div className="text-sm text-muted-foreground">Leggyakoribb szerepkör</div>
                              <div className="font-medium">
                                {userStats.summary.most_used_role.name} ({userStats.summary.most_used_count}x)
                              </div>
                            </div>
                          )}
                          {userStats.role_statistics.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Szerepkör eloszlás:</div>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {userStats.role_statistics.slice(0, 5).map((roleStat) => (
                                  <div key={roleStat.role.id} className="flex justify-between items-center text-xs">
                                    <span>{roleStat.role.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {roleStat.total_times}x
                                    </Badge>
                                  </div>
                                ))}
                                {userStats.role_statistics.length > 5 && (
                                  <div className="text-xs text-muted-foreground text-center">
                                    +{userStats.role_statistics.length - 5} további szerepkör...
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {userStatsLoading && (
                      <div className="space-y-3">
                        <Separator />
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm text-muted-foreground">Statisztikák betöltése...</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {selectedCrewMember.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <div className="h-4 w-4 bg-green-400 rounded-full flex-shrink-0" />
                          <div>
                            <div className="text-sm text-muted-foreground">Telefon</div>
                            <div className="font-medium">{selectedCrewMember.phone}</div>
                          </div>
                        </div>
                      )}

                      {selectedCrewMember.email && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <div className="h-4 w-4 bg-blue-400 rounded-full flex-shrink-0" />
                          <div>
                            <div className="text-sm text-muted-foreground">Email</div>
                            <div className="font-medium">{selectedCrewMember.email}</div>
                          </div>
                        </div>
                      )}

                      {selectedCrewMember.username && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <div className="h-4 w-4 bg-purple-400 rounded-full flex-shrink-0" />
                          <div>
                            <div className="text-sm text-muted-foreground">Felhasználónév</div>
                            <div className="font-medium font-mono">@{selectedCrewMember.username}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      {selectedCrewMember.phone && (
                        <Button className="flex-1" size="sm" asChild>
                          <a href={`tel:${selectedCrewMember.phone}`}>
                            📞 Hívás
                          </a>
                        </Button>
                      )}
                      {selectedCrewMember.email && (
                        <Button variant="outline" className="flex-1 bg-transparent" size="sm" asChild>
                          <a href={`mailto:${selectedCrewMember.email}`}>
                            ✉️ Email
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Add Member Dialog */}
            <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
              <DialogContent className="mx-2 w-[calc(100vw-1rem)] max-w-md sm:mx-4 sm:w-[calc(100vw-2rem)] sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Új stáb tag hozzáadása
                  </DialogTitle>
                  <DialogDescription>
                    Válaszd ki a diákot és a szerepkört
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Diák</label>
                    <Select value={selectedNewUser} onValueChange={setSelectedNewUser}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Válassz egy diákot..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                          <SelectItem key={user.id} value={user.id.toString()}>
                            <div className="flex flex-col">
                              <span>{user.full_name || `${user.last_name} ${user.first_name}`}</span>
                              {user.username && <span className="text-muted-foreground text-xs">@{user.username}</span>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Szerepkör</label>
                    <Select value={selectedNewRole} onValueChange={setSelectedNewRole}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Válassz szerepkört..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(availableRoles || []).map((role: SzerepkorSchema) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button 
                      onClick={handleAddMember}
                      disabled={!selectedNewUser || !selectedNewRole}
                      className="w-full sm:flex-1"
                    >
                      Hozzáadás
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddMemberDialog(false)
                        setSelectedNewUser("")
                        setSelectedNewRole("")
                      }}
                      className="w-full sm:flex-1"
                    >
                      Mégse
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ApiErrorBoundary>
  )
}
