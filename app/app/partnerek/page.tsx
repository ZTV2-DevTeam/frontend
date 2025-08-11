'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { useApi } from '@/hooks/use-simple-api'
import { AlertCircleIcon, BadgeCheckIcon, CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'

interface Partner {
  id?: number
  name: string
  address: string
  institution?: string
  imageURL?: string
}

export default function PartnersPage() {
  // Egysoros API call
  const { data: partners, loading, error } = useApi<Partner[]>('partners')

  
   
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
          
          {loading && <div>Loading partners...</div>}
          {error && <div>Error: {error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners?.map((partner: Partner, index: number) => (
              <Card key={partner.id || index}>
                <CardHeader>
                  {partner.imageURL && (
                    <div className="relative h-16 w-16 mb-2">
                      <Image 
                        src={partner.imageURL} 
                        alt={`${partner.name} logo`} 
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <CardTitle>{partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge>{partner.address}</Badge>
                  <p className="text-sm text-gray-600">{partner.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}