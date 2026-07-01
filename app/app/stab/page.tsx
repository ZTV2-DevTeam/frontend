"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react"
import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProtectedRoute } from "@/components/protected-route"
import { ProfessionalLoading } from "@/components/professional-loading"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Toggle } from "@/components/ui/toggle"
import { 
  Users, 
  Mail, 
  Phone, 
  Search, 
  AlertCircle, 
  Plus, 
  Edit,
  Trash2,
  Filter,
  Download,
  Upload,
  UserCheck,
  UserX,
  GraduationCap,
  Shield,
  BookOpen,
  Clock,
  Calendar,
  MapPin,
  Eye,
  RefreshCw,
  Settings,
  MoreHorizontal,
  Star,
  Activity,
  Loader2,
  FileText,
  User,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { useApiQuery } from "@/lib/api-helpers"
import { UserDetailSchema, UserProfileSchema, OsztalySchema } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { useTanev } from "@/contexts/tanev-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"
import { UserStabBadge } from "@/components/stab-badge"

// Dynamic import for PDF functionality (client-side only)
const generatePDF = async (users: any[]) => {
  try {
    // Import jsPDF and autoTable dynamically to avoid SSR issues
    const jsPDFModule = await import('jspdf')
    const jsPDF = jsPDFModule.default
    
    // Import autoTable function directly
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // Group users by class
    const usersByClass: { [key: string]: any[] } = {}
    users.forEach(user => {
      // Only include users with phone numbers for contact purposes
      if (user.telefonszam) {
        const className = user.osztaly_name || 'Osztály nélkül'
        if (!usersByClass[className]) {
          usersByClass[className] = []
        }
        usersByClass[className].push(user)
      }
    })

    // Sort classes alphabetically
    const sortedClasses = Object.keys(usersByClass).sort()

    if (sortedClasses.length === 0) {
      throw new Error('Nincs telefonszámmal rendelkező felhasználó.')
    }

    let isFirstPage = true

    sortedClasses.forEach(className => {
      if (!isFirstPage) {
        doc.addPage()
      }
      isFirstPage = false

      const classUsers = usersByClass[className]
      
      // Title
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      const pageWidth = doc.internal.pageSize.getWidth()
      const textWidth = doc.getTextWidth(className)
      const x = (pageWidth - textWidth) / 2
      doc.text(className, x, 25)
      
      // Subtitle
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')

      // Prepare table data - only name and phone number
      const tableData = classUsers.map(user => [
        user.full_name || `${user.last_name} ${user.first_name}`.trim(),
        user.telefonszam || ''
      ])

      // Generate table using autoTable function
      autoTable(doc, {
        head: [['Név', 'Telefonszám']],
        body: tableData,
        startY: 45,
        styles: {
          fontSize: 11,
          cellPadding: 4,
          fillColor: [255, 255, 255], // White background for B&W
          textColor: [0, 0, 0],       // Black text for B&W
          lineWidth: 0.2,             // Subtle border width
          lineColor: [180, 180, 180], // Light gray border
        },
        headStyles: {
          fillColor: [255, 255, 255], // White header text
          textColor: [0, 0, 0],       // Black header background
          fontStyle: 'bold',
          lineWidth: 0.4,             // Slightly stronger border for header
          lineColor: [120, 120, 120], // Slightly darker gray for header border
        },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 80 },
        },
        margin: { left: 20, right: 20 },
      })
    })

    // Save the PDF
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    doc.save(`stab-kontakt-lista-${timestamp}.pdf`)
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error(`PDF generálási hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`)
  }
}

