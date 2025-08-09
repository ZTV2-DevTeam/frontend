"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { Plus, Calendar, Users, Video, BarChart3, Clock, CheckCircle, AlertCircle, FileText, GraduationCap, MessageSquare, UserCheck, X, Check, MoreHorizontal, ExternalLink } from "lucide-react"
import { CreateForgatásDialog } from "@/components/create-forgatas-dialog"
import { ChartRadialStatus } from "@/components/chart-radial-status"
import { ChartLineActivities } from "@/components/chart-line-activities"
import { ChartBarEquipment } from "@/components/chart-bar-equipment"
import { ChartAreaThemed } from "@/components/chart-area-themed"
import { ChartClassAttendance } from "@/components/chart-class-attendance"
import { ChartGradeDistribution } from "@/components/chart-grade-distribution"
import { ChartMonthlyForgatasok } from "@/components/chart-monthly-forgatasok"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DATABASE_MODELS, getDatabaseAdminUrl } from "@/lib/database-models"
import { BACKEND_CONFIG } from "@/lib/config"

// Backend URL configuration
const BACKEND_URL = BACKEND_CONFIG.BASE_URL

// Mock data - replace with real API calls
const mockForgatások = [
  { id: 1, title: "Iskolai rendezvény", status: "active", date: "2025-08-15", location: "Sportcsarnok" },
  { id: 2, title: "Ballagás előkészítés", status: "pending", date: "2025-08-20", location: "Nagyterem" },
  { id: 3, title: "Tantárgyi bemutató", status: "completed", date: "2025-08-10", location: "Labor" },
]

const mockBeosztások = [
  { id: 1, title: "Ünnepi műsor", status: "pending", date: "2025-08-25", applicants: 5 },
  { id: 2, title: "Sportverseny", status: "pending", date: "2025-08-28", applicants: 3 },
  { id: 3, title: "Nyílt nap", status: "assigned", date: "2025-09-05", applicants: 8 },
]

// Mock data for class teachers
const mockIgazolások = [
  { id: 1, student: "Nagy Péter", type: "Betegség", date: "2025-08-08", status: "naplozott", reason: "Orvosi vizsgálat", hours: 2 },
  { id: 2, student: "Kiss Anna", type: "Családi ok", date: "2025-08-07", status: "igazolt", reason: "Családi program", hours: 4 },
  { id: 3, student: "Szabó Márk", type: "Egyéb", date: "2025-08-09", status: "naplozott", reason: "Hivatalos ügyintézés", hours: 1 },
  { id: 4, student: "Tóth Zsuzsanna", type: "Betegség", date: "2025-08-06", status: "igazolatlan", reason: "Nem megfelelő dokumentáció", hours: 3 },
  { id: 5, student: "Kovács Gábor", type: "Betegség", date: "2025-08-05", status: "naplozott", reason: "Láz, influenza tünetek", hours: 6 },
]

// Mock data for recent logins (for admins)
const mockRecentLogins = [
  { id: 1, user: "admin@ztv.hu", role: "Admin", loginTime: "2025-08-09 14:23", ip: "192.168.1.100" },
  { id: 2, user: "osztaly.10a@ztv.hu", role: "Osztályfőnök", loginTime: "2025-08-09 13:45", ip: "192.168.1.105" },
  { id: 3, user: "nagy.peter@ztv.hu", role: "Diák", loginTime: "2025-08-09 12:30", ip: "192.168.1.110" },
  { id: 4, user: "kiss.anna@ztv.hu", role: "Diák", loginTime: "2025-08-09 11:15", ip: "192.168.1.115" },
  { id: 5, user: "tanulo@ztv.hu", role: "Diák", loginTime: "2025-08-09 10:22", ip: "192.168.1.120" },
]

const chartData = [
  { month: "Jan", forgatások: 12, beosztások: 8 },
  { month: "Feb", forgatások: 15, beosztások: 12 },
  { month: "Mar", forgatások: 18, beosztások: 15 },
  { month: "Apr", forgatások: 22, beosztások: 18 },
  { month: "May", forgatások: 25, beosztások: 20 },
  { month: "Jun", forgatások: 28, beosztások: 25 },
]

