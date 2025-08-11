"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ThemeSelector } from "@/components/theme-selector"
import { useAuth } from "@/contexts/auth-context"
import { useUserRole } from "@/contexts/user-role-context"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Settings,
  User,
  Palette,
  Shield,
  Database,
  ExternalLink,
  AlertTriangle,
  Lock,
  Globe,
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { currentRole } = useUserRole()

  if (!user) return null

  const userDisplayName = `${user.first_name} ${user.last_name}`.trim() || user.username
  const initials = userDisplayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isAdmin = currentRole === 'admin'

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          {/* Page Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Settings className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Beállítások</h1>
              <p className="text-muted-foreground">
                Személyre szabd az alkalmazást és kezelje a fiókod
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* User Account Card */}
            <Card className="col-span-full lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle>Felhasználói fiók</CardTitle>
                    <CardDescription>Fiók információk és beállítások</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Profile Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-lg">
                    <AvatarFallback className="rounded-lg text-lg font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{userDisplayName}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {currentRole === 'admin' ? 'Adminisztrátor' : 
                         currentRole === 'class-teacher' ? 'Osztályfőnök' : 'Diák'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        @{user.username}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Account Actions */}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">Profil szerkesztése</span>
                        <p className="text-sm text-muted-foreground">Név, email és egyéb adatok módosítása</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">Jelszó megváltoztatása</span>
                        <p className="text-sm text-muted-foreground">Új jelszó beállítása</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle>Téma beállítások</CardTitle>
                    <CardDescription>Külső megjelenés testreszabása</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ThemeSelector />
              </CardContent>
            </Card>

            {/* Admin Global Settings Notice */}
            {isAdmin && (
              <Card className="col-span-full border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-orange-800 dark:text-orange-200">
                        Globális rendszerbeállítások
                      </CardTitle>
                      <CardDescription className="text-orange-700 dark:text-orange-300">
                        Biztonsági okokból csak közvetlen adatbázis-hozzáféréssel
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border border-orange-200 rounded-lg bg-orange-100/50 dark:border-orange-700 dark:bg-orange-900/20">
                      <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                          Rendszerszintű beállítások
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                          A rendszer alapvető konfigurációja, kapcsolati sztringek, és egyéb kritikus beállítások 
                          biztonsági okokból csak közvetlen adatbázis-hozzáféréssel módosíthatók.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Database className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-medium">Adatbázis adminisztráció</span>
                          <p className="text-sm text-muted-foreground">Közvetlen hozzáférés az adatbázishoz</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/app/database-admin" target="_blank" className="flex items-center gap-2">
                          <Globe className="h-3 w-3" />
                          Megnyitás
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Settings Cards (placeholders for future features) */}
            <Card className="opacity-60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle>Értesítések</CardTitle>
                    <CardDescription>Email és push értesítések kezelése</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <div className="text-center">
                    <p className="text-sm">Hamarosan elérhető</p>
                    <p className="text-xs">2025 Q3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="opacity-60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle>Biztonság</CardTitle>
                    <CardDescription>Kétfaktoros hitelesítés és munkamenetek</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <div className="text-center">
                    <p className="text-sm">Hamarosan elérhető</p>
                    <p className="text-xs">2025 Q4</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
