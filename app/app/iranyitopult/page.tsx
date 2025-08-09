"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { useApiGet } from "@/hooks/use-api"
import { 
  Users, 
  Clock, 
  Calendar,
  Plus, 
  Megaphone, 
  CalendarDays,
  Camera,
  Video,
  FileText,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Target,
  LogIn,
  ExternalLink,
  Activity,
  Zap,
  ArrowUpRight,
  Award,
  Timer,
  Globe,
  Layers,
  BarChart4,
  Shield,
  GraduationCap,
  User
} from "lucide-react"

// Types for dashboard data
interface LatestLogin {
  id: number
  full_name: string
  datetime: string
  relative_time: string
}

interface PendingForgatas {
  id: number
  title: string
  date: string
  location: string
  type: string
}

interface UpcomingShoot {
  id: number
  title: string
  date: string
  location: string
  role: string
  equipment: string[]
  is_next: boolean
}

interface IgazolasStats {
  daily: number
  weekly: number
  monthly: number
}

// Mock data - replace with real API calls
const mockLatestLogins: LatestLogin[] = [
  { id: 1, full_name: "Nagy Péter", datetime: "2025-01-08 14:30", relative_time: "2 órája" },
  { id: 2, full_name: "Kiss Anna", datetime: "2025-01-08 13:15", relative_time: "3 órája" },
  { id: 3, full_name: "Szabó János", datetime: "2025-01-08 12:00", relative_time: "4 órája" },
  { id: 4, full_name: "Tóth Mária", datetime: "2025-01-08 11:45", relative_time: "5 órája" },
]

const mockPendingForgatások: PendingForgatas[] = [
  { id: 1, title: "Évkönyv fotózás", date: "2025-01-10", location: "Tornaterem", type: "Fotózás" },
  { id: 2, title: "Ballagás felvétel", date: "2025-01-12", location: "Aula", type: "Videózás" },
  { id: 3, title: "Iskolai bemutató", date: "2025-01-15", location: "Színpadterem", type: "Közvetítés" },
]

const mockUpcomingShootsForStudent: UpcomingShoot[] = [
  { 
    id: 1, 
    title: "UNESCO Műsor - ÉLŐ", 
    date: "2025-01-10", 
    location: "Körösi Kulturális Központ", 
    role: "Operatőr", 
    equipment: ["📹"],
    is_next: true 
  },
  { 
    id: 2, 
    title: "BRFK - Bringás Sportnap", 
    date: "2025-01-12", 
    location: "Vörösmarty Mihály Gimnázium", 
    role: "Operatőr", 
    equipment: ["📹"],
    is_next: false 
  },
  {
    id: 3,
    title: "Kőbányai diákok jazz koncertje",
    date: "2025-01-15",
    location: "Magyar Zene Háza - Városliget",
    role: "Operatőr",
    equipment: ["📹"],
    is_next: false
  }
]

const mockIgazolasStats: IgazolasStats = {
  daily: 5,
  weekly: 23,
  monthly: 87
}

// Function to get dynamic welcome message based on time of day and season
function getDynamicWelcomeMessage(firstName: string = 'Felhasználó'): string {
  const now = new Date()
  const hour = now.getHours()
  const month = now.getMonth() + 1 // getMonth() returns 0-11
  const day = now.getDate()

  // Christmas period (second half of December)
  if (month === 12 && day >= 15) {
    const christmasGreetings = [
      `🎄 Kellemes ünnepeket, ${firstName}!`,
      `✨ Kellemes ünnepeket, ${firstName}!`,
      `🎅 Kellemes ünnepeket, ${firstName}!`,
      `❄️ Kellemes ünnepeket, ${firstName}!`
    ]
    return christmasGreetings[Math.floor(Math.random() * christmasGreetings.length)]
  }

  // New Year period (first week of January)
  if (month === 1 && day <= 7) {
    return `🎊 Boldog új évet, ${firstName}!`
  }

  // Summer greetings (July-August)
  if (month >= 7 && month <= 8) {
    const summerGreetings = [
      `☀️ Jó reggelt, ${firstName}!`,
      `🌞 Szép napot, ${firstName}!`,
      `🌅 Kellemes nyarat, ${firstName}!`
    ]
    if (hour >= 6 && hour < 12) return summerGreetings[0]
    if (hour >= 12 && hour < 18) return summerGreetings[1]
    return summerGreetings[2]
  }

  // Time-based greetings for regular days
  if (hour >= 5 && hour < 11) {
    return `🌅 Jó reggelt, ${firstName}!`
  } else if (hour >= 11 && hour < 17) {
    return `☀️ Szép napot, ${firstName}!`
  } else if (hour >= 17 && hour < 21) {
    return `🌇 Szép estét, ${firstName}!`
  } else {
    return `🌙 Jó éjszakát, ${firstName}!`
  }
}

