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
  Wifi
} from "lucide-react"

// Mock data for equipment - Simplified to 2 cameras + tripods
const mockEquipment = [
  {
    id: 1,
    name: "Bella",
    category: "camera",
    type: "Videókamera",
    status: "available",
    condition: "excellent",
    location: "Kamera raktár",
    serialNumber: "VK-BELLA-001",
    purchaseDate: "2023-09-15",
    lastMaintenance: "2024-12-01",
    currentUser: null,
    reservedBy: null,
    reservedUntil: null,
    specifications: {
      resolution: "4K",
      videoFormat: "MP4/MOV",
      battery: "3 óra",
      storage: "SD kártya"
    },
    accessories: ["Akkumulátor", "Töltő", "SD kártya", "Bella Statív"],
    maintenanceHistory: [
      { date: "2024-12-01", type: "Tisztítás", technician: "Szabó István" },
      { date: "2024-10-15", type: "Firmware frissítés", technician: "Nagy Péter" }
    ],
    usageHours: 245,
    value: 350000
  },
  {
    id: 2,
    name: "Virág",
    category: "camera", 
    type: "Videókamera",
    status: "in_use",
    condition: "good",
    location: "Forgatás",
    serialNumber: "VK-VIRAG-002",
    purchaseDate: "2022-11-20",
    lastMaintenance: "2024-11-15",
    currentUser: "Nagy Péter",
    reservedBy: null,
    reservedUntil: "2025-01-16 18:00",
    specifications: {
      resolution: "4K",
      videoFormat: "MP4/MOV",
      battery: "2.5 óra",
      storage: "SD kártya"
    },
    accessories: ["Akkumulátor (2db)", "Töltő", "SD kártya", "Virág Statív"],
    maintenanceHistory: [
      { date: "2024-11-15", type: "Sensor tisztítás", technician: "Tóth Mária" }
    ],
    usageHours: 458,
    value: 320000
  },
  {
    id: 3,
    name: "Bella Statív",
    category: "tripod",
    type: "Statív",
    status: "available",
    condition: "excellent",
    location: "Kamera raktár",
    serialNumber: "ST-BELLA-001",
    purchaseDate: "2023-09-15",
    lastMaintenance: "2024-09-20",
    currentUser: null,
    reservedBy: null,
    reservedUntil: null,
    specifications: {
      height: "50-180cm",
      weight: "2.1kg",
      capacity: "5kg",
      material: "Alumínium"
    },
    accessories: ["Szállító táska", "Gyorscsavaró"],
    maintenanceHistory: [
      { date: "2024-09-20", type: "Kenés", technician: "Kovács László" }
    ],
    usageHours: 245,
    value: 45000
  },
  {
    id: 4,
    name: "Virág Statív",
    category: "tripod",
    type: "Statív",
    status: "in_use",
    condition: "good",
    location: "Forgatás",
    serialNumber: "ST-VIRAG-002",
    purchaseDate: "2022-11-20",
    lastMaintenance: "2024-11-15",
    currentUser: "Nagy Péter",
    reservedBy: null,
    reservedUntil: "2025-01-16 18:00",
    specifications: {
      height: "50-180cm", 
      weight: "2.1kg",
      capacity: "5kg",
      material: "Alumínium"
    },
    accessories: ["Szállító táska", "Gyorscsavaró"],
    maintenanceHistory: [
      { date: "2024-11-15", type: "Kenés", technician: "Horváth Gábor" }
    ],
    usageHours: 458,
    value: 45000
  }
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'available':
      return { variant: 'default', label: 'Elérhető', color: 'text-green-600', icon: CheckCircle }
    case 'in_use':
      return { variant: 'destructive', label: 'Használatban', color: 'text-red-600', icon: User }
    case 'reserved':
      return { variant: 'secondary', label: 'Lefoglalva', color: 'text-blue-600', icon: Calendar }
    case 'maintenance':
      return { variant: 'outline', label: 'Karbantartás', color: 'text-orange-600', icon: Wrench }
    case 'damaged':
      return { variant: 'destructive', label: 'Sérült', color: 'text-red-600', icon: XCircle }
    default:
      return { variant: 'outline', label: 'Ismeretlen', color: 'text-gray-600', icon: AlertTriangle }
  }
}

const getConditionInfo = (condition: string) => {
  switch (condition) {
    case 'excellent':
      return { variant: 'default', label: 'Kiváló', color: 'text-green-600' }
    case 'good':
      return { variant: 'secondary', label: 'Jó', color: 'text-blue-600' }
    case 'fair':
      return { variant: 'outline', label: 'Megfelelő', color: 'text-yellow-600' }
    case 'poor':
      return { variant: 'destructive', label: 'Rossz', color: 'text-red-600' }
    default:
      return { variant: 'outline', label: 'Ismeretlen', color: 'text-gray-600' }
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'camera':
      return Camera
    case 'tripod':
      return Video
    case 'accessory':
      return Package
    default:
      return Video
  }
}

