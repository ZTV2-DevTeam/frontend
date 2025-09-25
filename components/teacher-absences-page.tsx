"use client"

import { StandardizedLayout } from "@/components/standardized-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Calendar,
  Search,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Edit2,
  AlertTriangle,
} from "lucide-react"
import { useState, useEffect } from "react"
// import { useAuth } from "@/contexts/auth-context" // Unused for now
import { usePermissions } from "@/contexts/permissions-context"
import { useUserRole } from "@/contexts/user-role-context"
import {
  getSchoolAbsences,
  updateSchoolAbsence,
  getAbsenceStatusColor,
  getAbsenceStatusText,
  type Absence,
} from "@/lib/config/absences"

const SCHOOL_SCHEDULE = {
  0: { name: "0. óra", start: "07:30", end: "08:15" },
  1: { name: "1. óra", start: "08:25", end: "09:10" },
  2: { name: "2. óra", start: "09:20", end: "10:05" },
  3: { name: "3. óra", start: "10:20", end: "11:05" },
  4: { name: "4. óra", start: "11:15", end: "12:00" },
  5: { name: "5. óra", start: "12:20", end: "13:05" },
  6: { name: "6. óra", start: "13:25", end: "14:10" },
  7: { name: "7. óra", start: "14:20", end: "15:05" },
  8: { name: "8. óra", start: "15:15", end: "16:00" },
}

// Helper function to check if an absence involves the 8th period
const isEighthPeriodAffected = (absence: ExtendedAbsence): boolean => {
  return absence.affectedClasses.includes(8) || absence.affected_classes_with_student_time.includes(8)
}

// Helper function to check if a student has DSE (Student Sports Association) during 8th period
// This is a placeholder implementation - in real use, this should check against a schedule or database
const hasDSETraining = (_studentId: string, _date: string): boolean => {
  // TODO: This should be replaced with actual DSE schedule check from database
  // For now, we'll return false as a safe default
  // In a real implementation, this would query the student's schedule or DSE enrollment
  return false
}

// Helper function to determine if 8th period absence should be auto-excused
const shouldAutoExcuseEighthPeriod = (absence: ExtendedAbsence): boolean => {
  if (!isEighthPeriodAffected(absence)) {
    return false
  }
  
  // If student has no regular 8th period class and no DSE training, auto-excuse
  return !hasDSETraining(absence.studentId, absence.date)
}

// Extended absence type for UI display
type ExtendedAbsence = Absence & {
  studentName: string
  studentId: string
  studentClass: string
  shootingTitle: string
  shootingId: string
  affectedClasses: number[]
  timeFrom: string
  timeTo: string
}

