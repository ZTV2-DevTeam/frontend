"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Forgatas } from "@/lib/types"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"

// Enhanced mock data for shootings
const mockShootings = [
  {
    id: 1,
    name: "Évkönyv fotózás - 12F osztály",
    type: "Fotózás",
    status: "scheduled",
    priority: "high",
    date: "2025-01-15",
    time: "09:00 - 15:00",
    duration: "6 óra",
    location: {
      name: "Tornaterem",
      address: "1102 Budapest, Kőrösi Csoma Sándor út 26.",
      imageURL: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"
    },
    description: "Érettségiző diákok egyéni és csoportos fotózása az évkönyvhöz. Minden diáknak 5 perc egyéni időpont és közös osztályfotó.",
    contactPerson: {
      name: "Nagy Péter",
      role: "Médiatanár",
      phone: "+36 30 123 4567",
      email: "nagy.peter@szlgbp.hu"
    },
    crew: {
      assigned: "A stáb",
      members: ["Kiss Anna", "Szabó János", "Tóth Mária"],
      needed: 4,
      confirmed: 3
    },
    equipment: ["Canon EOS R5", "85mm objektív", "Stúdió világítás", "Háttérszövet", "Reflektor"],
    budget: "50.000 Ft",
    tags: ["Évkönyv", "Portré", "Iskola"],
    notes: "Figyelni kell az egyenletes világításra, minden diák kapjon ugyanolyan beállításokat."
  },
  {
    id: 2,
    name: "UNESCO Műsor - Élő közvetítés",
    type: "Közvetítés",
    status: "confirmed",
    priority: "high",
    date: "2025-01-16",
    time: "14:00 - 17:00",
    duration: "3 óra",
    location: {
      name: "Körösi Kulturális Központ",
      address: "1102 Budapest, Kőrösi Csoma Sándor út 33.",
      imageURL: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop&crop=center"
    },
    description: "UNESCO világnap alkalmából rendezett kulturális műsor élő közvetítése. Több kamera, váltás, élő hang.",
    contactPerson: {
      name: "Kiss Anna",
      role: "Szervező tanár",
      phone: "+36 30 234 5678",
      email: "kiss.anna@szlgbp.hu"
    },
    crew: {
      assigned: "A stáb",
      members: ["Nagy Péter", "Kovács László", "Horváth Gábor", "Varga Eszter"],
      needed: 6,
      confirmed: 4
    },
    equipment: ["4K kamerák (3db)", "Streaming konzol", "Mikrofon készlet", "Fejhallgatók", "Tripodok"],
    budget: "120.000 Ft",
    tags: ["Élő", "UNESCO", "Kultúra", "Streaming"],
    notes: "Próba 13:00-tól! Backup streaming beállítás szükséges. Hangpróba kötelező."
  },
  {
    id: 3,
    name: "BRFK Sportnap dokumentálás",
    type: "Esemény",
    status: "scheduled",
    priority: "medium",
    date: "2025-01-18",
    time: "08:30 - 16:00",
    duration: "7.5 óra",
    location: {
      name: "Vörösmarty Mihály Gimnázium",
      address: "1051 Budapest, Arany János u. 17.",
      imageURL: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"
    },
    description: "Budapesti Rendőr-főkapitányság sportnapjának teljes dokumentálása videóval és fotókkal.",
    contactPerson: {
      name: "Szabó János",
      role: "Médiatanár",
      phone: "+36 30 345 6789",
      email: "szabo.janos@szlgbp.hu"
    },
    crew: {
      assigned: "B stáb",
      members: ["Takács Dávid", "Balogh Emma", "Simon Bence"],
      needed: 5,
      confirmed: 3
    },
    equipment: ["DSLR kamerák", "Mobil gimbal", "Drón (engedéllyel)", "Hosszú objektívek", "Memóriakártyák"],
    budget: "75.000 Ft",
    tags: ["Sport", "BRFK", "Dokumentum", "Drón"],
    notes: "Drón használat engedélyezve 10:00-15:00 között. Biztonsági előírások betartása kötelező."
  },
  {
    id: 4,
    name: "Jazz koncert - Magyar Zene Háza",
    type: "Koncert",
    status: "pending",
    priority: "medium",
    date: "2025-01-20",
    time: "19:00 - 22:00",
    duration: "3 óra",
    location: {
      name: "Magyar Zene Háza",
      address: "1146 Budapest, Olof Palme sétány 3.",
      imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center"
    },
    description: "Kőbányai diákok jazz koncertjének professzionális felvétele többkamerás beállítással.",
    contactPerson: {
      name: "Tóth Mária",
      role: "Médiatanár",
      phone: "+36 30 456 7890",
      email: "toth.maria@szlgbp.hu"
    },
    crew: {
      assigned: "A stáb",
      members: [],
      needed: 4,
      confirmed: 0
    },
    equipment: ["Koncert kamerák", "Audio interface", "Tápkábelek", "Memóriakártyák", "Tartalék akkuk"],
    budget: "90.000 Ft",
    tags: ["Jazz", "Koncert", "Magyar Zene Háza", "Audio"],
    notes: "Hangfelvétel egyeztetése a technikusokkal. Világítási próba szükséges."
  },
  {
    id: 5,
    name: "Iskolai promóciós videó",
    type: "Videó",
    status: "draft",
    priority: "low",
    date: "2025-01-25",
    time: "13:00 - 16:00",
    duration: "3 óra",
    location: {
      name: "Iskola épülete és környéke",
      address: "1102 Budapest, Kőrösi Csoma Sándor út 26.",
      imageURL: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=300&fit=crop&crop=center"
    },
    description: "Rövid promóciós videó készítése az iskola bemutatásához, új diákok toborzása céljából.",
    contactPerson: {
      name: "Kovács László",
      role: "Igazgatóhelyettes",
      phone: "+36 30 567 8901",
      email: "kovacs.laszlo@szlgbp.hu"
    },
    crew: {
      assigned: "B stáb",
      members: [],
      needed: 3,
      confirmed: 0
    },
    equipment: ["DSLR kamera", "Stabilizátor", "Mikrofon", "LED panel", "Tartalék akkuk"],
    budget: "30.000 Ft",
    tags: ["Promóció", "Iskola", "Bemutató"],
    notes: "Diákok és tanárok rövid interjúi szükségesek. Forgatókönyv egyeztetése."
  },
  {
    id: 6,
    name: "Gogobar hambi - KaCsa forgatás",
    type: "KaCsa",
    status: "confirmed",
    priority: "high",
    date: "2025-01-28",
    time: "16:00 - 19:00",
    duration: "3 óra",
    location: {
      name: "Gogobar hambi",
      address: "1102 Budapest, Kőrösi Csoma Sándor út 26.",
      imageURL: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nr0H3RAOZnvMt0SVdA76fcbkDVnKQ7Sp68opzVi0ffEu0k62tK0pYnNonIquPZjWqmK3kkGPj0d82NR6v8qZasxNeec-wwl49KthKrpLH9c81D8WjqDGIZL37Le45M02emCAM9j=w408-h306-k-no"
    },
    description: "Helyi vendéglátóegység bemutató videójának készítése a KaCsa program keretében.",
    contactPerson: {
      name: "Kovács László",
      role: "Tulajdonos",
      phone: "+36 20 345 4545",
      email: "gogohami@gmail.com"
    },
    crew: {
      assigned: "A stáb",
      members: ["Kiss Anna", "Nagy Péter"],
      needed: 3,
      confirmed: 2
    },
    equipment: ["DSLR kamera", "Gimbal", "Mikrofon", "LED világítás"],
    budget: "40.000 Ft",
    tags: ["KaCsa", "Vendéglátás", "Partner"],
    notes: "Ételfotózás és rövid interjú a tulajdonossal. Nyitvatartási időben forgatunk."
  }
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { variant: 'default', label: 'Megerősítve', icon: CheckCircle, color: 'text-green-600' }
    case 'scheduled':
      return { variant: 'secondary', label: 'Ütemezve', icon: Clock, color: 'text-blue-600' }
    case 'pending':
      return { variant: 'outline', label: 'Függőben', icon: AlertCircle, color: 'text-yellow-600' }
    case 'draft':
      return { variant: 'outline', label: 'Tervezet', icon: Edit, color: 'text-gray-600' }
    case 'cancelled':
      return { variant: 'destructive', label: 'Törölve', icon: XCircle, color: 'text-red-600' }
    default:
      return { variant: 'outline', label: 'Ismeretlen', icon: AlertCircle, color: 'text-gray-600' }
  }
}

