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
    admin: [
      {
        name: "Partnerek",
        url: "/app/partnerek",
        icon: Handshake,
      },
      {
        name: "Felszerelés",
        url: "/app/felszereles",
        icon: Video,
      },
    ],
    'class-teacher': [],
    student: [
      {
        name: "Partnerek",
        url: "/app/partnerek",
        icon: Handshake,
      },
      {
        name: "Felszerelés",
        url: "/app/felszereles",
        icon: Video,
      },

    ],
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
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain[currentRole]} />
        {data.shootings[currentRole].length > 0 && (
          <NavCategory category="Tevékenység" items={data.shootings[currentRole]} />
        )}
        {data.utils[currentRole].length > 0 && (
          <NavCategory category="Eszközök" items={data.utils[currentRole]} />
        )}
        {data.myClass[currentRole].length > 0 && (
          <NavCategory category="Osztályom" items={data.myClass[currentRole]} />
        )}
        <NavSecondary items={data.navSecondary[currentRole]} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
