"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
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
import { Plus, Users, Mail, Phone, Pencil, Search, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import * as React from "react"
import { useApiQuery } from "@/lib/api-helpers"
import { UserDetailSchema, UserProfileSchema, OsztalySchema } from "@/lib/types"
import { apiClient } from "@/lib/api"

export default function StabPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedCrew, setSelectedCrew] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Debug logging
  console.log('StabPage: Component rendered')
  
  // Fetch data from API - using safer endpoints with better error handling
  const { data: users = [], loading: usersLoading, error: usersError } = useApiQuery(
    async () => {
      console.log('StabPage: Fetching users...')
      try {
        // Try the detailed user management endpoint first
        const result = await apiClient.getAllUsersDetailed()
        console.log('StabPage: Users fetched successfully:', result?.length || 0, 'users')
        return result
      } catch (error) {
        // Fallback to regular users endpoint if detailed fails
        console.warn('Detailed users endpoint failed, trying regular users:', error)
        const fallbackResult = await apiClient.getAllUsers()
        console.log('StabPage: Users fetched via fallback:', fallbackResult?.length || 0, 'users')
        return fallbackResult
      }
    },
    []
  )
  
  const { data: classes = [], loading: classesLoading, error: classesError } = useApiQuery(
    async () => {
      console.log('StabPage: Fetching classes...')
      try {
        const result = await apiClient.getClasses()
        console.log('StabPage: Classes fetched successfully:', result?.length || 0, 'classes')
        return result
      } catch (error) {
        console.warn('Classes endpoint error:', error)
        throw error
      }
    },
    []
  )

  // Debug logging
  console.log('StabPage: State:', {
    users: users?.length || 0,
    classes: classes?.length || 0,
    usersLoading,
    classesLoading,
    usersError,
    classesError
  })

  if (usersLoading || classesLoading) {
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
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Adatok betöltése...</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (usersError || classesError) {
    const errorMessage = usersError || classesError
    const isNetworkError = errorMessage?.includes('Network error') || errorMessage?.includes('fetch')
    const isAuthError = errorMessage?.includes('401') || errorMessage?.includes('Unauthorized') || errorMessage?.includes('munkamenet lejárt')
    const isPermissionError = errorMessage?.includes('403') || errorMessage?.includes('Forbidden') || errorMessage?.includes('jogosultság')
    
    let displayMessage = 'Hiba történt az adatok betöltésekor.'
    
    if (isNetworkError) {
      displayMessage = 'Nem sikerült csatlakozni a szerverhez. Ellenőrizze, hogy a backend fut-e.'
    } else if (isAuthError) {
      displayMessage = 'Bejelentkezés szükséges. Kérjük, jelentkezzen be újra.'
    } else if (isPermissionError) {
      displayMessage = 'Nincs jogosultsága ehhez az oldalhoz.'
    } else if (errorMessage) {
      // Don't show "internal server error" - show more user-friendly message
      displayMessage = errorMessage.includes('500') || errorMessage.toLowerCase().includes('internal server error')
        ? 'Szerverhiba történt. Kérjük, próbálja újra később.'
        : errorMessage
    }

    console.error('StabPage: Error occurred:', {
      usersError,
      classesError,
      displayMessage,
      isNetworkError,
      isAuthError,
      isPermissionError
    })

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
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
                <div className="mb-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hiba történt</h3>
                <p className="text-red-600 mb-4">{displayMessage}</p>
                <details className="text-left">
                  <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                    Technikai részletek
                  </summary>
                  <p className="text-xs text-muted-foreground mt-2 p-3 bg-muted rounded">
                    {errorMessage}
                  </p>
                </details>
                <div className="mt-6 flex gap-3 justify-center">
                  {(isAuthError || isPermissionError) && (
                    <Button onClick={() => window.location.href = '/login'}>
                      Bejelentkezés
                    </Button>
                  )}
                  {isNetworkError && (
                    <Button onClick={() => window.location.reload()}>
                      Újrapróbálás
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Ensure we have valid data and normalize user data
  const usersArray = Array.isArray(users) ? users : []
  const classesArray = Array.isArray(classes) ? classes : []

  // Normalize users to ensure consistent structure
  const normalizedUsers = usersArray.map((user: any) => ({
    ...user,
    full_name: user.full_name || `${user.first_name} ${user.last_name}`.trim(),
    osztaly: user.osztaly || (user.osztaly_name ? { name: user.osztaly_name } : null),
    stab: user.stab || (user.stab_name ? { name: user.stab_name } : null),
  }))

  // Filter users based on search and selection criteria
  const filteredUsers = normalizedUsers.filter((user: any) => {
    const matchesSearch = searchTerm === "" || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = selectedClass === "all" || 
      (user.osztaly && user.osztaly.name === selectedClass)
    
    const matchesCrew = selectedCrew === "all" || 
      (user.stab && user.stab.name === selectedCrew)
    
    return matchesSearch && matchesClass && matchesCrew
  })

  const availableClasses = [...new Set(normalizedUsers.map((user: any) => user.osztaly?.name).filter(Boolean))]
  const availableCrews = [...new Set(normalizedUsers.map((user: any) => user.stab?.name).filter(Boolean))]

  return (
    <TooltipProvider>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Stáb Kezelése</h1>
                <p className="text-muted-foreground">
                  Diákok és médiatanárok nyilvántartása ({filteredUsers.length} felhasználó)
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Új felhasználó
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Szűrők</CardTitle>
                <CardDescription>
                  Szűrje a felhasználókat név, osztály vagy stáb alapján
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Keresés név, felhasználónév vagy email alapján..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-full lg:w-[180px]">
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
                    <Select value={selectedCrew} onValueChange={setSelectedCrew}>
                      <SelectTrigger className="w-full lg:w-[180px]">
                        <SelectValue placeholder="Stáb szűrése" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Minden stáb</SelectItem>
                        {availableCrews.map((crewName: string) => (
                          <SelectItem key={crewName} value={crewName}>
                            {crewName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users list */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Felhasználók</CardTitle>
                    <CardDescription>
                      {filteredUsers.length === normalizedUsers.length 
                        ? `Összes felhasználó (${filteredUsers.length})` 
                        : `${filteredUsers.length} felhasználó a szűrés alapján (${normalizedUsers.length} összesen)`
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Nincs találat</h3>
                    <p className="mt-2 text-muted-foreground">
                      Nincs felhasználó a megadott kritériumoknak megfelelően.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredUsers.map((user: any) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                            {user.first_name?.charAt(0) || ''}{user.last_name?.charAt(0) || ''}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground">
                              {user.full_name || `${user.first_name} ${user.last_name}`.trim()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.username} • {user.email}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {user.osztaly && (
                                <Badge variant="outline" className="text-xs">
                                  📚 {user.osztaly.name}
                                </Badge>
                              )}
                              {user.stab && (
                                <Badge variant="outline" className="text-xs">
                                  👥 {user.stab.name}
                                </Badge>
                              )}
                              <Badge 
                                variant={(user.is_active !== false) ? "default" : "secondary"} 
                                className="text-xs"
                              >
                                {(user.is_active !== false) ? "✅ Aktív" : "❌ Inaktív"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {user.admin_type === 'student' ? '🎓 Diák' : 
                                 user.admin_type === 'teacher' ? '👨‍🏫 Tanár' : 
                                 user.admin_type === 'staff' ? '👷 Alkalmazott' : 
                                 user.admin_type || '❓ Ismeretlen'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.telefonszam && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Phone className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{user.telefonszam}</TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{user.email}</TooltipContent>
                          </Tooltip>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