// Admin Widget Components - Database Admin Style
function LatestLoginsWidget() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogIn className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Aktív felhasználók</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {mockLatestLogins.length} aktív
          </Badge>
        </div>
        <CardDescription>Legutóbbi bejelentkezések</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {mockLatestLogins.slice(0, 3).map((login, index) => (
            <div key={login.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                  {login.full_name.charAt(0)}
                </div>
                <div>
                  <span className="font-medium">{login.full_name}</span>
                  <p className="text-sm text-muted-foreground">{login.datetime}</p>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="text-sm mr-2">{login.relative_time}</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Napi összesítő</span>
            </div>
            <span className="text-sm text-muted-foreground">+12% növekedés</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PendingForgatásokWidget() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Függő feladatok</CardTitle>
          </div>
          <Badge variant="destructive" className="text-xs">
            {mockPendingForgatások.length}
          </Badge>
        </div>
        <CardDescription>Beosztásra váró forgatások</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {mockPendingForgatások.map((forgatas) => (
            <div key={forgatas.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">{forgatas.title}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{forgatas.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span>{forgatas.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Badge variant="outline" className="text-xs mr-2">
                  {forgatas.type}
                </Badge>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 border rounded-lg bg-destructive/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sürgős beosztás szükséges</span>
            </div>
            <span className="text-sm text-muted-foreground">Prioritás: Magas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionsWidget() {
  const router = useRouter()
  
  const quickActions = [
    { 
      name: "Új forgatás", 
      description: "Forgatás létrehozása",
      icon: Plus, 
      route: "/app/forgatasok"
    },
    { 
      name: "Stábok", 
      description: "Csapat kezelése",
      icon: Users, 
      route: "/app/stab"
    },
    { 
      name: "Közlemény", 
      description: "Új üzenet küldése",
      icon: Megaphone, 
      route: "/app/uzenofal"
    },
    { 
      name: "Naptár", 
      description: "Események megtekintése",
      icon: CalendarDays, 
      route: "/app/naptar"
    },
  ]

  const handleActionClick = (route: string) => {
    router.push(route)
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Gyors műveletek</CardTitle>
        </div>
        <CardDescription>Gyakran használt funkciók egyetlen kattintással</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.name}
              onClick={() => handleActionClick(action.route)}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">{action.name}</span>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Student Widget Components - Database Admin Style
function UpcomingShootingsWidget() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Közelgő forgatások</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {mockUpcomingShootsForStudent.length} aktív
          </Badge>
        </div>
        <CardDescription>Az előttünk álló feladatok</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {mockUpcomingShootsForStudent.map((shoot, index) => (
            <div 
              key={shoot.id} 
              className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors ${
                shoot.is_next 
                  ? 'border-primary bg-primary/5' 
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{shoot.title}</span>
                    {shoot.is_next && (
                      <Badge variant="default" className="text-xs">
                        Következő
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{shoot.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{shoot.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Badge variant="outline" className="text-xs mr-2">
                  {shoot.role}
                </Badge>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Havi teljesítmény</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{mockUpcomingShootsForStudent.length} forgatás</span>
              <ArrowUpRight className="h-3 w-3 text-green-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Osztályfőnök Widget Components - Database Admin Style
function IgazolasStatsWidget() {
  const router = useRouter()
  
  const stats = [
    { label: 'Mai nap', value: mockIgazolasStats.daily, icon: Clock },
    { label: 'Ezen a héten', value: mockIgazolasStats.weekly, icon: Calendar },
    { label: 'Ebben a hónapban', value: mockIgazolasStats.monthly, icon: BarChart3 }
  ]
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Igazolás központ</CardTitle>
        </div>
        <CardDescription>Feldolgozott dokumentumok áttekintése</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{stat.label}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="text-sm font-medium mr-2">{stat.value}</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 border rounded-lg bg-muted/50 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Cél elérése</span>
            </div>
            <span className="text-sm text-muted-foreground">{mockIgazolasStats.monthly}/100 (87%)</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000" 
              style={{ width: '87%' }}
            ></div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => router.push("/app/igazolasok")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Igazolások kezelése
        </Button>
      </CardContent>
    </Card>
  )
}

function ShootingTrendsWidget() {
  const trends = [
    { label: 'Napi átlag', value: 12, trend: '+8%', icon: TrendingUp },
    { label: 'Heti összesen', value: 84, trend: '+15%', icon: BarChart3 },
    { label: 'Havi cél', value: 356, trend: '89%', icon: Target }
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Aktivitási trendek</CardTitle>
        </div>
        <CardDescription>Forgatások és teljesítmények elemzése</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 mb-4">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <trend.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{trend.label}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="text-sm font-medium mr-2">{trend.value}</span>
                <Badge variant="outline" className="text-xs mr-2">
                  {trend.trend}
                </Badge>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 border rounded-lg bg-muted/50 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Cél követés</span>
            </div>
            <span className="text-sm text-muted-foreground">356/400 (89%)</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000" 
              style={{ width: '89%' }}
            ></div>
          </div>
        </div>
        
        <div className="p-3 border rounded-lg bg-primary/5">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">Kiváló teljesítmény!</span>
              <p className="text-xs text-muted-foreground">A heti átlag 12% -kal meghaladja a tervezett értéket</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const { currentRole } = useUserRole()
  const { user } = useAuth()
  const [welcomeMessage, setWelcomeMessage] = useState('')

  // Update welcome message on component mount and every minute
  useEffect(() => {
    const updateMessage = () => {
      setWelcomeMessage(getDynamicWelcomeMessage(user?.first_name))
    }

    // Initial update
    updateMessage()

    // Update every minute to keep time-based greetings current
    const interval = setInterval(updateMessage, 60000)

    return () => clearInterval(interval)
  }, [user?.first_name])

  // Function to render role-specific widgets
  const renderRoleSpecificWidgets = () => {
    switch (currentRole) {
      case 'admin':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-2">
              <LatestLoginsWidget />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <PendingForgatásokWidget />
            </div>
            <div className="col-span-full">
              <QuickActionsWidget />
            </div>
          </div>
        )

      case 'student':
        return (
          <div className="grid gap-6">
            <div className="col-span-full">
              <UpcomingShootingsWidget />
            </div>
          </div>
        )

      case 'class-teacher':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="col-span-1">
              <IgazolasStatsWidget />
            </div>
          </div>
        )

      default:
        return (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="max-w-sm mx-auto space-y-4">
                <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                  <Layers className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Nincs elérhető tartalom
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ehhez a szerepkörhöz nem található megfelelő dashboard tartalom.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  const getRoleInfo = () => {
    switch (currentRole) {
      case 'admin':
        return { 
          title: 'Rendszergazda', 
          icon: Shield
        }
      case 'student':
        return { 
          title: 'Diák', 
          icon: GraduationCap
        }
      case 'class-teacher':
        return { 
          title: 'Osztályfőnök', 
          icon: Users
        }
      default:
        return { 
          title: 'Ismeretlen', 
          icon: User
        }
    }
  }

  const roleInfo = getRoleInfo()

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
          {/* Header Section */}
          <Card>
            <CardContent className="">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <roleInfo.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold">
                      {welcomeMessage || `Üdvözlünk, ${user?.first_name || 'Felhasználó'}!`}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      {roleInfo.title}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('hu-HU')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-specific widgets */}
          <div className="space-y-4">
            {renderRoleSpecificWidgets()}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
