import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function AnalyticsPage() {
  const faqs = [
    {
      question: "Milyen adatokat fogok látni az analitikában?",
      answer: "A funkció még azért nem készült el, mert nem tudjuk milyen statisztikákra lesz szükség. Kérjük jelezze a fejleszőknek, hogy milyen adatokat szeretne látni."
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
              featureName="ANALITIKA"
              description="Részletes statisztikák és riportok a forgatásokról, jelenlétről és teljesítményről."
              faqs={faqs}
              estimatedCompletion="Igény szerint"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
