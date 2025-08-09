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
  ExternalLink
} from 'lucide-react';

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

// Database model names for admin panel integration
const DATABASE_MODELS = {
  FORGATASOK: 'api/forgatas',
  BEOSZTASOK: 'api/beosztas',
  USERS: 'auth/user',
  EQUIPMENT: 'api/equipment',
}

// Backend URL configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

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
        title: "Analitika",
        url: "/app/analitika",
        icon: IconChartBar,
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
  navSecondary: [
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
        name: "Vakáció",
        url: "/app/vakacio",
        icon: TreePalm,
      },
    ],
    'class-teacher': [
    ],
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
        name: "Vakáció",
        url: "/app/vakacio",
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
    admin: [
      {
        name: "Forgatások DB",
        url: `${BACKEND_URL}/admin/${DATABASE_MODELS.FORGATASOK}`,
        icon: Video,
        external: true,
      },
      {
        name: "Beosztások DB",
        url: `${BACKEND_URL}/admin/${DATABASE_MODELS.BEOSZTASOK}`,
        icon: TableProperties,
        external: true,
      },
      {
        name: "Felhasználók DB",
        url: `${BACKEND_URL}/admin/${DATABASE_MODELS.USERS}`,
        icon: UserCheck,
        external: true,
      },
      {
        name: "Felszerelések DB",
        url: `${BACKEND_URL}/admin/${DATABASE_MODELS.EQUIPMENT}`,
        icon: Video,
        external: true,
      },
    ],
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
        {data.databaseAdmin[currentRole].length > 0 && (
          <NavCategory category="Adatbázis admin" items={data.databaseAdmin[currentRole]} />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
