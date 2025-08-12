"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react"
import * as React from "react"
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

// Dynamic import for PDF functionality (client-side only)
const generatePDF = async (users: any[]) => {
  // Import jsPDF and autoTable dynamically to avoid SSR issues
  const jsPDF = (await import('jspdf')).default
  // Import autoTable - this extends jsPDF prototype
  await import('jspdf-autotable')

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
    doc.text(className, 20, 25)
    
    // Subtitle
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Kontakt információk - ${classUsers.length} személy`, 20, 35)

    // Prepare table data - only name and phone number
    const tableData = classUsers.map(user => [
      user.full_name || `${user.first_name} ${user.last_name}`.trim(),
      user.telefonszam || ''
    ])

    // Generate table using the extended autoTable method
    ;(doc as any).autoTable({
      head: [['Név', 'Telefonszám']],
      body: tableData,
      startY: 45,
      styles: {
        fontSize: 11,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 120 }, // Name column
        1: { cellWidth: 80 }, // Phone column
      },
      margin: { left: 20, right: 20 },
    })
  })

  // Save the PDF
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  doc.save(`stab-kontakt-lista-${timestamp}.pdf`)
}

// Enhanced Loading Component
function LoadingSpinner({ message = "Betöltés..." }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
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
  const getRoleInfo = (adminType: string) => {
    switch (adminType) {
      case 'student': return { name: 'Diák', icon: '🎓', color: 'bg-blue-100 text-blue-800' }
      case 'teacher': return { name: 'Tanár', icon: '👨‍🏫', color: 'bg-green-100 text-green-800' }
      case 'staff': return { name: 'Alkalmazott', icon: '👷', color: 'bg-purple-100 text-purple-800' }
      case 'admin': return { name: 'Admin', icon: '👑', color: 'bg-red-100 text-red-800' }
      case 'dev': return { name: 'Fejlesztő', icon: '💻', color: 'bg-gray-100 text-gray-800' }
      default: return { name: 'Ismeretlen', icon: '❓', color: 'bg-gray-100 text-gray-600' }
    }
  }

  const roleInfo = getRoleInfo(user.admin_type)
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-lg font-semibold border-2 border-primary/20">
                {user.first_name?.charAt(0) || ''}{user.last_name?.charAt(0) || ''}
              </div>
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

            {(user.osztaly?.name || user.osztaly_name) && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{user.osztaly?.name || user.osztaly_name}</span>
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
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("name")
  
  // Fetch data from API
  const usersQuery = useApiQuery(
    async () => {
      try {
        const result = await apiClient.getAllUsersDetailed()
        console.log('Users fetched successfully:', result?.length || 0, 'users')
        return result || []
      } catch (error) {
        console.error('Failed to fetch users:', error)
        throw error
      }
    },
    []
  )
  
  const classesQuery = useApiQuery(
    async () => {
      try {
        const result = await apiClient.getClasses()
        console.log('Classes fetched successfully:', result?.length || 0, 'classes')
        return result || []
      } catch (error) {
        console.warn('Classes endpoint error:', error)
        return [] // Don't fail if classes can't be loaded
      }
    },
    []
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
    osztaly_name: user.osztaly?.name || user.osztaly_name || null,
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

  // Separate into categories
  const students = filteredUsers.filter((user: any) => user?.admin_type === 'student')
  const staff = filteredUsers.filter((user: any) => 
    user?.admin_type && ['teacher', 'staff', 'admin', 'dev'].includes(user.admin_type)
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

  const handleExportPDF = async () => {
    try {
      // Filter users with phone numbers
      const usersWithPhone = filteredUsers.filter(user => user.telefonszam)
      
      if (usersWithPhone.length === 0) {
        alert('Nincs telefonszámmal rendelkező felhasználó a jelenlegi szűrés alapján.')
        return
      }
      
      await generatePDF(usersWithPhone)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Hiba történt a PDF generálása során.')
    }
  }

  return (
    <ProtectedRoute>
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "19rem",
              "--header-height": "3.5rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex-1 space-y-6 p-6">
              {/* Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Stáb Kezelése
                  </h1>
                  <p className="text-muted-foreground">
                    Diákok és oktatók nyilvántartása • {filteredUsers.length} felhasználó
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button onClick={handleExportPDF} variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Frissítés
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Új felhasználó
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
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

              {/* Staff Section */}
              {staff.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">Oktatók és Adminisztrátorok</h2>
                      <p className="text-muted-foreground">{staff.length} személy</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {staff.map((user: any) => (
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

              {/* Students Section */}
              {students.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">Diákok</h2>
                      <p className="text-muted-foreground">{students.length} diák</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {students.map((user: any) => (
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