// Professional Loading Component with Layout
function LoadingSpinner({ message = "Betöltés..." }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1">
          <ProfessionalLoading
            variant="simple"
            title={message}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Enhanced Error Component
function ErrorDisplay({ 
  error, 
  onRetry, 
  title = "Hiba történt" 
}: {
  error: string
  onRetry?: () => void
  title?: string
}) {
  const isNetworkError = error?.includes('Network error') || error?.includes('fetch')
  const isAuthError = error?.includes('401') || error?.includes('Unauthorized') || error?.includes('munkamenet lejárt')
  const isPermissionError = error?.includes('403') || error?.includes('Forbidden') || error?.includes('jogosultság')
  
  let displayMessage = 'Hiba történt az adatok betöltésekor.'
  let actionButton = null
  
  if (isNetworkError) {
    displayMessage = 'Nem sikerült csatlakozni a szerverhez. Ellenőrizze, hogy a backend fut-e.'
    actionButton = onRetry && (
      <Button onClick={onRetry} className="mt-4">
        <RefreshCw className="h-4 w-4 mr-2" />
        Újrapróbálás
      </Button>
    )
  } else if (isAuthError) {
    displayMessage = 'Bejelentkezés szükséges. Kérjük, jelentkezzen be újra.'
    actionButton = (
      <Button onClick={() => window.location.href = '/login'} className="mt-4">
        Bejelentkezés
      </Button>
    )
  } else if (isPermissionError) {
    displayMessage = 'Nincs jogosultsága ehhez az oldalhoz.'
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground mb-6">{displayMessage}</p>
                {actionButton}
                <details className="text-left mt-6">
                  <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                    Technikai részletek
                  </summary>
                  <div className="mt-3 p-3 bg-muted rounded text-xs text-muted-foreground break-words">
                    {error}
                  </div>
                </details>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// User Card Component
function UserCard({ user, onEdit, onDelete, hasAdminPermissions = false }: { 
  user: any, 
  onEdit?: (user: any) => void,
  onDelete?: (user: any) => void,
  hasAdminPermissions?: boolean
}) {
  const getRoleInfo = (user: any) => {
    // Check admin_type (for admin roles with dark mode support)
    if (user.admin_type === 'system_admin') return { 
      name: 'Rendszergazda', 
      icon: '👑', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
    };
    if (user.admin_type === 'developer') return { 
      name: 'Fejlesztő', 
      icon: '💻', 
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' 
    };
    if (user.admin_type === 'teacher') return { 
      name: 'Médiatanár', 
      icon: '👨‍🏫', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
    };
    
    // Note: is_class_teacher (Osztályfőnök) role has been disabled and removed from frontend
    // Class teachers now use the external Igazoláskezelő interface at igazolas.szlg.info
    
    // Check gyv (for production managers/gyártásvezetők)
    if (user.gyv === true) {
      return { 
        name: 'Gyártásvezető', 
        icon: '🎬', 
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' 
      };
    }
    
    // Default to student for anyone without admin privileges or special roles
    return { 
      name: 'Diák', 
      icon: '🎓', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
    };
  }

  // Check if user is currently active (similar to dashboard logic)
  // This checks actual session activity, not just account status
  const isCurrentlyActive = (user: any) => {
    if (!user.last_login) return false
    
    const now = new Date()
    const lastLogin = new Date(user.last_login)
    const diffMs = now.getTime() - lastLogin.getTime()
    const diffMinutes = diffMs / (1000 * 60)
    
    // Consider active if logged in within last 5 minutes
    // This ensures the green dot only shows for truly active sessions
    return diffMinutes <= 5
  }

  const roleInfo = getRoleInfo(user)
  const isActive = isCurrentlyActive(user)
  
  return (
    <>
      <Card className="hover:shadow-md transition-all duration-200 group cursor-pointer" onClick={() => onEdit?.(user)}>
        <CardContent className="p-4 py-3">
          {/* Header with Avatar, Name, and Menu */}
          <div className="flex items-center gap-4 mb-3">
            <div className="relative shrink-0">
              <UserAvatar
                email={user.email}
                firstName={user.first_name}
                lastName={user.last_name}
                username={user.username}
                size="lg"
                className={`border-2 ${isActive ? 'border-green-500' : 'border-border/50'} transition-colors duration-200`}
                fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-base font-semibold"
              />
              {isActive && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight">
                {user.full_name || `${user.last_name} ${user.first_name}`.trim()}
              </h3>
              <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  disabled
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(user)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Megtekintés
                </DropdownMenuItem>
                {hasAdminPermissions && (
                  <>
                    <DropdownMenuItem onClick={() => onEdit?.(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Szerkesztés
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(user)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Törlés
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className={`text-xs px-2.5 py-1 ${roleInfo.color}`}>
              <span className="mr-1.5">{roleInfo.icon}</span>
              {roleInfo.name}
            </Badge>
            
            {(user.stab?.name || user.stab_name) && (
              <UserStabBadge stabName={user.stab?.name || user.stab_name} size="md" />
            )}

            {isActive && (
              <Badge variant="default" className="text-xs px-2.5 py-1 bg-green-600 hover:bg-green-700">
                🟢 Online
              </Badge>
            )}
          </div>

          {/* Info Grid - Desktop */}
          <div className="hidden sm:grid grid-cols-1 gap-2 mb-3 text-sm">
            {(user.osztaly?.display_name || user.osztaly_name) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{user.osztaly?.display_name || user.osztaly_name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{user.email}</span>
            </div>
            
            {user.telefonszam && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{user.telefonszam}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {user.telefonszam && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-xs" 
                asChild
              >
                <a href={`tel:${user.telefonszam}`}>
                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                  Hívás
                </a>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-xs" 
              asChild
            >
              <a href={`mailto:${user.email}`}>
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                Email
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
    </>
  )
}

// Main Component
export default function StabPage() {
  const { isAuthenticated } = useAuth()
  const { hasPermission } = usePermissions()
  const { activeTanev, activeOsztalyIds } = useTanev()
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [groupBy, setGroupBy] = useState<"class" | "role" | "none">("class") // Default to class grouping
  const [sortBy, setSortBy] = useState<string>("name")
  const [isOsztalyNelkulOpen, setIsOsztalyNelkulOpen] = useState<boolean>(false) // Collapsible state
  const [selectedUser, setSelectedUser] = useState<any>(null) // Add state for modal
  const [filterGyartasvezetok, setFilterGyartasvezetok] = useState<boolean>(false) // Add Gyártásvezető filter
  
  // Auto-expand "Osztály nélkül" section when searching
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      setIsOsztalyNelkulOpen(true)
    }
  }, [searchTerm])
  
  // Check if user has permission to access detailed user data
  // Staff contact information should be accessible to all users
  const canAccessUserData = true // Allow all authenticated users to view staff contact info
  
  // Check if user has admin permissions for advanced features (editing, deleting, etc.)
  const hasAdminPermissions = hasPermission('is_admin') || hasPermission('is_system_admin') || hasPermission('is_teacher_admin')
  
  // Fetch data from API
  const usersQuery = useApiQuery(
    async () => {
      try {
        if (!isAuthenticated) {
          return []
        }
        
        // Use basic user endpoint that's accessible to all authenticated users
        const result = await apiClient.getAllUsers()
        console.log('Users fetched successfully:', result?.length || 0, 'users')
        return result || []
      } catch (error) {
        console.error('Failed to fetch users:', error)
        throw error
      }
    },
    [isAuthenticated]
  )
  
  const classesQuery = useApiQuery(
    async () => {
      try {
        if (!isAuthenticated) {
          return []
        }
        const result = await apiClient.getClasses()
        console.log('Classes fetched successfully:', result?.length || 0, 'classes')
        return result || []
      } catch (error) {
        console.warn('Classes endpoint error:', error)
        return [] // Don't fail if classes can't be loaded
      }
    },
    [isAuthenticated]
  )

  const users = usersQuery.data || []
  const usersLoading = usersQuery.loading
  const usersError = usersQuery.error
  const classes = classesQuery.data || []

  // Loading state
  if (usersLoading) {
    return <LoadingSpinner message="Felhasználók betöltése..." />
  }

  // Error state
  if (usersError) {
    return (
      <ErrorDisplay 
        error={usersError} 
        onRetry={() => {
          window.location.reload()
        }}
        title="Hiba a felhasználók betöltésekor"
      />
    )
  }

  // Process data
  const usersArray = Array.isArray(users) ? users : []
  const classesArray = Array.isArray(classes) ? classes : []

  // Normalize users
  const normalizedUsers = usersArray.map((user: any) => ({
    ...user,
    full_name: user.full_name || `${user.last_name} ${user.first_name}`.trim(),
    osztaly_name: user.osztaly?.display_name || user.osztaly_name || null,
    stab_name: user.stab?.name || user.stab_name || null,
  }))

  // Multi-Tanév: only students belonging to the currently-active Tanév's
  // `osztalyok` should appear in the Stáb menu. Users without an `osztaly`
  // (staff/teachers) are not gated by class membership. If the backend has
  // not yet reported the active Tanév's class list, we fall back to showing
  // everyone (safe default) so the menu doesn't go empty in transition.
  const hasActiveOsztalyIds = activeOsztalyIds.size > 0
  const activeTanevUsers = hasActiveOsztalyIds
    ? normalizedUsers.filter((user: any) => {
        const osztalyId = user?.osztaly?.id
        // Students (users with a class): keep only if class is in active Tanév.
        if (typeof osztalyId === 'number') return activeOsztalyIds.has(osztalyId)
        // Staff/teachers (no class) always pass through.
        return true
      })
    : normalizedUsers

  // Restrict the class list too, so filters only offer active-Tanév classes.
  const activeTanevClasses = hasActiveOsztalyIds
    ? classesArray.filter((cls: any) => cls?.id != null && activeOsztalyIds.has(cls.id))
    : classesArray

  // Filter and sort users - using regular calculation instead of useMemo to avoid React hook errors
  let filteredUsers: any[] = []
  
  if (activeTanevUsers && Array.isArray(activeTanevUsers)) {
    filteredUsers = activeTanevUsers.filter((user: any) => {
      if (!user) return false
      
      const matchesSearch = searchTerm === "" || 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telefonszam?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesClass = selectedClass === "all" || 
        user.osztaly_name === selectedClass
      
      const matchesRole = selectedRole === "all" ||
        user.admin_type === selectedRole ||
        (selectedRole === "gyartasvezeto" && user.gyv === true)
      
      const matchesGyartasvezetoFilter = !filterGyartasvezetok || user.gyv === true
      
      return matchesSearch && matchesClass && matchesRole && matchesGyartasvezetoFilter
    })

    // Sort users
    filteredUsers.sort((a: any, b: any) => {
      if (!a || !b) return 0
      
      switch (sortBy) {
        case "name":
          return (a.full_name || "").localeCompare(b.full_name || "")
        case "role":
          return (a.admin_type || "").localeCompare(b.admin_type || "")
        case "class":
          return (a.osztaly_name || "").localeCompare(b.osztaly_name || "")
        default:
          return 0
      }
    })
  }

  // Group users by class for better categorization
  const usersByClass = filteredUsers.reduce((acc: { [key: string]: any[] }, user: any) => {
    const className = user?.osztaly_name || 'Osztály nélkül'
    if (!acc[className]) {
      acc[className] = []
    }
    acc[className].push(user)
    return acc
  }, {})

  // Sort classes with "Osztály nélkül" at the end
  const sortedClassNames = Object.keys(usersByClass).sort((a, b) => {
    // Custom order: Osztály nélkül, NYF, 9F, 10F, 11F, 12F, 13F, etc.
    if (a === 'Osztály nélkül' && b !== 'Osztály nélkül') return -1
    if (b === 'Osztály nélkül' && a !== 'Osztály nélkül') return 1
    if (a === 'Osztály nélkül' && b === 'Osztály nélkül') return 0
    
    // NYF comes after "Osztály nélkül" but before numbered classes
    if (a === 'NYF' && b !== 'NYF' && b !== 'Osztály nélkül') return -1
    if (b === 'NYF' && a !== 'NYF' && a !== 'Osztály nélkül') return 1
    if (a === 'NYF' && b === 'NYF') return 0
    
    // Extract numbers from class names (e.g., "9F" -> 9, "10F" -> 10)
    const extractNumber = (className: string) => {
      const match = className.match(/^(\d+)/)
      return match ? parseInt(match[1], 10) : Infinity
    }
    
    const numA = extractNumber(a)
    const numB = extractNumber(b)
    
    // If both have numbers, sort by number
    if (numA !== Infinity && numB !== Infinity) {
      return numA - numB
    }
    
    // If one has a number and the other doesn't, number comes first
    if (numA !== Infinity && numB === Infinity) return -1
    if (numB !== Infinity && numA === Infinity) return 1
    
    // If neither has a number, sort alphabetically
    return a.localeCompare(b, 'hu')
  })

  // Separate into categories for legacy views (updated to check admin_type only, class teacher role removed)
  const students = filteredUsers.filter((user: any) => 
    (user?.admin_type === 'none' || !user?.admin_type || 
     !['system_admin', 'developer', 'teacher'].includes(user?.admin_type))
  )
  const staff = filteredUsers.filter((user: any) => 
    (user?.admin_type && ['system_admin', 'developer', 'teacher'].includes(user.admin_type))
  )

  const availableClasses = [...new Set(activeTanevUsers
    .filter((user: any) => user?.osztaly_name)
    .map((user: any) => user.osztaly_name)
  )].sort()

  const availableRoles = [...new Set([
    ...activeTanevUsers
      .filter((user: any) => user?.admin_type)
      .map((user: any) => user.admin_type),
    ...activeTanevUsers
      .filter((user: any) => user?.gyv === true)
      .map(() => "gyartasvezeto")
  ])].sort()

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleEdit = (user: any) => {
    // Open modal to show user details
    setSelectedUser(user)
  }

  const handleDelete = (user: any) => {
    // TODO: Implement delete functionality
    console.log('Delete user:', user)
  }

  // Helper function to get role info (updated to check admin_type only, class teacher role removed)
  const getRoleInfo = (user: any) => {
    // Check admin_type first (for admin roles)
    if (user.admin_type === 'system_admin') return { name: 'Rendszergazda', icon: '👑', color: 'bg-red-100 text-red-800' };
    if (user.admin_type === 'developer') return { name: 'Fejlesztő', icon: '💻', color: 'bg-gray-100 text-gray-800' };
    if (user.admin_type === 'teacher') return { name: 'Médiatanár', icon: '👨‍🏫', color: 'bg-green-100 text-green-800' };
    
    // Note: is_class_teacher (Osztályfőnök) role has been disabled and removed from frontend
    // Class teachers now use the external Igazoláskezelő interface at igazolas.szlg.info
    
    // Check gyv (for production managers/gyártásvezetők)
    if (user.gyv === true) {
      return { name: 'Gyártásvezető', icon: '🎬', color: 'bg-orange-100 text-orange-800' };
    }
    
    // For users without admin_type or special roles, default to student
    if (user.admin_type === 'none' || !user.admin_type) {
      return { name: 'Diák', icon: '🎓', color: 'bg-blue-100 text-blue-800' };
    }
    
    // Default to student for safety
    return { name: 'Diák', icon: '🎓', color: 'bg-blue-100 text-blue-800' };
  }

  const handleExportPDF = async () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        alert('A PDF export csak böngészőben működik.')
        return
      }

      // Filter users with phone numbers
      const usersWithPhone = filteredUsers.filter(user => user.telefonszam)
      
      if (usersWithPhone.length === 0) {
        alert('Nincs telefonszámmal rendelkező felhasználó a jelenlegi szűrés alapján.')
        return
      }
      
      // Show loading indicator
      const originalText = 'Export PDF'
      const button = document.querySelector('[data-export-pdf]') as HTMLButtonElement
      if (button) {
        button.disabled = true
        button.textContent = 'PDF generálása...'
      }
      
      await generatePDF(usersWithPhone)
      
      // Restore button
      if (button) {
        button.disabled = false
        button.textContent = originalText
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      
      // Restore button
      const button = document.querySelector('[data-export-pdf]') as HTMLButtonElement
      if (button) {
        button.disabled = false
        button.textContent = 'Export PDF'
      }
      
      // More specific error message
      let errorMessage = 'Hiba történt a PDF generálása során.'
      if (error instanceof Error) {
        if (error.message.includes('jspdf')) {
          errorMessage = 'A PDF könyvtár betöltése sikertelen. Kérjük próbálja újra.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Hálózati hiba történt. Ellenőrizze az internetkapcsolatot.'
        } else {
          errorMessage = `PDF generálási hiba: ${error.message}`
        }
      }
      alert(errorMessage)
    }
  }

  // If user doesn't have permission to access user data, show a message
  if (!canAccessUserData) {
    return (
      <ProtectedRoute>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
              <SiteHeader />
              <div className="flex-1 space-y-6 p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                  <Card className="max-w-md mx-auto">
                    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                      <AlertCircle className="h-12 w-12 text-muted-foreground" />
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold">Hozzáférés korlátozott</h3>
                        <p className="text-sm text-muted-foreground">
                          A stáb részletes adatainak megtekintéséhez adminisztrátori jogosultság szükséges.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Kapcsolattartási adatok a forgatásoknál elérhetők.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex-1 space-y-6 p-6">{/* Fixed content */}
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-xl shadow-sm">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Stáb Kezelése</h1>
                    <p className="text-base text-muted-foreground">
                      Diákok és tanárok nyilvántartása • {filteredUsers.length} felhasználó
                      {activeTanevUsers.length !== filteredUsers.length && (
                        <span className="text-sm text-blue-600 ml-2">
                          ({activeTanevUsers.length} összesen, {activeTanevUsers.length - filteredUsers.length} szűrve)
                        </span>
                      )}
                      {activeTanev?.display_name && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          • Aktív tanév: {activeTanev.display_name}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button onClick={handleExportPDF} variant="outline" size="sm" data-export-pdf>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Frissítés
                  </Button>
                </div>
              </div>

              {/* Filters and Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Szűrők és keresés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-x-4 gap-y-2 md:grid-cols-2 lg:grid-cols-6">
                    {/* Search */}
                    <div className="lg:col-span-2 flex flex-col gap-2">
                      <Label htmlFor="search">Keresés</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Név, felhasználónév, email vagy telefonszám..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    {/* Group By */}
                    <div className="flex flex-col gap-2">
                      <Label>Csoportosítás</Label>
                      <Select value={groupBy} onValueChange={(value: "class" | "role" | "none") => setGroupBy(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class">Osztály szerint</SelectItem>
                          <SelectItem value="role">Szerepkör szerint</SelectItem>
                          <SelectItem value="none">Nincs csoportosítás</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Class Filter */}
                    <div className="flex flex-col gap-2">
                      <Label>Osztály</Label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger>
                          <SelectValue placeholder="Osztály szűrése" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Minden osztály</SelectItem>
                          {availableClasses.map((className: string) => (
                            <SelectItem key={className} value={className}>
                              {className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Role Filter */}
                    <div className="flex flex-col gap-2">
                      <Label>Szerepkör</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Szerepkör szűrése" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Minden szerepkör</SelectItem>
                          {availableRoles.map((role: string) => (
                            <SelectItem key={role} value={role}>
                              {role === 'student' ? 'Diák' :
                               role === 'teacher' ? 'Médiatanár' :
                               role === 'gyartasvezeto' ? 'Gyártásvezető' :
                               role === 'system_admin' ? 'Rendszergazda' :
                               role === 'developer' ? 'Fejlesztő' :
                               role === 'staff' ? 'Alkalmazott' :
                               role === 'admin' ? 'Admin' :
                               role === 'dev' ? 'Fejlesztő' : role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort */}
                    <div className="flex flex-col gap-2">
                      <Label>Rendezés</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Név szerint</SelectItem>
                          <SelectItem value="role">Szerepkör szerint</SelectItem>
                          <SelectItem value="class">Osztály szerint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Additional Filters Row */}
                  <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                    <div className="flex items-center space-x-2">
                      <Toggle
                        pressed={filterGyartasvezetok}
                        onPressedChange={setFilterGyartasvezetok}
                        aria-label="Filter Gyártásvezetők"
                        variant="outline"
                        size="sm"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Gyártásvezetők
                      </Toggle>
                      <span className="text-xs text-muted-foreground">
                        {filterGyartasvezetok ? 'Csak gyártásvezetők' : 'Minden felhasználó'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content - Group by Class by Default */}
              {groupBy === 'class' && Object.keys(usersByClass).length > 0 && (
                <div className="space-y-8">
                  {sortedClassNames.map((className) => {
                    const classUsers = usersByClass[className]
                    if (!classUsers || classUsers.length === 0) return null
                    
                    // Special handling for "Osztály nélkül"
                    const isOsztalyNelkul = className === 'Osztály nélkül'
                    
                    // Variables for layout logic
                    let hasStabSeparation = false
                    let hasRoleSeparation = false
                    let aStabUsers: any[] = []
                    let bStabUsers: any[] = []
                    let otherUsers: any[] = []
                    let roleGroups: any[] = []
                    
                    if (isOsztalyNelkul) {
                      // For "Osztály nélkül", separate by roles (class teacher role removed)
                      const adminUsers = classUsers.filter((user: any) => user.admin_type === 'system_admin')
                      const developerUsers = classUsers.filter((user: any) => user.admin_type === 'developer')
                      const teacherUsers = classUsers.filter((user: any) => user.admin_type === 'teacher')
                      const gyartasvezetoUsers = classUsers.filter((user: any) => user.gyv === true)
                      
                      // Group remaining users as "Diákok" (those without admin_type or gyv)
                      const studentUsers = classUsers.filter((user: any) => {
                        const isAdmin = user.admin_type === 'system_admin'
                        const isDeveloper = user.admin_type === 'developer' 
                        const isTeacher = user.admin_type === 'teacher'
                        const isGyartasvezeto = user.gyv === true
                        
                        return !isAdmin && !isDeveloper && !isTeacher && !isGyartasvezeto
                      })
                      
                      roleGroups = [
                        { users: adminUsers, name: 'Rendszergazdák', icon: '👑', color: 'bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-400/10 dark:text-red-300 dark:border-red-400/30' },
                        { users: developerUsers, name: 'Fejlesztők', icon: '💻', color: 'bg-gray-500/10 text-gray-600 border-gray-500/30 dark:bg-gray-400/10 dark:text-gray-300 dark:border-gray-400/30' },
                        { users: teacherUsers, name: 'Médiatanárok', icon: '👨‍🏫', color: 'bg-green-500/10 text-green-600 border-green-500/30 dark:bg-green-400/10 dark:text-green-300 dark:border-green-400/30' },
                        { users: gyartasvezetoUsers, name: 'Gyártásvezetők', icon: '🎬', color: 'bg-orange-500/10 text-orange-600 border-orange-500/30 dark:bg-orange-400/10 dark:text-orange-300 dark:border-orange-400/30' },
                        { users: studentUsers, name: 'Diákok', icon: '🎓', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/30' }
                      ].filter(group => group.users.length > 0)
                      
                      hasRoleSeparation = roleGroups.length > 1
                    } else {
                      // For regular classes, separate users by A and B stáb
                      aStabUsers = classUsers.filter((user: any) => {
                        const stabName = user.stab?.name || user.stab_name || ''
                        return stabName.toLowerCase().includes('a stáb') || stabName.toLowerCase().includes('a-stáb')
                      })
                      
                      bStabUsers = classUsers.filter((user: any) => {
                        const stabName = user.stab?.name || user.stab_name || ''
                        return stabName.toLowerCase().includes('b stáb') || stabName.toLowerCase().includes('b-stáb')
                      })
                      
                      otherUsers = classUsers.filter((user: any) => {
                        const stabName = user.stab?.name || user.stab_name || ''
                        return !stabName.toLowerCase().includes('stáb')
                      })
                      
                      hasStabSeparation = (aStabUsers.length > 0 || bStabUsers.length > 0)
                    }
                    
                    return (
                      <div key={className} className="space-y-6">
                        {/* Class Header */}
                        {isOsztalyNelkul ? (
                          // Collapsible header for "Osztály nélkül"
                          <button
                            onClick={() => setIsOsztalyNelkulOpen(!isOsztalyNelkulOpen)}
                            className="w-full flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                                <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div className="text-left">
                                <h2 className="text-xl font-semibold">{className}</h2>
                                <p className="text-muted-foreground text-sm">
                                  Tanárok, fejlesztők és egyéb osztály nélküli felhasználók • {classUsers.length} személy
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {classUsers.length} fő
                              </Badge>
                              {isOsztalyNelkulOpen ? (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </button>
                        ) : (
                          // Regular header for other classes
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <GraduationCap className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h2 className="text-xl font-semibold">{className}</h2>
                                <p className="text-muted-foreground text-sm">
                                  {classUsers.length} személy
                                  {(() => {
                                    const studentCount = classUsers.filter(u => 
                                      (!u.admin_type || u.admin_type === 'none')
                                    ).length
                                    const staffCount = classUsers.filter(u => 
                                      (u.admin_type && u.admin_type !== 'none')
                                    ).length
                                    return studentCount > 0 && staffCount > 0 ? ` • ${studentCount} diák, ${staffCount} oktató/admin` : ''
                                  })()}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {classUsers.length} fő
                            </Badge>
                          </div>
                        )}
                        
                        {/* Cards Layout */}
                        {(!isOsztalyNelkul || isOsztalyNelkulOpen) && (
                          <>
                            {hasRoleSeparation ? (
                              // Role-based columns for "Osztály nélkül"
                              <div className="grid gap-6 lg:grid-cols-2">
                                {roleGroups.map((roleGroup, index) => (
                                  <div key={roleGroup.name} className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                                      <Badge className={roleGroup.color}>
                                        <span className="mr-1.5">{roleGroup.icon}</span>
                                        {roleGroup.name} ({roleGroup.users.length} fő)
                                      </Badge>
                                      <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                                    </div>
                                    <div className="space-y-4">
                                      {roleGroup.users.map((user: any) => (
                                        <UserCard 
                                          key={user.id} 
                                          user={user} 
                                          onEdit={handleEdit}
                                          onDelete={handleDelete}
                                          hasAdminPermissions={hasAdminPermissions}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : hasStabSeparation ? (
                              // Two-column layout for A and B stáb on desktop
                              <div className="grid gap-6 lg:grid-cols-2">
                                {/* A Stáb Column */}
                                {aStabUsers.length > 0 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <div className="h-px bg-blue-200 dark:bg-blue-800 flex-1"></div>
                                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/30">
                                        A Stáb ({aStabUsers.length} fő)
                                      </Badge>
                                      <div className="h-px bg-blue-200 dark:bg-blue-800 flex-1"></div>
                                    </div>
                                    <div className="space-y-4">
                                      {aStabUsers.map((user: any) => (
                                        <UserCard 
                                          key={user.id} 
                                          user={user} 
                                          onEdit={handleEdit}
                                          onDelete={handleDelete}
                                          hasAdminPermissions={hasAdminPermissions}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* B Stáb Column */}
                                {bStabUsers.length > 0 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <div className="h-px bg-green-200 dark:bg-green-800 flex-1"></div>
                                      <Badge className="bg-green-500/10 text-green-600 border-green-500/30 dark:bg-green-400/10 dark:text-green-300 dark:border-green-400/30">
                                        B Stáb ({bStabUsers.length} fő)
                                      </Badge>
                                      <div className="h-px bg-green-200 dark:bg-green-800 flex-1"></div>
                                    </div>
                                    <div className="space-y-4">
                                      {bStabUsers.map((user: any) => (
                                        <UserCard 
                                          key={user.id} 
                                          user={user} 
                                          onEdit={handleEdit}
                                          onDelete={handleDelete}
                                          hasAdminPermissions={hasAdminPermissions}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Regular grid layout for classes without stáb separation
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {classUsers.map((user: any) => (
                                  <UserCard 
                                    key={user.id} 
                                    user={user} 
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    hasAdminPermissions={hasAdminPermissions}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                        
                        {/* Other users (non-stáb) if any */}
                        {(!isOsztalyNelkul || isOsztalyNelkulOpen) && hasStabSeparation && otherUsers.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                              <Badge variant="outline" className="text-xs">
                                Egyéb ({otherUsers.length} fő)
                              </Badge>
                              <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              {otherUsers.map((user: any) => (
                                <UserCard 
                                  key={user.id} 
                                  user={user} 
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  hasAdminPermissions={hasAdminPermissions}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Group by Role */}
              {groupBy === 'role' && (
                <div className="space-y-6">
                  {/* Group users by their actual roles */}
                  {(() => {
                    const usersByRole = filteredUsers.reduce((acc: { [key: string]: any[] }, user: any) => {
                      const roleInfo = getRoleInfo(user)
                      const roleName = roleInfo.name
                      if (!acc[roleName]) {
                        acc[roleName] = []
                      }
                      acc[roleName].push(user)
                      return acc
                    }, {})

                    const sortedRoles = Object.keys(usersByRole).sort((a, b) => {
                      // Custom sort: Admins first, then staff roles, then students
                      const roleOrder = ['Rendszergazda', 'Fejlesztő', 'Médiatanár', 'Osztályfőnök', 'Gyártásvezető', 'Diák']
                      const aIndex = roleOrder.indexOf(a)
                      const bIndex = roleOrder.indexOf(b)
                      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
                      if (aIndex !== -1) return -1
                      if (bIndex !== -1) return 1
                      return a.localeCompare(b)
                    })

                    return sortedRoles.map((roleName) => {
                      const roleUsers = usersByRole[roleName]
                      if (!roleUsers || roleUsers.length === 0) return null
                      
                      const roleInfo = getRoleInfo(roleUsers[0])
                      
                      return (
                        <div key={roleName} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${roleInfo.color.replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                                <span className="text-lg">{roleInfo.icon}</span>
                              </div>
                              <div>
                                <h2 className="text-xl font-semibold">{roleName}</h2>
                                <p className="text-muted-foreground text-sm">{roleUsers.length} személy</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {roleUsers.length} fő
                            </Badge>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {roleUsers.map((user: any) => (
                              <UserCard 
                                key={user.id} 
                                user={user} 
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                hasAdminPermissions={hasAdminPermissions}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              )}

              {/* No Grouping - All Users */}
              {groupBy === 'none' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Minden felhasználó</h2>
                      <p className="text-muted-foreground text-sm">{filteredUsers.length} személy</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {filteredUsers.length} fő
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredUsers.map((user: any) => (
                      <UserCard 
                        key={user.id} 
                        user={user} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        hasAdminPermissions={hasAdminPermissions}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <Card className="py-12">
                  <CardContent className="text-center space-y-4">
                    <div className="mx-auto h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {hasActiveOsztalyIds ? 'Nincs találat' : 'Nincs aktív tanévhez rendelt diák'}
                      </h3>
                      <p className="text-muted-foreground">
                        {hasActiveOsztalyIds
                          ? 'Próbáljon meg más keresési kritériumokat.'
                          : 'Az aktív tanévhez jelenleg nincsenek osztályok rendelve.'}
                      </p>
                    </div>
                    <Button onClick={() => {
                      setSearchTerm("")
                      setSelectedClass("all")
                      setSelectedRole("all")
                      setFilterGyartasvezetok(false)
                      setGroupBy("class") // Reset to default class grouping
                    }} variant="outline">
                      Szűrők törlése
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-sm mx-auto w-[95vw] sm:max-w-md sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Kapcsolattartó Információk
            </DialogTitle>
            <DialogDescription>Diák elérhetőségei és részletei</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <UserAvatar
                  email={selectedUser.email || ''}
                  firstName={selectedUser.first_name || ''}
                  lastName={selectedUser.last_name || ''}
                  username={selectedUser.username || ''}
                  customSize={64}
                  className="border-2 border-primary/20 mx-auto"
                  fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-semibold"
                />
                <h3 className="text-lg font-semibold">
                  {selectedUser.full_name || `${selectedUser.last_name} ${selectedUser.first_name}`.trim()}
                </h3>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Badge className={getRoleInfo(selectedUser).color}>
                    {getRoleInfo(selectedUser).icon} {getRoleInfo(selectedUser).name}
                  </Badge>
                  {(selectedUser.osztaly?.display_name || selectedUser.osztaly_name) && (
                    <Badge variant="outline">{selectedUser.osztaly?.display_name || selectedUser.osztaly_name}</Badge>
                  )}
                  {(selectedUser.stab?.name || selectedUser.stab_name) && (
                    <UserStabBadge stabName={selectedUser.stab?.name || selectedUser.stab_name} />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {selectedUser.telefonszam && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                    <Phone className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="text-sm text-muted-foreground">Telefon</div>
                      <div className="font-medium">{selectedUser.telefonszam}</div>
                    </div>
                  </div>
                )}

                {selectedUser.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{selectedUser.email}</div>
                    </div>
                  </div>
                )}

                {selectedUser.last_login && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <div>
                      <div className="text-sm text-muted-foreground">Utolsó bejelentkezés</div>
                      <div className="font-medium">{new Date(selectedUser.last_login).toLocaleString('hu-HU')}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                {selectedUser.telefonszam && (
                  <Button className="flex-1" size="sm" asChild>
                    <a href={`tel:${selectedUser.telefonszam}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Hívás
                    </a>
                  </Button>
                )}
                {selectedUser.email && (
                  <Button variant="outline" className="flex-1 bg-transparent" size="sm" asChild>
                    <a href={`mailto:${selectedUser.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}