export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null)

  // Filter equipment
  const filteredEquipment = mockEquipment.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || equipment.status === statusFilter
    const matchesCategory = categoryFilter === "all" || equipment.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Stats
  const stats = {
    total: mockEquipment.length,
    available: mockEquipment.filter(e => e.status === 'available').length,
    inUse: mockEquipment.filter(e => e.status === 'in_use').length,
    maintenance: mockEquipment.filter(e => e.status === 'maintenance').length,
    totalValue: mockEquipment.reduce((sum, equipment) => sum + equipment.value, 0)
  }

  const categories = [...new Set(mockEquipment.map(e => e.category))]

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
                {filteredEquipment.map(equipment => {
                  const statusInfo = getStatusInfo(equipment.status)
                  const conditionInfo = getConditionInfo(equipment.condition)
                  const StatusIcon = statusInfo.icon
                  const CategoryIcon = getCategoryIcon(equipment.category)
                  
                  return (
                    <Card key={equipment.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-muted rounded-lg">
                              <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg leading-tight">{equipment.name}</CardTitle>
                              <CardDescription>{equipment.type}</CardDescription>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge variant={statusInfo.variant as any} className="text-xs">
                              <StatusIcon className="h-2 w-2 mr-1" />
                              {statusInfo.label}
                            </Badge>
                            <Badge variant={conditionInfo.variant as any} className="text-xs">
                              {conditionInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Basic Info */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sorozatszám:</span>
                            <span className="font-mono">{equipment.serialNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Helyszín:</span>
                            <span>{equipment.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Használat:</span>
                            <span>{equipment.usageHours}h</span>
                          </div>
                        </div>

                        {/* Current Status Details */}
                        {equipment.status === 'in_use' && equipment.currentUser && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-red-600" />
                              <span className="font-medium text-red-800">
                                Használja: {equipment.currentUser}
                              </span>
                            </div>
                            <div className="text-xs text-red-600 mt-1">
                              Visszahozás: {equipment.reservedUntil}
                            </div>
                          </div>
                        )}

                        {equipment.status === 'reserved' && equipment.reservedBy && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-800">
                                Lefoglalta: {equipment.reservedBy}
                              </span>
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              Időpont: {equipment.reservedUntil}
                            </div>
                          </div>
                        )}

                        {equipment.status === 'maintenance' && (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                              <Wrench className="h-4 w-4 text-orange-600" />
                              <span className="font-medium text-orange-800">
                                Karbantartás alatt
                              </span>
                            </div>
                            <div className="text-xs text-orange-600 mt-1">
                              Utolsó: {equipment.lastMaintenance}
                            </div>
                          </div>
                        )}

                        {/* Key Specifications */}
                        <div className="space-y-1">
                          <h5 className="font-medium text-sm">Főbb specifikációk:</h5>
                          <div className="text-xs text-muted-foreground">
                            {Object.entries(equipment.specifications).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key}:</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Accessories */}
                        <div className="space-y-1">
                          <h5 className="font-medium text-sm">Tartozékok:</h5>
                          <div className="flex flex-wrap gap-1">
                            {equipment.accessories.slice(0, 3).map(accessory => (
                              <Badge key={accessory} variant="outline" className="text-xs">
                                {accessory}
                              </Badge>
                            ))}
                            {equipment.accessories.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{equipment.accessories.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            disabled={equipment.status !== 'available'}
                          >
                            {equipment.status === 'available' ? 'Lefoglal' : 'Foglalt'}
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
                    {mockEquipment.filter(e => e.status === 'in_use' || e.status === 'reserved').map(equipment => (
                      <div key={equipment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-muted rounded">
                            <Video className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{equipment.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {equipment.status === 'in_use' ? `Használja: ${equipment.currentUser}` : `Lefoglalta: ${equipment.reservedBy}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <div className="text-sm font-medium">
                              {equipment.status === 'in_use' ? 'Visszahozás:' : 'Átvétel:'}
                            </div>
                            <div className="text-sm text-muted-foreground">{equipment.reservedUntil}</div>
                          </div>
                          <Badge variant={equipment.status === 'in_use' ? 'destructive' : 'secondary'}>
                            {equipment.status === 'in_use' ? 'Használatban' : 'Lefoglalva'}
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
                      {mockEquipment.filter(e => e.status === 'maintenance').map(equipment => (
                        <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{equipment.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {equipment.maintenanceHistory[0]?.type} - {equipment.maintenanceHistory[0]?.date}
                            </p>
                          </div>
                          <Badge variant="outline">Szerviz</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Karbantartás ütemezés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Hamarosan esedékes</span>
                        </div>
                        <div className="text-sm text-yellow-700 mt-1">
                          3 eszköz igényel karbantartást 30 napon belül
                        </div>
                      </div>
                      <div className="space-y-2">
                        {mockEquipment.slice(0, 3).map(equipment => (
                          <div key={equipment.id} className="flex items-center justify-between text-sm">
                            <span>{equipment.name}</span>
                            <span className="text-muted-foreground">Következő: Jan 30</span>
                          </div>
                        ))}
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
                        <div className="text-2xl font-bold">{Math.round(mockEquipment.reduce((sum, e) => sum + e.usageHours, 0) / mockEquipment.length)}</div>
                        <div className="text-sm text-muted-foreground">átlagos óra/eszköz</div>
                      </div>
                      <div className="space-y-2">
                        {mockEquipment.slice(0, 4).map(equipment => (
                          <div key={equipment.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{equipment.name}</span>
                              <span>{equipment.usageHours}h</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-1">
                              <div 
                                className="bg-primary h-1 rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min((equipment.usageHours / 800) * 100, 100)}%` }}
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
                      Értékesítési adatok
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
