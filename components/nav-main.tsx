"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUserRole } from "@/contexts/user-role-context"
import { usePermissions } from "@/contexts/permissions-context"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon | LucideIcon
  }[]
}) {
  const pathname = usePathname()
  const { currentRole } = useUserRole()
  const { hasPermission } = usePermissions()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {hasPermission('can_create_forgatas') && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                asChild
                tooltip="Új Forgatás"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground flex-1 justify-start transition-colors"
              >
                <Link href="/app/forgatasok/uj">
                  <IconCirclePlusFilled className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">Új Forgatás</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  isActive={isActive}
                  className="transition-colors"
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
