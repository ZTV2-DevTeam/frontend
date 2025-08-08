'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { useApi } from '@/hooks/use-simple-api'

export default function PartnersPage() {
  // Egysoros API call
  const { data: partners, loading, error } = useApi('partners')

  

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
            {partners?.map((partner: any, index: number) => (
              <Card key={partner.id || index}>
                <CardHeader>
                  <img src={partner.imageURL} alt={`${partner.name} logo`} className="h-16 mb-2" />
                  <CardTitle>{partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{partner.address}</p>
                  <p className="text-sm text-gray-600">{partner.institution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
