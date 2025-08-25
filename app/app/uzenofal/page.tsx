"use client"

import React, { useState } from 'react';
import { useAuth } from "@/contexts/auth-context";
import { useUserRole } from "@/contexts/user-role-context";
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
import { EnhancedMarkdownRenderer } from '@/components/enhanced-markdown-renderer';
import { useApiQuery } from "@/lib/api-helpers";
import { AnnouncementSchema, AnnouncementDetailSchema } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { AnnouncementDialog } from "@/components/announcement-dialog";
import { AnnouncementActions } from "@/components/announcement-actions";

export default function MessageBoardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const { isAuthenticated, user } = useAuth()
  const { currentRole } = useUserRole()
  
  // Check if user is admin (can create/edit/delete announcements)
  const isAdmin = currentRole === 'admin'
  
  // Fetch data from API - only when authenticated
  const { data: announcements = [], loading, error } = useApiQuery(
    () => isAuthenticated ? apiClient.getAnnouncements() : Promise.resolve([]),
    [isAuthenticated]
  )

  // Refresh function for after create/edit/delete
  const refreshAnnouncements = () => {
    // Force a re-render by updating a dependency
    window.location.reload()
  }

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

  // Helper function to check if user can edit/delete an announcement
  const canUserModifyAnnouncement = (announcement: AnnouncementSchema) => {
    if (!isAdmin) return false
    
    // Admin can edit/delete all announcements
    // In the future, we might add logic to allow authors to edit their own
    return true
  }

  const getCategoryBadge = (announcement: AnnouncementSchema) => {
    if (announcement.is_targeted) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-50">Célzott</Badge>
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:border-green-700 dark:bg-green-950 dark:text-green-50">Közérdekű</Badge>
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Üzenőfal
              </h1>
              <p className="text-muted-foreground">
                Közlemények és bejelentések • {sortedAnnouncements.length} üzenet
              </p>
            </div>
            {isAdmin && (
              <AnnouncementDialog 
                onSuccess={refreshAnnouncements}
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Új közlemény
                  </Button>
                }
              />
            )}
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
                        {isAdmin && (
                          <AnnouncementActions
                            announcement={announcement}
                            onSuccess={refreshAnnouncements}
                            userCanEdit={canUserModifyAnnouncement(announcement)}
                            userCanDelete={canUserModifyAnnouncement(announcement)}
                            userCanView={true}
                          />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <EnhancedMarkdownRenderer
                      className="text-sm"
                      maxLength={300}
                      showMoreButton={true}
                    >
                      {announcement.body}
                    </EnhancedMarkdownRenderer>
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
