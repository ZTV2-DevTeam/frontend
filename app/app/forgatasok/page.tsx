'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { useApi } from '@/hooks/use-simple-api'
import { AlertCircleIcon, BadgeCheckIcon, CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AnnouncementsPage() {
    const { data: announcements, loading, error } = useApi('announcements')
  
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
        <div className="p-4">
          
          {loading && <div>Loading announcements...</div>}
          {error && <div>Error: {error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements?.map((announcement: any, index: number) => (
              <Card key={announcement.id || index}>
                <CardHeader>
                  <img src={announcement.location.imageURL} alt={`${announcement.location.name} logo`} className="h-16 mb-2" />
                  <CardTitle>{announcement.name}</CardTitle>
                  <CardTitle className="text-sm">{announcement.forgTipus}</CardTitle>
                  <Badge>{announcement.contactperson.phone}</Badge>
                  <Badge>{announcement.contactperson.email}</Badge>
                  <Badge>{announcement.location.address}</Badge>
                  <Badge>i</Badge>

                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{announcement.date}</p>
                  <p className="text-sm text-gray-600">{announcement.contactperson.name}</p>
                  
                </CardContent>
              </Card>
            ))}
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

