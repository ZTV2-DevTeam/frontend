import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card"
import { apiClient } from '@/lib/api'

export default function PartnersPage() {
  // const faqs = [
  //   {
  //       question: "Mire szolgál ez a funkció?",
  //       answer: "A funkció célja, hogy tárolja és kezelje a forgatási helyszínek (kultúrális intézmények, iskolák) elérhetőségeit és helyszíneit, valamint az azokhoz kijelölt diákokat. Ez segíti a diákokat és tanárokat a forgatások szervezésében és a helyszínek gyors elérésében.",
  //   },
  // ]

  

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
        {/* <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <ComingSoon 
              featureName="PARTNEREK"
              description="Forgatási helyszínek (kultúrális intézmények, iskolák) elérhetőségei és helyszínei, az azokhoz kijelölt diákokkal."
              faqs={faqs}
              estimatedCompletion="2025. november"
            />
          </div>
        </div> */}

        {/* map partners */}

        <div className="flex flex-col items-center justify-center px-4 text-center h-dvh x-1">
          {partners.map((partner) => (
            <Card key={partner.name} className="flex flex-col items-center justify-center w-full p-8">
              <CardHeader>
              </CardHeader>
              <CardContent>
                <CardTitle>
                {partner.name}
              </CardTitle>
            </CardContent>
          </Card>
          ))}
        </div>




      </SidebarInset>
    </SidebarProvider>
  )
}
