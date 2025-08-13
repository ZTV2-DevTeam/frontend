import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ComingSoon } from "@/components/coming-soon"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function JustifyPage() {
  const faqs = [
    {
      question: "Mire szolgál ez a funkció?",
      answer: "A funkció célja, hogy tárolja és kezelje a médiás diákok forgatással vagy egyéb médiás tevékenységgel kapcsolatos igazolásait. Az igazolások hiteles nyilvántartása és naplózott állapot rögzítése csak osztályfőnökök számára elérhető.",
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <ComingSoon 
              featureName="IGAZOLÁSOK"
              description="Médiás diákok, forgatással vagy egyéb médiás tevékenységgel kapcsolatos igazolások hiteles nyilvántartása, naplózott állapot rögzítése (Csak ofőknek)"
              faqs={faqs}
              estimatedCompletion="2025. szeptember"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}