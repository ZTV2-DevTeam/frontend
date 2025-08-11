'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { useApiQuery } from '@/lib/api-helpers'
import { apiClient } from '@/lib/api'
import { AlertCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'

export default function PartnersPage() {
  // Use the real API call
  const { data: partners, loading, error } = useApiQuery(
    () => apiClient.getPartners()
  )

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
          
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Partnerek betöltése...
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center py-12 text-destructive">
              <AlertCircle className="h-6 w-6 mr-2" />
              Hiba a partnerek betöltésekor: {error}
            </div>
          )}
          
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners && Array.isArray(partners) && partners.length > 0 ? (
                partners.map((partner: any, index: number) => (
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
                      <CardTitle>{partner.name || partner.company_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge>{partner.address || partner.city}</Badge>
                      <p className="text-sm text-gray-600 mt-2">
                        {partner.description || partner.institution || partner.name}
                      </p>
                      {partner.contact_person && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Kapcsolattartó: {partner.contact_person}
                        </p>
                      )}
                      {partner.phone && (
                        <p className="text-sm text-muted-foreground">
                          Telefon: {partner.phone}
                        </p>
                      )}
                      {partner.email && (
                        <p className="text-sm text-muted-foreground">
                          Email: {partner.email}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Nincsenek partnerek.</p>
                </div>
              )}
            </div>
          )}
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}