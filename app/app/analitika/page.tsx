"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Video,
  Calendar,
  Award,
  Clock,
  Target,
  Activity,
  PieChart,
  LineChart,
  BarChart2,
  Eye,
  Download,
  Share,
  Filter,
  RefreshCw
} from "lucide-react"

// Mock data for analytics
const mockAnalytics = {
  overview: {
    totalShootings: 245,
    totalHours: 1250,
    totalStudents: 89,
    averageRating: 4.7,
    monthlyGrowth: 12.5,
    weeklyActive: 67
  },
  shootingStats: [
    { month: 'Sep', shootings: 18, hours: 95 },
    { month: 'Okt', shootings: 22, hours: 110 },
    { month: 'Nov', shootings: 28, hours: 145 },
    { month: 'Dec', shootings: 15, hours: 80 },
    { month: 'Jan', shootings: 32, hours: 170 }
  ],
  categories: [
    { name: 'Évkönyv fotózás', count: 45, percentage: 35, color: '#8884d8' },
    { name: 'Sport események', count: 32, percentage: 25, color: '#82ca9d' },
    { name: 'Iskolai műsorok', count: 28, percentage: 22, color: '#ffc658' },
    { name: 'Partnerek', count: 15, percentage: 12, color: '#ff7300' },
    { name: 'Egyéb', count: 8, percentage: 6, color: '#00ff88' }
  ],
  topPerformers: [
    { name: 'Nagy Péter', role: 'Operatőr', shootings: 28, rating: 4.9, trend: 'up' },
    { name: 'Kiss Anna', role: 'Szervező', shootings: 24, rating: 4.8, trend: 'up' },
    { name: 'Szabó János', role: 'Operatőr', shootings: 22, rating: 4.7, trend: 'stable' },
    { name: 'Tóth Mária', role: 'Vágó', shootings: 20, rating: 4.6, trend: 'down' },
    { name: 'Kovács László', role: 'Operatőr', shootings: 18, rating: 4.5, trend: 'up' }
  ],
  equipmentUsage: [
    { name: 'Canon EOS R5', usage: 85, available: 3, total: 5 },
    { name: 'DJI Ronin', usage: 70, available: 2, total: 4 },
    { name: 'Sony A7S III', usage: 60, available: 4, total: 6 },
    { name: 'Rode Microphone', usage: 90, available: 1, total: 8 },
    { name: 'LED Panel Kit', usage: 45, available: 6, total: 10 }
  ]
}

export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly")

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
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
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Analitika</h1>
                <p className="text-muted-foreground">
                  Részletes statisztikák és teljesítmény elemzés
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Szűrés
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Frissítés
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Összes forgatás
                    </p>
                    <p className="text-2xl font-bold">{mockAnalytics.overview.totalShootings}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">+{mockAnalytics.overview.monthlyGrowth}%</span>
                    </div>
                  </div>
                  <Video className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Összes óra
                    </p>
                    <p className="text-2xl font-bold">{mockAnalytics.overview.totalHours}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">ez hónapban</span>
                    </div>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Aktív diákok
                    </p>
                    <p className="text-2xl font-bold">{mockAnalytics.overview.totalStudents}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-muted-foreground">{mockAnalytics.overview.weeklyActive} heti aktív</span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Átlagos értékelés
                    </p>
                    <p className="text-2xl font-bold">{mockAnalytics.overview.averageRating}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">5-ös skálán</span>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Details */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Áttekintés</TabsTrigger>
              <TabsTrigger value="performance">Teljesítmény</TabsTrigger>
              <TabsTrigger value="equipment">Felszerelés</TabsTrigger>
              <TabsTrigger value="students">Diákok</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Shooting Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      Forgatási trendek
                    </CardTitle>
                    <CardDescription>
                      Havi forgatások és óraszám alakulása
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalytics.shootingStats.map((stat, index) => (
                        <div key={stat.month} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-primary rounded" style={{height: `${stat.shootings * 2}px`}} />
                            <div>
                              <p className="font-medium">{stat.month}</p>
                              <p className="text-sm text-muted-foreground">{stat.shootings} forgatás</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{stat.hours}h</p>
                            <p className="text-sm text-muted-foreground">összes</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Kategória bontás
                    </CardTitle>
                    <CardDescription>
                      Forgatások típus szerinti megoszlása
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalytics.categories.map((category, index) => (
                        <div key={category.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{category.count}</span>
                              <Badge variant="outline">{category.percentage}%</Badge>
                            </div>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-1000" 
                              style={{ 
                                width: `${category.percentage}%`,
                                backgroundColor: category.color
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Legjobb teljesítők
                  </CardTitle>
                  <CardDescription>
                    A legaktívabb és legjobb értékelésű diákok
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.topPerformers.map((performer, index) => (
                      <div key={performer.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{performer.name}</p>
                            <p className="text-sm text-muted-foreground">{performer.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-right">
                          <div>
                            <p className="font-medium">{performer.shootings}</p>
                            <p className="text-sm text-muted-foreground">forgatás</p>
                          </div>
                          <div>
                            <p className="font-medium">{performer.rating}</p>
                            <p className="text-sm text-muted-foreground">értékelés</p>
                          </div>
                          <div className="flex items-center">
                            {getTrendIcon(performer.trend)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Felszerelés kihasználtság
                  </CardTitle>
                  <CardDescription>
                    Eszközök használati statisztikái
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.equipmentUsage.map((equipment, index) => (
                      <div key={equipment.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{equipment.name}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              {equipment.available}/{equipment.total} elérhető
                            </span>
                            <Badge variant={equipment.usage > 80 ? "destructive" : equipment.usage > 60 ? "default" : "secondary"}>
                              {equipment.usage}% használt
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              equipment.usage > 80 ? 'bg-red-500' : 
                              equipment.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${equipment.usage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Aktivitási szintek
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 border rounded-lg">
                        <span>Nagyon aktív (10+ forgatás)</span>
                        <Badge>24 diák</Badge>
                      </div>
                      <div className="flex justify-between p-3 border rounded-lg">
                        <span>Aktív (5-9 forgatás)</span>
                        <Badge variant="secondary">31 diák</Badge>
                      </div>
                      <div className="flex justify-between p-3 border rounded-lg">
                        <span>Mérsékelt (1-4 forgatás)</span>
                        <Badge variant="outline">22 diák</Badge>
                      </div>
                      <div className="flex justify-between p-3 border rounded-lg">
                        <span>Inaktív (0 forgatás)</span>
                        <Badge variant="destructive">12 diák</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Célok teljesítése
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Havi cél (200 forgatás)</span>
                          <span className="text-sm font-medium">245/200</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-full" />
                        </div>
                        <p className="text-xs text-muted-foreground">122% teljesítve</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Kvalitás cél (4.5 átlag)</span>
                          <span className="text-sm font-medium">4.7/4.5</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-full" />
                        </div>
                        <p className="text-xs text-muted-foreground">104% teljesítve</p>
                      </div>
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