// Mock data for admin preview mode when user is not a class teacher
const MOCK_ABSENCES: ExtendedAbsence[] = [
  {
    id: 1,
    diak: {
      id: 1,
      username: 'kovacs.anna',
      first_name: 'Anna',
      last_name: 'Kovács',
      full_name: 'Kovács Anna'
    },
    forgatas: {
      id: 1,
      name: 'Szalagavató Dokumentumfilm',
      date: '2024-03-15',
      time_from: '09:00',
      time_to: '15:00',
      type: 'rendes'
    },
    date: '2024-03-15',
    time_from: '09:00',
    time_to: '15:00',
    excused: false,
    unexcused: false,
    status: 'nincs_dontes',
    affected_classes: [2, 3, 4, 5, 6],
    affected_classes_with_student_time: [2, 3, 4, 5, 6],
    student_extra_time_before: 0,
    student_extra_time_after: 0,
    student_edited: false,
    student_edit_timestamp: undefined,
    student_edit_note: undefined,
    effective_time_from: '09:00',
    effective_time_to: '15:00',
    osztaly: {
      id: 1,
      name: '10.F',
      szekcio: 'Média',
      start_year: 2021
    },
    studentName: 'Kovács Anna',
    studentId: '1',
    studentClass: '10.F',
    shootingTitle: 'Szalagavató Dokumentumfilm',
    shootingId: '1',
    affectedClasses: [2, 3, 4, 5, 6],
    timeFrom: '09:00',
    timeTo: '15:00'
  },
  {
    id: 2,
    diak: {
      id: 2,
      username: 'nagy.peter',
      first_name: 'Péter',
      last_name: 'Nagy',
      full_name: 'Nagy Péter'
    },
    forgatas: {
      id: 1,
      name: 'Szalagavató Dokumentumfilm',
      date: '2024-03-15',
      time_from: '09:00',
      time_to: '15:00',
      type: 'rendes'
    },
    date: '2024-03-15',
    time_from: '09:00',
    time_to: '15:00',
    excused: true,
    unexcused: false,
    status: 'igazolt',
    affected_classes: [2, 3, 4, 5, 6],
    affected_classes_with_student_time: [1, 2, 3, 4, 5, 6, 7],
    student_extra_time_before: 30,
    student_extra_time_after: 45,
    student_edited: true,
    student_edit_timestamp: '2024-03-14T10:30:00Z',
    student_edit_note: 'Korábban kellett távoznom a forgatáshoz, és később tértem vissza.',
    effective_time_from: '08:30',
    effective_time_to: '15:45',
    osztaly: {
      id: 1,
      name: '10.F',
      szekcio: 'Média',
      start_year: 2021
    },
    studentName: 'Nagy Péter',
    studentId: '2',
    studentClass: '10.F',
    shootingTitle: 'Szalagavató Dokumentumfilm',
    shootingId: '1',
    affectedClasses: [2, 3, 4, 5, 6],
    timeFrom: '09:00',
    timeTo: '15:00'
  },
  {
    id: 3,
    diak: {
      id: 3,
      username: 'horvath.kata',
      first_name: 'Kata',
      last_name: 'Horváth',
      full_name: 'Horváth Kata'
    },
    forgatas: {
      id: 2,
      name: 'Hírműsor - Március',
      date: '2024-03-20',
      time_from: '10:30',
      time_to: '12:00',
      type: 'rendkívüli'
    },
    date: '2024-03-20',
    time_from: '10:30',
    time_to: '12:00',
    excused: false,
    unexcused: true,
    status: 'igazolatlan',
    affected_classes: [3, 4],
    affected_classes_with_student_time: [3, 4],
    student_extra_time_before: 0,
    student_extra_time_after: 0,
    student_edited: false,
    student_edit_timestamp: undefined,
    student_edit_note: undefined,
    effective_time_from: '10:30',
    effective_time_to: '12:00',
    osztaly: {
      id: 2,
      name: '10.F',
      szekcio: 'Média',
      start_year: 2022
    },
    studentName: 'Horváth Kata',
    studentId: '3',
    studentClass: '10.F',
    shootingTitle: 'Hírműsor - Március',
    shootingId: '2',
    affectedClasses: [3, 4],
    timeFrom: '10:30',
    timeTo: '12:00'
  },
  // Test case for 8th period DSE handling
  {
    id: 4,
    diak: {
      id: 4,
      username: 'kovacs.mark',
      first_name: 'Márk',
      last_name: 'Kovács',
      full_name: 'Kovács Márk'
    },
    forgatas: {
      id: 3,
      name: 'Teszt Forgatás - 8. óra',
      date: '2024-03-25',
      time_from: '15:00',
      time_to: '16:00',
      type: 'rendes'
    },
    date: '2024-03-25',
    time_from: '15:00',
    time_to: '16:00',
    excused: false,
    unexcused: false,
    status: 'nincs_dontes',
    affected_classes: [8],
    affected_classes_with_student_time: [8],
    student_extra_time_before: 0,
    student_extra_time_after: 0,
    student_edited: false,
    student_edit_timestamp: undefined,
    student_edit_note: undefined,
    effective_time_from: '15:00',
    effective_time_to: '16:00',
    osztaly: {
      id: 1,
      name: '10.F',
      szekcio: 'Média',
      start_year: 2021
    },
    studentName: 'Kovács Márk',
    studentId: '4',
    studentClass: '10.F',
    shootingTitle: 'Teszt Forgatás - 8. óra',
    shootingId: '3',
    affectedClasses: [8],
    timeFrom: '15:00',
    timeTo: '16:00'
  },
  // Test case for 0th period
  {
    id: 5,
    diak: {
      id: 5,
      username: 'szabo.eszter',
      first_name: 'Eszter',
      last_name: 'Szabó',
      full_name: 'Szabó Eszter'
    },
    forgatas: {
      id: 4,
      name: 'Reggeli Hírműsor',
      date: '2024-03-26',
      time_from: '07:30',
      time_to: '08:15',
      type: 'rendes'
    },
    date: '2024-03-26',
    time_from: '07:30',
    time_to: '08:15',
    excused: false,
    unexcused: false,
    status: 'nincs_dontes',
    affected_classes: [0],
    affected_classes_with_student_time: [0],
    student_extra_time_before: 0,
    student_extra_time_after: 0,
    student_edited: false,
    student_edit_timestamp: undefined,
    student_edit_note: undefined,
    effective_time_from: '07:30',
    effective_time_to: '08:15',
    osztaly: {
      id: 1,
      name: '10.F',
      szekcio: 'Média',
      start_year: 2021
    },
    studentName: 'Szabó Eszter',
    studentId: '5',
    studentClass: '10.F',
    shootingTitle: 'Reggeli Hírműsor',
    shootingId: '4',
    affectedClasses: [0],
    timeFrom: '07:30',
    timeTo: '08:15'
  }
]

