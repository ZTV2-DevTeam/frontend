"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Show } from "@/lib/types"
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
  Bird,
  Video,
  Tv,
  Clock,
  Calendar,
  Users,
  Eye,
  Play,
  Pause,
  Edit,
  Share,
  Download,
  Plus,
  Search,
  Filter,
  Star,
  TrendingUp,
  BarChart3,
  Radio,
  Mic,
  Camera,
  Film,
  Upload,
  Settings,
  PlayCircle,
  Heart,
  MessageCircle,
  Bookmark
} from "lucide-react"

// Mock data for KaCsa content
const mockShows = [
  {
    id: 1,
    title: "KaCsa Heti Hírösszefoglaló",
    type: "news",
    status: "published",
    airDate: "2025-01-12",
    duration: "15:23",
    views: 2847,
    likes: 156,
    comments: 23,
    thumbnail: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=300&fit=crop&crop=center",
    description: "A hét legfontosabb iskolai és helyi eseményeinek összefoglalója",
    presenter: "Nagy Petra",
    crew: ["Kovács János", "Szabó Anna"],
    category: "Hírműsor",
    tags: ["Hírek", "Heti", "Összefoglaló"]
  },
  {
    id: 2,
    title: "Diákinterjú - Olimpiai felkészülés",
    type: "interview",
    status: "scheduled",
    airDate: "2025-01-15",
    duration: "22:45",
    views: 0,
    likes: 0,
    comments: 0,
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    description: "Beszélgetés iskolánk úszóválogatott tagjával az olimpiai felkészülésről",
    presenter: "Tóth Márton",
    crew: ["Kiss Eszter", "Horváth Gábor"],
    category: "Interjú",
    tags: ["Sport", "Olimpia", "Diák"]
  },
  {
    id: 3,
    title: "KaCsa Gasztro - Menza különlegességek",
    type: "lifestyle",
    status: "recording",
    airDate: "2025-01-18",
    duration: "18:12",
    views: 1523,
    likes: 89,
    comments: 15,
    thumbnail: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center",
    description: "Gasztronómiai kalandozás az iskolai menzán, különleges ételek bemutatása",
    presenter: "Molnár Lilla",
    crew: ["Varga Péter", "Takács Emma"],
    category: "Gasztronómia",
    tags: ["Gasztro", "Menza", "Ételek"]
  },
  {
    id: 4,
    title: "Zene a KaCs-ban - Local Band bemutató",
    type: "music",
    status: "published",
    airDate: "2025-01-10",
    duration: "35:18",
    views: 4521,
    likes: 287,
    comments: 48,
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center",
    description: "Helyi zenekar bemutatkozása élő fellépéssel és interjúval",
    presenter: "Farkas Dávid",
    crew: ["Balogh Nóra", "Simon Bence"],
    category: "Zene",
    tags: ["Zene", "Koncert", "Helyi"]
  },
  {
    id: 5,
    title: "KaCsa Tech - Mobil app fejlesztés",
    type: "tech",
    status: "draft",
    airDate: "2025-01-20",
    duration: "25:30",
    views: 0,
    likes: 0,
    comments: 0,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center",
    description: "Technológiai műsor a diákok által fejlesztett mobilalkalmazásokról",
    presenter: "Kelemen Alex",
    crew: ["Papp Vivien", "Lakatos Tamás"],
    category: "Technológia",
    tags: ["Tech", "Mobil", "Fejlesztés"]
  },
  {
    id: 6,
    title: "Környezettudatosság a KaCs-ban",
    type: "documentary",
    status: "editing",
    airDate: "2025-01-22",
    duration: "28:45",
    views: 0,
    likes: 0,
    comments: 0,
    thumbnail: "https://images.unsplash.com/photo-1569163139272-de7d6e6b2e6b?w=400&h=300&fit=crop&crop=center",
    description: "Dokumentumfilm az iskola környezettudatos kezdeményezéseiről",
    presenter: "Rácz Zsuzsanna",
    crew: ["Mészáros Ádám", "Juhász Nóra"],
    category: "Dokumentum",
    tags: ["Környezet", "Fenntarthatóság"]
  }
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'published':
      return { variant: 'default', label: 'Publikálva', color: 'text-green-600', icon: PlayCircle }
    case 'scheduled':
      return { variant: 'secondary', label: 'Ütemezve', color: 'text-blue-600', icon: Clock }
    case 'recording':
      return { variant: 'destructive', label: 'Felvétel', color: 'text-red-600', icon: Radio }
    case 'editing':
      return { variant: 'outline', label: 'Vágás', color: 'text-orange-600', icon: Film }
    case 'draft':
      return { variant: 'outline', label: 'Tervezet', color: 'text-gray-600', icon: Edit }
    default:
      return { variant: 'outline', label: 'Ismeretlen', color: 'text-gray-600', icon: Edit }
  }
}

