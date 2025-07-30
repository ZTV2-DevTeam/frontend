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
      question: "Mik azok a kiírások?",
      answer: "A kiírások oldalon láthatod, hogy melyik forgatásra vagy beosztva, mikor és hova kell menned."
    },
    {
      question: "Hogyan tudom megnézni a saját beosztásaimat?",
      answer: "A rendszer automatikusan megjeleníti a számodra kijelölt forgatásokat, időponttal és helyszínnel."
    },
    {
      question: "Kapok értesítést, ha új beosztásom van?",
      answer: "Igen, minden új beosztásról értesítést kapsz emailben és a platformon belül is."
    },
    {
      question: "Mit tegyek, ha nem tudok részt venni egy beosztáson?",
      answer: "Ebben az esetben vedd fel a kapcsolatot egy tanárral, hogy módosíthassák a beosztást."
    },
    {
      question: "Láthatom más diákok beosztását is?",
      answer: "Igen, a kiírások oldalon megtekintheted a többi diák beosztását is, így láthatod, hogy mikor és hol vannak mások."
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
                  featureName="Kiírások"
                  description="A kiírások oldalon a diákok számára megjelennek a beosztott forgatások, ahol pontosan láthatod, hogy mikor és hova kell menned."
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
