import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { AbsenceManagement } from "@/components/absence-management"
import {
  SidebarInset,
  SidebarProvider,  
} from "@/components/ui/sidebar"

export default function VacationPage() {
    return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-1 sm:gap-4 p-1 sm:p-4">
          <AbsenceManagement />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}