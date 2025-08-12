/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
  IconChartBar,
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
  Handshake, 
  Video, 
  TableProperties, 
  BellDot, 
  Mail,
  TicketCheck,
  TreePalm,
  Bird,
  Database,
  FileText,
  UserCheck,
  ExternalLink,
  Wrench,
  Settings,
  Tag,
  Phone,
  Calendar,
  User,
  Network
} from 'lucide-react';

// Icon mapping for database admin items
const iconMap = {
  Video,
  TableProperties,
  UserCheck,
  Users,
  Wrench,
  Settings,
  Tag,
  Phone,
  GraduationCap,
  Calendar,
  User,
  BellDot,
  Shield,
  Network,
  Handshake,
};

// Helper function to get icon component by name
const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Database;
};

import { NavCategory } from "@/components/nav-category"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useUserRole, type UserRole } from "@/contexts/user-role-context"
import { usePermissions } from "@/contexts/permissions-context"
import { 
  DATABASE_MODELS, 
  getDatabaseAdminUrl, 
  getDatabaseAdminMenuItemsByRole,
  type DatabaseAdminMenuItem 
} from "@/lib/database-models"
import { BACKEND_CONFIG } from "@/lib/config"

// Backend URL configuration
const BACKEND_URL = BACKEND_CONFIG.BASE_URL

const data = {
  teams: [
    {
      name: "Adminisztrátor",
      logo: Shield,
      plan: "Adminisztráció, beosztások",
      role: 'admin' as UserRole,
    },
    {
      name: "Osztályfőnök",
      logo: Users,
      plan: "Igazoláskezelés",
      role: 'class-teacher' as UserRole,
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
        title: "Stáb",
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
      // Database Admin
      {
        title: "Adatbázis Admin",
        url: "/app/database-admin",
        icon: Database,
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
  },
  shootings: {
    admin: [
      {
        name: "Forgatások",
        url: "/app/forgatasok",
        icon: BellDot,
      },
      {
        name: "KaCsa",
        url: "/app/kacsa",
        icon: Bird,
      },
      {
        name: "Beosztás",
        url: "/app/beosztas",
        icon: TableProperties,
      },
      {
        name: "Távollét",
        url: "/app/tavollet",
        icon: TreePalm,
      },
    ],
    'class-teacher': [],
    student: [
      {
        name: "Forgatások",
        url: "/app/forgatasok",
        icon: BellDot,
      },
      {
        name: "KaCsa",
        url: "/app/kacsa",
        icon: Bird,
      },
      {
        name: "Távollét",
        url: "/app/tavollet",
        icon: TreePalm,
      },
    ],
  },
  utils: {
    admin: [] as Array<{
      name: string
      url: string  
      icon: any
    }>,
    // Partnerek és Felszerelés funkciókat ideiglenesen kikapcsolta a fejlesztő
    // {
    //   name: "Partnerek",
    //   url: "/app/partnerek",
    //   icon: Handshake,
    // },
    // {
    //   name: "Felszerelés",
    //   url: "/app/felszereles",
    //   icon: Video,
    // },
    'class-teacher': [] as Array<{
      name: string
      url: string
      icon: any
    }>,
    student: [] as Array<{
      name: string
      url: string
      icon: any
    }>,
    // Partnerek és Felszerelés funkciókat ideiglenesen kikapcsolta a fejlesztő
    // {
    //   name: "Partnerek",
    //   url: "/app/partnerek",
    //   icon: Handshake,
    // },
    // {
    //   name: "Felszerelés", 
    //   url: "/app/felszereles",
    //   icon: Video,
    // },
  },
  myClass: {
    admin: [],
    'class-teacher': [
      {
        name: "Igazolások",
        url: "/app/igazolasok",
        icon: TicketCheck,
      },
    ],
    student: [
      {
        name: "Igazolások",
        url: "/app/igazolasok",
        icon: TicketCheck,
      },
    ],
  },
  databaseAdmin: {
    admin: getDatabaseAdminMenuItemsByRole('admin').map((item: DatabaseAdminMenuItem) => ({
      name: item.name,
      url: getDatabaseAdminUrl(item.modelPath),
      icon: getIconComponent(item.icon),
      external: true,
    })),
    'class-teacher': [],
    student: [],
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentRole } = useUserRole()
  const { permissions, canAccessPage, hasPermission } = usePermissions()
  
  // Filter navigation items based on permissions
  const getFilteredNavMain = () => {
    return data.navMain[currentRole].filter(item => canAccessPage(item.url))
  }

  const getFilteredShootings = () => {
    return data.shootings[currentRole].filter(item => canAccessPage(item.url))
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
          <NavUser />
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
          <NavCategory category="Tevékenység" items={filteredShootings} />
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
