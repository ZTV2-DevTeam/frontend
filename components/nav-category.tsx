"use client"

import {
  IconDatabase,
  IconDots,
  type Icon,
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

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
    // Map item names to database models
    const modelMap: { [key: string]: string } = {
      'Forgatások': 'forgatasok',
      'Beosztás': 'beosztasok', 
      'Igazolások': 'igazolasok',
      'Partnerek': 'partnerek',
      'Felszerelés': 'equipment',
      'Stáb': 'users',
      'Üzenőfal': 'messages',
      'Naptár': 'events'
    }
    
    const modelName = modelMap[itemName] || itemName.toLowerCase()
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    const adminUrl = `${backendUrl}/admin/api/${modelName}`
    window.open(adminUrl, '_blank')
  }

  const handleItemClick = (item: any, e: React.MouseEvent) => {
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
                      className="data-[state=open]:bg-accent rounded-sm"
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
                    <DropdownMenuItem onClick={() => handleDatabaseEdit(item.name)}>
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
