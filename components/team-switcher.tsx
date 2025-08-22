"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUserRole, type UserRole } from "@/contexts/user-role-context"
import { usePermissions } from "@/contexts/permissions-context"

interface Team {
  name: string
  logo: React.ElementType
  plan: string
  role: UserRole
  isPreview?: boolean
}

export function TeamSwitcher({
  teams,
}: {
  teams: Team[]
}) {
  const { isMobile } = useSidebar()
  const { currentRole, setRole, isPreviewMode, actualUserRole } = useUserRole()
  const { permissions, getAvailableRoles, isLoading } = usePermissions()
  
  // Filter teams based on user permissions and admin preview logic
  const availableRoles = getAvailableRoles()
  
  // Check if user is an admin (any type)
  const isAnyAdmin = permissions?.permissions?.is_admin || 
                   permissions?.permissions?.is_system_admin || 
                   permissions?.permissions?.is_teacher_admin ||
                   permissions?.permissions?.is_developer_admin ||
                   permissions?.role_info?.admin_type === 'system_admin' ||
                   permissions?.role_info?.admin_type === 'teacher' ||
                   permissions?.role_info?.admin_type === 'dev' ||
                   permissions?.role_info?.admin_type === 'developer' ||
                   permissions?.role_info?.primary_role === 'developer_admin'

  // Check if user is both admin and "ofő" (class teacher)
  const isAdminAndClassTeacher = isAnyAdmin && (
    permissions?.permissions?.is_osztaly_fonok || 
    permissions?.role_info?.special_role === 'class_teacher'
  )

  let allowedTeams = teams.filter(team => {
    if (!isAnyAdmin) {
      // Non-admins only see their available roles
      return availableRoles.includes(team.role)
    }
    
    // Admins can always see admin role
    if (team.role === 'admin') {
      return true
    }
    
    // Admins can always preview student role
    if (team.role === 'student') {
      return true
    }
    
    // For class-teacher role:
    // - If admin is also a class teacher (ofő+admin), show it as actual role
    // - If admin is not a class teacher, show it as preview
    if (team.role === 'class-teacher') {
      return true // Always show for admins (either as actual or preview)
    }
    
    return availableRoles.includes(team.role)
  })

  // Mark preview status for admin users
  allowedTeams = allowedTeams.map(team => ({
    ...team,
    isPreview: isAnyAdmin && team.role !== 'admin' && (
      team.role === 'student' || 
      (team.role === 'class-teacher' && !isAdminAndClassTeacher)
    )
  }))
  
  const activeTeam = allowedTeams.find(team => team.role === currentRole) || allowedTeams[0]

  // Show loading state
  if (isLoading || !permissions) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg animate-pulse" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Betöltés...</span>
              <span className="truncate text-xs">Szerepkör betöltése</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!activeTeam) {
    return null
  }

  // If user only has one role, don't show dropdown
  if (allowedTeams.length === 1) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="cursor-default">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <activeTeam.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{activeTeam.name}</span>
                {activeTeam.isPreview && (
                  <span className="px-1 py-0.5 text-[9px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-700">
                    ELŐNÉZET
                  </span>
                )}
                <span className="px-1 py-0.5 text-[9px] font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded border border-orange-200 dark:border-orange-700">
                  BETA
                </span>
              </div>
              <span className="truncate text-xs">
                {activeTeam.isPreview ? `${activeTeam.plan} (Előnézet)` : activeTeam.plan}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const handleTeamChange = (team: Team) => {
    setRole(team.role)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{activeTeam.name}</span>
                  {activeTeam.isPreview && (
                    <span className="px-1 py-0.5 text-[9px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-700">
                      ELŐNÉZET
                    </span>
                  )}
                  <span className="px-1 py-0.5 text-[9px] font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded border border-orange-200 dark:border-orange-700">
                    BETA
                  </span>
                </div>
                <span className="truncate text-xs">
                  {activeTeam.isPreview ? `${activeTeam.plan} (Előnézet)` : activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Elérhető szerepkörök
            </DropdownMenuLabel>
            {allowedTeams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleTeamChange(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span>{team.name}</span>
                  {team.isPreview && (
                    <span className="px-1 py-0.5 text-[8px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-700">
                      ELŐNÉZET
                    </span>
                  )}
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {/* Remove "Új szerepkör" button - users can't create new roles */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
