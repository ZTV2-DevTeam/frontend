"use client"

import React, { useState } from "react"
import {
  IconDatabase,
  IconDots,
  type Icon,
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import { useUserRole } from "@/contexts/user-role-context"
import { DATABASE_MODELS, getDatabaseAdminUrl } from "@/lib/database-models"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

export interface CollapsibleNavItem {
  name: string
  url?: string
  icon: Icon | LucideIcon
  external?: boolean
  subItems?: {
    name: string
    url: string
    icon: Icon | LucideIcon
    external?: boolean
  }[]
}

export function NavCategoryCollapsible({
  category,
  items,
}: {
  category: string
  items: CollapsibleNavItem[]
}) {
  const { isMobile } = useSidebar()
  const pathname = usePathname()
  const { currentRole } = useUserRole()
  const label = category && category.trim() !== "" ? category : "Category"

  const handleDatabaseEdit = (itemName: string) => {
    // Map item names to database models using centralized configuration
    const modelMap: { [key: string]: string } = {
      'Forgatások': DATABASE_MODELS.FORGATAS,
      'Összejátszások': DATABASE_MODELS.FORGATAS,
      'Események': DATABASE_MODELS.CONFIG,
      'Beosztás': DATABASE_MODELS.BEOSZTAS,
      'Igazolások': DATABASE_MODELS.ANNOUNCEMENT,
      'Partnerek': DATABASE_MODELS.PARTNER,
      'Felszerelés': DATABASE_MODELS.EQUIPMENT,
      'Stáb': DATABASE_MODELS.STAB,
      'Üzenőfal': DATABASE_MODELS.ANNOUNCEMENT,
      'Naptár': DATABASE_MODELS.CONFIG,
      'KaCsa': DATABASE_MODELS.CONFIG,
      'Távollét': DATABASE_MODELS.TAVOLLET,
    }
    
    const modelPath = modelMap[itemName] || DATABASE_MODELS.CONFIG
    const adminUrl = getDatabaseAdminUrl(modelPath)
    window.open(adminUrl, '_blank')
  }

  const handleItemClick = (item: { url?: string; external?: boolean }, e: React.MouseEvent) => {
    if (item.external && item.url) {
      e.preventDefault()
      window.open(item.url, '_blank')
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Check if any subitem is active
          const isSubItemActive = item.subItems?.some(subItem => pathname === subItem.url) || false
          const isParentActive = item.url ? pathname === item.url : false
          const isActive = isParentActive || isSubItemActive

          if (item.subItems && item.subItems.length > 0) {
            // Collapsible menu item with subitems
            return (
              <CollapsiblePrimitive.Root key={item.name} defaultOpen={isSubItemActive} className="group" data-state={isSubItemActive ? "open" : "closed"}>
                <SidebarMenuItem>
                  <CollapsiblePrimitive.CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="w-full justify-between group/collapsible-trigger"
                      isActive={isActive}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <item.icon className="shrink-0 size-4" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <ChevronRight className="ml-auto shrink-0 size-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsiblePrimitive.CollapsibleTrigger>
                  {currentRole === 'admin' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction
                          showOnHover
                          className="data-[state=open]:bg-accent rounded-sm transition-colors"
                        >
                          <IconDots />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                      >
                        <DropdownMenuItem 
                          onClick={() => handleDatabaseEdit(item.name)}
                          className="transition-colors"
                        >
                          <IconDatabase />
                          <span>Szerkesztés Adatbázisban</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <CollapsiblePrimitive.CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton 
                              asChild={!subItem.external}
                              isActive={isSubActive}
                              onClick={subItem.external ? (e) => handleItemClick(subItem, e) : undefined}
                              className="transition-colors"
                            >
                              {subItem.external ? (
                                <div className="flex items-center gap-2">
                                  <subItem.icon />
                                  <span>{subItem.name}</span>
                                </div>
                              ) : (
                                <Link href={subItem.url}>
                                  <subItem.icon />
                                  <span>{subItem.name}</span>
                                </Link>
                              )}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsiblePrimitive.CollapsibleContent>
                </SidebarMenuItem>
              </CollapsiblePrimitive.Root>
            )
          } else {
            // Regular menu item without subitems
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild={!item.external}
                  isActive={isActive}
                  onClick={item.external ? (e) => handleItemClick(item, e) : undefined}
                  className="transition-colors"
                >
                  {item.external ? (
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.name}</span>
                    </div>
                  ) : item.url ? (
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.name}</span>
                    </div>
                  )}
                </SidebarMenuButton>
                {currentRole === 'admin' && !item.external && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction
                        showOnHover
                        className="data-[state=open]:bg-accent rounded-sm transition-colors"
                      >
                        <IconDots />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem 
                        onClick={() => handleDatabaseEdit(item.name)}
                        className="transition-colors"
                      >
                        <IconDatabase />
                        <span>Szerkesztés Adatbázisban</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </SidebarMenuItem>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}