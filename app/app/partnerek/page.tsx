'use client'

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { DisabledFeatureMessage } from "@/components/disabled-feature-message"
import { Users } from "lucide-react"

export default function PartnersPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl shadow-sm">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
                  Partnerkezelő
                </h1>
                <p className="text-base text-muted-foreground">
                  Külső partnerek és együttműködések kezelése
                </p>
              </div>
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