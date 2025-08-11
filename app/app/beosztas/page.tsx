"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Assignment, AssignedStudent } from "@/lib/types"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TableProperties,
  Users,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Settings,
  UserCheck,
  UserX,
  Shuffle,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  Edit,
  Trash2
} from "lucide-react"

// Mock data for schedule assignments
const mockAssignments = [
  {
    id: 1,
    shootingId: 1,
    shootingTitle: "Évkönyv fotózás - 12F osztály",
    date: "2025-01-15",
    time: "09:00 - 15:00",
    location: "Tornaterem",
    requiredRoles: [
      { role: "Főoperatőr", needed: 1, assigned: 1 },
      { role: "Segédoperatőr", needed: 2, assigned: 2 },
      { role: "Világítás", needed: 1, assigned: 1 },
      { role: "Asszisztens", needed: 2, assigned: 1 }
    ],
    assignedStudents: [
      { id: 1, name: "Nagy Péter", role: "Főoperatőr", class: "NYF", status: "confirmed", skills: ["Fotózás", "Portré"] },
      { id: 2, name: "Kiss Anna", role: "Segédoperatőr", class: "NYF", status: "confirmed", skills: ["Fotózás"] },
      { id: 3, name: "Szabó János", role: "Segédoperatőr", class: "9F", status: "pending", skills: ["Fotózás", "Világítás"] },
      { id: 4, name: "Tóth Mária", role: "Világítás", class: "10F", status: "confirmed", skills: ["Világítás", "Technika"] },
      { id: 5, name: "Kovács László", role: "Asszisztens", class: "11F", status: "declined", skills: ["Általános"] }
    ],
    status: "incomplete",
    priority: "high",
    autoAssigned: false
  },
  {
    id: 2,
    shootingId: 2,
    shootingTitle: "UNESCO Műsor - Élő közvetítés",
    date: "2025-01-16",
    time: "14:00 - 17:00",
    location: "Körösi Kulturális Központ",
    requiredRoles: [
      { role: "Rendező", needed: 1, assigned: 1 },
      { role: "Kameraman", needed: 3, assigned: 3 },
      { role: "Hangmérnök", needed: 1, assigned: 1 },
      { role: "Világítás", needed: 1, assigned: 1 },
      { role: "Streaming", needed: 1, assigned: 1 }
    ],
    assignedStudents: [
      { id: 6, name: "Horváth Gábor", role: "Rendező", class: "NYF", status: "confirmed", skills: ["Rendezés", "Vezetés"] },
      { id: 7, name: "Varga Eszter", role: "Kameraman", class: "NYF", status: "confirmed", skills: ["Kamera", "Kompozíció"] },
      { id: 8, name: "Molnár Zsuzsanna", role: "Kameraman", class: "9F", status: "confirmed", skills: ["Kamera"] },
      { id: 9, name: "Farkas Gábor", role: "Kameraman", class: "10F", status: "confirmed", skills: ["Kamera", "Élő"] },
      { id: 10, name: "Takács Dávid", role: "Hangmérnök", class: "NYF", status: "confirmed", skills: ["Hang", "Mixing"] },
      { id: 11, name: "Balogh Emma", role: "Világítás", class: "11F", status: "confirmed", skills: ["Világítás"] },
      { id: 12, name: "Simon Bence", role: "Streaming", class: "12F", status: "confirmed", skills: ["Streaming", "IT"] }
    ],
    status: "complete",
    priority: "high",
    autoAssigned: true
  },
  {
    id: 3,
    shootingId: 3,
    shootingTitle: "BRFK Sportnap dokumentálás",
    date: "2025-01-18",
    time: "08:30 - 16:00",
    location: "Vörösmarty Mihály Gimnázium",
    requiredRoles: [
      { role: "Dokumentarista", needed: 2, assigned: 1 },
      { role: "Kameraman", needed: 3, assigned: 2 },
      { role: "Drón operátor", needed: 1, assigned: 0 },
      { role: "Hang", needed: 1, assigned: 1 }
    ],
    assignedStudents: [
      { id: 13, name: "Kelemen Lilla", role: "Dokumentarista", class: "NYF", status: "confirmed", skills: ["Dokumentum", "Interjú"] },
      { id: 14, name: "Papp Márton", role: "Kameraman", class: "9F", status: "confirmed", skills: ["Mobil kamera", "Sport"] },
      { id: 15, name: "Juhász Vivien", role: "Kameraman", class: "10F", status: "pending", skills: ["Kamera"] },
      { id: 16, name: "Lakatos Tamás", role: "Hang", class: "11F", status: "confirmed", skills: ["Hang", "Mobil felvétel"] }
    ],
    status: "incomplete",
    priority: "medium",
    autoAssigned: false
  }
]

