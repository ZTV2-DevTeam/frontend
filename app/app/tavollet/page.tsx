import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,  
} from "@/components/ui/sidebar"

export default function VacationPage() {
    const faqs = [
        {
        question: "Mit takar ez a funkció?",
        answer: "Ez a funkció váltja ki a korábbi Trello, később Google Forms felületet, ahol a diákok jelezhették előre azokat az időszakokat, amikor nem tudnak részt venni a médiás tevékenységekben.",
        },
        {
            question: "Miért nem volt jó a régi rendszer?",
            answer: "A Trello módosította a szerződési felételeit, emiatt nem érte meg használni. A Google Forms rendszerben a diákok nem tudták visszanézni, mely időszakokat jelezték előre, és emiatt sokszor elfelejtették, hogy jeleztek-e már vagy sem. Mindkettő rendszer hibája, hogy nem volt átlátható és könnyen kezelhető. Innentől, hogy egy rendszerben lesz kezelve, a forgatások beosztása sokkal egyszerűbb lesz.",
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
              featureName="TÁVOLLÉT"
              description="A diákok előre jelezhetik, ha nem tudnak részt venni a médiás tevékenységekben. Ez segíti a forgatások beosztását és a diákok tervezését."
              faqs={faqs}
              estimatedCompletion="2025. szeptember"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )

}