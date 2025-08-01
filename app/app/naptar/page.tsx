import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function CalendarPage() {
  const faqs = [
    {
      question: "Milyen funkciókat fog tartalmazni a naptár?",
      answer: "A naptár lehetőséget biztosít majd a forgatási időpontok megtekintésére, új események hozzáadására és a csapat ütemezésének kezelésére."
    },
    {
      question: "Hogyan fogom tudni hozzáadni az eseményeket?",
      answer: "Az adminisztrátorok új forgatásokat és eseményeket tudnak majd létrehozni, míg a diákok megtekinthetik a releváns eseményeket."
    },
    {
      question: "Lesz értesítés a közelgő eseményekről?",
      answer: "Igen, a rendszer értesítéseket fog küldeni a közelgő forgatásokról és fontos eseményekről."
    },
    {
      question: "Integrálódni fog más naptár alkalmazásokkal?",
      answer: "Tervezzük a Google Calendar és más népszerű naptár alkalmazásokkal való szinkronizációt."
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ComingSoon 
                  featureName="Naptár"
                  description="A naptár funkció lehetővé teszi majd a forgatási időpontok, események és határidők áttekintését egy könnyen kezelhető felületen."
                  faqs={faqs}
                  estimatedCompletion="2025 november"
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
