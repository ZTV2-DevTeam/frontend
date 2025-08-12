"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useCallback } from "react"
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
  try {
    const now = new Date()
    const hour = now.getHours()
    const month = now.getMonth() + 1 // getMonth() returns 0-11
    const day = now.getDate()

    // Validate date values
    if (isNaN(hour) || isNaN(month) || isNaN(day)) {
      return `Üdvözlünk, ${firstName}!`
    }

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
  } catch (error) {
    console.error('Error generating welcome message:', error)
    return `Üdvözlünk, ${firstName}!`
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
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Legutóbbi Felhasználók</CardTitle>
                <CardDescription>Utolsó bejelentkezések betöltése...</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Felhasználók betöltése...</p>
          </div>
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
  
  // Get most recently active users (last 5 users who logged in)
  // Sort all users by last_login (most recent first), filter out users without login, and take last 5
  const mostRecentUsers = users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((user: any) => user.last_login) // Only users who have logged in
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => {
      return new Date(b.last_login).getTime() - new Date(a.last_login).getTime()
    })
    .slice(0, 5) // Get most recent 5

  // Count users active in different time periods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeNowCount = users.filter((user: any) => {
    if (!user.last_login) return false
    const lastLogin = new Date(user.last_login)
    return lastLogin >= fiveMinutesAgo
  }).length

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeTodayCount = users.filter((user: any) => {
    if (!user.last_login) return false
    const lastLogin = new Date(user.last_login)
    return lastLogin >= last24Hours
  }).length

  // Format last login time with better error handling
  const formatLastLogin = (lastLogin: string) => {
    try {
      const loginDate = new Date(lastLogin)
      if (isNaN(loginDate.getTime())) {
        return 'ismeretlen'
      }
      
      const diffMs = now.getTime() - loginDate.getTime()
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMinutes < 1) return 'most'
      if (diffMinutes < 60) return `${diffMinutes} perce`
      if (diffHours < 24) return `${diffHours} órája`
      if (diffDays === 1) return 'tegnap'
      if (diffDays > 365) return 'több mint egy éve'
      return `${diffDays} napja`
    } catch (error) {
      console.error('Error formatting last login:', error)
      return 'ismeretlen'
    }
  }

  // Get user role display
  const getUserRoleDisplay = (user: any) => {
    if (user.admin_type === 'system') return 'Rendszeradmin'
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
    <Card className="h-fit" role="region" aria-labelledby="recent-users-title">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg" aria-hidden="true">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle id="recent-users-title" className="text-base">Legutóbbi bejelentkezések</CardTitle>
              <CardDescription className="text-xs">Utolsó {mostRecentUsers.length} felhasználó</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mostRecentUsers.length > 0 ? (
          <>
            <div className="space-y-1">
              {mostRecentUsers.slice(0, 3).map((user: any, index: number) => {
                const activity = getActivityStatus(user)
                const isActive = isCurrentlyActive(user)
                
                return (
                  <div 
                    key={user.id} 
                    className="group flex items-center justify-between p-2 rounded-lg border border-border/30 hover:border-primary/30 hover:bg-accent/50 cursor-pointer transition-all duration-200"
                    role="button"
                    tabIndex={0}
                    aria-label={`${user.full_name || `${user.first_name} ${user.last_name}`} - ${getUserRoleDisplay(user)} - ${formatLastLogin(user.last_login)}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div 
                          className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-xs font-semibold border border-background group-hover:border-primary/20 transition-colors"
                          title={`${user.full_name || `${user.first_name || 'Ismeretlen'} ${user.last_name || 'Felhasználó'}`}`}
                        >
                          {(user.first_name?.charAt(0) || user.full_name?.charAt(0) || '?').toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-background ${activity.bgColor} flex items-center justify-center`}>
                          {isActive && (
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="font-medium text-xs truncate">
                            {user.full_name || `${user.first_name || 'Ismeretlen'} ${user.last_name || 'Felhasználó'}`}
                          </span>
                          {isActive && (
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs px-1.5 py-0 text-xs">
                            {getUserRoleDisplay(user)}
                          </Badge>
                          <span>•</span>
                          <span>{formatLastLogin(user.last_login)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Compact Statistics */}
            <div className="pt-2 border-t border-border/30">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">{activeNowCount}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Aktív most</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{activeTodayCount}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Ma aktív</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Nincs aktív felhasználó</h3>
            <p className="text-xs text-muted-foreground">Még senki sem jelentkezett be</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PendingForgatásokWidget() {
  const { data: filmingData, loading, error } = useApiQuery(
    () => apiClient.getFilmingSessions()
  )
  const router = useRouter()

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Függő Forgatások</CardTitle>
                <CardDescription>Beosztásra váró munkák betöltése...</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-sm text-muted-foreground">Forgatások betöltése...</p>
          </div>
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
  const urgentSessions = pendingSessions.filter((s: any) => {
    if (!s.datum) return false
    const sessionDate = new Date(s.datum)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return sessionDate <= threeDaysFromNow
  })

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
              <CardDescription>Beosztásra váró munkák és sürgős feladatok</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800">
              {pendingSessions.length} függő
            </Badge>
            {urgentSessions.length > 0 && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                {urgentSessions.length} sürgős
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingSessions.length > 0 ? (
          <>
            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <Button 
                size="sm" 
                onClick={() => router.push('/app/forgatasok')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Új forgatás
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/app/forgatasok/beosztasok')}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Beosztások
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/app/stab')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Stábok
              </Button>
            </div>

            {/* Priority Sessions */}
            {urgentSessions.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <h4 className="text-sm font-semibold text-red-700 dark:text-red-300">Sürgős beosztások (3 napon belül)</h4>
                </div>
                <div className="space-y-2">
                  {urgentSessions.slice(0, 2).map((session: any, index: number) => (
                    <div key={`urgent-${session.id}`} className="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500 rounded-lg animate-pulse">
                            <Video className="h-4 w-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-red-800 dark:text-red-200">
                                {session.title}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                Sürgős
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-red-600 dark:text-red-300">
                              <span>📅 {session.datum || 'Nincs dátum'}</span>
                              <span>📍 {session.location || 'Nincs helyszín'}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive">
                          Beosztás
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Pending Sessions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Összes függő forgatás</h4>
                <Button variant="ghost" size="sm" onClick={() => router.push('/app/forgatasok')}>
                  Összes megtekintése
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {pendingSessions.slice(0, 6).map((session: any, index: number) => (
                  <div key={session.id} className="group flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-orange-500/30 hover:bg-accent/50 cursor-pointer transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="p-2 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-200/30 group-hover:border-orange-300/50 transition-colors">
                          <Video className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-background flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">
                            {session.title}
                          </span>
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800">
                            {session.type || 'Forgatás'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>📅 {session.datum || 'TBD'}</span>
                          <span>•</span>
                          <span>📍 {session.location || 'TBD'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800"
                      >
                        🔶 Függő
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics and Overview */}
            <div className="pt-4 border-t border-border/50">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-center">
                  <div className="text-xl font-bold text-orange-700 dark:text-orange-300">{pendingSessions.length}</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Összes függő</div>
                </div>
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-center">
                  <div className="text-xl font-bold text-red-700 dark:text-red-300">{urgentSessions.length}</div>
                  <div className="text-xs text-red-600 dark:text-red-400">Sürgős</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{sessions.length - pendingSessions.length}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Beosztott</div>
                </div>
              </div>
            </div>

            {urgentSessions.length > 0 && (
              <div className="relative overflow-hidden rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-4 dark:from-red-950/30 dark:to-orange-950/30 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-lg animate-pulse">
                      <Timer className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-red-800 dark:text-red-200">Sürgős beosztás szükséges</span>
                      <div className="text-xs text-red-600 dark:text-red-300 mt-1">
                        {urgentSessions.length} forgatás 3 napon belül • Azonnali figyelem szükséges
                      </div>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => router.push('/app/forgatasok/surgos')}>
                    Kezelés
                  </Button>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-red-400/20 rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500/20 rounded-full" />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Nincs függő forgatás</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Minden forgatás megfelelően be van osztva
            </p>
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

  const handleActionClick = (route: string, actionName: string) => {
    try {
      router.push(route)
    } catch (error) {
      console.error(`Failed to navigate to ${actionName}:`, error)
      // Could add toast notification here
    }
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
              onClick={() => handleActionClick(action.route, action.name)}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:bg-accent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              role="button"
              tabIndex={0}
              aria-label={`${action.name} - ${action.description}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleActionClick(action.route, action.name);
                }
              }}
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
      if (user?.first_name) {
        setWelcomeMessage(getDynamicWelcomeMessage(user.first_name))
      }
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
            
            {/* Main widgets grid - Prioritizing pending shootings */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-1 lg:col-span-2">
                <PendingForgatásokWidget />
              </div>
              <div className="col-span-1">
                <ActiveUsersWidget />
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
                  {(() => {
                    try {
                      return new Date().toLocaleDateString('hu-HU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })
                    } catch (error) {
                      return new Date().toLocaleDateString('hu-HU')
                    }
                  })()}
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
