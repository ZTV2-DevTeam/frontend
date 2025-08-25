"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react"
import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProtectedRoute } from "@/components/protected-route"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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
  FileText
} from "lucide-react"
import { useApiQuery } from "@/lib/api-helpers"
import { UserDetailSchema, UserProfileSchema, OsztalySchema } from "@/lib/types"
import { apiClient } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"

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
        user.full_name || `${user.first_name} ${user.last_name}`.trim(),
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

// Enhanced Loading Component
function LoadingSpinner({ message = "Betöltés..." }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">{message}</p>
                <p className="text-sm text-muted-foreground">
                  Kérjük várjon, az adatok betöltése folyamatban...
                </p>
              </div>
            </div>
          </div>
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
function UserCard({ user, onEdit, onDelete }: { 
  user: any, 
  onEdit?: (user: any) => void,
  onDelete?: (user: any) => void 
}) {
  const getRoleInfo = (user: any) => {
    // Check admin_type first
    if (user.admin_type === 'system_admin') return { name: 'Rendszergazda', icon: '👑', color: 'bg-red-100 text-red-800' };
    if (user.admin_type === 'developer') return { name: 'Fejlesztő', icon: '�', color: 'bg-gray-100 text-gray-800' };
    if (user.admin_type === 'teacher') return { name: 'Tanár', icon: '�‍🏫', color: 'bg-green-100 text-green-800' };
    
    // Check special_role
    if (user.special_role === 'production_leader') return { name: 'Gyártásvezető', icon: '🎬', color: 'bg-orange-100 text-orange-800' };
    
    // If admin_type is 'none' or not set, and no special role, it's a student
    if ((user.admin_type === 'none' || !user.admin_type) && 
        (user.special_role === 'none' || !user.special_role)) {
      return { name: 'Diák', icon: '🎓', color: 'bg-blue-100 text-blue-800' };
    }
    
    // Default to student for safety
    return { name: 'Diák', icon: '🎓', color: 'bg-blue-100 text-blue-800' };
  }

  const roleInfo = getRoleInfo(user)
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <UserAvatar
                email={user.email}
                firstName={user.first_name}
                lastName={user.last_name}
                username={user.username}
                size="lg"
                className="border-2 border-primary/20"
                fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-semibold"
              />
              {user.is_active !== false && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {user.full_name || `${user.first_name} ${user.last_name}`.trim()}
              </h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(user)}>
                <Eye className="h-4 w-4 mr-2" />
                Megtekintés
              </DropdownMenuItem>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={roleInfo.color}>
              {roleInfo.icon} {roleInfo.name}
            </Badge>
            <Badge variant={user.is_active !== false ? "default" : "secondary"}>
              {user.is_active !== false ? "✅ Aktív" : "❌ Inaktív"}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a 
                href={`mailto:${user.email}`}
                className="text-blue-600 hover:underline truncate"
                title={user.email}
              >
                {user.email}
              </a>
            </div>
            
            {user.telefonszam && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${user.telefonszam}`}
                  className="text-blue-600 hover:underline"
                >
                  {user.telefonszam}
                </a>
              </div>
            )}

            {(user.osztaly?.display_name || user.osztaly_name) && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{user.osztaly?.display_name || user.osztaly_name}</span>
              </div>
            )}

            {(user.stab?.name || user.stab_name) && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{user.stab?.name || user.stab_name}</span>
              </div>
            )}

            {user.last_login && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">
                  Utolsó bejelentkezés: {new Date(user.last_login).toLocaleDateString('hu-HU')}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Component
export default function StabPage() {
  const { isAuthenticated } = useAuth()
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [groupBy, setGroupBy] = useState<"class" | "role" | "none">("class") // Default to class grouping
  const [sortBy, setSortBy] = useState<string>("name")
  
  // Fetch data from API
  const usersQuery = useApiQuery(
    async () => {
      try {
        if (!isAuthenticated) {
          return []
        }
        // Call without any filters to get ALL users
        const result = await apiClient.getAllUsersDetailed()
        console.log('Users fetched successfully:', result?.length || 0, 'users')
        console.log('Users by admin_type:', result?.reduce((acc: any, user: any) => {
          const type = user.admin_type || 'unknown'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {}))
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
    full_name: user.full_name || `${user.first_name} ${user.last_name}`.trim(),
    osztaly_name: user.osztaly?.display_name || user.osztaly_name || null,
    stab_name: user.stab?.name || user.stab_name || null,
  }))

  // Filter and sort users - using regular calculation instead of useMemo to avoid React hook errors
  let filteredUsers: any[] = []
  
  if (normalizedUsers && Array.isArray(normalizedUsers)) {
    filteredUsers = normalizedUsers.filter((user: any) => {
      if (!user) return false
      
      const matchesSearch = searchTerm === "" || 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesClass = selectedClass === "all" || 
        user.osztaly_name === selectedClass
      
      const matchesRole = selectedRole === "all" ||
        user.admin_type === selectedRole
      
      return matchesSearch && matchesClass && matchesRole
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
        case "last_login":
          return new Date(b.last_login || 0).getTime() - new Date(a.last_login || 0).getTime()
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
    if (a === 'Osztály nélkül') return 1
    if (b === 'Osztály nélkül') return -1
    return a.localeCompare(b)
  })

  // Separate into categories for legacy views
  const students = filteredUsers.filter((user: any) => 
    user?.admin_type === 'none' || !user?.admin_type ||
    (user?.admin_type !== 'system_admin' && user?.admin_type !== 'developer' && 
     user?.admin_type !== 'teacher' && user?.special_role !== 'production_leader')
  )
  const staff = filteredUsers.filter((user: any) => 
    user?.admin_type && ['system_admin', 'developer', 'teacher'].includes(user.admin_type) ||
    user?.special_role === 'production_leader'
  )

  const availableClasses = [...new Set(normalizedUsers
    .filter((user: any) => user?.osztaly_name)
    .map((user: any) => user.osztaly_name)
  )].sort()

  const availableRoles = [...new Set(normalizedUsers
    .filter((user: any) => user?.admin_type)
    .map((user: any) => user.admin_type)
  )].sort()

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleEdit = (user: any) => {
    // TODO: Implement edit functionality
    console.log('Edit user:', user)
  }

  const handleDelete = (user: any) => {
    // TODO: Implement delete functionality
    console.log('Delete user:', user)
  }

  // Helper function to get role info (defined here for global use)
  const getRoleInfo = (user: any) => {
    // Check admin_type first
    if (user.admin_type === 'system_admin') return { name: 'Rendszergazda', icon: '👑', color: 'bg-red-100 text-red-800' };
    if (user.admin_type === 'developer') return { name: 'Fejlesztő', icon: '💻', color: 'bg-gray-100 text-gray-800' };
    if (user.admin_type === 'teacher') return { name: 'Tanár', icon: '👨‍🏫', color: 'bg-green-100 text-green-800' };
    
    // Check special_role
    if (user.special_role === 'production_leader') return { name: 'Gyártásvezető', icon: '🎬', color: 'bg-orange-100 text-orange-800' };
    
    // If admin_type is 'none' or not set, and no special role, it's a student
    if ((user.admin_type === 'none' || !user.admin_type) && 
        (user.special_role === 'none' || !user.special_role)) {
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

  return (
    <ProtectedRoute>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex-1 space-y-6 p-6">{/* Fixed content */}
              {/* Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <Users className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">Stáb Kezelése</h1>
                    <p className="text-muted-foreground">
                      Diákok és oktatók nyilvántartása • {filteredUsers.length} felhasználó
                      {normalizedUsers.length !== filteredUsers.length && (
                        <span className="text-sm text-blue-600 ml-2">
                          ({normalizedUsers.length} összesen, {normalizedUsers.length - filteredUsers.length} szűrve)
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
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                    {/* Search */}
                    <div className="lg:col-span-2">
                      <Label htmlFor="search">Keresés</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Név, felhasználónév vagy email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    {/* Group By */}
                    <div>
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
                    <div>
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
                    <div>
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
                               role === 'teacher' ? 'Tanár' :
                               role === 'staff' ? 'Alkalmazott' :
                               role === 'admin' ? 'Admin' :
                               role === 'dev' ? 'Fejlesztő' : role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort */}
                    <div>
                      <Label>Rendezés</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Név szerint</SelectItem>
                          <SelectItem value="role">Szerepkör szerint</SelectItem>
                          <SelectItem value="class">Osztály szerint</SelectItem>
                          <SelectItem value="last_login">Utolsó bejelentkezés</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content - Group by Class by Default */}
              {groupBy === 'class' && Object.keys(usersByClass).length > 0 && (
                <div className="space-y-6">
                  {sortedClassNames.map((className) => {
                    const classUsers = usersByClass[className]
                    if (!classUsers || classUsers.length === 0) return null
                    
                    return (
                      <div key={className} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold">{className}</h2>
                              <p className="text-muted-foreground text-sm">
                                {classUsers.length} személy
                                {classUsers.some(u => u.admin_type === 'student') && 
                                 classUsers.some(u => u.admin_type !== 'student') && 
                                 ` • ${classUsers.filter(u => u.admin_type === 'student').length} diák, ${classUsers.filter(u => u.admin_type !== 'student').length} oktató/admin`}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {classUsers.length} fő
                          </Badge>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {classUsers.map((user: any) => (
                            <UserCard 
                              key={user.id} 
                              user={user} 
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
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
                      const roleOrder = ['Rendszergazda', 'Fejlesztő', 'Tanár', 'Gyártásvezető', 'Diák']
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
                      <h3 className="text-lg font-semibold">Nincs találat</h3>
                      <p className="text-muted-foreground">
                        Próbáljon meg más keresési kritériumokat.
                      </p>
                    </div>
                    <Button onClick={() => {
                      setSearchTerm("")
                      setSelectedClass("all")
                      setSelectedRole("all")
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
    </ProtectedRoute>
  )
}