const getTypeInfo = (type: string) => {
  switch (type) {
    case 'news':
      return { icon: Tv, label: 'Hírműsor', color: 'bg-blue-500' }
    case 'interview':
      return { icon: Mic, label: 'Interjú', color: 'bg-green-500' }
    case 'lifestyle':
      return { icon: Heart, label: 'Életmód', color: 'bg-pink-500' }
    case 'music':
      return { icon: Radio, label: 'Zene', color: 'bg-purple-500' }
    case 'tech':
      return { icon: Settings, label: 'Tech', color: 'bg-indigo-500' }
    case 'documentary':
      return { icon: Film, label: 'Dokumentum', color: 'bg-orange-500' }
    default:
      return { icon: Video, label: 'Általános', color: 'bg-gray-500' }
  }
}

export default function KacsaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)

  // Filter shows
  const filteredShows = mockShows.filter(show => {
    const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         show.presenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         show.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || show.status === statusFilter
    const matchesType = typeFilter === "all" || show.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Stats
  const stats = {
    total: mockShows.length,
    published: mockShows.filter(s => s.status === 'published').length,
    scheduled: mockShows.filter(s => s.status === 'scheduled').length,
    totalViews: mockShows.reduce((sum, show) => sum + show.views, 0),
    totalLikes: mockShows.reduce((sum, show) => sum + show.likes, 0),
    thisWeek: mockShows.filter(s => {
      const showDate = new Date(s.airDate)
      const now = new Date()
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      return showDate >= weekStart && showDate < weekEnd
    }).length
  }

  const types = [...new Set(mockShows.map(s => s.type))]

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
                <Bird className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">KaCsa - Kamasz Csatorna</h1>
                <p className="text-muted-foreground">
                  Iskolai műsorkészítés és tartalomkezelés
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Feltöltés
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Új műsor
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Video className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Összes műsor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.published}</p>
                    <p className="text-sm text-muted-foreground">Publikálva</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Összes megtekintés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalLikes}</p>
                    <p className="text-sm text-muted-foreground">Összes like</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Management */}
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all">Összes műsor</TabsTrigger>
                <TabsTrigger value="published">Publikálva</TabsTrigger>
                <TabsTrigger value="scheduled">Ütemezve</TabsTrigger>
                <TabsTrigger value="production">Gyártás alatt</TabsTrigger>
              </TabsList>

              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Műsor keresése..."
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
                    <SelectItem value="published">Publikálva</SelectItem>
                    <SelectItem value="scheduled">Ütemezve</SelectItem>
                    <SelectItem value="recording">Felvétel</SelectItem>
                    <SelectItem value="editing">Vágás</SelectItem>
                    <SelectItem value="draft">Tervezet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredShows.map(show => {
                  const statusInfo = getStatusInfo(show.status)
                  const typeInfo = getTypeInfo(show.type)
                  const StatusIcon = statusInfo.icon
                  const TypeIcon = typeInfo.icon
                  
                  return (
                    <Card key={show.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img 
                          src={show.thumbnail} 
                          alt={show.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Előnézet
                          </Button>
                        </div>
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge variant={statusInfo.variant as "default" | "secondary" | "destructive" | "outline"}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge className={`${typeInfo.color} text-white border-0`}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeInfo.label}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {show.duration}
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg leading-tight line-clamp-2">
                            {show.title}
                          </CardTitle>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {show.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Meta information */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{show.airDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{show.presenter}</span>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        {show.status === 'published' && (
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              <span>{show.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-red-500">
                              <Heart className="h-3 w-3" />
                              <span>{show.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MessageCircle className="h-3 w-3" />
                              <span>{show.comments}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {show.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Megtekintés
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="published" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Publikált műsorok</CardTitle>
                  <CardDescription>
                    Már elérhető tartalmak teljesítményadatokkal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockShows.filter(show => show.status === 'published').map(show => (
                      <div key={show.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-4">
                          <img src={show.thumbnail} alt={show.title} className="w-16 h-12 rounded object-cover" />
                          <div>
                            <h3 className="font-medium">{show.title}</h3>
                            <p className="text-sm text-muted-foreground">{show.airDate} • {show.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{show.views.toLocaleString()}</div>
                            <div className="text-muted-foreground">megtekintés</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{show.likes}</div>
                            <div className="text-muted-foreground">like</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{show.comments}</div>
                            <div className="text-muted-foreground">komment</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ütemezett műsorok</CardTitle>
                  <CardDescription>
                    Közelgő adások és tervezett tartalmak
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockShows.filter(show => show.status === 'scheduled').map(show => (
                      <div key={show.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-4">
                          <img src={show.thumbnail} alt={show.title} className="w-16 h-12 rounded object-cover" />
                          <div>
                            <h3 className="font-medium">{show.title}</h3>
                            <p className="text-sm text-muted-foreground">Műsorvezető: {show.presenter}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">{show.airDate}</div>
                            <div className="text-sm text-muted-foreground">{show.duration} hosszú</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="production" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Felvétel alatt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockShows.filter(show => show.status === 'recording').map(show => (
                        <div key={show.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{show.title}</h4>
                            <p className="text-sm text-muted-foreground">{show.presenter}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">Élő</Badge>
                            <Button variant="ghost" size="sm">
                              <Radio className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vágás alatt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockShows.filter(show => show.status === 'editing').map(show => (
                        <div key={show.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{show.title}</h4>
                            <p className="text-sm text-muted-foreground">{show.crew.join(', ')}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Utómunka</Badge>
                            <Button variant="ghost" size="sm">
                              <Film className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
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
