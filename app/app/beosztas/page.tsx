"use client"

import React, { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { BeosztasSchema, BeosztasDetailSchema, UserDetailSchema, SzerepkorRelacioSchema, SzerepkorSchema, ForgatSchema, UserPermissionsSchema, TavolletSchema } from "@/lib/types"
import { apiClient } from "@/lib/api"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  History,
  RefreshCw,
  Plus,
  X,
  ChevronDown,
  Camera,
  Radio,
  Sparkles,
  BookOpen,
  Save,
  UserPlus,
  Settings,
  Info
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Role restrictions by year
interface RoleRestriction {
  years: string[]
  optional?: boolean
  count?: number
}

interface RoleHistory {
  studentId: number
  roleName: string
  count: number
  lastAssigned: string | null
  performances: string[] // Array of dates when they performed this role
}

interface StudentRoleSummary {
  student: UserDetailSchema
  totalAssignments: number
  lastAssignment: string | null
  roleFrequency: Record<string, number>
}

const ROLE_RESTRICTIONS: Record<string, RoleRestriction> = {
  // Regular filming roles (Rendes forgatás)
  'Mentor': { years: ['11F'], optional: true },
  'Riporter': { years: ['10F'] },
  'Operatőr': { years: ['9F'] },
  'Asszisztens': { years: ['NYF'] },
  'Stábvezető': { years: ['10F'] },
  
  // KaCsa (Duck) show roles - 9F  
  'Kacsa Operatőr': { years: ['9F'], count: 3 },
  'Bejátszó': { years: ['9F'] },
  'Feliratozó': { years: ['9F'] },
  
  // KaCsa show roles - 10F
  'Szerkesztő': { years: ['10F'] },
  'Rendező': { years: ['10F', '11F'] },
  'Rendezőasszisztens': { years: ['10F'] },
  'Műsorvezető 1': { years: ['10F', '11F'] },
  'Műsorvezető 2': { years: ['10F'] },
  'Látványtervező': { years: ['10F'] },
  'Vezető operatőr': { years: ['10F', '11F'] },
  'Hangvágó': { years: ['10F'] },
  'Képvágó': { years: ['10F'] },
  'Bejátszó mentor': { years: ['10F'] },
  'Feliratozó mentor': { years: ['10F'] },
  'Technikus 1': { years: ['10F'] },
  'Technikus 2': { years: ['10F'] },
  
  // KaCsa show roles - NYF
  'Kacsa Asszisztens': { years: ['NYF'], count: 4 },
} as const;

export default function BeosztasPage() {
  // State for filming sessions and assignments
  const [filmingSessions, setFilmingSessions] = useState<ForgatSchema[]>([])
  const [assignments, setAssignments] = useState<BeosztasDetailSchema[]>([])
  const [availableStudents, setAvailableStudents] = useState<UserDetailSchema[]>([])
  const [roles, setRoles] = useState<SzerepkorSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // UI state
  const [selectedSession, setSelectedSession] = useState<ForgatSchema | null>(null)
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set())
  const [currentAssignments, setCurrentAssignments] = useState<Record<string, { student: UserDetailSchema, role: string }[]>>({})
  const [unsavedChanges, setUnsavedChanges] = useState<Record<number, boolean>>({})
  const [roleHistory, setRoleHistory] = useState<RoleHistory[]>([])
  const [permissions, setPermissions] = useState<UserPermissionsSchema | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionDate, setNewSessionDate] = useState("");
  const [newSessionDescription, setNewSessionDescription] = useState("");
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedSessionForAssignment, setSelectedSessionForAssignment] = useState<ForgatSchema | null>(null);
  const [newAssignmentRole, setNewAssignmentRole] = useState("");
  const [newAssignmentStudent, setNewAssignmentStudent] = useState<UserDetailSchema | null>(null);

  // Check if user has admin permissions for assignments
  const canManageAssignments = () => {
    if (!permissions) return false
    return permissions.permissions.can_manage_forgatas || 
           permissions.permissions.is_developer_admin || 
           permissions.permissions.is_teacher_admin || 
           permissions.permissions.is_system_admin
  }

  // Mock role history data (in a real app, this would come from the API)
  const generateMockRoleHistory = (): RoleHistory[] => {
    const history: RoleHistory[] = []
    const roles = Object.keys(ROLE_RESTRICTIONS)
    const dates = [
      '2024-11-15', '2024-10-20', '2024-09-25', '2024-08-30', 
      '2024-07-15', '2024-06-20', '2024-05-25', '2024-04-30'
    ]
    
    availableStudents.forEach(student => {
      roles.forEach(role => {
        const restriction = ROLE_RESTRICTIONS[role]
        const studentClass = student.osztaly?.name || ''
        
        if (restriction.years.some(year => studentClass.includes(year))) {
          const assignmentCount = Math.floor(Math.random() * 6) // 0-5 times
          const performances = dates.slice(0, assignmentCount).sort().reverse()
          
          if (assignmentCount > 0) {
            history.push({
              studentId: student.id,
              roleName: role,
              count: assignmentCount,
              lastAssigned: performances[0] || null,
              performances
            })
          }
        }
      })
    })
    
    return history
  }

  const getRoleHistoryForStudent = (studentId: number, roleName: string): RoleHistory | null => {
    return roleHistory.find(h => h.studentId === studentId && h.roleName === roleName) || null
  }

  const getSortedStudentsForRole = (roleName: string): UserDetailSchema[] => {
    const restriction = ROLE_RESTRICTIONS[roleName as keyof typeof ROLE_RESTRICTIONS]
    if (!restriction) return []
    
    const eligibleStudents = availableStudents.filter(student => {
      const studentClass = student.osztaly?.name || ''
      return restriction.years.some(year => studentClass.includes(year))
    })

    // Sort by role experience (least experienced first, then by how long since last assignment)
    return eligibleStudents.sort((a, b) => {
      const aHistory = getRoleHistoryForStudent(a.id, roleName)
      const bHistory = getRoleHistoryForStudent(b.id, roleName)
      
      const aCount = aHistory?.count || 0
      const bCount = bHistory?.count || 0
      
      // First priority: fewer times in this role
      if (aCount !== bCount) {
        return aCount - bCount
      }
      
      // Second priority: longer time since last assignment
      const aLastDate = aHistory?.lastAssigned ? new Date(aHistory.lastAssigned).getTime() : 0
      const bLastDate = bHistory?.lastAssigned ? new Date(bHistory.lastAssigned).getTime() : 0
      
      return aLastDate - bLastDate // Earlier dates first (longer time ago)
    })
  }

  const getStudentRoleSummary = (studentId: number): StudentRoleSummary | null => {
    const student = availableStudents.find(s => s.id === studentId)
    if (!student) return null

    const studentHistory = roleHistory.filter(h => h.studentId === studentId)
    const totalAssignments = studentHistory.reduce((sum, h) => sum + h.count, 0)
    const lastAssignment = studentHistory
      .filter(h => h.lastAssigned)
      .sort((a, b) => new Date(b.lastAssigned!).getTime() - new Date(a.lastAssigned!).getTime())[0]?.lastAssigned || null

    const roleFrequency: Record<string, number> = {}
    studentHistory.forEach(h => {
      roleFrequency[h.roleName] = h.count
    })

    return {
      student,
      totalAssignments,
      lastAssignment,
      roleFrequency
    }
  }

  const addStudentToRole = (sessionId: number, roleId: number, student: UserDetailSchema) => {
    try {
      const key = `${sessionId}-${roleId}`;
      setCurrentAssignments(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), { student, role: roles.find(r => r.id === roleId)?.name || '' }]
      }));
      setUnsavedChanges(prev => ({ ...prev, [sessionId]: true }));
      showFeedback('Student added to role successfully!', 'success');
    } catch (error) {
      showFeedback('Failed to add student to role.', 'error');
    }
  }

  const removeStudentFromRole = (sessionId: number, roleId: number, studentId: number) => {
    try {
      const key = `${sessionId}-${roleId}`;
      setCurrentAssignments(prev => ({
        ...prev,
        [key]: (prev[key] || []).filter(assignment => assignment.student.id !== studentId)
      }));
      setUnsavedChanges(prev => ({ ...prev, [sessionId]: true }));
      showFeedback('Student removed from role successfully!', 'success');
    } catch (error) {
      showFeedback('Failed to remove student from role.', 'error');
    }
  }

  // Calculate assignment progress for each session
  const getAssignmentProgress = (sessionId: number) => {
    const session = filmingSessions.find(s => s.id === sessionId);
    if (!session) return { filled: 0, total: 0, percentage: 0, progressClass: "text-gray-500" };
    
    const relevantRoles = getRelevantRolesForSession(session);
    const sessionKeys = Object.keys(currentAssignments).filter(key => key.startsWith(`${sessionId}-`));
    const totalRoles = relevantRoles.length;
    const filledRoles = sessionKeys.length;
    const percentage = totalRoles > 0 ? (filledRoles / totalRoles) * 100 : 0;
    
    let progressClass = "";
    if (percentage === 0) {
      progressClass = "text-gray-500";
    } else if (percentage < 100) {
      progressClass = "text-amber-600";
    } else {
      progressClass = "text-green-600";
    }
    
    return {
      filled: filledRoles,
      total: totalRoles,
      percentage,
      progressClass
    };
  };

  const saveAssignments = async (sessionId: number) => {
    try {
      // Get all assignments for this session
      const sessionAssignments = Object.entries(currentAssignments)
        .filter(([key]) => key.startsWith(`${sessionId}-`))
        .flatMap(([key, assignments]) => {
          const roleId = parseInt(key.split('-')[1])
          return assignments.map(assignment => ({
            user_id: assignment.student.id,
            szerepkor_id: roleId
          }))
        })

      if (sessionAssignments.length === 0) {
        console.log('No assignments to save for session', sessionId)
        setUnsavedChanges(prev => ({ ...prev, [sessionId]: false }))
        return
      }

      // Check if assignment already exists for this session
      const existingAssignment = assignments.find(a => a.forgatas.id === sessionId)
      
      if (existingAssignment) {
        // Update existing assignment
        console.log('Updating existing assignment:', existingAssignment.id)
        await apiClient.updateFilmingAssignment(existingAssignment.id, {
          student_role_pairs: sessionAssignments
        })
      } else {
        // Create new assignment
        console.log('Creating new assignment for session:', sessionId)
        await apiClient.createFilmingAssignment({
          forgatas_id: sessionId,
          student_role_pairs: sessionAssignments
        })
      }

      // Refresh assignments data
      await fetchData()
      setUnsavedChanges(prev => ({ ...prev, [sessionId]: false }))
      
      console.log('Assignments saved successfully for session', sessionId)
    } catch (error) {
      console.error('Error saving assignments:', error)
      setError(`Hiba történt a beosztás mentése során: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`)
    }
  }

  const finalizeAssignment = async (sessionId: number) => {
    try {
      const existingAssignment = assignments.find(a => a.forgatas.id === sessionId)
      if (!existingAssignment) {
        // Save first if assignment doesn't exist
        await saveAssignments(sessionId)
        const updatedAssignments = await apiClient.getFilmingAssignments()
        const newAssignment = updatedAssignments.find(a => a.forgatas.id === sessionId)
        if (newAssignment) {
          await apiClient.finalizeFilmingAssignment(newAssignment.id)
        }
      } else {
        await apiClient.finalizeFilmingAssignment(existingAssignment.id)
      }

      // Refresh data to show updated status
      await fetchData()
      console.log('Assignment finalized successfully for session', sessionId)
    } catch (error) {
      console.error('Error finalizing assignment:', error)
      setError(`Hiba történt a beosztás véglegesítése során: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current date for filtering future sessions
      const today = new Date().toISOString().split('T')[0]
      
      console.log('Fetching filming sessions from:', today)
      const [sessionsData, studentsData, rolesData, permissionsData] = await Promise.all([
        apiClient.getFilmingSessions(today).catch(() => []), // Only future sessions
        apiClient.getAllUsersDetailed('student').catch(() => []),
        apiClient.getRoles().catch(() => []),
        apiClient.getPermissions().catch(() => null) // Add permissions to the parallel requests
      ])
      
      console.log('Filming sessions:', sessionsData)
      console.log('Students:', studentsData)
      console.log('Roles:', rolesData)
      console.log('Permissions:', permissionsData)
      
      setFilmingSessions(sessionsData)
      setAvailableStudents(studentsData)
      setRoles(rolesData)
      setPermissions(permissionsData)
      
      // Generate mock role history after students are loaded
      setTimeout(() => {
        const history = generateMockRoleHistory()
        setRoleHistory(history)
      }, 100)
      
      // Fetch assignments using the filming assignments API
      try {
        const assignmentsData = await apiClient.getFilmingAssignments()
        console.log('Filming assignments:', assignmentsData)
        setAssignments(assignmentsData as BeosztasSchema[])
        
        // Convert assignments to currentAssignments format
        const currentAssignmentsData: Record<string, { student: UserDetailSchema, role: string }[]> = {}
        assignmentsData.forEach((assignment: any) => {
          assignment.szerepkor_relaciok?.forEach((relation: any) => {
            const key = `${assignment.forgatas.id}-${relation.szerepkor.id}`
            if (!currentAssignmentsData[key]) {
              currentAssignmentsData[key] = []
            }
            currentAssignmentsData[key].push({
              student: relation.user,
              role: relation.szerepkor.name
            })
          })
        })
        setCurrentAssignments(currentAssignmentsData)
      } catch (assignmentError) {
        console.warn('Could not fetch filming assignments:', assignmentError)
        setAssignments([])
        setCurrentAssignments({})
      }
      
    } catch (err) {
      console.error('Error fetching data:', err)
      if (err instanceof Error) {
        setError(`Hiba történt az adatok betöltése során: ${err.message}`)
      } else {
        setError('Hiba történt az adatok betöltése során')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    async function loadPermissions() {
      try {
        const perms = await apiClient.getPermissions();
        setPermissions(perms);
      } catch (err) {
        setPermissions(null);
      }
    }
    loadPermissions();
  }, []);

  const toggleSessionExpansion = (sessionId: number) => {
    const newExpanded = new Set(expandedSessions)
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId)
    } else {
      newExpanded.add(sessionId)
    }
    setExpandedSessions(newExpanded)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5) // Remove seconds
  }

  const createNewSession = async () => {
    try {
      if (!newSessionName || !newSessionDate) {
        setError("A név és a dátum megadása kötelező.");
        return;
      }

      const newSession = {
        name: newSessionName,
        date: newSessionDate,
        description: newSessionDescription,
        time_from: "08:00", // Default start time
        time_to: "16:00", // Default end time
        type: "default", // Default type
      };

      await apiClient.createFilmingSession(newSession);
      setIsCreateModalOpen(false);
      setNewSessionName("");
      setNewSessionDate("");
      setNewSessionDescription("");
      await fetchData();
    } catch (err) {
      console.error("Error creating new session:", err);
      setError("Hiba történt az új forgatás létrehozása során.");
    }
  };

  const createNewAssignment = async () => {
    try {
      if (!selectedSessionForAssignment || !newAssignmentRole || !newAssignmentStudent) {
        setError("Minden mező kitöltése kötelező.");
        return;
      }

      const roleId = roles.find((role) => role.name === newAssignmentRole)?.id;
      if (!roleId) {
        setError("Érvénytelen szerepkör azonosító.");
        return;
      }

      const newAssignment = {
        forgatas_id: selectedSessionForAssignment.id,
        student_role_pairs: [
          {
            user_id: newAssignmentStudent.id,
            szerepkor_id: roleId,
          },
        ],
      };

      await apiClient.createFilmingAssignment(newAssignment);
      setIsAssignmentModalOpen(false);
      setNewAssignmentRole("");
      setNewAssignmentStudent(null);
      await fetchData();
    } catch (err) {
      console.error("Error creating new assignment:", err);
      setError("Hiba történt az új beosztás létrehozása során.");
    }
  };

  const showFeedback = (message: string, type: 'success' | 'error') => {
    // You can replace this with a proper toast notification system
    alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
  };

  const getRelevantRolesForSession = (session: ForgatSchema): SzerepkorSchema[] => {
    // Filter roles based on session type if needed
    if (session.type === 'kacsa') {
      return roles.filter(role => 
        role.name.toLowerCase().includes('kacsa') || 
        ['Rendező', 'Szerkesztő', 'Műsorvezető 1', 'Műsorvezető 2', 'Látványtervező', 'Vezető operatőr', 'Hangvágó', 'Képvágó', 'Bejátszó mentor', 'Feliratozó mentor', 'Technikus 1', 'Technikus 2'].includes(role.name)
      );
    }
    
    // For regular filming sessions, show non-KaCsa roles
    return roles.filter(role => !role.name.toLowerCase().includes('kacsa'));
  };

  const isEligibleForRole = (student: UserDetailSchema, session: ForgatSchema, roleName?: string) => {
  const isEligibleForRole = (student: UserDetailSchema, session: ForgatSchema, roleName?: string) => {
    // Check role-specific eligibility
    if (roleName) {
      const restriction = ROLE_RESTRICTIONS[roleName as keyof typeof ROLE_RESTRICTIONS];
      if (restriction) {
        const studentClass = student.osztaly?.name || '';
        if (!restriction.years.some(year => studentClass.includes(year))) {
          return false;
        }
      }
    }

    const hasOverlappingForgatas = filmingSessions.some((s: ForgatSchema) =>
      s.id !== session.id &&
      s.date === session.date &&
      ((s.time_from <= session.time_to && s.time_to >= session.time_from) ||
        s.time_from === session.time_from)
    );

    const hasRadioConflict = Array.isArray(student.radio_stab) && student.radio_stab.some((radio: { date: string; time_from: string; time_to: string }) =>
      radio.date === session.date &&
      ((radio.time_from <= session.time_to && radio.time_to >= session.time_from) ||
        radio.time_from === session.time_from)
    );

    const hasApprovedAbsence = Array.isArray(student.absences) && student.absences.some((absence: TavolletSchema) =>
      absence.start_date <= session.date &&
      absence.end_date >= session.date &&
      absence.status === "APPROVED"
    );

    return !hasOverlappingForgatas && !hasRadioConflict && !hasApprovedAbsence;
  };

  const showFeedback = (message: string, type: 'success' | 'error') => {
    alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
  };

  const suggestStudentForRole = (roleName: string, session: ForgatSchema): UserDetailSchema | null => {
    const eligibleStudents = getSortedStudentsForRole(roleName).filter(student => isEligibleForRole(student, session, roleName));
    return eligibleStudents.length > 0 ? eligibleStudents[0] : null;
  };

  const getAssignedStudentsForRole = (sessionId: number, roleId: number): { student: UserDetailSchema, role: string }[] => {
    const key = `${sessionId}-${roleId}`;
    return currentAssignments[key] || [];
  };

  const isStudentAlreadyAssigned = (sessionId: number, studentId: number): boolean => {
    return Object.keys(currentAssignments)
      .filter(key => key.startsWith(`${sessionId}-`))
      .some(key => currentAssignments[key].some(assignment => assignment.student.id === studentId));
  };

  const renderRoleAssignment = (role: SzerepkorSchema, session: ForgatSchema) => {
    const suggestedStudent = suggestStudentForRole(role.name, session);
    const assignedStudents = getAssignedStudentsForRole(session.id, role.id);
    const restriction = ROLE_RESTRICTIONS[role.name as keyof typeof ROLE_RESTRICTIONS];
    const maxCount = restriction?.count || 1;

    return (
      <div key={role.id} className="border rounded-lg p-4 space-y-3 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">{role.name}</h4>
            {restriction && (
              <p className="text-xs text-muted-foreground">
                {restriction.years.join(', ')} • {assignedStudents.length}/{maxCount}
              </p>
            )}
          </div>
          {assignedStudents.length < maxCount && (
            <Badge variant={suggestedStudent ? "default" : "secondary"} className="text-xs">
              {assignedStudents.length}/{maxCount}
            </Badge>
          )}
        </div>

        {/* Assigned Students */}
        {assignedStudents.length > 0 && (
          <div className="space-y-2">
            {assignedStudents.map((assignment, index) => (
              <div key={`${assignment.student.id}-${index}`} className="flex items-center justify-between bg-muted/50 rounded px-2 py-1">
                <span className="text-sm font-medium">{assignment.student.full_name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeStudentFromRole(session.id, role.id, assignment.student.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Assignment Controls */}
        {assignedStudents.length < maxCount && (
          <div className="space-y-2">
            {/* Suggested Student */}
            {suggestedStudent && !isStudentAlreadyAssigned(session.id, suggestedStudent.id) && (
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 rounded px-2 py-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-3 w-3 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {suggestedStudent.full_name}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addStudentToRole(session.id, role.id, suggestedStudent)}
                  className="h-6 text-xs px-2"
                >
                  Hozzáadás
                </Button>
              </div>
            )}

            {/* Student Selection */}
            <Select
              onValueChange={(value) => {
                const selectedStudent = availableStudents.find(student => student.id === parseInt(value));
                if (selectedStudent && !isStudentAlreadyAssigned(session.id, selectedStudent.id)) {
                  addStudentToRole(session.id, role.id, selectedStudent);
                }
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Diák kiválasztása..." />
              </SelectTrigger>
              <SelectContent>
                {getSortedStudentsForRole(role.name)
                  .filter(student => isEligibleForRole(student, session, role.name) && !isStudentAlreadyAssigned(session.id, student.id))
                  .map(student => {
                    const history = getRoleHistoryForStudent(student.id, role.name);
                    const experienceText = history ? `(${history.count}x)` : '(új)';
                    return (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{student.full_name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{experienceText}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2">Adatok betöltése...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/app">Alkalmazás</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Beosztáskezelő</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Beosztáskezelő</h1>
              <p className="text-muted-foreground">
                Jövőbeli forgatások diákbeosztásainak kezelése
              </p>
            </div>
            {canManageAssignments() && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Új forgatás
              </Button>
            )}
          </div>

          <div className="grid gap-4 pb-20 max-w-full overflow-hidden">
            {filmingSessions.map((session) => {
              const progress = getAssignmentProgress(session.id);
              const hasUnsavedChanges = unsavedChanges[session.id];

              return (
                <Card key={session.id} className="overflow-hidden border-l-4 border-l-primary/30 hover:border-l-primary transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{session.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {formatDate(session.date)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {formatTime(session.time_from)} - {formatTime(session.time_to)}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1">{session.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {hasUnsavedChanges && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Mentetlen változások
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleSessionExpansion(session.id)}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSessions.has(session.id) ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={progress.progressClass}>
                          Kitöltött szerepkörök: {progress.filled}/{progress.total}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(progress.percentage)}%
                        </span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                    </div>
                  </CardHeader>

                  {expandedSessions.has(session.id) && (
                    <CardContent className="pt-0">
                      {/* Role Assignments Grid */}
                      <div className="grid gap-3 mb-4">
                        {getRelevantRolesForSession(session).map((role) => renderRoleAssignment(role, session))}
                      </div>

                      {/* Action Buttons */}
                      {canManageAssignments() && (
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => saveAssignments(session.id)}
                              disabled={!hasUnsavedChanges}
                              variant={hasUnsavedChanges ? "default" : "secondary"}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Mentés
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => finalizeAssignment(session.id)}
                              disabled={progress.percentage < 100}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Véglegesítés
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {progress.percentage === 100 ? 'Minden szerepkör kitöltve' : `${progress.total - progress.filled} szerepkör hiányzik`}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}

            {/* Empty State */}
            {filmingSessions.length === 0 && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nincsenek közelgő forgatások</h3>
                  <p className="text-muted-foreground mb-4">
                    Jelenleg nincsenek beosztható forgatások a rendszerben.
                  </p>
                  {canManageAssignments() && (
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Új forgatás létrehozása
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="fixed bottom-4 right-4 max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Create Session Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Új forgatás létrehozása</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Név</label>
                  <Input
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="Forgatás neve..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Dátum</label>
                  <Input
                    type="date"
                    value={newSessionDate}
                    onChange={(e) => setNewSessionDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Leírás</label>
                  <Input
                    value={newSessionDescription}
                    onChange={(e) => setNewSessionDescription(e.target.value)}
                    placeholder="Forgatás leírása..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Mégse
                  </Button>
                  <Button onClick={createNewSession}>
                    Létrehozás
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