export default function Page() {
  const { currentRole } = useUserRole()
  const { user, isAuthenticated } = useAuth()
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Mock recent activity based on role
    let mockActivity;
    
    if (currentRole === 'student') {
      mockActivity = [
        { id: 1, action: "Új forgatás jelentkezés", time: "2 órája", type: "application" },
        { id: 2, action: "Felszerelés kérelem jóváhagyva", time: "5 órája", type: "approval" },
        { id: 3, action: "Naptár esemény módosítva", time: "1 napja", type: "update" },
      ]
    } else if (currentRole === 'class-teacher') {
      mockActivity = [
        { id: 1, action: "Új igazolás kérelem - Nagy Péter", time: "1 órája", type: "request" },
        { id: 2, action: "Hiányzás jóváhagyva - Kiss Anna", time: "3 órája", type: "approval" },
        { id: 3, action: "Osztályfőnöki óra ütemezve", time: "5 órája", type: "update" },
        { id: 4, action: "Szülői értesítés elküldve", time: "1 napja", type: "assignment" },
      ]
    } else {
      mockActivity = [
        { id: 1, action: "Új beosztás kérelem", time: "1 órája", type: "request" },
        { id: 2, action: "Forgatás jóváhagyva", time: "3 órája", type: "approval" },
        { id: 3, action: "Felszerelés kiosztás", time: "6 órája", type: "assignment" },
      ]
    }
    
    setRecentActivity(mockActivity)
  }, [currentRole])

  const handleEditInDatabase = (modelPath: string) => {
    const adminUrl = getDatabaseAdminUrl(modelPath)
    window.open(adminUrl, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'assigned': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIgazolásStatusColor = (status: string) => {
    switch (status) {
      case 'naplozott': return 'bg-blue-100 text-blue-800'
      case 'igazolt': return 'bg-green-100 text-green-800'
      case 'igazolatlan': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIgazolásStatusLabel = (status: string) => {
    switch (status) {
      case 'naplozott': return 'Naplózott'
      case 'igazolt': return 'Igazolt'
      case 'igazolatlan': return 'Igazolatlan'
      default: return 'Ismeretlen'
    }
  }

  const getIgazolásTypeColor = (type: string) => {
    switch (type) {
      case 'Betegség': return 'bg-red-100 text-red-800'
      case 'Családi ok': return 'bg-blue-100 text-blue-800'
      case 'Egyéb': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canCreateForgatás = currentRole === 'admin' || (currentRole === 'student' && user?.username?.includes('10F'))

  const renderStudentDashboard = () => (
    <>
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {canCreateForgatás && (
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Új forgatás</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CreateForgatásDialog />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Naptár</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">következő esemény</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Felszerelések</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">kölcsönzött</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statisztikák</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">befejezett forgatás</p>
          </CardContent>
        </Card>
      </div>

      {/* Saját Forgatások */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Saját forgatások</CardTitle>
            <CardDescription>Az aktuális és közeljövőbeli forgatásaid</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditInDatabase(DATABASE_MODELS.FORGATAS)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Edit in Database
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockForgatások.map((forgatás) => (
              <div key={forgatás.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-semibold">{forgatás.title}</h4>
                    <p className="text-sm text-muted-foreground">{forgatás.location} • {forgatás.date}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(forgatás.status)}>
                  {forgatás.status === 'active' ? 'Aktív' :
                   forgatás.status === 'pending' ? 'Várakozó' : 'Befejezett'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Usage Chart for Students */}
      <div className="mb-6">
        <ChartBarEquipment />
      </div>
    </>
  )

  const renderClassTeacherDashboard = () => (
    <>
      {/* Simple Monthly Chart */}
      <div className="mb-6">
        <ChartMonthlyForgatasok />
      </div>

      {/* Quick Link to Igazolások */}
      <Card>
        <CardHeader>
          <CardTitle>Igazolások kezelése</CardTitle>
          <CardDescription>Ugrás az igazolások menüpontba a részletes kezeléshez</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <a href="/app/igazolasok">
              <FileText className="mr-2 h-4 w-4" />
              Igazolások megtekintése
            </a>
          </Button>
        </CardContent>
      </Card>
    </>
  )

  const renderAdminDashboard = () => (
    <>
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Új forgatás</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CreateForgatásDialog />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Összes forgatás</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">ebben a hónapban</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ma bejelentkezett</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRecentLogins.length}</div>
            <p className="text-xs text-muted-foreground">felhasználó ma</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Várakozó</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">jóváhagyásra vár</p>
          </CardContent>
        </Card>
      </div>

      {/* Beosztásra váró forgatások */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Beosztásra váró forgatások</CardTitle>
            <CardDescription>Forgatások, amelyekhez szükséges a személyzet beosztása</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditInDatabase(DATABASE_MODELS.BEOSZTAS)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Edit in Database
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBeosztások.map((beosztás) => (
              <div key={beosztás.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-semibold">{beosztás.title}</h4>
                    <p className="text-sm text-muted-foreground">{beosztás.date} • {beosztás.applicants} jelentkező</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(beosztás.status)}>
                    {beosztás.status === 'pending' ? 'Várakozó' : 'Beosztva'}
                  </Badge>
                  {beosztás.status === 'pending' && (
                    <Button size="sm" variant="outline">Beosztás</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Logins for Admin */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Legutóbbi bejelentkezések</CardTitle>
          <CardDescription>Az elmúlt órák bejelentkezési aktivitása</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentLogins.map((login) => (
              <div key={login.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{login.user}</h4>
                    <p className="text-sm text-muted-foreground">{login.loginTime} • {login.ip}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {login.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Themed Area Chart for Admin */}
      <div className="mb-6">
        <ChartAreaThemed />
      </div>
    </>
  )

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
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Irányítópult</h2>
            <p className="text-muted-foreground">
              Üdvözlünk, {user?.first_name || 'Felhasználó'}! ({currentRole === 'admin' ? 'Admin' : currentRole === 'student' ? 'Diák' : 'Osztályfőnök'})
            </p>
          </div>

          {/* Role-based content */}
          {currentRole === 'student' ? renderStudentDashboard() : 
           currentRole === 'class-teacher' ? renderClassTeacherDashboard() : 
           renderAdminDashboard()}

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
            <div className="col-span-4">
              <ChartLineActivities />
            </div>
            <div className="col-span-3">
              <ChartRadialStatus />
            </div>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Legutóbbi aktivitás</CardTitle>
              <CardDescription>A legfrissebb események és változások</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.type === 'approval' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.type === 'request' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
