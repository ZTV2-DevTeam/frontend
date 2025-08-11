"use client"

import { AppSidebar } from "@/components/app-sidebar"
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
import { Plus, Users, UserCheck, GraduationCap, ShieldCheck, Mail, Phone, Pencil, Search, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { useApiQuery } from "@/lib/api-helpers"
import { UserDetailSchema, OsztalySchema } from "@/lib/types"
import { apiClient } from "@/lib/api"

export default function StabPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedCrew, setSelectedCrew] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Fetch data from API
  const { data: users = [], loading: usersLoading, error: usersError } = useApiQuery(
    () => apiClient.getAllUsersDetailed()
  )
  
  const { data: classes = [], loading: classesLoading, error: classesError } = useApiQuery(
    () => apiClient.getClasses()
  )

  if (usersLoading || classesLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center">Betöltés...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (usersError || classesError) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center text-red-500">
              Hiba történt az adatok betöltésekor: {usersError || classesError}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Ensure we have valid data
  const usersArray = (users as UserDetailSchema[]) || []
  const classesArray = (classes as OsztalySchema[]) || []

  // Filter users based on search and selection criteria
  const filteredUsers = usersArray.filter((user: UserDetailSchema) => {
    const matchesSearch = searchTerm === "" || 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = selectedClass === "all" || 
      (user.osztaly && user.osztaly.name === selectedClass)
    
    const matchesCrew = selectedCrew === "all" || 
      (user.stab && user.stab.name === selectedCrew)
    
    return matchesSearch && matchesClass && matchesCrew
  })

  // Calculate statistics
  const stats = {
    total: usersArray.length,
    active: usersArray.filter((user: UserDetailSchema) => user.is_active).length,
    students: usersArray.filter((user: UserDetailSchema) => user.admin_type === 'student').length,
    teachers: usersArray.filter((user: UserDetailSchema) => user.admin_type === 'teacher').length,
    staff: usersArray.filter((user: UserDetailSchema) => user.admin_type === 'staff').length
  }

  const availableClasses = [...new Set(usersArray.map((user: UserDetailSchema) => user.osztaly?.name).filter(Boolean))]
  const availableCrews = [...new Set(usersArray.map((user: UserDetailSchema) => user.stab?.name).filter(Boolean))]

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
        <AppSidebar />
        <SidebarInset>
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Stáb Kezelése</h1>
              <p className="text-muted-foreground">Diákok és médiatanárok nyilvántartása</p>
            </div>

            {/* Statistics cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Összes felhasználó</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aktív felhasználók</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Diákok</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.students}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tanárok</CardTitle>
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.teachers + stats.staff}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
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
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[180px]">
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Új felhasználó
              </Button>
            </div>

            {/* Users table */}
            <Card>
              <CardHeader>
                <CardTitle>Felhasználók ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  Az összes regisztrált felhasználó listája
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user: UserDetailSchema) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.username} • {user.email}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {user.osztaly && (
                              <Badge variant="outline" className="text-xs">
                                {user.osztaly.name}
                              </Badge>
                            )}
                            {user.stab && (
                              <Badge variant="outline" className="text-xs">
                                Stáb: {user.stab.name}
                              </Badge>
                            )}
                            <Badge variant={user.is_active ? "default" : "secondary"} className="text-xs">
                              {user.is_active ? "Aktív" : "Inaktív"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {user.admin_type === 'student' ? 'Diák' : 
                               user.admin_type === 'teacher' ? 'Tanár' : 'Alkalmazott'}
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
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nincs találat a megadott kritériumoknak megfelelően.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
