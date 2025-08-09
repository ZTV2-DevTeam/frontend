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

export function BadgeDemo() {
     return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full flex-wrap gap-2">
        <Badge></Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <div className="flex w-full flex-wrap gap-2">
        <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600"
        >
          <BadgeCheckIcon />
          Verified
        </Badge>
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          8
        </Badge>
        <Badge
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
          variant="destructive"
        >
          99
        </Badge>
        <Badge
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
          variant="outline"
        >
          20+
        </Badge>
      </div>
    </div>
  )
}