import { ComingSoon } from "@/components/coming-soon"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export default function Page() {
  const faqs = [
    {
      question: "Milyen funkciók lesznek az irányítópulton?",
      answer: "Az irányítópult áttekintést nyújt a fontos információkról, mint például a saját forgatások, feladatok és statisztikák."
    },
    {
      question: "Hogyan tudom testreszabni az irányítópultot?",
      answer: "Az irányítópult testreszabható lesz, lehetőséget biztosítva a widgetek és információk kiválasztására."
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
          <ComingSoon 
            featureName="IRÁNYÍTÓPULT"
            description="A rendszer kezdőoldala, ahol a felhasználók áttekinthetik a fontos információkat és gyorsan navigálhatnak a különböző funkciók között."
            faqs={faqs}
            estimatedCompletion="2025. szeptember"
          />
      </SidebarInset>
    </SidebarProvider>
  )
}
