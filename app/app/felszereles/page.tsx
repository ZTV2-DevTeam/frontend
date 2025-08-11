"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
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
  Video,
  Camera,
  Mic,
  Headphones,
  Lightbulb,
  Battery,
  HardDrive,
  Wrench,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  TrendingUp,
  BarChart3,
  Package,
  Settings,
  Smartphone,
  Monitor,
  Zap,
  Wifi,
  Loader2,
  AlertCircle
} from "lucide-react"

const getStatusInfo = (functional: boolean) => {
  if (functional) {
    return { variant: 'default', label: 'Működőképes', color: 'text-green-600', icon: CheckCircle }
  } else {
    return { variant: 'destructive', label: 'Nem működik', color: 'text-red-600', icon: XCircle }
  }
}

const getCategoryIcon = (category: string) => {
  const lowerCategory = category?.toLowerCase() || ''
  if (lowerCategory.includes('camera') || lowerCategory.includes('kamera')) {
    return Camera
  } else if (lowerCategory.includes('tripod') || lowerCategory.includes('statív')) {
    return Video
  } else if (lowerCategory.includes('mic') || lowerCategory.includes('audio')) {
    return Mic
  } else {
    return Package
  }
}

export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Fetch equipment from API
  const { data: equipmentData, loading, error } = useApiQuery(
    () => apiClient.getEquipment()
  )

  if (loading) {
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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Felszerelések betöltése...
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error) {
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
          <div className="flex items-center justify-center py-12 text-destructive">
            <AlertCircle className="h-6 w-6 mr-2" />
            Hiba a felszerelések betöltésekor: {error}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const equipment = Array.isArray(equipmentData) ? equipmentData : []

  // Filter equipment
  const filteredEquipment = equipment.filter((item: any) => {
    const matchesSearch = (item.nickname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.serial_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.display_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || (statusFilter === "functional" ? item.functional : !item.functional)
    const matchesCategory = categoryFilter === "all" || item.equipment_type?.name === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Stats
  const stats = {
    total: equipment.length,
    available: equipment.filter((e: any) => e.functional).length,
    inUse: equipment.filter((e: any) => !e.functional).length,
    maintenance: 0, // Not available in current schema
    totalValue: equipment.length * 50000 // Estimated value
  }

  const categories = [...new Set(equipment.map((e: any) => e.equipment_type?.name).filter(Boolean))]

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-md">
                <Video className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Felszerelés kezelő</h1>
                <p className="text-sm text-muted-foreground">
                  Kamerák és statívok nyilvántartása
                </p>
              </div>
            </div>
            <Button size="sm">
              <Plus className="mr-1 h-3 w-3" />
              Új eszköz
            </Button>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="inventory" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="inventory">Készlet</TabsTrigger>
                <TabsTrigger value="reservations">Foglalások</TabsTrigger>
                <TabsTrigger value="maintenance">Karbantartás</TabsTrigger>
                <TabsTrigger value="analytics">Statisztikák</TabsTrigger>
              </TabsList>

              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Eszköz keresése..."
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
                    <SelectItem value="available">Elérhető</SelectItem>
                    <SelectItem value="in_use">Használatban</SelectItem>
                    <SelectItem value="reserved">Lefoglalva</SelectItem>
                    <SelectItem value="maintenance">Karbantartás</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Kategória" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Minden</SelectItem>
                    <SelectItem value="camera">Kamera</SelectItem>
                    <SelectItem value="tripod">Statív</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="inventory" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEquipment.map((equipment: any) => {
                  const statusInfo = getStatusInfo(equipment.functional)
                  const CategoryIcon = getCategoryIcon(equipment.equipment_type?.name || 'equipment')
                  
                  return (
                    <Card key={equipment.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-muted rounded-lg">
                              <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg leading-tight">{equipment.nickname || equipment.display_name}</CardTitle>
                              <CardDescription>{equipment.brand} {equipment.model}</CardDescription>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge variant={statusInfo.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                              <statusInfo.icon className="h-2 w-2 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Basic Info */}
                        <div className="space-y-2 text-sm">
                          {equipment.serial_number && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sorozatszám:</span>
                              <span className="font-mono">{equipment.serial_number}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Típus:</span>
                            <span>{equipment.equipment_type?.name || 'Nincs megadva'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Állapot:</span>
                            <span className={statusInfo.color}>{statusInfo.label}</span>
                          </div>
                        </div>

                        {/* Notes */}
                        {equipment.notes && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm">
                              <span className="font-medium text-muted-foreground">Megjegyzések:</span>
                              <p className="mt-1 text-xs">{equipment.notes}</p>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            disabled={!equipment.functional}
                          >
                            {equipment.functional ? 'Részletek' : 'Nem elérhető'}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="reservations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Aktív foglalások</CardTitle>
                  <CardDescription>
                    Jelenleg lefoglalt és használatban lévő eszközök
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {equipment.filter((e: any) => !e.functional).slice(0, 5).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-muted rounded">
                            <Video className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.nickname || item.display_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Javítás szükséges
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <Badge variant="destructive">
                            Nem működik
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Karbantartás alatt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Karbantartás szükséges</span>
                        </div>
                        <div className="text-sm text-yellow-700 mt-1">
                          Nincs karbantartási információ a rendszerben
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Karbantartás ütemezés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Rendszeres karbantartás</span>
                        </div>
                        <div className="text-sm text-blue-700 mt-1">
                          A felszerelések rendszeres ellenőrzése ajánlott
                        </div>
                      </div>
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
                      Használati statisztika
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{equipment.length > 0 ? Math.round(equipment.reduce((sum: number, e: any) => sum + (e.usage_hours || 0), 0) / equipment.length) : 0}</div>
                        <div className="text-sm text-muted-foreground">átlagos óra/eszköz</div>
                      </div>
                      <div className="space-y-2">
                        {equipment.slice(0, 4).map((item: any) => (
                          <div key={item.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{item.nickname}</span>
                              <span>{item.usage_hours || 0}h</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-1">
                              <div 
                                className="bg-primary h-1 rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(((item.usage_hours || 0) / 800) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Költség elemzés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{(stats.totalValue / 1000000).toFixed(1)}M Ft</div>
                        <div className="text-sm text-muted-foreground">összes érték</div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Kamerák:</span>
                          <span>3.2M Ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Számítógépek:</span>
                          <span>1.9M Ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stabilizátorok:</span>
                          <span>560k Ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Egyéb:</span>
                          <span>740k Ft</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Készlet állapot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-green-600">{stats.available}</div>
                          <div className="text-xs text-muted-foreground">elérhető</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-red-600">{stats.inUse}</div>
                          <div className="text-xs text-muted-foreground">kiadott</div>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                          style={{ width: `${(stats.available / stats.total) * 100}%` }}
                        />
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">{Math.round((stats.available / stats.total) * 100)}% elérhető</span>
                        </div>
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
