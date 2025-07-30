import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { ComingSoon } from "@/components/coming-soon"

import data from "./data.json"

export default function Page() {
  // return (
  //   <SidebarProvider
  //     style={
  //       {
  //         "--sidebar-width": "calc(var(--spacing) * 72)",
  //         "--header-height": "calc(var(--spacing) * 12)",
  //       } as React.CSSProperties
  //     }
  //   >
  //     <AppSidebar variant="inset" />
  //     <SidebarInset>
  //       <SiteHeader />
  //       <div className="flex flex-1 flex-col">
  //         <div className="@container/main flex flex-1 flex-col gap-2">
  //           <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
  //             <SectionCards />
  //             <div className="px-4 lg:px-6">
  //               <ChartAreaInteractive />
  //             </div>
  //             <DataTable data={data} />
  //           </div>
  //         </div>
  //       </div>
  //     </SidebarInset>
  //   </SidebarProvider>
  // )

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
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <ComingSoon 
                featureName="IRÁNYÍTÓPULT"
                description="A rendszer kezdőoldala, ahol a felhasználók áttekinthetik a fontos információkat és gyorsan navigálhatnak a különböző funkciók között."
                faqs={faqs}
                estimatedCompletion="2025. szeptember"
              />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
}
