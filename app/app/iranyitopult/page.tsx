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
  Eye, 
  Megaphone, 
  CalendarDays,
  Camera,
  Triangle,
  Mic,
  Settings,
  Video,
  FileText,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Target,
  LogIn,
  ExternalLink,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Timer,
  Globe,
  Sparkles,
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

// Admin Widget Components - Simplified Design
function LatestLoginsWidget() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
            Aktív felhasználók
          </CardTitle>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Legutóbbi bejelentkezések
          </p>
        </div>
        <LogIn className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {mockLatestLogins.slice(0, 3).map((login, index) => (
            <div key={login.id} className="flex items-center justify-between p-3 rounded border bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {login.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {login.full_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {login.datetime}
                  </p>
                </div>
              </div>
              <Badge 
                variant="outline"
                className="text-xs"
              >
                {login.relative_time}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {mockLatestLogins.length} aktív ma
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">+12%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PendingForgatásokWidget() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
            Függő feladatok
          </CardTitle>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Beosztásra váró forgatások
          </p>
        </div>
        <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockPendingForgatások.map((forgatas) => (
            <div key={forgatas.id} className="p-3 rounded border bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {forgatas.title}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {forgatas.type}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>{forgatas.date}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Globe className="h-3 w-3" />
                  <span>{forgatas.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-orange-700 dark:text-orange-300">
                Sürgős beosztás szükséges
              </span>
            </div>
            <span className="text-xs text-orange-600 font-medium">
              {mockPendingForgatások.length}
            </span>
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
      color: "from-emerald-500 to-green-500",
      textColor: "text-white",
      route: "/app/forgatasok"
    },
    { 
      name: "Stábok", 
      description: "Csapat kezelése",
      icon: Users, 
      color: "from-blue-500 to-cyan-500",
      textColor: "text-white",
      route: "/app/stab"
    },
    { 
      name: "Közlemény", 
      description: "Új üzenet küldése",
      icon: Megaphone, 
      color: "from-purple-500 to-pink-500",
      textColor: "text-white",
      route: "/app/uzenofal"
    },
    { 
      name: "Naptár", 
      description: "Események megtekintése",
      icon: CalendarDays, 
      color: "from-orange-500 to-red-500",
      textColor: "text-white",
      route: "/app/naptar"
    },
  ]

  const handleActionClick = (route: string) => {
    router.push(route)
  }

  return (
    <Card className="col-span-2 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Gyors műveletek
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gyakran használt funkciók egyetlen kattintással
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.name}
              variant="ghost"
              onClick={() => handleActionClick(action.route)}
              className="group h-auto p-0 bg-transparent hover:bg-transparent overflow-hidden"
            >
              <div className={`w-full h-full p-4 rounded-xl bg-gradient-to-br ${action.color} ${action.textColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{action.name}</p>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Student Widget Components - Simplified Design
function UpcomingShootingsWidget() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500 rounded">
              <Video className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                Közelgő forgatások
              </CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Az előttünk álló feladatok
              </p>
            </div>
          </div>
          <span className="text-xs text-violet-600 dark:text-violet-400">
            {mockUpcomingShootsForStudent.length} aktív
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockUpcomingShootsForStudent.map((shoot, index) => (
          <div 
            key={shoot.id} 
            className={`p-3 rounded border ${
              shoot.is_next 
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            {shoot.is_next && (
              <div className="mb-2">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  Következő
                </Badge>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1 text-gray-900 dark:text-white">
                  {shoot.title}
                </h3>
              </div>
              <Badge 
                className={`font-medium ${
                  shoot.is_next 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                }`}
              >
                {shoot.role}
              </Badge>
            </div>
            
            <div className={`grid grid-cols-2 gap-4 mb-4 text-sm ${
              shoot.is_next ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
            }`}>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{shoot.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="truncate">{shoot.location}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${
                  shoot.is_next ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Felszerelés:
                </span>
                <div className="flex gap-1">
                  {shoot.equipment.map((item, equipIndex) => (
                    <span key={equipIndex} className="text-xl">{item}</span>
                  ))}
                </div>
              </div>
              {shoot.is_next && (
                <div className="flex items-center gap-1 text-white/90">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-medium">2 nap múlva</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200/50 dark:border-violet-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 rounded-lg">
                <BarChart4 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-violet-800 dark:text-violet-200">
                  Havi teljesítmény
                </p>
                <p className="text-sm text-violet-600 dark:text-violet-400">
                  {mockUpcomingShootsForStudent.length} forgatás ebben a hónapban
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                {mockUpcomingShootsForStudent.length}
              </p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>+25%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Osztályfőnök Widget Components - Modern Redesign
function IgazolasStatsWidget() {
  const router = useRouter()
  
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/30">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5"></div>
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Igazolás központ
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Feldolgozott dokumentumok áttekintése
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Mai nap', value: mockIgazolasStats.daily, color: 'from-blue-500 to-cyan-500', icon: Clock },
            { label: 'Ezen a héten', value: mockIgazolasStats.weekly, color: 'from-emerald-500 to-green-500', icon: Calendar },
            { label: 'Ebben a hónapban', value: mockIgazolasStats.monthly, color: 'from-purple-500 to-pink-500', icon: BarChart3 }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-white/80" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-white/90">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-200">
                  Havi teljesítmény
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Kiváló munka a dokumentáció terén
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                87%
              </p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">Cél elérése</span>
              <span className="text-emerald-800 dark:text-emerald-200 font-bold">{mockIgazolasStats.monthly}/100</span>
            </div>
            <div className="w-full bg-emerald-200/50 dark:bg-emerald-800/30 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-1000" 
                style={{ width: '87%' }}
              ></div>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
          onClick={() => router.push("/app/igazolasok")}
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <span className="font-semibold">Igazolások kezelése</span>
          </div>
        </Button>
      </CardContent>
    </Card>
  )
}

function ShootingTrendsWidget() {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/30">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5"></div>
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Aktivitási trendek
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Forgatások és teljesítmények elemzése
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Napi átlag', value: 12, trend: '+8%', color: 'from-green-500 to-emerald-500', icon: TrendingUp },
            { label: 'Heti összesen', value: 84, trend: '+15%', color: 'from-blue-500 to-cyan-500', icon: BarChart3 },
            { label: 'Havi cél', value: 356, trend: '89%', color: 'from-purple-500 to-pink-500', icon: Target }
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-white/80" />
                  <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                    {stat.trend}
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-white/90">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="font-bold text-indigo-800 dark:text-indigo-200">Cél követés</p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">Havi 400 forgatás cél</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">356/400</p>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">Még 44 hátra</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium">Előrehaladás</span>
              <span className="text-indigo-800 dark:text-indigo-200 font-bold">89%</span>
            </div>
            <div className="w-full bg-indigo-200/50 dark:bg-indigo-800/30 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-1000" 
                style={{ width: '89%' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="font-bold text-yellow-800 dark:text-yellow-200 text-sm">
                Kiváló teljesítmény!
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                A heti átlag 12% -kal meghaladja a tervezett értéket
              </p>
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="max-w-sm mx-auto space-y-4">
                <div className="p-4 bg-gray-200/50 dark:bg-gray-700/50 rounded-full w-fit mx-auto">
                  <Layers className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nincs elérhető tartalom
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
          color: 'from-red-500 to-pink-500',
          bgColor: 'from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/30',
          icon: Shield
        }
      case 'student':
        return { 
          title: 'Diák', 
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/30',
          icon: GraduationCap
        }
      case 'class-teacher':
        return { 
          title: 'Osztályfőnök', 
          color: 'from-emerald-500 to-green-500',
          bgColor: 'from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/30',
          icon: Users
        }
      default:
        return { 
          title: 'Ismeretlen', 
          color: 'from-gray-500 to-gray-600',
          bgColor: 'from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/30',
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
        <div className="flex-1 space-y-4 p-4 md:p-6 bg-white dark:bg-gray-900">
          {/* Simple Header Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${roleInfo.color} rounded-lg`}>
                  <roleInfo.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {welcomeMessage || `Üdvözlünk, ${user?.first_name || 'Felhasználó'}!`}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {roleInfo.title}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('hu-HU')}
              </div>
            </div>
          </div>

          {/* Role-specific widgets */}
          <div className="space-y-4">
            {renderRoleSpecificWidgets()}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
