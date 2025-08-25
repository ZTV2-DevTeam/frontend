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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserAvatar } from "@/components/user-avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Shield,
  AlertTriangle,
  Database,
  Globe,
  Save,
  User,
  Mail,
  AtSign,
  Palette,
  Bell,
  Lock,
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { currentRole } = useUserRole()

  if (!user) return null

  const userDisplayName = `${user.first_name} ${user.last_name}`.trim() || user.username

  const isAdmin = currentRole === 'admin'

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-8">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-sm">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Beállítások</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Személyre szabd az alkalmazást és kezeld a fiókod
                </p>
              </div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-border via-border/50 to-transparent"></div>
          </div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="flex justify-center w-full max-w-2xl mx-auto mb-6 h-12 p-1">
                <TabsTrigger value="profile" className="flex items-center gap-2 h-10 px-4">
                  <User className="h-4 w-4" />
                  <span>Profil</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2 h-10 px-4">
                  <Palette className="h-4 w-4" />
                  <span>Téma</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 h-10 px-4" disabled>
                  <Bell className="h-4 w-4" />
                  <span>Értesítések</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2 h-10 px-4" disabled>
                  <Lock className="h-4 w-4" />
                  <span>Biztonság</span>
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin" className="flex items-center gap-2 h-10 px-4">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border/50">
                  <UserAvatar
                    email={user.email}
                    firstName={user.first_name}
                    lastName={user.last_name}
                    username={user.username}
                    size="xl"
                    className="rounded-xl shadow-sm"
                    fallbackClassName="rounded-xl text-xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                  />
                  <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-bold">{userDisplayName}</h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {currentRole === 'admin' ? 'Adminisztrátor' : 
                         currentRole === 'class-teacher' ? 'Osztályfőnök' : 'Diák'}
                      </div>
                      <div className="px-3 py-1.5 bg-secondary/80 text-secondary-foreground rounded-full text-sm font-medium">
                        @{user.username}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="p-6 bg-card/50 rounded-xl border border-border/50 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Személyes információk</h3>
                    <p className="text-muted-foreground text-sm">Kezeld a fiókod alapvető adatait</p>
                  </div>
                  
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          Keresztnév
                        </Label>
                        <Input
                          id="firstName"
                          value={user.first_name}
                          disabled
                          className="h-10 disabled:opacity-60 disabled:bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          Vezetéknév
                        </Label>
                        <Input
                          id="lastName"
                          value={user.last_name}
                          disabled
                          className="h-10 disabled:opacity-60 disabled:bg-muted/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email cím
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="h-10 pl-10 disabled:opacity-60 disabled:bg-muted/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Felhasználónév
                      </Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          value={user.username}
                          disabled
                          className="h-10 pl-10 disabled:opacity-60 disabled:bg-muted/50"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                      <Button type="button" disabled className="h-10 px-4 opacity-50">
                        <Save className="mr-2 h-4 w-4" />
                        Profil mentése
                      </Button>
                      <Button type="button" variant="outline" disabled className="h-10 px-4 opacity-50">
                        Jelszó változtatása
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                <div className="p-6 bg-card/50 rounded-xl border border-border/50">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Megjelenés és téma</h2>
                    <p className="text-muted-foreground text-sm">Személyre szabd az alkalmazás kinézetét és színvilágát</p>
                  </div>
                  <ThemeSelector />
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <div className="p-6 bg-card/30 rounded-xl border border-border/30 opacity-60">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-muted-foreground">Értesítési beállítások</h2>
                    <p className="text-muted-foreground text-sm">Email és push értesítések kezelése</p>
                  </div>
                  
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailNotifications" className="text-sm font-medium text-muted-foreground">
                        Email értesítések
                      </Label>
                      <Input
                        id="emailNotifications"
                        placeholder="Hamarosan elérhető..."
                        disabled
                        className="h-10 disabled:opacity-40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pushNotifications" className="text-sm font-medium text-muted-foreground">
                        Push értesítések
                      </Label>
                      <Input
                        id="pushNotifications"
                        placeholder="Hamarosan elérhető..."
                        disabled
                        className="h-10 disabled:opacity-40"
                      />
                    </div>

                    <Button type="button" disabled className="h-10 px-4 opacity-40">
                      <Save className="mr-2 h-4 w-4" />
                      Értesítések mentése
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">📅 Várható megjelenés: <strong>2025 Q3</strong></p>
                  </div>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="p-6 bg-card/30 rounded-xl border border-border/30 opacity-60">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-muted-foreground">Biztonsági beállítások</h2>
                    <p className="text-muted-foreground text-sm">Kétfaktoros hitelesítés és munkamenetek kezelése</p>
                  </div>
                  
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="twoFactor" className="text-sm font-medium text-muted-foreground">
                        Kétfaktoros hitelesítés
                      </Label>
                      <Input
                        id="twoFactor"
                        placeholder="Hamarosan elérhető..."
                        disabled
                        className="h-10 disabled:opacity-40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessions" className="text-sm font-medium text-muted-foreground">
                        Aktív munkamenetek
                      </Label>
                      <Input
                        id="sessions"
                        placeholder="Hamarosan elérhető..."
                        disabled
                        className="h-10 disabled:opacity-40"
                      />
                    </div>

                    <Button type="button" disabled className="h-10 px-4 opacity-40">
                      <Save className="mr-2 h-4 w-4" />
                      Biztonsági beállítások mentése
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">🔒 Várható megjelenés: <strong>2025 Q4</strong></p>
                  </div>
                </div>
              </TabsContent>

              {/* Admin Tab */}
              {isAdmin && (
                <TabsContent value="admin" className="space-y-6">
                  <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30 p-4">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200">
                      <div className="space-y-2">
                        <p className="font-medium">Globális rendszerbeállítások</p>
                        <p className="text-sm">
                          A rendszer alapvető konfigurációja, kapcsolati sztringek, és egyéb kritikus beállítások 
                          biztonsági okokból csak közvetlen adatbázis-hozzáféréssel módosíthatók.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="p-6 bg-card/50 rounded-xl border border-border/50">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">Rendszeradminisztráció</h2>
                      <p className="text-muted-foreground text-sm">Speciális adminisztrátori eszközök és beállítások</p>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Adatbázis adminisztráció</h3>
                          <p className="text-muted-foreground text-sm">Közvetlen hozzáférés az adatbázis-kezelő felülethez</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="h-10 px-4">
                        <a href="/app/database-admin" target="_blank" className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Megnyitás
                        </a>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
