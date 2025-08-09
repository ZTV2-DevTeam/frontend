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
    // const { data: announcements, loading, error } = useApi('announcements')

    const announcement =
      {
        id: 17,
        location: {
          imageURL: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nr0H3RAOZnvMt0SVdA76fcbkDVnKQ7Sp68opzVi0ffEu0k62tK0pYnNonIquPZjWqmK3kkGPj0d82NR6v8qZasxNeec-wwl49KthKrpLH9c81D8WjqDGIZL37Le45M02emCAM9j=w408-h306-k-no",
          name:"Gogobar hambi",
          address:"1102 Kőrösi Csoma Sándor út 26."
        },
        name: "Gogo forgi",
        forgtipus: "KaCsa",
        contactperson: {
          phone: "+36203454545",
          email: "gogohami@gmail.com",
          name: "Kovács László",
        },
        date: "2025. szeptember 1.",
        
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
        <div className="p-4">
          
          {/* {loading && <div>Loading announcements...</div>} */}
          {/* {error && <div>Error: {error}</div>} */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card key={announcement.id}>
                <CardHeader>
                  <img 
                  src={announcement.location.imageURL} 
                  alt={`${announcement.location.name} logo`} 
                  className="h-auto w-full rounded lg" />
                  <CardTitle>{announcement.name}</CardTitle>
                  {/* <label className="text-sm text-gray-600" htmlFor="cim">időpont:</label> */}
                  <p className="text-sm">{announcement.date}</p>
                  <CardTitle className="text-sm">{announcement.forgtipus}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                  

                  <p className="">{announcement.contactperson.name}:</p>
                  <label  className="text-sm text-gray-600" htmlFor="">telefon:</label>
                  <a className="ml-5" href="tel:{announcement.contactperson.phone}">{announcement.contactperson.phone}</a>

                  <label  className="text-sm text-gray-600" htmlFor="">email:</label>
                  <a className="ml-5" href="announcement.contactperson.email">{announcement.contactperson.email}</a>

                  <label  className="text-sm text-gray-600" htmlFor="cim">cím:</label>
                  <a className="ml-5" id="cim"   href={`https://maps.google.com/?q=${encodeURIComponent(announcement.location.address)}`}
>{announcement.location.address}</a>                  
                  </CardContent>
              </Card>
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

