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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail, 
  Plus, 
  Bell, 
  Star, 
  Archive, 
  Clock,
  Users,
  AlertCircle,
  Megaphone,
  User,
  Calendar,
  MapPin,
  MessageSquare,
  Heart,
  Share,
  Bookmark
} from "lucide-react"

interface Message {
  id: number
  title: string
  content: string
  author: string
  authorRole: string
  timestamp: string
  category: 'announcement' | 'shooting' | 'general' | 'urgent'
  isRead: boolean
  isStarred: boolean
  audience: string
  location?: string
  date?: string
  likes?: number
  comments?: number
}

const mockMessages: Message[] = [
  {
    id: 1,
    title: "🎬 Évkönyv fotózás - Fontos információk",
    content: "Kedves Diákok! Az évkönyv fotózásra készüljetek fel! Dátum: január 15-16. Helyszín: Tornaterem. Kérjük mindenkitől a pontos megjelenést és ügyeljen a megfelelő öltözködésre. Részletes információk hamarosan...",
    author: "Nagy Péter",
    authorRole: "Média tanár",
    timestamp: "2 órája",
    category: "shooting",
    isRead: false,
    isStarred: true,
    audience: "12. osztály",
    location: "Tornaterem",
    date: "Január 15-16",
    likes: 24,
    comments: 8
  },
  {
    id: 2,
    title: "📢 Sürgős: Holnapi forgatás változás",
    content: "A holnapi UNESCO műsor forgatás helyszíne megváltozott! Új helyszín: Körösi Kulturális Központ (nem a Magyar Zene Háza). Kérjük minden érintett operatőr figyeljen az időpontra: 14:00. Találkozó a főbejáratnál!",
    author: "Kiss Anna",
    authorRole: "Szervező tanár",
    timestamp: "4 órája",
    category: "urgent",
    isRead: false,
    isStarred: false,
    audience: "Operatőrök",
    location: "Körösi Kulturális Központ",
    date: "Holnap 14:00",
    likes: 15,
    comments: 3
  },
  {
    id: 3,
    title: "🎉 Szuper teljesítmény a múlt heti forgatáson!",
    content: "Gratulálunk mindenkinek a múlt heti BRFK sportnap kiváló munkájához! A felvételek minősége példaértékű volt, és a szervezés is zökkenőmentesen zajlott. Külön köszönet Szabó Jánosnak és csapatának!",
    author: "Tóth Mária",
    authorRole: "Média koordinátor",
    timestamp: "1 napja",
    category: "general",
    isRead: true,
    isStarred: false,
    audience: "Minden diák",
    likes: 42,
    comments: 12
  },
  {
    id: 4,
    title: "📅 Januári forgatási terv közzétéve",
    content: "A januári havi forgatási terv elkészült és feltöltésre került a rendszerbe. Kérjük minden érintett diák ellenőrizze a beosztását és jelezze, ha bármi problémát tapasztal. A terv a Forgatások menüpontban található.",
    author: "Kovács László",
    authorRole: "Igazgató helyettes",
    timestamp: "2 napja",
    category: "announcement",
    isRead: true,
    isStarred: true,
    audience: "Minden média diák",
    likes: 18,
    comments: 5
  },
  {
    id: 5,
    title: "🛠️ Új felszerelések érkeztek",
    content: "Örömmel jelentjük, hogy megérkezett az új 4K kamera és stabilizátor készlet! A felszerelések a felszerelés raktárban találhatók. Kérjük a bérlésnél ügyeljenek a megfelelő kezelésre és visszavitelre.",
    author: "Szabó István",
    authorRole: "Technikus",
    timestamp: "3 napja",
    category: "general",
    isRead: true,
    isStarred: false,
    audience: "Operatőrök",
    likes: 33,
    comments: 7
  }
]

