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
  Bird
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
