'use client';

import React, { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Pin, 
  MessageCircle, 
  Share2, 
  Filter,
  User,
  BellDot,
  Plus,
  Megaphone
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useApiQuery } from "@/lib/api-helpers";
import { AnnouncementSchema, AnnouncementDetailSchema } from "@/lib/types";
import { apiClient } from "@/lib/api";

export default function MessageBoardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  
  // Fetch data from API
  const { data: announcements = [], loading, error } = useApiQuery(
    () => apiClient.getAnnouncements()
  )

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 space-y-4 p-4 md:p-6">
            <div className="text-center">Betöltés...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 space-y-4 p-4 md:p-6">
            <div className="text-center text-red-500">
              Hiba történt az adatok betöltésekor: {error}
            </div>
            {(error.includes('munkamenet') || error.includes('session') || error.includes('401')) && (
              <div className="text-center mt-4">
                <p className="text-gray-600 mb-4">A munkamenet lejárt. Kérjük, jelentkezzen be újra.</p>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Bejelentkezés
                </button>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Properly handle the case where announcements is an empty array (valid response)
  const announcementsArray = (announcements as AnnouncementSchema[]) || []

  // Filter announcements based on search and category
  const filteredAnnouncements = announcementsArray.filter(announcement => {
    const matchesSearch = searchTerm === "" || 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.body.toLowerCase().includes(searchTerm.toLowerCase())
    
    // For category filtering, we can use is_targeted or other properties
    const matchesCategory = categoryFilter === "all" || 
      (categoryFilter === "targeted" && announcement.is_targeted) ||
      (categoryFilter === "public" && !announcement.is_targeted)
    
    return matchesSearch && matchesCategory
  })

  // Sort by creation date, most recent first
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Most'
    } else if (diffInHours < 24) {
      return `${diffInHours} órája`
    } else {
      return date.toLocaleDateString('hu-HU', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getCategoryBadge = (announcement: AnnouncementSchema) => {
    if (announcement.is_targeted) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Célzott</Badge>
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Nyilvános</Badge>
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Megaphone className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Üzenőfal</h1>
                <p className="text-muted-foreground">
                  Közlemények és bejelentések
                </p>
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Új közlemény
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Keresés közlemények között..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategória szűrése" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden közlemény</SelectItem>
                <SelectItem value="public">Nyilvános</SelectItem>
                <SelectItem value="targeted">Célzott</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {sortedAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    {searchTerm || categoryFilter !== "all" 
                      ? "Nincs találat a megadott kritériumoknak megfelelően."
                      : "Nincsenek közlemények."
                    }
                  </div>
                </CardContent>
              </Card>
            ) : (
              sortedAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">
                            {announcement.author?.first_name?.[0]}{announcement.author?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>{announcement.author?.full_name || 'Rendszer'}</span>
                            <span>•</span>
                            <span>{formatTimestamp(announcement.created_at)}</span>
                            <span>•</span>
                            <span>{announcement.recipient_count} címzett</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getCategoryBadge(announcement)}
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {announcement.body.length > 300 
                          ? announcement.body.substring(0, 300) + '...'
                          : announcement.body
                        }
                      </ReactMarkdown>
                    </div>
                    {announcement.body.length > 300 && (
                      <Button variant="link" className="p-0 h-auto text-sm mt-2">
                        Több megjelenítése
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
