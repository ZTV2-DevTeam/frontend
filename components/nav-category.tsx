"use client"

import {
  IconDatabase,
  IconDots,
  type Icon,
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { NavItem } from "@/lib/types"

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
  useSidebar,
} from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import { useUserRole } from "@/contexts/user-role-context"
import { DATABASE_MODELS, getDatabaseAdminUrl } from "@/lib/database-models"

export function NavCategory({
  category,
  items,
}: {
  category: string
  items: {
    name: string
    url: string
    icon: Icon | LucideIcon
    external?: boolean
  }[]
}) {
  const { isMobile } = useSidebar()
  const pathname = usePathname()
  const { currentRole } = useUserRole()
  const label = category && category.trim() !== "" ? category : "Category"

  const handleDatabaseEdit = (itemName: string) => {
    // Map item names to database models using centralized configuration
    const modelMap: { [key: string]: string } = {
      'Forgatások': DATABASE_MODELS.FORGATAS,
      'Beosztás': DATABASE_MODELS.BEOSZTAS,
      'Igazolások': DATABASE_MODELS.ANNOUNCEMENT, // Using announcements for igazolások
      'Partnerek': DATABASE_MODELS.PARTNER,
      'Felszerelés': DATABASE_MODELS.EQUIPMENT,
      'Stáb': DATABASE_MODELS.STAB,
      'Üzenőfal': DATABASE_MODELS.ANNOUNCEMENT,
      'Naptár': DATABASE_MODELS.CONFIG, // Using config for calendar events
      'Felszerelések': DATABASE_MODELS.EQUIPMENT,
      'Forgatások DB': DATABASE_MODELS.FORGATAS,
      'Beosztások DB': DATABASE_MODELS.BEOSZTAS,
      'Felhasználók DB': DATABASE_MODELS.AUTH_USER,
      'Felszerelések DB': DATABASE_MODELS.EQUIPMENT,
    }
    
    const modelPath = modelMap[itemName] || DATABASE_MODELS.CONFIG
    const adminUrl = getDatabaseAdminUrl(modelPath)
    window.open(adminUrl, '_blank')
  }

  const handleItemClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.external) {
      e.preventDefault()
      window.open(item.url, '_blank')
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url
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
                ) : (
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
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
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
