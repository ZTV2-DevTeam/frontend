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
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Aktív Felhasználók</CardTitle>
              <CardDescription>Legutóbbi bejelentkezések alapján</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            Top {topActiveUsers.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {topActiveUsers.length > 0 ? (
          <>
            <div className="space-y-2">
              {topActiveUsers.map((user: any, index: number) => {
                const activity = getActivityStatus(user)
                const isActive = isCurrentlyActive(user)
                
                return (
                  <div key={user.id} className="group flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-accent/50 cursor-pointer transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center gap-3">
                        <div className={`flex items-center justify-center w-2 h-8 rounded-full ${
                          index === 0 ? 'bg-yellow-400' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-400' : 'bg-muted'
                        }`}>
                          <span className="text-xs font-bold text-white">
                            {index + 1}
                          </span>
                        </div>
                        
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-background group-hover:border-primary/20 transition-colors">
                            {user.first_name?.charAt(0) || '?'}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${activity.bgColor} flex items-center justify-center`}>
                            {isActive && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm truncate">
                            {user.full_name || `${user.first_name} ${user.last_name}`}
                          </span>
                          {isActive && (
                            <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                              ONLINE
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-muted rounded-md">{getUserRoleDisplay(user)}</span>
                          <span>•</span>
                          <span>{formatLastLogin(user.last_login)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${activity.color} border-current`}
                      >
                        {activity.status === 'online' ? 'Aktív' : 
                         activity.status === 'recent' ? 'Nemrég' : 
                         activity.status === 'today' ? 'Ma' : 'Offline'}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm mb-2">Nincs aktív felhasználó</h3>
            <p className="text-xs text-muted-foreground">Még senki sem jelentkezett be</p>
          </div>
        )}
        
        {/* Statistics cards */}
        <div className="pt-4 border-t border-border/50">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-3 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-500 rounded-md">
                    <Activity className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Aktív most</span>
                </div>
                <span className="text-lg font-bold text-green-700 dark:text-green-300">{activeNowCount}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400/20 rounded-full" />
            </div>
            
            <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 dark:from-blue-950/30 dark:to-cyan-950/30 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500 rounded-md">
                    <Clock className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Ma aktív</span>
                </div>
                <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{activeTodayCount}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-400/20 rounded-full" />
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
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Függő Forgatások</CardTitle>
              <CardDescription>Beosztásra váró munkák</CardDescription>
            </div>
          </div>
          <Badge variant="destructive" className="text-xs bg-red-50 text-red-700 border-red-200">
            {pendingSessions.length} függőben
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingSessions.length > 0 ? (
          <>
            <div className="space-y-2">
              {pendingSessions.slice(0, 3).map((session: any, index: number) => (
                <div key={session.id} className="group flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-orange-500/30 hover:bg-accent/50 cursor-pointer transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="p-2.5 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-200/30 group-hover:border-orange-300/50 transition-colors">
                        <Video className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm truncate">
                          {session.title}
                        </span>
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          {session.type || 'Forgatás'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs text-red-600 border-red-200"
                    >
                      Függő
                    </Badge>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Priority Alert */}
            <div className="relative overflow-hidden rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-4 dark:from-red-950/30 dark:to-orange-950/30 dark:border-red-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500 rounded-lg animate-pulse">
                    <Timer className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-red-800 dark:text-red-200">Sürgős beosztás szükséges</span>
                    <div className="text-xs text-red-600 dark:text-red-300 mt-1">Prioritás: Magas • Azonnali figyelem szükséges</div>
                  </div>
                </div>
                <Badge variant="destructive" className="text-xs animate-bounce">
                  Sürgős
                </Badge>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-red-400/20 rounded-full" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500/20 rounded-full" />
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm mb-2">Nincs függő forgatás</h3>
            <p className="text-xs text-muted-foreground">Minden forgatás rendben van</p>
          </div>
        )}
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
      route: "/app/forgatasok",
      color: "bg-blue-500"
    },
    { 
      name: "Stábok", 
      description: "Csapat kezelése",
      icon: Users, 
      route: "/app/stab",
      color: "bg-green-500"
    },
    { 
      name: "Közlemény", 
      description: "Új üzenet küldése",
      icon: Megaphone, 
      route: "/app/uzenofal",
      color: "bg-orange-500"
    },
    { 
      name: "Naptár", 
      description: "Események megtekintése",
      icon: CalendarDays, 
      route: "/app/naptar",
      color: "bg-purple-500"
    },
  ]

  const handleActionClick = (route: string) => {
    router.push(route)
  }

  return (
    <Card className="border-2 border-dashed border-muted-foreground/20 bg-gradient-to-r from-background via-muted/30 to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Gyors műveletek</CardTitle>
              <CardDescription>Gyakran használt funkciók egyetlen kattintással</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {quickActions.length} művelet
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.name}
              onClick={() => handleActionClick(action.route)}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:bg-accent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">{action.name}</h3>
                    <p className="text-xs text-muted-foreground leading-tight">{action.description}</p>
                  </div>
                </div>
                
                {/* Decorative corner element */}
                <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
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
