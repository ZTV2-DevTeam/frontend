import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function HelpPage() {
  const faqs = [
    {
      question: "Kihez fordulhatok technikai problémák esetén?",
      answer: "Technikai támogatás esetén a ztv2@ztv.hu e-mail címen érheted el a fejlesztőket. A válaszidő legfeljebb 24 óra."
    },
    {
      question: "Honnan tudhatom mi számít technikai problémának?",
      answer: "Technikai problémának számít minden olyan hiba vagy kérdés, amely a rendszer működésével kapcsolatos. Ez nem tér ki a forgatásokkal vagy a beosztásokkal kapcsolatos kérdésekre, hanem kizárólag a rendszer technikai működésére vonatkozik."
    },
    {
        question: "Javaslatom van a rendszer fejlesztésére/véleményem van a felhasználói felületről, hová írhatom?",
        answer: "Javaslatokat a ztv2@ztv.hu e-mail címen várja ezeket a visszajelzéseket a fejlesztői csapat őszinte örömmel. Kérjük, hogy a javaslatokat részletesen írjátok le, hogy minél jobban megérthessük az igényeiteket és a felhasználói élményt javíthassuk."
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
              featureName="SEGÍTSÉG"
              description="Technikai támogatás, dokumentáció és útmutatók a rendszer használatához."
              faqs={faqs}
              estimatedCompletion="2025. november"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
