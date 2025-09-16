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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import { useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import type { UserRole } from "@/contexts/user-role-context"
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
  Loader2,
  Settings,
  Eye,
  Info,
  Server,
  KeyRound,
  HelpCircle
} from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { AnnouncementDialog } from "@/components/announcement-dialog"
import { VersionInfo } from "@/components/version-info"
import { Shadow } from "@tsparticles/engine"

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

// Function to get role display name in Hungarian
function getRoleDisplayName(role: UserRole | null): string {
  switch (role) {
    case 'admin':
      return 'adminisztrátor'
    case 'class-teacher':
      return 'osztályfőnök'
    case 'student':
      return 'diák'
    default:
      return 'ismeretlen'
  }
}

// Admin Widget Components - Database Admin Style
function ActiveUsersWidget() {
  const { isAuthenticated } = useAuth()
  const { hasPermission } = usePermissions()
  
  // Only fetch users if user has admin permissions
  const canAccessUserData = hasPermission('is_admin') || hasPermission('is_system_admin') || hasPermission('is_teacher_admin')
  
  // Don't render the widget if user doesn't have permission
  if (!canAccessUserData) {
    return null
  }
  
  const { data: usersData, loading, error } = useApiQuery(
    () => isAuthenticated && canAccessUserData ? apiClient.getAllUsersDetailed() : Promise.resolve([]),
    [isAuthenticated, canAccessUserData]
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
                <CardTitle className="text-lg">Legutóbbi Aktivitás</CardTitle>
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

  // Get user role display - using the same logic as in stab page
  const getUserRoleDisplay = (user: any) => {
    // Check admin_type first
    if (user.admin_type === 'developer') return 'Fejlesztő'
    if (user.admin_type === 'teacher') return 'Médiatanár'
    if (user.admin_type === 'system_admin' || user.admin_type === 'admin') return 'Rendszergazda'
    
    // Check special_role
    if (user.special_role === 'class_teacher') return 'Osztályfőnök'
    if (user.special_role === 'production_leader') return 'Gyártásvezető'
    
    // If admin_type is 'none' or not set, and no special role, it's a student
    if ((user.admin_type === 'none' || !user.admin_type) && 
        (user.special_role === 'none' || !user.special_role)) {
      return 'Diák'
    }
    
    // Default to unknown for safety if we can't determine the role
    return 'Ismeretlen'
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
    <Card className="h-96 flex flex-col" role="region" aria-labelledby="recent-users-title">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg" aria-hidden="true">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle id="recent-users-title" className="text-base">Legutóbbi Aktivitás</CardTitle>
              <CardDescription className="text-xs">Utolsó {mostRecentUsers.length} felhasználó</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 overflow-y-auto">
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
                    aria-label={`${user.full_name || `${user.last_name} ${user.first_name}`} - ${getUserRoleDisplay(user)} - ${formatLastLogin(user.last_login)}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <UserAvatar
                          email={user.email}
                          firstName={user.first_name}
                          lastName={user.last_name}
                          username={user.username}
                          size="md"
                          className="border border-background group-hover:border-primary/20 transition-colors"
                          fallbackClassName="bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-semibold"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-background ${activity.bgColor} flex items-center justify-center`}>
                          {isActive && (
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="font-medium text-xs truncate">
                            {user.full_name || `${user.last_name || 'Felhasználó'} ${user.first_name || 'Ismeretlen'}`}
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
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Függő Forgatások</CardTitle>
              <CardDescription>Hamarosan elérhető funkció</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800">
            Fejlesztés alatt
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Hamarosan elérhető!</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-2xl mx-auto">
            A függő forgatások gyors áttekintése hamarosan elérhető lesz.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Fejlesztés folyamatban</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Hamarosan kész</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Temporarily disabled Quick Actions widget
// function QuickActionsWidget() {
//   const router = useRouter()
  
//   const quickActions = [
//     { 
//       name: "Új forgatás", 
//       description: "Forgatás létrehozása",
//       icon: Plus, 
//       route: "/app/forgatasok",
//       color: "bg-blue-500"
//     },
//     { 
//       name: "Stáb", 
//       description: "Csapat kezelése",
//       icon: Users, 
//       route: "/app/stab",
//       color: "bg-green-500"
//     },
//     { 
//       name: "Közlemény", 
//       description: "Új üzenet küldése",
//       icon: Megaphone, 
//       route: "/app/uzenofal",
//       color: "bg-orange-500"
//     },
//     { 
//       name: "Naptár", 
//       description: "Események megtekintése",
//       icon: CalendarDays, 
//       route: "/app/naptar",
//       color: "bg-purple-500"
//     },
//   ]

//   const handleActionClick = (route: string, actionName: string) => {
//     try {
//       router.push(route)
//     } catch (error) {
//       console.error(`Failed to navigate to ${actionName}:`, error)
//       // Could add toast notification here
//     }
//   }

//   return (
//     <Card className="border-2 border-dashed border-muted-foreground/20 bg-gradient-to-r from-background via-muted/30 to-background">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-primary rounded-lg">
//               <Zap className="h-5 w-5 text-primary-foreground" />
//             </div>
//             <div>
//               <CardTitle className="text-lg">Gyors műveletek</CardTitle>
//               <CardDescription>Gyakran használt funkciók egyetlen kattintással</CardDescription>
//             </div>
//           </div>
//           <Badge variant="secondary" className="text-xs">
//             {quickActions.length} művelet
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {quickActions.map((action) => (
//             <div
//               key={action.name}
//               onClick={() => handleActionClick(action.route, action.name)}
//               className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:bg-accent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
//               role="button"
//               tabIndex={0}
//               aria-label={`${action.name} - ${action.description}`}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   e.preventDefault();
//                   handleActionClick(action.route, action.name);
//                 }
//               }}
//             >
//               <div className="p-4">
//                 <div className="flex flex-col items-center text-center space-y-3">
//                   <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform duration-300`}>
//                     <action.icon className="h-6 w-6 text-white" />
//                   </div>
//                   <div className="space-y-1">
//                     <h3 className="font-semibold text-sm">{action.name}</h3>
//                     <p className="text-xs text-muted-foreground leading-tight">{action.description}</p>
//                   </div>
//                 </div>
                
//                 {/* Decorative corner element */}
//                 <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
//                   <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
//                 </div>
                
//                 {/* Hover overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// Quick Actions Widget with new design
function QuickActionsWidget() {
  const router = useRouter()
  const [createForgatásOpen, setCreateForgatásOpen] = useState(false)
  const [createAnnouncementOpen, setCreateAnnouncementOpen] = useState(false)
  
  const quickActions = [
    { 
      name: "Új forgatás", 
      description: "Forgatás létrehozása",
      icon: Plus, 
      action: () => setCreateForgatásOpen(true),
      color: "blue"
    },
    { 
      name: "Új közlemény", 
      description: "Közlemény létrehozása",
      icon: Megaphone, 
      action: () => setCreateAnnouncementOpen(true),
      color: "orange"
    },
    { 
      name: "Stáb Áttekintése", 
      description: "Csapat kezelése",
      icon: Users, 
      action: () => router.push("/app/stab"),
      color: "green"
    },
    { 
      name: "Naptár", 
      description: "Események megnyitása",
      icon: CalendarDays, 
      action: () => router.push("/app/naptar"),
      color: "purple"
    },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-500',
          text: 'text-blue-500',
          icon: 'text-blue-500',
          shadow: 'shadow-blue-500'
        }
      case 'orange':
        return {
          border: 'border-orange-500',
          bg: 'bg-orange-500', 
          text: 'text-orange-500',
          icon: 'text-orange-500',
          shadow: 'shadow-orange-500'
        }
      case 'green':
        return {
          border: 'border-green-500',
          bg: 'bg-green-500',
          text: 'text-green-500',
          icon: 'text-green-500',
          shadow: 'shadow-green-500'
        }
      case 'purple':
        return {
          border: 'border-purple-500',
          bg: 'bg-purple-500',
          text: 'text-purple-500',
          icon: 'text-purple-500',
          shadow: 'shadow-purple-500'
        }
      default:
        return {
          border: 'border-gray-500',
          bg: 'bg-gray-500',
          text: 'text-gray-500',
          icon: 'text-gray-500',
          shadow: 'shadow-gray-500'
        }
    }
  }

  const handleActionClick = (action: () => void, actionName: string) => {
    try {
      action()
    } catch (error) {
      console.error(`Failed to execute ${actionName}:`, error)
    }
  }

  const handleCreateForgatásSuccess = () => {
    setCreateForgatásOpen(false)
    // Could add toast notification here
  }

  const handleCreateAnnouncementSuccess = () => {
    setCreateAnnouncementOpen(false)
    // Could add toast notification here
  }

  // Function to handle creating new forgatás (same logic as sidebar)
  const handleCreateForgatás = () => {
    router.push("/app/forgatasok/uj")
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 sm:gap-4">
        {quickActions.map((action) => {
          const colorClasses = getColorClasses(action.color)
          return (
            <div
              key={action.name}
              onClick={() => {
                if (action.name === "Új forgatás") {
                  handleCreateForgatás()
                } else if (action.name === "Új közlemény") {
                  setCreateAnnouncementOpen(true)
                } else {
                  handleActionClick(action.action, action.name)
                }
              }}
              className={`
                h-auto px-5 py-4 flex flex-col items-start justify-center gap-3 
                ${colorClasses.border} ${colorClasses.bg}/10 ${colorClasses.text} hover:${colorClasses.bg}/20
                transition-all duration-200 hover:scale-[1.02] cursor-pointer
                border-2 hover:border-opacity-80 rounded-md
                scale-90 sm:scale-100
                hover:shadow-sm ${colorClasses.shadow}
              `}
              role="button"
              tabIndex={0}
              aria-label={`${action.name} - ${action.description}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (action.name === "Új forgatás") {
                    handleCreateForgatás()
                  } else if (action.name === "Új közlemény") {
                    setCreateAnnouncementOpen(true)
                  } else {
                    handleActionClick(action.action, action.name)
                  }
                }
              }}
            >
              <action.icon className={`h-5 w-5 ${colorClasses.icon}`} />
              <div className="text-left">
                <div className="font-semibold text-sm leading-tight">{action.name}</div>
                <div className="text-xs opacity-75 mt-1">{action.description}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Announcement Dialog */}
      {createAnnouncementOpen && (
        <AnnouncementDialog
          trigger={null}
          mode="create"
          onSuccess={handleCreateAnnouncementSuccess}
        />
      )}
    </>
  )
}

function SystemOverviewWidget() {
  // System configuration variables
  const systemConfig = [
    {
      label: "Bejelentkezési tokenek lejárata",
      value: "1 óra",
      status: "secure",
      icon: KeyRound,
      tooltipInfo: "Minél kisebb ez az érték, annál biztonságosabb a rendszer, de a felhasználóknak gyakrabban kell újra bejelentkezniük. Nagyobb érték esetén kevesebb bejelentkezés szükséges, de csökken a biztonság."
    },
    {
      label: "Adatbázis kapcsolat állapota",
      value: "Aktív",
      status: "online",
      icon: Server,
      tooltipInfo: "Az adatbázis kapcsolat jelenlegi állapota. Zöld = Aktív, Piros = Kapcsolódási hiba."
    },
    // {
    //   label: "Backend verzió",
    //   value: "v2.1.3",
    //   status: "info",
    //   icon: Settings,
    //   tooltipInfo: "A jelenleg futó backend API verzió száma."
    // },
    // {
    //   label: "Aktív sessions",
    //   value: "23",
    //   status: "info", 
    //   icon: Activity,
    //   tooltipInfo: "Jelenleg bejelentkezett felhasználói munkamenetek száma."
    // }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
        return 'text-green-600 dark:text-green-400'
      case 'online':
        return 'text-green-600 dark:text-green-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'secure':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800'
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800'
    }
  }

  return (
    <TooltipProvider>
      <Card className="h-96 flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <Server className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Rendszer áttekintés</CardTitle>
                <CardDescription>Fix változók és rendszer állapot</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 flex-1 overflow-y-auto">
          {systemConfig.map((config, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <config.icon className={`h-5 w-5 ${getStatusColor(config.status)}`} />
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{config.label}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">{config.tooltipInfo}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${getStatusBadgeColor(config.status)}`}>
                  {config.value}
                </Badge>
              </div>
            </div>
          ))}
          
          <div className="pt-3 border-t border-border/30">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Utolsó frissítés:</span>
              <span>{new Date().toLocaleTimeString('hu-HU')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

// Student Widget Components
function UpcomingShootingsWidget() {
  const { user, isAuthenticated } = useAuth()
  const { data: filmingData, loading, error } = useApiQuery(
    () => isAuthenticated ? apiClient.getFilmingSessions() : Promise.resolve([]),
    [isAuthenticated]
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
  // Filter upcoming sessions (future dates only)
  const today = new Date().toISOString().split('T')[0]
  const upcomingSessions = sessions
    .filter((session: any) => session.date >= today)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

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
                      <span>{session.date || 'Nincs dátum'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{session.location?.name || 'Nincs helyszín'}</span>
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
  const { isAuthenticated } = useAuth()
  const { data: absenceData, loading, error } = useApiQuery(
    () => isAuthenticated ? apiClient.getAbsences() : Promise.resolve([]),
    [isAuthenticated]
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
              <span className="text-sm font-medium">Trendek</span>
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

// Role-specific First Steps Widgets
function FirstStepsWidget() {
  const router = useRouter()
  const { currentRole } = useUserRole()
  
  const getFirstStepsConfig = () => {
    switch (currentRole) {
      case 'admin':
        return {
          title: 'Adminisztrátori Első Lépések',
          description: 'Rendszergazdai feladatok és beállítások útmutatója',
          icon: Shield,
          bgColor: 'from-red-50/50 via-red-100/30 to-red-50/50 dark:from-red-950/30 dark:via-red-900/20 dark:to-red-950/30',
          borderColor: 'border-red-500/20',
          badgeColor: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          guidePath: '/app/segitseg/admin-utmutato',
          tasks: [
            'Felhasználók és szerepkörök kezelése',
            'Forgatások létrehozása és beosztása',
            'Rendszer konfigurálása',
            'Jelentések és statisztikák'
          ]
        }
      case 'class-teacher':
        return {
          title: 'Osztályfőnöki Első Lépések',
          description: 'Osztályfőnöki feladatok és igazoláskezelés útmutatója',
          icon: Users,
          bgColor: 'from-green-50/50 via-green-100/30 to-green-50/50 dark:from-green-950/30 dark:via-green-900/20 dark:to-green-950/30',
          borderColor: 'border-green-500/20',
          badgeColor: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          guidePath: '/app/segitseg/ofonok-utmutato',
          tasks: [
            'Igazolások áttekintése és kezelése',
            'Diákok hiányzásainak nyomon követése',
            'Osztálystatisztikák megtekintése',
            'Kommunikáció a diákokkal'
          ]
        }
      case 'student':
        return {
          title: 'Diák Első Lépések',
          description: 'Diákok számára készült útmutató a rendszer használatához',
          icon: GraduationCap,
          bgColor: 'from-blue-50/50 via-blue-100/30 to-blue-50/50 dark:from-blue-950/30 dark:via-blue-900/20 dark:to-blue-950/30',
          borderColor: 'border-blue-500/20',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          guidePath: '/app/segitseg/diak-utmutato',
          tasks: [
            'Forgatási beosztások megtekintése',
            'Igazolás kérelmek beküldése',
            'Naptár és eseménykezelés',
            'Kommunikáció és üzenetek'
          ]
        }
      default:
        return null
    }
  }

  const config = getFirstStepsConfig()
  
  if (!config) {
    return null
  }

  const { title, description, icon: Icon, bgColor, borderColor, badgeColor, buttonColor, guidePath, tasks } = config

  return (
    <Card className={`border-2 border-dashed ${borderColor} bg-gradient-to-r ${bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${buttonColor.replace('hover:', '').replace('bg-', 'bg-').replace('600', '500')}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className={`text-xs ${badgeColor}`}>
            Útmutató
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">Mit találsz az útmutatóban?</h4>
                <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                  {tasks.map((task, index) => (
                    <div key={index}>• {task}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => router.push(guidePath)}
            className={`w-full ${buttonColor} text-white`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Első Lépések Útmutató
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const { currentRole, isPreviewMode, actualUserRole } = useUserRole()
  const { user, isAuthenticated } = useAuth()
  const { hasPermission } = usePermissions()
  const [welcomeMessage, setWelcomeMessage] = useState('')
  
  // Only fetch detailed user data if user has admin permissions (for admin_type info)
  const canAccessUserData = hasPermission('is_admin') || hasPermission('is_system_admin') || hasPermission('is_teacher_admin')
  
  // Get detailed user data that includes admin_type by fetching all users and finding current user
  const { data: allUsersData } = useApiQuery(
    () => isAuthenticated && canAccessUserData ? apiClient.getAllUsersDetailed() : Promise.resolve([]),
    [isAuthenticated, canAccessUserData]
  )
  
  // Find current user in the detailed data (only if we have permission to fetch it)
  const currentUserDetailed = canAccessUserData ? allUsersData?.find((u: any) => u.user_id === user?.user_id || u.id === user?.user_id) : null

  // Debug logging
  console.log('🎭 Dashboard state:', {
    currentRole,
    actualUserRole,
    isPreviewMode,
    calculation: `${actualUserRole} !== null && ${actualUserRole} !== ${currentRole} && ${actualUserRole} === 'admin'`
  })

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
            {/* Quick Actions Widget - positioned between welcome message and other widgets */}
            <QuickActionsWidget />
            
            {/* Top row: Key operational widgets in 3-column layout */}
            <div className="grid gap-4 md:gap-6 md:grid-cols-3">
              <div className="col-span-1">
                <ActiveUsersWidget />
              </div>
              <div className="col-span-1">
                <SystemOverviewWidget />
              </div>
              <div className="col-span-1">
                <PendingForgatásokWidget />
              </div>
            </div>
            
            {/* First Steps Widget */}
            {/* <FirstStepsWidget /> */}
          </>
        )

      case 'student':
        return (
          <div className="grid gap-6">
            {/* Forgatások widget disabled per request */}
            {/* <div className="col-span-full">
              <UpcomingShootingsWidget />
            </div> */}
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                    <GraduationCap className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Diák irányítópult hamarosan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      A diák irányítópult jelenleg fejlesztés alatt áll. Hamarosan elérhető lesz!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'class-teacher':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              {/* <FirstStepsWidget /> */}
            </div>
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
        // Check user's admin_type using detailed user data
        if (currentUserDetailed?.admin_type) {
          if (currentUserDetailed.admin_type === 'teacher') {
            return { 
              title: 'Médiatanár', 
              icon: Shield
            }
          }
          if (currentUserDetailed.admin_type === 'developer') {
            return { 
              title: 'Fejlesztő', 
              icon: Shield
            }
          }
        }
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
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Preview Mode Banner */}
          {isPreviewMode && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Előnézeti mód
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      Ön {getRoleDisplayName(actualUserRole)} jogosultsággal rendelkezik, de jelenleg a(z) {getRoleDisplayName(currentRole)} nézetet tekinti meg előnézetként. 
                      Az itt látható adatok valós információk, de csak megtekintés céljából szolgálnak.
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700">
                    Előnézet
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header Section */}
          <Card>
            <CardContent className="">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <roleInfo.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-black dark:text-white">
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
          
          {/* Feedback suggestion for all dashboards */}
          <div className="mt-6">
            <p className="text-xs text-center text-muted-foreground">
              Hiányolsz valamit? Mondd el nekünk milyen widgetekkel segíthetjük a munkádat a{" "}
              <a 
                href="https://forms.gle/ATyvgiutqNNaKT46A" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline hover:no-underline transition-colors"
              >
                visszajelzési űrlapon
              </a>
              !
            </p>
          </div>

          {/* Version Information */}
          <VersionInfo className="mt-4" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
