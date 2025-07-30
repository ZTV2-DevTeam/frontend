import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function MessagesPage() {
  const faqs = [
    {
      question: "Milyen típusú üzeneteket fogok kapni itt?",
      answer: "Itt kapod meg az összes olyan értesítést, melyek célközönsége egy stáb vagy annál nagyobb csoport, de média tagozaton túlnyúló információkat nem feltétlen."
    },
    {
      question: "Válaszolhatok az üzenetekre?",
      answer: "Nem. Ez egy egyirányú üzenőfal, ahol a tanárok küldhetnek információkat, viszont a későbbiekben eldönthetik, hogy szeretnének-e interakciókat."
    },
    {
      question: "Kapok értesítést új üzenetekről?",
      answer: "Igen, alapértelmezetten értesítést kapsz e-mailben minden olyan üzenetről, aminek beletartozol a célközönségébe."
    }
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
              featureName="ÜZENŐFAL"
              description="Itt fogod megkapni az összes fontos iskolai közleményt, forgatási információkat és értesítéseket."
              faqs={faqs}
              estimatedCompletion="2025. szeptember"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