const getCategoryInfo = (category: string) => {
  switch (category) {
    case 'urgent':
      return { color: 'destructive', icon: AlertCircle, label: 'Sürgős' }
    case 'shooting':
      return { color: 'default', icon: Megaphone, label: 'Forgatás' }
    case 'announcement':
      return { color: 'secondary', icon: Bell, label: 'Közlemény' }
    case 'general':
      return { color: 'outline', icon: MessageSquare, label: 'Általános' }
    default:
      return { color: 'outline', icon: MessageSquare, label: 'Általános' }
  }
}

export default function MessagesPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [messages, setMessages] = useState(mockMessages)

  const toggleStar = (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ))
  }

  const toggleRead = (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: !msg.isRead } : msg
    ))
  }

  const markAsRead = (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
  }

  const filteredMessages = () => {
    switch (selectedTab) {
      case 'unread':
        return messages.filter(msg => !msg.isRead)
      case 'starred':
        return messages.filter(msg => msg.isStarred)
      case 'urgent':
        return messages.filter(msg => msg.category === 'urgent')
      default:
        return messages
    }
  }

  const unreadCount = messages.filter(msg => !msg.isRead).length
  const starredCount = messages.filter(msg => msg.isStarred).length
  const urgentCount = messages.filter(msg => msg.category === 'urgent').length

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
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Üzenőfal</h1>
                <p className="text-sm text-muted-foreground">
                  Bejelentések és információk
                </p>
              </div>
            </div>
          </div>

          {/* Message List */}
          <Card>
            <CardContent className="p-3">
              <Tabs defaultValue="all" className="space-y-3">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" className="text-xs">
                    Összes ({messages.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">
                    Olvasatlan ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="starred" className="text-xs">
                    Kedvencek ({starredCount})
                  </TabsTrigger>
                  <TabsTrigger value="urgent" className="text-xs">
                    Sürgős ({urgentCount})
                  </TabsTrigger>
                </TabsList>

                {['all', 'unread', 'starred', 'urgent'].map(tabValue => (
                  <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                    {filteredMessages().length === 0 ? (
                      <div className="text-center py-8">
                        <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nincsenek üzenetek ebben a kategóriában</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredMessages().map((message, index) => {
                          const categoryInfo = getCategoryInfo(message.category)
                          const CategoryIcon = categoryInfo.icon
                          
                          return (
                            <Card 
                              key={message.id}
                              className={`transition-all cursor-pointer hover:shadow-md ${!message.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                              onClick={() => markAsRead(message.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-2">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Badge variant={categoryInfo.color as any} className="flex items-center gap-1 text-xs">
                                          <CategoryIcon className="h-3 w-3" />
                                          {categoryInfo.label}
                                        </Badge>
                                        {!message.isRead && (
                                          <Badge variant="outline" className="text-xs">
                                            Új
                                          </Badge>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleStar(message.id)
                                        }}
                                      >
                                        <Star className={`h-3 w-3 ${message.isStarred ? 'fill-current text-yellow-500' : ''}`} />
                                      </Button>
                                    </div>

                                    {/* Title and Content */}
                                    <div>
                                      <h3 className="font-medium text-base mb-1">
                                        {message.title}
                                      </h3>
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {message.content}
                                      </p>
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">{" "}
                                      <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        <span>{message.author}</span>
                                        <span>•</span>
                                        <span>{message.authorRole}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{message.timestamp}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        <span>{message.audience}</span>
                                      </div>
                                      {message.location && (
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          <span>{message.location}</span>
                                        </div>
                                      )}
                                      {message.date && (
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>{message.date}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Disabled Interactions */}
                                    <div className="flex items-center justify-between pt-3 border-t border-muted">
                                      <span className="text-xs text-muted-foreground">
                                        Reakciók és megjegyzések kikapcsolva
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="text-muted-foreground hover:text-foreground"
                                          onClick={() => toggleStar(message.id)}
                                        >
                                          <Star className={`h-4 w-4 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="text-muted-foreground hover:text-foreground"
                                          onClick={() => toggleRead(message.id)}
                                        >
                                          <Bell className={`h-4 w-4 ${!message.isRead ? 'text-blue-500' : ''}`} />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