const getPriorityInfo = (priority: string) => {
  switch (priority) {
    case 'high':
      return { variant: 'destructive', label: 'Magas' }
    case 'medium':
      return { variant: 'default', label: 'Közepes' }
    case 'low':
      return { variant: 'secondary', label: 'Alacsony' }
    default:
      return { variant: 'outline', label: 'Nincs' }
  }
}

export default function ShootingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedShooting, setSelectedShooting] = useState<Forgatas | null>(null)

  // Filter shootings
  const filteredShootings = mockShootings.filter(shooting => {
    const matchesSearch = shooting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shooting.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shooting.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || shooting.status === statusFilter
    const matchesType = typeFilter === "all" || shooting.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Stats
  const stats = {
    total: mockShootings.length,
    confirmed: mockShootings.filter(s => s.status === 'confirmed').length,
    pending: mockShootings.filter(s => s.status === 'pending').length,
    thisWeek: mockShootings.filter(s => {
      const shootingDate = new Date(s.date)
      const now = new Date()
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      return shootingDate >= weekStart && shootingDate < weekEnd
    }).length
  }

  const types = [...new Set(mockShootings.map(s => s.type))]

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
                <h1 className="text-xl font-semibold">Forgatások</h1>
                <p className="text-sm text-muted-foreground">
                  Videó és fotózási projektek kezelése
                </p>
              </div>
            </div>
            <Button size="sm">
              <Plus className="mr-1 h-3 w-3" />
              Új forgatás
            </Button>
          </div>

          {/* Filters - Compact */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Forgatás keresése..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-8 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="Státusz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden</SelectItem>
                <SelectItem value="confirmed">Megerősítve</SelectItem>
                <SelectItem value="scheduled">Ütemezve</SelectItem>
                <SelectItem value="pending">Függőben</SelectItem>
                <SelectItem value="draft">Tervezet</SelectItem>
                <SelectItem value="cancelled">Törölve</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="Típus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shootings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredShootings.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Video className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Nincs találat</p>
                <p className="text-sm text-muted-foreground">Próbálj meg más keresési feltételekkel</p>
              </div>
            ) : (
              filteredShootings.map(shooting => {
                const statusInfo = getStatusInfo(shooting.status)
                const priorityInfo = getPriorityInfo(shooting.priority)
                const StatusIcon = statusInfo.icon
                
                return (
                  <Card key={shooting.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex gap-2">
                          <Badge variant={statusInfo.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {shooting.type}
                          </Badge>
                          <Badge variant={priorityInfo.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                            {priorityInfo.label}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{shooting.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {shooting.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Date and Duration */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{shooting.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{shooting.time}</span>
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{shooting.location.name}</span>
                      </div>
                      
                      {/* Contact */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">{shooting.contactPerson.name}</div>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                            <a href={`tel:${shooting.contactPerson.phone}`}>
                              <Phone className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                            <a href={`mailto:${shooting.contactPerson.email}`}>
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                            <a 
                              href={`https://maps.google.com/?q=${encodeURIComponent(shooting.location.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                      
                      {/* Staff Assignment - More Prominent */}
                      <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Stáb beosztás</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {shooting.crew.confirmed}/{shooting.crew.needed} fő
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">Beosztott stábtagok:</div>
                          <div className="flex flex-wrap gap-1">
                            {shooting.crew.members.map((member, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {member}
                              </Badge>
                            ))}
                            {shooting.crew.needed > shooting.crew.confirmed && (
                              <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                                +{shooting.crew.needed - shooting.crew.confirmed} hiányzik
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Részletek
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

