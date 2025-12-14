/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
  IconDashboard,
  IconHelp,
  IconSettings,
  IconUsers,
  IconCalendar,
} from "@tabler/icons-react"

import { 
  Shield, 
  Users, 
  GraduationCap, 
  BellDot, 
  Mail,
  TicketCheck,
  TreePalm,
  Calendar,
  Wrench,
  CameraIcon,
} from 'lucide-react';

import { DuckIcon } from "@/components/icons/duck-icon"

import { NavCategory } from "@/components/nav-category"
import { NavCategoryCollapsible } from "@/components/nav-category-collapsible"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUserRole, type UserRole } from "@/contexts/user-role-context"
import { usePermissions } from "@/contexts/permissions-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

const data = {
  teams: [
    {
      name: "Adminisztrátor",
      logo: Shield,
      plan: "Adminisztráció, beosztások",
      role: 'admin' as UserRole,
    },
    {
      name: "Diák",
      logo: GraduationCap,
      plan: "Diákoknak",
      role: 'student' as UserRole,
    },
  ],
  navMain: {
    admin: [
      {
        title: "Irányítópult",
        url: "/app/iranyitopult",
        icon: IconDashboard,
      },
      {
        title: "Üzenőfal",
        url: "/app/uzenofal",
        icon: Mail,
      },
      {
        title: "Stábtagok",
        url: "/app/stab",
        icon: IconUsers,
      },
      {
        title: "Naptár",
        url: "/app/naptar",
        icon: IconCalendar,
      },
    ],
    student: [
      {
        title: "Irányítópult",
        url: "/app/iranyitopult",
        icon: IconDashboard,
      },
      {
        title: "Üzenőfal",
        url: "/app/uzenofal",
        icon: Mail,
      },
      {
        title: "Stábtagok",
        url: "/app/stab",
        icon: IconUsers,
      },
      {
        title: "Naptár",
        url: "/app/naptar",
        icon: IconCalendar,
      },
    ],
    'class-teacher': [
      {
        title: "Irányítópult",
        url: "/app/iranyitopult",
        icon: IconDashboard,
      },
      {
        title: "Üzenőfal",
        url: "/app/uzenofal",
        icon: Mail,
      },
      {
        title: "Stábtagok",
        url: "/app/stab",
        icon: IconUsers,
      },
      {
        title: "Naptár",
        url: "/app/naptar",
        icon: IconCalendar,
      },
    ],
  },
  navSecondary: {
    admin: [
      {
        title: "Beállítások",
        url: "/app/beallitasok",
        icon: IconSettings,
      },
      {
        title: "Segítség",
        url: "/app/segitseg",
        icon: IconHelp,
      },
    ],
    student: [
      {
        title: "Beállítások",
        url: "/app/beallitasok",
        icon: IconSettings,
      },
      {
        title: "Segítség",
        url: "/app/segitseg",
        icon: IconHelp,
      },
    ],
    'class-teacher': [
      {
        title: "Beállítások",
        url: "/app/beallitasok",
        icon: IconSettings,
      },
      {
        title: "Segítség",
        url: "/app/segitseg",
        icon: IconHelp,
      },
    ],
  },
  shootings: {
    admin: [
      {
        name: "Forgatások",
        icon: BellDot,
        subItems: [
          {
            name: "KaCsa forgatások",
            url: "/app/forgatasok",
            icon: CameraIcon,
          },
          {
            name: "KaCsa összejátszások",
            url: "/app/kacsa",
            icon: DuckIcon,
          },
          {
            name: "Események",
            url: "/app/esemenyek",
            icon: Calendar,
          },
        ],
      },
      // Beosztás removed - now managed within forgatások
      {
        name: "Távollét",
        url: "/app/tavollet",
        icon: TreePalm,
      },
    ],

    student: [
      {
        name: "Forgatások",
        icon: BellDot,
        subItems: [
          {
            name: "KaCsa forgatások",
            url: "/app/forgatasok",
            icon: CameraIcon,
          },
          {
            name: "KaCsa összejátszások",
            url: "/app/kacsa",
            icon: DuckIcon,
          },
          {
            name: "Események",
            url: "/app/esemenyek",
            icon: Calendar,
          },
        ],
      },
      {
        name: "Távollét",
        url: "/app/tavollet",
        icon: TreePalm,
      },
    ],
    'class-teacher': [
      {
        name: "Forgatások",
        icon: BellDot,
        subItems: [
          {
            name: "KaCsa forgatások",
            url: "/app/forgatasok",
            icon: CameraIcon,
          },
          {
            name: "KaCsa összejátszások",
            url: "/app/kacsa",
            icon: DuckIcon,
          },
          {
            name: "Események",
            url: "/app/esemenyek",
            icon: Calendar,
          },
        ],
      },
      {
        name: "Távollét",
        url: "/app/tavollet",
        icon: TreePalm,
      },
    ],
  },
  utils: {
    admin: [
      {
        name: "Felszerelés",
        url: "/app/felszereles",
        icon: Wrench,
      },
    ],
    student: [
      {
        name: "Felszerelés", 
        url: "/app/felszereles",
        icon: Wrench,
      },
    ],
    'class-teacher': [
      {
        name: "Felszerelés", 
        url: "/app/felszereles",
        icon: Wrench,
      },
    ],
  },
  myClass: {
    admin: [],
    student: [
      {
        name: "Igazolások",
        url: "/app/igazolasok",
        icon: TicketCheck,
      },
    ],
    'class-teacher': [
      {
        name: "Igazolások",
        url: "/app/igazolasok",
        icon: TicketCheck,
      },
    ],
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentRole } = useUserRole()
  const { permissions, canAccessPage } = usePermissions()
  const { logout } = useAuth()
  const router = useRouter()
  
  // Logout handler
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  // Filter navigation items based on permissions
  const getFilteredNavMain = () => {
    const filteredItems = data.navMain[currentRole].filter(item => canAccessPage(item.url))
    
    // Note: Class teacher (Osztályfőnök) role has been removed from frontend
    // They now use external Igazoláskezelő interface at igazolas.szlg.info
    
    return filteredItems
  }

  const getFilteredShootings = () => {
    return data.shootings[currentRole].filter(item => {
      if (item.url) {
        return canAccessPage(item.url)
      }
      // For items with subItems, check if any subitem is accessible
      if (item.subItems) {
        return item.subItems.some(subItem => canAccessPage(subItem.url))
      }
      return true
    })
  }

  const getFilteredUtils = () => {
    return data.utils[currentRole].filter(item => canAccessPage(item.url))
  }

  const getFilteredMyClass = () => {
    return data.myClass[currentRole].filter(item => canAccessPage(item.url))
  }

  const getFilteredNavSecondary = () => {
    return data.navSecondary[currentRole].filter(item => canAccessPage(item.url))
  }

  // Show loading state while permissions are loading
  if (!permissions) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-center text-sm text-muted-foreground">
            Navigáció betöltése...
          </div>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="size-4" />
                <span>Kijelentkezés</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }

  const filteredNavMain = getFilteredNavMain()
  const filteredShootings = getFilteredShootings()
  const filteredUtils = getFilteredUtils()
  const filteredMyClass = getFilteredMyClass()
  const filteredNavSecondary = getFilteredNavSecondary()
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {filteredShootings.length > 0 && (
          <NavCategoryCollapsible category="Tevékenység" items={filteredShootings} />
        )}
        {filteredUtils.length > 0 && (
          <NavCategory category="Eszközök" items={filteredUtils} />
        )}
        {filteredMyClass.length > 0 && (
          <NavCategory category="Osztályom" items={filteredMyClass} />
        )}
        <NavSecondary items={filteredNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="size-4" />
              <span>Kijelentkezés</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
