import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function AnnouncementsPage() {
  const faqs = [
    {
      question: "Miben más a KaCsa menüpont a Forgatások menüponthoz képest?",
      answer: "A KaCsa menüpont a Kamasz Csatorna adásainak és öszejátszásainak kezelésére szolgál, míg a Forgatások menüpont a diákok beosztott forgatásait jeleníti meg."
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
        <div className="flex flex-col flex-1">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ComingSoon 
                  featureName="KACSA"
                  description="A KaCsa vagyis a Kamasz Csatorna öszejátszásainak, adásainak kezelőfelülete"
                  faqs={faqs}
                  estimatedCompletion="2025 szeptember"
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
