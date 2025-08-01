import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function SchedulePage() {
  const faqs = [
    {
      question: "Hogyan működik a beosztás rendszer?",
      answer: "Automatikus és manuális beosztás a forgatásokra, figyelembe véve a képességeket és preferenciákat."
    },
    {
      question: "Módosíthatom a beosztásom?",
      answer: "Igen, kérheted a módosítást, amit a tanárok jóváhagyása után lehet véglegesíteni."
    },
    {
      question: "Kapok értesítést a beosztásról?",
      answer: "Igen, minden új beosztásról e-mail és push értesítést kapsz."
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
              featureName="BEOSZTÁS"
              description="Automatikus és manuális beosztás a forgatásokra, figyelembe véve a diákok képzettségét és elérhetőségét. (Csak tanároknak)"
              faqs={faqs}
              estimatedCompletion="2025. március"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
