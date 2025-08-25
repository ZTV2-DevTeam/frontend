"use client"

import { ProfilePictureDemo } from '@/components/profile-picture-demo'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function ProfilePictureTestPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-1">
            <ProfilePictureDemo />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