export function TeacherAbsencesPage() {
  // const { user } = useAuth() // Unused for now
  const { permissions, hasPermission } = usePermissions()
  const { isPreviewMode, actualUserRole, currentRole } = useUserRole()
  const [allAbsences, setAllAbsences] = useState<ExtendedAbsence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<Set<number>>(new Set())
  const [isPreviewWithMockData, setIsPreviewWithMockData] = useState(false)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "excused" | "unexcused">("all")
  const [selectedStudent, setSelectedStudent] = useState<string>("all")
  const [groupBy, setGroupBy] = useState<"shooting" | "student">("shooting")

  // Check if user can access real absence data
  const canAccessAbsenceData = hasPermission('is_osztaly_fonok') || 
                               permissions?.permissions?.is_osztaly_fonok ||
                               permissions?.display_properties?.show_class_management

  // Check if we should use mock data - this covers multiple scenarios:
  // 1. Admin in preview mode as class-teacher without actual permissions
  // 2. Admin accessing directly without permissions
  // 3. Any user viewing class-teacher view without actual class-teacher permissions
  // 4. Class-teacher in preview mode as student should NOT use mock data (they should see real student view)
  const shouldUseMockData = (currentRole === 'class-teacher' && !canAccessAbsenceData) ||
                           (isPreviewMode && actualUserRole === 'admin' && !canAccessAbsenceData)

  // Debug logging
  useEffect(() => {
    console.log('🔍 TeacherAbsencesPage Debug:', {
      currentRole,
      isPreviewMode,
      actualUserRole,
      canAccessAbsenceData,
      shouldUseMockData,
      hasPermissionOsztalyFonok: hasPermission('is_osztaly_fonok'),
      permissionsOsztalyFonok: permissions?.permissions?.is_osztaly_fonok,
      showClassManagement: permissions?.display_properties?.show_class_management,
      permissions: permissions
    })
  }, [currentRole, isPreviewMode, actualUserRole, canAccessAbsenceData, shouldUseMockData, permissions, hasPermission])

  // Load absences from API or use mock data
  const loadAbsences = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use mock data immediately if user doesn't have class teacher permissions
      if (shouldUseMockData) {
        console.log('🎭 User viewing class-teacher interface without permissions: Using mock absence data immediately')
        setAllAbsences(MOCK_ABSENCES)
        setIsPreviewWithMockData(true)
        setLoading(false)
        return
      }

      // Try to fetch real data
      console.log('📡 Attempting to fetch real absence data...')
      const rawAbsences = await getSchoolAbsences()
      
      // Transform to extended format for UI
      const transformedAbsences: ExtendedAbsence[] = rawAbsences.map(absence => ({
        ...absence,
        studentName: absence.diak.full_name,
        studentId: absence.diak.id.toString(),
        studentClass: absence.osztaly?.name || "Ismeretlen",
        shootingTitle: absence.forgatas.name,
        shootingId: absence.forgatas.id.toString(),
        affectedClasses: absence.affected_classes,
        timeFrom: absence.time_from,
        timeTo: absence.time_to
      }))
      
      setAllAbsences(transformedAbsences)
      setIsPreviewWithMockData(false)
      console.log('✅ Successfully loaded real absence data')
    } catch (err) {
      console.error('❌ Error loading absences:', err)
      
      // If user doesn't have permissions (especially admin in preview mode), fall back to mock data
      // Note: class-teachers previewing as students should get real student data, not mock data
      if (!canAccessAbsenceData || (isPreviewMode && actualUserRole === 'admin')) {
        console.log('🎭 Permission fallback: API error for user without permissions, using mock data instead')
        setAllAbsences(MOCK_ABSENCES)
        setIsPreviewWithMockData(true)
        setError(null) // Clear the error since we're showing mock data
      } else {
        setError(err instanceof Error ? err.message : 'Hiba történt a hiányzások betöltése során')
      }
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    loadAbsences()
  }, [])

  const filteredAbsences = allAbsences.filter((absence) => {
    const matchesSearch =
      absence.shootingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.date.includes(searchTerm)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !absence.excused && !absence.unexcused) ||
      (statusFilter === "excused" && absence.excused) ||
      (statusFilter === "unexcused" && absence.unexcused)

    const matchesStudent = selectedStudent === "all" || absence.studentId === selectedStudent

    return matchesSearch && matchesStatus && matchesStudent
  })

  const getStatusIcon = (absence: ExtendedAbsence) => {
    if (absence.excused) return CheckCircle
    if (absence.unexcused) return XCircle
    return AlertCircle
  }

  const getClassCircleColor = (classNum: number, absence: ExtendedAbsence) => {
    if (!absence.affectedClasses.includes(classNum)) {
      return "bg-gray-700/50 text-gray-500 border border-gray-600/30" // Nem érintett óra
    }

    // Special styling for 8th period to make it more visible
    const isEighth = classNum === 8
    const shadowIntensity = isEighth ? "shadow-xl" : "shadow-lg"
    const pulseEffect = isEighth && !absence.excused && !absence.unexcused ? " animate-pulse" : ""

    if (absence.excused) {
      return `bg-green-500 text-white ${shadowIntensity} shadow-green-500/25${pulseEffect}` // Igazolt
    } else if (absence.unexcused) {
      return `bg-red-500 text-white ${shadowIntensity} shadow-red-500/25${pulseEffect}` // Igazolatlan
    } else {
      return `bg-yellow-500 text-white ${shadowIntensity} shadow-yellow-500/25${pulseEffect}` // Elbírálás alatt
    }
  }

  const stats = {
    total: allAbsences.length,
    pending: allAbsences.filter((a) => !a.excused && !a.unexcused).length,
    excused: allAbsences.filter((a) => a.excused).length,
    unexcused: allAbsences.filter((a) => a.unexcused).length,
  }

  const uniqueStudents = Array.from(new Set(allAbsences.map((a) => ({ id: a.studentId, name: a.studentName }))))

  // Check if there are any pending 8th period absences
  const pendingEighthPeriodAbsences = filteredAbsences.filter(absence => 
    isEighthPeriodAffected(absence) && !absence.excused && !absence.unexcused
  )
  
  const hasAutoExcusableEighthPeriod = pendingEighthPeriodAbsences.some(absence =>
    shouldAutoExcuseEighthPeriod(absence)
  )

  const handleApprove = async (absenceId: number) => {
    // If using mock data (admin in preview mode), just update the local state
    if (shouldUseMockData || isPreviewWithMockData) {
      console.log('🎭 Mock action: Approving absence', absenceId)
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: true, unexcused: false, status: 'igazolt' as const }
          : absence
      ))
      return
    }

    try {
      setUpdating(prev => new Set(prev).add(absenceId))
      
      await updateSchoolAbsence(absenceId, {
        excused: true,
        unexcused: false
      })
      
      // Update local state
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: true, unexcused: false, status: 'igazolt' as const }
          : absence
      ))
      
    } catch (err) {
      console.error('Error approving absence:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt az igazolás során')
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev)
        newSet.delete(absenceId)
        return newSet
      })
    }
  }

  const handleReject = async (absenceId: number) => {
    // If using mock data (admin in preview mode), just update the local state
    if (shouldUseMockData || isPreviewWithMockData) {
      console.log('🎭 Mock action: Rejecting absence', absenceId)
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: false, unexcused: true, status: 'igazolatlan' as const }
          : absence
      ))
      return
    }

    try {
      setUpdating(prev => new Set(prev).add(absenceId))
      
      await updateSchoolAbsence(absenceId, {
        excused: false,
        unexcused: true
      })
      
      // Update local state
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: false, unexcused: true, status: 'igazolatlan' as const }
          : absence
      ))
      
    } catch (err) {
      console.error('Error rejecting absence:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt az elutasítás során')
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev)
        newSet.delete(absenceId)
        return newSet
      })
    }
  }

  const handleReset = async (absenceId: number) => {
    // If using mock data (admin in preview mode), just update the local state
    if (shouldUseMockData || isPreviewWithMockData) {
      console.log('🎭 Mock action: Resetting absence status', absenceId)
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: false, unexcused: false, status: 'nincs_dontes' as const }
          : absence
      ))
      return
    }

    try {
      setUpdating(prev => new Set(prev).add(absenceId))
      
      await updateSchoolAbsence(absenceId, {
        excused: false,
        unexcused: false
      })
      
      // Update local state
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: false, unexcused: false, status: 'nincs_dontes' as const }
          : absence
      ))
      
    } catch (err) {
      console.error('Error resetting absence status:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt a státusz visszaállításakor')
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev)
        newSet.delete(absenceId)
        return newSet
      })
    }
  }

  const handleAutoExcuseEighthPeriod = async (absenceId: number) => {
    // If using mock data (admin in preview mode), just update the local state
    if (shouldUseMockData || isPreviewWithMockData) {
      console.log('🎭 Mock action: Auto-excusing 8th period absence', absenceId)
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: true, unexcused: false, status: 'igazolt' as const }
          : absence
      ))
      return
    }

    try {
      setUpdating(prev => new Set(prev).add(absenceId))
      
      await updateSchoolAbsence(absenceId, {
        excused: true,
        unexcused: false
      })
      
      // Update local state
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: true, unexcused: false, status: 'igazolt' as const }
          : absence
      ))
      
    } catch (err) {
      console.error('Error auto-excusing 8th period absence:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt az automatikus igazolás során')
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev)
        newSet.delete(absenceId)
        return newSet
      })
    }
  }

  // Csoportosítás logika
  const groupedAbsences =
    groupBy === "shooting"
      ? filteredAbsences.reduce(
          (groups: Record<string, { shootingTitle: string; date: string; absences: ExtendedAbsence[] }>, absence) => {
            const key = `${absence.shootingId}-${absence.date}`
            if (!groups[key]) {
              groups[key] = {
                shootingTitle: absence.shootingTitle,
                date: absence.date,
                absences: [],
              }
            }
            groups[key].absences.push(absence)
            return groups
          },
          {},
        )
      : filteredAbsences.reduce(
          (groups: Record<string, { studentName: string; studentClass: string; absences: ExtendedAbsence[] }>, absence) => {
            const key = absence.studentId
            if (!groups[key]) {
              groups[key] = {
                studentName: absence.studentName,
                studentClass: absence.studentClass,
                absences: [],
              }
            }
            groups[key].absences.push(absence)
            return groups
          },
          {},
        )

  if (loading) {
    return (
      <StandardizedLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Adatok betöltése...</span>
        </div>
      </StandardizedLayout>
    )
  }

  return (
    <StandardizedLayout>
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-xl shadow-sm">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Igazolások</h1>
              <div className="flex items-center gap-2">
                <p className="text-base text-muted-foreground">
                  {filteredAbsences.length} hiányzás • Elbírálás alatt: {stats.pending} • Igazolt: {stats.excused} • Igazolatlan: {stats.unexcused}
                </p>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
                  {shouldUseMockData || isPreviewWithMockData 
                    ? 'Admin Előnézet' 
                    : isPreviewMode && actualUserRole === 'class-teacher' 
                      ? 'Ofő Előnézet'
                      : 'Osztályfőnök'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={loadAbsences} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Frissítés
            </Button>
          </div>
        </div>

        {/* Mock Data Banner */}
        {(shouldUseMockData || isPreviewWithMockData) && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-400 mb-1">Demo Adatok Megjelenítése</h4>
                  <p className="text-amber-300 text-sm">
                    Ez egy adminisztrátori előnézet. Mivel nem vagy osztályfőnök, demo adatok kerülnek megjelenítésre. 
                    A valós igazoláskezelési funkcióhoz osztályfőnöki jogosultság szükséges.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Alert */}
        {error && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{error}</p>
                <Button onClick={() => setError(null)} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Összes hiányzás</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Elbírálás alatt</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold">{stats.excused}</div>
                  <div className="text-sm text-muted-foreground">Igazolt</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-400" />
                <div>
                  <div className="text-2xl font-bold">{stats.unexcused}</div>
                  <div className="text-sm text-muted-foreground">Igazolatlan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Keresés diák, forgatás vagy dátum alapján..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Csoportosítás kapcsoló */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-md border border-border bg-background/50">
                  <span className="text-sm font-medium">Csoportosítás:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGroupBy(groupBy === "shooting" ? "student" : "shooting")}
                    className="h-8 p-1 hover:bg-transparent"
                  >
                    {groupBy === "shooting" ? (
                      <ToggleLeft className="h-5 w-5 text-blue-400" />
                    ) : (
                      <ToggleRight className="h-5 w-5 text-blue-400" />
                    )}
                  </Button>
                  <span className="text-sm font-medium text-blue-400">
                    {groupBy === "shooting" ? "Forgatás" : "Diák"}
                  </span>
                </div>

                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="px-3 py-2 rounded-md border border-border bg-background/50 text-sm min-w-[140px]"
                >
                  <option value="all">Minden diák</option>
                  {uniqueStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className="bg-transparent"
                  >
                    Összes
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                    className="bg-transparent"
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Elbírálás alatt
                  </Button>
                  <Button
                    variant={statusFilter === "excused" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("excused")}
                    className="bg-transparent"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Igazolt
                  </Button>
                  <Button
                    variant={statusFilter === "unexcused" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("unexcused")}
                    className="bg-transparent"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Igazolatlan
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              <span className="text-muted-foreground font-medium block sm:inline">Jelmagyarázat:</span>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-green-500/25 flex-shrink-0">
                    1
                  </div>
                  <span>Igazolt hiányzás</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-red-500/25 flex-shrink-0">
                    2
                  </div>
                  <span>Igazolatlan hiányzás</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-yellow-500/25 flex-shrink-0">
                    3
                  </div>
                  <span>Elbírálás alatt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-700/50 border border-gray-600/30 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                    4
                  </div>
                  <span>Nem érintett óra</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <Edit2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span>Diák által korrigált</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8th Period DSE Global Warning */}
        {pendingEighthPeriodAbsences.length > 0 && (
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-400">8. órai hiányzások észlelve</h4>
                    <p className="text-sm text-orange-300">
                      {pendingEighthPeriodAbsences.length} diáknak van 8. órában hiányzása. 
                      Ha a diáknak nincs 8. órája, akkor DSE edzést kell igazolni. 
                      Ha DSE sincs, automatikusan igazoltnak jelölhető, ezzel figyelmen kívül helyezhető az &quot;Auto igazol&quot; gombbal.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-orange-400">
                      <span>Érintett diákok:</span>
                      <span className="font-medium">
                        {pendingEighthPeriodAbsences.map(a => a.studentName).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Bulk auto-excuse button if there are auto-excusable absences */}
                {hasAutoExcusableEighthPeriod && (
                  <Button
                    size="sm"
                    onClick={() => {
                      // Auto-excuse all eligible 8th period absences
                      pendingEighthPeriodAbsences
                        .filter(absence => shouldAutoExcuseEighthPeriod(absence))
                        .forEach(absence => handleAutoExcuseEighthPeriod(absence.id))
                    }}
                    disabled={updating.size > 0}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 flex-shrink-0"
                    title="Automatikus igazolás minden jogosult 8. órai hiányzásra"
                  >
                    {updating.size > 0 ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Összes Auto igazol
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Absences List */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Osztály Hiányzások ({filteredAbsences.length})
              <Badge variant="outline" className="ml-2">
                {groupBy === "shooting" ? "Forgatás szerint" : "Diák szerint"}
              </Badge>
            </CardTitle>
            <CardDescription>Diákok forgatások alapján automatikusan generált hiányzásai</CardDescription>
          </CardHeader>
          <CardContent className="overflow-visible">
            {Object.keys(groupedAbsences).length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nincs hiányzás</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || selectedStudent !== "all"
                    ? "Nincs a szűrési feltételeknek megfelelő hiányzás."
                    : "Jelenleg nincs rögzített hiányzás az osztályban."}
                </p>
              </div>
            ) : (
              <div className="space-y-8 overflow-visible">
                {Object.entries(groupedAbsences).map(([key, group], groupIndex) => (
                  <div key={key} className="space-y-4">
                    {/* Csoport fejléc */}
                    <div className="flex items-center gap-3 pb-3 border-b border-border/30">
                      <h3 className="font-semibold text-xl">
                        {groupBy === "shooting"
                          ? `${(group as any).shootingTitle} - ${(group as any).date}`
                          : `${(group as any).studentName} (${(group as any).studentClass})`}
                      </h3>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {(group as any).absences.length} hiányzás
                      </Badge>
                    </div>

                    {/* Csoport elemei */}
                    <div className="space-y-3 ml-6 overflow-visible">
                      {(group as any).absences.map((absence: ExtendedAbsence, index: number) => {
                        const StatusIcon = getStatusIcon(absence)
                        const isUpdating = updating.has(absence.id)

                        return (
                          <div
                            key={absence.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 rounded-lg bg-background/30 border border-border/30 hover:bg-background/50 transition-all duration-200 overflow-visible"
                            style={{ animationDelay: `${groupIndex * 100 + index * 50}ms` }}
                          >
                              {/* Tanórák körök - Mobile optimized with extra padding to prevent shadow clipping */}
                            <div className="flex gap-1.5 sm:gap-2 py-4 px-3 -mx-2 scrollbar-hide" 
                                 style={{ overflowX: 'auto', overflowY: 'visible' }}>
                              {Object.keys(SCHOOL_SCHEDULE).map((classNum) => {
                                const num = Number.parseInt(classNum)
                                return (
                                  <div
                                    key={num}
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all hover:scale-110 flex-shrink-0 ${getClassCircleColor(
                                      num,
                                      absence,
                                    )}`}
                                    title={`${SCHOOL_SCHEDULE[num as keyof typeof SCHOOL_SCHEDULE].name} (${
                                      SCHOOL_SCHEDULE[num as keyof typeof SCHOOL_SCHEDULE].start
                                    }-${SCHOOL_SCHEDULE[num as keyof typeof SCHOOL_SCHEDULE].end})`}
                                  >
                                    {num}
                                  </div>
                                )
                              })}
                            </div>

                            {/* Tanuló neve és információk */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                <h4 className="font-medium text-base sm:text-lg truncate">
                                  {groupBy === "shooting" ? absence.studentName : absence.shootingTitle}
                                </h4>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="font-medium">
                                    {groupBy === "shooting" ? absence.studentClass : absence.date}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                  {absence.student_edited ? (
                                    <>
                                      <span className="line-through opacity-60">
                                        {absence.timeFrom} - {absence.timeTo}
                                      </span>
                                      <span className="ml-2 font-medium text-purple-600">
                                        {absence.effective_time_from} - {absence.effective_time_to}
                                      </span>
                                    </>
                                  ) : (
                                    `${absence.timeFrom} - ${absence.timeTo}`
                                  )}
                                </p>
                                {absence.student_edited && (
                                  <div className="flex items-center gap-1 text-xs text-purple-600">
                                    <Edit2 className="h-3 w-3" />
                                    <span>Diák által korrigálva</span>
                                    {absence.student_edit_timestamp && (
                                      <span className="text-muted-foreground hidden sm:inline">
                                        - {new Date(absence.student_edit_timestamp).toLocaleString('hu-HU')}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {absence.student_edit_note && (
                                  <p className="text-xs text-purple-700 dark:text-purple-300 italic">
                                    &ldquo;{absence.student_edit_note}&rdquo;
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Státusz és akciók - Mobile optimized */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                              <Badge className={`${getAbsenceStatusColor(absence)} px-3 py-1 text-center sm:text-left`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {getAbsenceStatusText(absence)}
                              </Badge>

                              <div className="flex flex-col sm:flex-row gap-2">
                                {/* Three-way switch: Pending / Excused / Unexcused */}
                                {!absence.excused && !absence.unexcused ? (
                                  <>
                                    {/* Pending state - show approve and reject buttons */}
                                    <Button
                                      size="sm"
                                      onClick={() => handleApprove(absence.id)}
                                      disabled={isUpdating}
                                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30 h-9 px-3 w-full sm:w-auto"
                                      title="Igazolt hiányzásnak jelöli"
                                    >
                                      {isUpdating ? (
                                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                      ) : (
                                        <Check className="h-4 w-4 mr-1" />
                                      )}
                                      <span className="sm:inline">Igazol</span>
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReject(absence.id)}
                                      disabled={isUpdating}
                                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30 h-9 px-3 w-full sm:w-auto"
                                      title="Igazolatlan hiányzásnak jelöli"
                                    >
                                      {isUpdating ? (
                                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                      ) : (
                                        <X className="h-4 w-4 mr-1" />
                                      )}
                                      <span className="sm:inline">Elutasít</span>
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    {/* Already decided state - show reset button */}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReset(absence.id)}
                                      disabled={isUpdating}
                                      className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-600 border-orange-500/30 h-9 px-3 w-full sm:w-auto"
                                      title="Visszaállítja függőben állapotra - lehetővé teszi az újbóli döntést"
                                    >
                                      {isUpdating ? (
                                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                      ) : (
                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                      )}
                                      <span className="sm:inline">Visszavon</span>
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StandardizedLayout>
  )
}
