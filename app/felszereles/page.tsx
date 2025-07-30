import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function EquipmentPage() {
  const faqs = [
    // Nincs eszközkölcsönzés
    
    {
        question: "Hogyan működik az eszközök nyilvántartása?",
        answer: "Az eszközök nyilvántartása automatikusan frissül a forgatások beosztása alapján. A diákok és a tanárok is láthatják az elérhető eszközöket és azok állapotát."
    },
    {
        question: "Ki fogja váltani ez a rendszer a jelenlegi kameraszett-ellenőrzési nyilvántartást?",
        answer: "Amennyiben jelenlegi rendszer nem lenne elég hatékony, valamint a gyártásvezetőkben és a tanárokban felmerül rá az igény, akkor egy későbbi frissítésben elhozhatjuk ezt a felületet is."
    },
  ]

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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <ComingSoon 
              featureName="ESZKÖZÖK"
              description="Eszközök nyilvántartása, állapotkövetés és elérhetőség."
              faqs={faqs}
              estimatedCompletion="2025. október"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