const availableStudents = [
  { id: 17, name: "Mészáros Nóra", class: "NYF", skills: ["Drón", "Külső"], availability: "available" },
  { id: 18, name: "Rácz Ádám", class: "9F", skills: ["Dokumentum", "Szervezés"], availability: "available" },
  { id: 19, name: "Oláh Máté", class: "10F", skills: ["Kamera", "Sport"], availability: "available" },
  { id: 20, name: "Pálinkás Sára", class: "11F", skills: ["Fotózás", "Portré"], availability: "busy" },
  { id: 21, name: "Vincze Alex", class: "12F", skills: ["IT", "Streaming"], availability: "available" }
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'complete':
      return { variant: 'default', label: 'Teljes', color: 'text-green-600', icon: CheckCircle }
    case 'incomplete':
      return { variant: 'destructive', label: 'Hiányos', color: 'text-red-600', icon: AlertTriangle }
    case 'draft':
      return { variant: 'outline', label: 'Tervezet', color: 'text-gray-600', icon: Edit }
    default:
      return { variant: 'outline', label: 'Ismeretlen', color: 'text-gray-600', icon: AlertTriangle }
  }
}

const getStudentStatusInfo = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { variant: 'default', label: 'Elfogadva', color: 'text-green-600', icon: CheckCircle }
    case 'pending':
      return { variant: 'outline', label: 'Függőben', color: 'text-yellow-600', icon: Clock }
    case 'declined':
      return { variant: 'destructive', label: 'Elutasítva', color: 'text-red-600', icon: XCircle }
    default:
      return { variant: 'outline', label: 'Ismeretlen', color: 'text-gray-600', icon: AlertTriangle }
  }
}

