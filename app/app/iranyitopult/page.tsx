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
import { useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
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
  User,
  Loader2
} from "lucide-react"

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
function ActiveUsersWidget() {
  const { data: usersData, loading, error } = useApiQuery(
    () => apiClient.getAllUsersDetailed()
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div className="text-center">
            <p className="text-destructive font-medium">
              Hiba az aktív felhasználók betöltésekor
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error}
            </p>
            {error?.includes('Bejelentkezés szükséges') && (
              <Button 
                onClick={() => window.location.href = '/login'}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Bejelentkezés
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const users = usersData || []
  
  // Get current date for activity calculations
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  // Get top 5 active users by last login time
  // Sort all users by last_login (most recent first), filter out users without login, and take top 5
  const topActiveUsers = users
    .filter((user: any) => user.last_login) // Only users who have logged in
    .sort((a: any, b: any) => {
      return new Date(b.last_login).getTime() - new Date(a.last_login).getTime()
    })
    .slice(0, 5) // Get top 5

  // Count users active in different time periods
  const activeNowCount = users.filter((user: any) => {
    if (!user.last_login) return false
    const lastLogin = new Date(user.last_login)
    return lastLogin >= fiveMinutesAgo
  }).length

  const activeTodayCount = users.filter((user: any) => {
    if (!user.last_login) return false
    const lastLogin = new Date(user.last_login)
    return lastLogin >= last24Hours
  }).length

  // Format last login time
  const formatLastLogin = (lastLogin: string) => {
    const loginDate = new Date(lastLogin)
    const diffMs = now.getTime() - loginDate.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'most'
    if (diffMinutes < 60) return `${diffMinutes} perce`
    if (diffHours < 24) return `${diffHours} órája`
    if (diffDays === 1) return 'tegnap'
    return `${diffDays} napja`
  }

  // Get user role display
  const getUserRoleDisplay = (user: any) => {
    if (user.admin_type === 'system') return 'Admin'
    if (user.admin_type === 'teacher') return 'Tanár'
    if (user.special_role === 'class_teacher') return 'Osztályfőnök'
    return 'Diák'
  }

  // Check if user is currently active (last login within 5 minutes)
  const isCurrentlyActive = (user: any) => {
    if (!user.last_login) return false
    const lastLogin = new Date(user.last_login)
    return lastLogin >= fiveMinutesAgo
  }

  // Get activity status with more precise timing
  const getActivityStatus = (user: any) => {
    if (!user.last_login) return { status: 'offline', color: 'text-gray-500', bgColor: 'bg-gray-500' }
    
    const lastLogin = new Date(user.last_login)
    const diffMs = now.getTime() - lastLogin.getTime()
    const diffMinutes = diffMs / (1000 * 60)
    const diffHours = diffMs / (1000 * 60 * 60)
    
    if (diffMinutes <= 5) return { status: 'online', color: 'text-green-500', bgColor: 'bg-green-500' }
    if (diffHours < 1) return { status: 'recent', color: 'text-blue-500', bgColor: 'bg-blue-500' }
    if (diffHours < 24) return { status: 'today', color: 'text-yellow-500', bgColor: 'bg-yellow-500' }
    return { status: 'offline', color: 'text-gray-500', bgColor: 'bg-gray-500' }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Aktív Felhasználók</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {topActiveUsers.length}/5
          </Badge>
        </div>
        <CardDescription>Legutóbbi bejelentkezések alapján rendezve</CardDescription>
      </CardHeader>
      <CardContent>
        {topActiveUsers.length > 0 ? (
          <div className="space-y-1">
            {topActiveUsers.map((user: any, index: number) => {
              const activity = getActivityStatus(user)
              const isActive = isCurrentlyActive(user)
              
              return (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                        {user.first_name?.charAt(0) || '?'}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${activity.bgColor}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.full_name || `${user.first_name} ${user.last_name}`}</span>
                          {isActive && (
                            <Badge variant="default" className="text-xs bg-green-500">
                              ONLINE
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                          <span>{getUserRoleDisplay(user)}</span>
                          <span>•</span>
                          <span>{formatLastLogin(user.last_login)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Badge 
                      variant="outline" 
                      className={`text-xs mr-2 ${activity.color}`}
                    >
                      {activity.status === 'online' ? 'Aktív' : 
                       activity.status === 'recent' ? 'Nemrég' : 
                       activity.status === 'today' ? 'Ma' : 'Offline'}
                    </Badge>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nincs bejelentkezett felhasználó</p>
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Aktív most</span>
              </div>
              <span className="text-sm font-bold text-green-600">{activeNowCount}</span>
            </div>
          </div>
          
          <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Ma aktív</span>
              </div>
              <span className="text-sm font-bold text-blue-600">{activeTodayCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PendingForgatásokWidget() {
  const { data: filmingData, loading, error } = useApiQuery(
    () => apiClient.getFilmingSessions()
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12 text-destructive">
          <AlertCircle className="h-6 w-6 mr-2" />
          Hiba a forgatások betöltésekor
        </CardContent>
      </Card>
    )
  }

  const sessions = filmingData || []
  const pendingSessions = sessions.filter((s: any) => s.status === 'pending' || s.status === 'planning')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Függő forgatások</CardTitle>
          </div>
          <Badge variant="destructive" className="text-xs">
            {pendingSessions.length}
          </Badge>
        </div>
        <CardDescription>Beosztásra váró forgatások</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {pendingSessions.slice(0, 3).map((session: any) => (
            <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">{session.title}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{session.datum || 'Nincs dátum'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span>{session.location || 'Nincs helyszín'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Badge variant="outline" className="text-xs mr-2">
                  {session.type || 'Forgatás'}
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

// Student Widget Components
function UpcomingShootingsWidget() {
  const { data: filmingData, loading, error } = useApiQuery(
    () => apiClient.getFilmingSessions()
  )
  const { user } = useAuth()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12 text-destructive">
          <AlertCircle className="h-6 w-6 mr-2" />
          Hiba a forgatások betöltésekor
        </CardContent>
      </Card>
    )
  }

  const sessions = filmingData || []
  // Filter upcoming sessions (could be filtered by user assignment later)
  const upcomingSessions = sessions.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Közelgő forgatások</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {upcomingSessions.length} aktív
          </Badge>
        </div>
        <CardDescription>Az előttünk álló feladatok</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {upcomingSessions.map((session: any, index: number) => (
            <div 
              key={session.id || index} 
              className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors ${
                index === 0 
                  ? 'border-primary bg-primary/5' 
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{session.title || session.name}</span>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Következő
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{session.datum || 'Nincs dátum'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{session.location || 'Nincs helyszín'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Badge variant="outline" className="text-xs mr-2">
                  {session.type || 'Operatőr'}
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
              <span className="text-sm text-muted-foreground">{sessions.length} forgatás</span>
              <ArrowUpRight className="h-3 w-3 text-green-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Class Teacher Widget Components
function IgazolasStatsWidget() {
  const router = useRouter()
  const { data: absenceData, loading, error } = useApiQuery(
    () => apiClient.getAbsences()
  )
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  const absences = Array.isArray(absenceData) ? absenceData : []
  const dailyCount = absences.length > 0 ? Math.min(5, absences.length) : 0
  const weeklyCount = absences.length > 0 ? Math.min(23, absences.length * 3) : 0
  const monthlyCount = absences.length || 0

  const stats = [
    { label: 'Mai nap', value: dailyCount, icon: Clock },
    { label: 'Ezen a héten', value: weeklyCount, icon: Calendar },
    { label: 'Ebben a hónapban', value: monthlyCount, icon: BarChart3 }
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
            <span className="text-sm text-muted-foreground">{monthlyCount}/100 ({Math.round((monthlyCount/100)*100)}%)</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min((monthlyCount/100)*100, 100)}%` }}
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
          <>
            {/* Quick Actions at the top */}
            <QuickActionsWidget />
            
            {/* Main widgets grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-1 lg:col-span-2">
                <ActiveUsersWidget />
              </div>
              <div className="col-span-1">
                <PendingForgatásokWidget />
              </div>
            </div>
          </>
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
