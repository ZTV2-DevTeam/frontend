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
import type { PendingFilmingSessionsSchema, PendingFilmingSessionItemSchema } from "@/lib/api"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
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
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingDown,
  Percent,
  Clock4,
  Package
} from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { AnnouncementDialog } from "@/components/announcement-dialog"
import { VersionInfo } from "@/components/version-info"
import { SystemMessages } from "@/components/system-messages"
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


function PendingForgatásokWidget() {
  return (
    <Card className="min-h-[400px]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Függő Forgatások</CardTitle>
            <CardDescription>Hamarosan elérhető funkció</CardDescription>
          </div>
        </div>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800 w-fit">
          Fejlesztés alatt
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800">
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
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Hamarosan kész</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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
      name: "Django Admin", 
      description: "Adatbázis adminisztráció",
      icon: Server, 
      action: () => {
        const adminUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ftvapi.szlg.info'}/admin/`;
        window.open(adminUrl, '_blank');
      },
      color: "red"
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
      case 'red':
        return {
          border: 'border-red-500',
          bg: 'bg-red-500',
          text: 'text-red-500',
          icon: 'text-red-500',
          shadow: 'shadow-red-500'
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
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
      <Card className="min-h-[400px] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Server className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Rendszer áttekintés</CardTitle>
              <CardDescription>Fix változók és rendszer állapot</CardDescription>
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

// Date helper for formatting filming session dates
const formatSessionDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return format(date, 'MM. dd. (EEE)', { locale: hu })
  } catch {
    return dateStr
  }
}

// Student Widget Components
function FuggoForgatasokWidget() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { hasPermission } = usePermissions()
  
  // Only fetch data if user has admin permissions
  const canAccessData = hasPermission('is_admin') || hasPermission('is_system_admin') || hasPermission('is_teacher_admin')
  
  const { data: fuggoForgatosokData, loading, error } = useApiQuery(
    () => isAuthenticated && canAccessData ? apiClient.getPendingFilmingSessions() : Promise.resolve(null),
    [isAuthenticated, canAccessData]
  )

  if (!canAccessData) {
    return null
  }

  if (loading) {
    return (
      <Card className="min-h-[400px] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Függő Forgatások</CardTitle>
              <CardDescription>Befejezetlen beosztások betöltése...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-1">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error || !fuggoForgatosokData) {
    return (
      <Card className="min-h-[400px]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Függő Forgatások</CardTitle>
              <CardDescription>Hiba történt az adatok betöltése során</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Hiba történt</h3>
            <p className="text-xs text-muted-foreground">Nem sikerült betölteni a függő forgatásokat</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const no_szerepkor_relations = fuggoForgatosokData?.no_szerepkor_relations || []
  const has_szerepkor_relations = fuggoForgatosokData?.has_szerepkor_relations || []
  const totalPending = no_szerepkor_relations.length + has_szerepkor_relations.length

  // Sort function to order by date 
  const sortByDate = (forgatasList: PendingFilmingSessionItemSchema[]) => {
    return [...forgatasList].sort((a, b) => {
      // Sort by date field first
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      // Fallback to ID for consistent ordering
      return a.id - b.id
    })
  }

  // Sort both arrays by date
  const sortedNoRoleRelations = sortByDate(no_szerepkor_relations)
  const sortedHasRoleRelations = sortByDate(has_szerepkor_relations)

  // Handler to navigate to assignment page for a specific filming session
  const handleNavigateToAssignment = (forgatásId: number) => {
    router.push(`/app/forgatasok/${forgatásId}/beosztas`)
  }

  return (
    
    <Card className="min-h-[400px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-lg">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Függő Forgatások</CardTitle>
            <CardDescription>Befejezetlen beosztások ({totalPending} összesen)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-y-auto">
        {/* Summary Stats */}
        <div className="pt-3 border-t border-border/30">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <div className="text-xl font-bold text-red-700 dark:text-red-300">{no_szerepkor_relations.length}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Sürgős</div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
              <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{has_szerepkor_relations.length}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Véglegesítendő</div>
            </div>
          </div>
        </div>
        {totalPending === 0 ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Nincs függő forgatás!</h3>
            <p className="text-sm text-muted-foreground">
              Minden beosztás véglegesítve vagy nincs várakozó forgatás.
            </p>
          </div>
        ) : (
          <>
            {/* No szerepkör relations - Higher priority */}
            {sortedNoRoleRelations.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <h4 className="font-semibold text-sm">Nincs beosztva ({sortedNoRoleRelations.length})</h4>
                  <Badge variant="destructive" className="text-xs">
                    Sürgős
                  </Badge>
                </div>
                <div className="space-y-2">
                  {sortedNoRoleRelations.map((forgatas: PendingFilmingSessionItemSchema) => (
                    <div key={forgatas.id} className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-red-900 dark:text-red-100 truncate">{forgatas.name}</div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs text-red-700 dark:text-red-300 mt-1">
                            {forgatas.date && (
                              <div className="flex items-center gap-1 shrink-0">
                                <Calendar className="h-3 w-3" />
                                <span>{formatSessionDate(forgatas.date)}</span>
                              </div>
                            )}
                            {forgatas.time && (
                              <div className="flex items-center gap-1 shrink-0">
                                <Clock className="h-3 w-3" />
                                <span>{forgatas.time}</span>
                              </div>
                            )}
                            {forgatas.location && (
                              <div className="flex items-center gap-1 min-w-0">
                                <Globe className="h-3 w-3 shrink-0" />
                                <span className="truncate">{forgatas.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-300 text-red-700 hover:bg-red-100 shrink-0"
                          onClick={() => handleNavigateToAssignment(forgatas.id)}
                        >
                          <Users className="h-4 w-4 sm:mr-1" />
                          <span className="inline">Beosztás</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Has szerepkör relations - Lower priority */}
            {sortedHasRoleRelations.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-semibold text-sm">Részben kész ({sortedHasRoleRelations.length})</h4>
                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                    Véglegesítendő
                  </Badge>
                </div>
                <div className="space-y-2">
                  {sortedHasRoleRelations.map((forgatas: PendingFilmingSessionItemSchema) => (
                    <div key={forgatas.id} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-yellow-900 dark:text-yellow-100 truncate">{forgatas.name}</div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                            {forgatas.date && (
                              <div className="flex items-center gap-1 shrink-0">
                                <Calendar className="h-3 w-3" />
                                <span>{formatSessionDate(forgatas.date)}</span>
                              </div>
                            )}
                            {forgatas.time && (
                              <div className="flex items-center gap-1 shrink-0">
                                <Clock className="h-3 w-3" />
                                <span>{forgatas.time}</span>
                              </div>
                            )}
                            {forgatas.location && (
                              <div className="flex items-center gap-1 min-w-0">
                                <Globe className="h-3 w-3 shrink-0" />
                                <span className="truncate">{forgatas.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 shrink-0"
                          onClick={() => handleNavigateToAssignment(forgatas.id)}
                        >
                          <Settings className="h-4 w-4 sm:mr-1" />
                          <span className="inline">Véglegesítés</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Student Widget Components
function NevjegyWidget() {
  const { user } = useAuth()
  const { currentRole } = useUserRole()

  if (!user) {
    return null
  }

  const userDisplayName = `${user.last_name} ${user.first_name}`.trim() || user.username
  
  // Get role display name
  const getRoleDisplayName = () => {
    if (currentRole === 'student') return 'Diák'
    if (currentRole === 'class-teacher') return 'Osztályfőnök'
    if (currentRole === 'admin') return 'Adminisztrátor'
    return 'Felhasználó'
  }

  // Format join date
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Ismeretlen'
    try {
      return new Date(dateString).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Ismeretlen'
    }
  }

  return (
    <Card className="min-h-[300px]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Névjegy</CardTitle>
            <CardDescription>Személyes adatok és fiók információk</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <UserAvatar
            email={user.email}
            firstName={user.first_name}
            lastName={user.last_name}
            username={user.username}
            size="lg"
            className="border-2 border-blue-200 dark:border-blue-800"
            fallbackClassName="bg-blue-500/20 text-blue-700 dark:text-blue-300"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-1">{userDisplayName}</h3>
            <p className="text-sm text-muted-foreground mb-2">{getRoleDisplayName()}</p>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800">
              Aktív felhasználó
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Felhasználónév</p>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">E-mail cím</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>


      </CardContent>
    </Card>
  )
}

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

// Class Teacher Widget Components - Currently no widgets available
function ClassTeacherPlaceholderWidget() {
  return (
    <Card className="min-h-[400px]">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="p-4 bg-muted rounded-full">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Nincsenek elérhető widgetek</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Jelenleg nincsenek Widgetek az osztályfőnöki felületen. 
            Jelezze a fejlesztőknek Widget ötleteit vagy igényeit a jövőbeni frissítésekhez.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}function ShootingTrendsWidget() {
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
  const router = useRouter()
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
          <div className="space-y-6">
            {/* Quick Actions Widget */}
            <div className="mb-6">
              <QuickActionsWidget />
            </div>
            
            {/* Teendők Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Teendők</h2>
                  <p className="text-sm text-muted-foreground">Véglegesítendő feladatok és függő folyamatok</p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-1">
                <FuggoForgatasokWidget />
              </div>
            </div>
          </div>
        )

      case 'student':
        return (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-12">
            {/* Personal Info Widget - Left side */}
            <div className="lg:col-span-5">
              <NevjegyWidget />
            </div>
            
            {/* Quick Actions and Status - Right side */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {/* Quick Access */}
              <Card className="min-h-[150px]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Gyors hozzáférés</CardTitle>
                      <CardDescription>Legfontosabb funkciók</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => router.push("/app/naptar")}
                      className="p-3 rounded-lg border border-border/50 hover:bg-accent transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Naptár</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Események</p>
                    </button>
                    <button 
                      onClick={() => router.push("/app/uzenofal")}
                      className="p-3 rounded-lg border border-border/50 hover:bg-accent transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">Üzenőfal</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Hírek</p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'class-teacher':
        return (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-12">
              <ClassTeacherPlaceholderWidget />
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

          {/* System Messages */}
          <SystemMessages />

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