export default function SchedulePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  // Filter assignments
  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.shootingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const stats = {
    totalAssignments: mockAssignments.length,
    completeAssignments: mockAssignments.filter(a => a.status === 'complete').length,
    incompleteAssignments: mockAssignments.filter(a => a.status === 'incomplete').length,
    totalStudentsAssigned: mockAssignments.reduce((sum, assignment) => sum + assignment.assignedStudents.length, 0),
    availableStudents: availableStudents.filter(s => s.availability === 'available').length
  }

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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <TableProperties className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Beosztás kezelő</h1>
                <p className="text-muted-foreground">
                  Diákok automatikus és manuális beosztása forgatásokra
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Shuffle className="mr-2 h-4 w-4" />
                Auto beosztás
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Új beosztás
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TableProperties className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                    <p className="text-sm text-muted-foreground">Beosztás összesen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.completeAssignments}</p>
                    <p className="text-sm text-muted-foreground">Teljes beosztás</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.incompleteAssignments}</p>
                    <p className="text-sm text-muted-foreground">Hiányos beosztás</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.availableStudents}</p>
                    <p className="text-sm text-muted-foreground">Elérhető diák</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="assignments" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="assignments">Beosztások</TabsTrigger>
                <TabsTrigger value="students">Diákok</TabsTrigger>
                <TabsTrigger value="analytics">Statisztikák</TabsTrigger>
                <TabsTrigger value="settings">Beállítások</TabsTrigger>
              </TabsList>

              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Keresés..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Státusz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Minden</SelectItem>
                    <SelectItem value="complete">Teljes</SelectItem>
                    <SelectItem value="incomplete">Hiányos</SelectItem>
                    <SelectItem value="draft">Tervezet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="assignments" className="space-y-4">
              <div className="space-y-6">
                {filteredAssignments.map(assignment => {
                  const statusInfo = getStatusInfo(assignment.status)
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{assignment.shootingTitle}</h3>
                              <Badge variant={statusInfo.variant as "default" | "secondary" | "destructive" | "outline"}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                              {assignment.autoAssigned && (
                                <Badge variant="secondary">
                                  <Shuffle className="h-3 w-3 mr-1" />
                                  Auto
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{assignment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{assignment.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{assignment.location}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Roles Overview */}
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {assignment.requiredRoles.map((role, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{role.role}</span>
                                <Badge variant={role.assigned >= role.needed ? "default" : "destructive"}>
                                  {role.assigned}/{role.needed}
                                </Badge>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    role.assigned >= role.needed ? 'bg-green-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min((role.assigned / role.needed) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Assigned Students */}
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Beosztott diákok ({assignment.assignedStudents.length})
                          </h4>
                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {assignment.assignedStudents.map(student => {
                              const studentStatusInfo = getStudentStatusInfo(student.status)
                              const StudentStatusIcon = studentStatusInfo.icon
                              
                              return (
                                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                      {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">{student.name}</div>
                                      <div className="text-xs text-muted-foreground">{student.class} • {student.role}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={studentStatusInfo.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                                      <StudentStatusIcon className="h-2 w-2 mr-1" />
                                      {studentStatusInfo.label}
                                    </Badge>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-3 border-t">
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Diák hozzáadása
                          </Button>
                          <Button variant="outline" size="sm">
                            <Shuffle className="h-4 w-4 mr-1" />
                            Automatikus kitöltés
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Értesítések küldése
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Assigned Students */}
                <Card>
                  <CardHeader>
                    <CardTitle>Beosztott diákok</CardTitle>
                    <CardDescription>Jelenleg beosztásban szereplő diákok</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockAssignments.flatMap(assignment => assignment.assignedStudents).slice(0, 8).map(student => {
                        const statusInfo = getStudentStatusInfo(student.status)
                        const StatusIcon = statusInfo.icon
                        
                        return (
                          <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.class}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {student.skills.slice(0, 2).join(', ')}
                              </Badge>
                              <Badge variant={statusInfo.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                                <StatusIcon className="h-2 w-2 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Available Students */}
                <Card>
                  <CardHeader>
                    <CardTitle>Elérhető diákok</CardTitle>
                    <CardDescription>Beosztásra váró diákok</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground">{student.class}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {student.skills.slice(0, 2).join(', ')}
                            </Badge>
                            <Badge variant={student.availability === 'available' ? 'default' : 'secondary'} className="text-xs">
                              {student.availability === 'available' ? 'Elérhető' : 'Foglalt'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Beosztás hatékonyság
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">87%</div>
                        <div className="text-sm text-muted-foreground">átlagos kitöltés</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Teljes beosztások</span>
                          <span>{stats.completeAssignments}/{stats.totalAssignments}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${(stats.completeAssignments / stats.totalAssignments) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Szerepkörök
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { role: 'Kameraman', count: 8, color: 'bg-blue-500' },
                        { role: 'Operatőr', count: 6, color: 'bg-green-500' },
                        { role: 'Hang', count: 4, color: 'bg-purple-500' },
                        { role: 'Világítás', count: 5, color: 'bg-orange-500' },
                        { role: 'Asszisztens', count: 7, color: 'bg-red-500' }
                      ].map(item => (
                        <div key={item.role} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${item.color}`} />
                            <span className="text-sm">{item.role}</span>
                          </div>
                          <span className="font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Havi trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+15%</div>
                        <div className="text-sm text-muted-foreground">növekedés</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Ez a hónap</span>
                          <span>{stats.totalAssignments} beosztás</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Múlt hónap</span>
                          <span>18 beosztás</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">Pozitív trend</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Automatikus beosztás</CardTitle>
                    <CardDescription>Beállítások az automatikus beosztás algoritmushoz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Képesség egyezés súlyozása</span>
                        <span className="text-sm text-muted-foreground">75%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-3/4" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Elérhetőség prioritás</span>
                        <span className="text-sm text-muted-foreground">90%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-5/6" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Osztály egyenlőség</span>
                        <span className="text-sm text-muted-foreground">60%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-3/5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Értesítési beállítások</CardTitle>
                    <CardDescription>Hogyan és mikor értesítsd a diákokat</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Email értesítés új beosztásról</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">SMS emlékeztető 24 órával előtte</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Push értesítés mobilon</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Értesítés beosztás változásról</span>
                      </label>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <Button size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Mentés
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
