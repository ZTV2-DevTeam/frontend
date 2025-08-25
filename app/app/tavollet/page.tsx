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
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <AbsenceManagement />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}