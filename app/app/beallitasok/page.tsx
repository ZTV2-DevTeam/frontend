import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function SettingsPage() {
  const faqs = [
    {
      question: "Milyen beállításokat tudok majd módosítani?",
      answer: "Profiladatok, értesítési preferenciák, téma és biztonsági beállítások."
    },
    {
      question: "Tudom majd változtatni a jelszavam?",
      answer: "Igen, a biztonsági beállításoknál módosíthatod a jelszavad."
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
              featureName="BEÁLLÍTÁSOK"
              description="Személyre szabd a rendszert: profiladatok, értesítések, téma és biztonsági beállítások."
              faqs={faqs}
              estimatedCompletion="2025. szeptember"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
