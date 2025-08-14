'use client'

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { DisabledFeatureMessage } from "@/components/disabled-feature-message"

export default function PartnersPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Partnerkezelő
              </h1>
              <p className="text-muted-foreground">
                Külső partnerek és együttműködések kezelése
              </p>
            </div>
          </div>
          
          <DisabledFeatureMessage 
            featureName="Partnerkezelő" 
            description="A partnerkezelő funkció jelenleg fejlesztés alatt áll és ideiglenesen nem elérhető."
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}