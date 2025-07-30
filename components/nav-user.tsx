"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconCheck,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme, type ThemeColor } from "@/contexts/theme-context"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { themeColor, setThemeColor } = useTheme()

  const colorMap: { hex: string; name: ThemeColor }[] = [
    { hex: "#ef4444", name: "red" },
    { hex: "#f59e42", name: "orange" },
    { hex: "#fde047", name: "yellow" },
    { hex: "#22d3ee", name: "cyan" },
    { hex: "#10b981", name: "green" },
    { hex: "#6366f1", name: "indigo" },
    { hex: "#a21caf", name: "purple" },
    { hex: "#ec4899", name: "pink" },
    { hex: "#f97316", name: "amber" },
    { hex: "#0ea5e9", name: "blue" },
  ]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Theme select
            </DropdownMenuLabel>
            <div className="grid grid-cols-5 gap-2 px-2 py-2 pb-2">
                {colorMap.map((colorItem) => (
                <button
                  key={colorItem.hex}
                  type="button"
                  aria-label={`Select theme color ${colorItem.name}`}
                  className={`h-6 w-6 rounded-full border-2 transition-all duration-200 hover:border-foreground focus:outline-none focus:ring-2 focus:ring-ring hover:scale-110 relative flex items-center justify-center ${
                    themeColor === colorItem.name 
                      ? 'border-foreground ring-2 ring-ring scale-110 shadow-lg' 
                      : 'border-muted-foreground/20'
                  }`}
                  style={{ backgroundColor: colorItem.hex }}
                  onClick={() => setThemeColor(colorItem.name)}
                  tabIndex={0}
                >
                  {themeColor === colorItem.name && (
                    <IconCheck className="h-3 w-3 text-white drop-shadow-sm" />
                  )}
                </button>
                ))}
            </div>

            <DropdownMenuSeparator />           
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
