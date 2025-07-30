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
  TreePalm
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

const data = {
  user: {
    name: "Minta Diák",
    email: "mintadiak@ztv.hu",
    avatar: "",
  },
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
        url: "/iranyitopult",
        icon: IconDashboard,
      },
      {
        title: "Üzenőfal",
        url: "/uzenofal",
        icon: Mail,
      },
      {
        title: "Analitika",
        url: "/analitika",
        icon: IconChartBar,
      },
      {
        title: "Stáb",
        url: "/stab",
        icon: IconUsers,
      },
      {
        title: "Naptár",
        url: "/naptar",
        icon: IconCalendar,
      },
    ],
    'class-teacher': [
      {
        title: "Irányítópult",
        url: "/iranyitopult",
        icon: IconDashboard,
      },
    ],
    student: [
      {
        title: "Irányítópult",
        url: "/iranyitopult",
        icon: IconDashboard,
      },
      {
        title: "Üzenőfal",
        url: "/uzenofal",
        icon: Mail,
      },
      {
        title: "Naptár",
        url: "/naptar",
        icon: IconCalendar,
      },
    ],
  },
  navSecondary: [
    {
      title: "Beállítások",
      url: "/beallitasok",
      icon: IconSettings,
    },
    {
      title: "Segítség",
      url: "/segitseg",
      icon: IconHelp,
    },
  ],
  shootings: {
    admin: [
      {
        name: "Kiírások",
        url: "/kiirasok",
        icon: BellDot,
      },
      {
        name: "Beosztás",
        url: "/beosztas",
        icon: TableProperties,
      },
      {
        name: "Vakáció",
        url: "/vakacio",
        icon: TreePalm,
      },
    ],
    'class-teacher': [
    ],
    student: [
      {
        name: "Kiírások",
        url: "/kiirasok",
        icon: BellDot,
      },
      {
        name: "Vakáció",
        url: "/vakacio",
        icon: TreePalm,
      },
    ],
  },
  utils: {
    admin: [
      {
        name: "Partnerek",
        url: "/partnerek",
        icon: Handshake,
      },
      {
        name: "Felszerelés",
        url: "/felszereles",
        icon: Video,
      },
    ],
    'class-teacher': [],
    student: [
      {
        name: "Partnerek",
        url: "/partnerek",
        icon: Handshake,
      },
      {
        name: "Felszerelés",
        url: "/felszereles",
        icon: Video,
      },

    ],
  },
  myClass: {
    admin: [],
    'class-teacher': [
      {
        name: "Igazolások",
        url: "/igazolasok",
        icon: TicketCheck,
      },
    ],
    student: [
      {
        name: "Igazolások",
        url: "/igazolasok",
        icon: TicketCheck,
      },
    ],
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
          <NavCategory category="Forgatások" items={data.shootings[currentRole]} />
        )}
        {data.utils[currentRole].length > 0 && (
          <NavCategory category="Eszközök" items={data.utils[currentRole]} />
        )}
        {data.myClass[currentRole].length > 0 && (
          <NavCategory category="Osztályom" items={data.myClass[currentRole]} />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
