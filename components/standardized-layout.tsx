'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface StandardizedLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * Standardized layout component that ensures consistent sidebar behavior across all pages
 * Uses the default sidebar width (16rem) and inset variant for consistency
 */
export function StandardizedLayout({ children, className }: StandardizedLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className={`flex-1 space-y-4 p-4 md:p-6 ${className || ''}`}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
