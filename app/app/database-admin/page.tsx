/**
 * Database Administration Page
 * 
 * Central page for managing all database models through Django admin interface.
 * Uses the centralized database models configuration.
 */

"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { DatabaseAdminMenu, DatabaseAdminToolbar } from "@/components/database-admin-menu"
import { CONTACT_CONFIG } from "@/lib/config"
import { 
  getDatabaseAdminMenuItemsByRole,
  DATABASE_MODELS,
  DATABASE_MODEL_NAMES,
  getDatabaseAdminUrl,
  type DatabaseAdminMenuItem
} from "@/lib/database-models"
import { 
  Database, 
  ExternalLink, 
  Server, 
  Users, 
  Settings, 
  Shield,
  Activity,
  Clock,
  CheckCircle2
} from "lucide-react"

export default function DatabaseAdminPage() {
  const { currentRole } = useUserRole()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalModels: 0,
    userModels: 0,
    recentlyAccessed: 0,
    lastAccess: null as string | null
  })

  useEffect(() => {
    // Calculate statistics
    const allMenuItems = getDatabaseAdminMenuItemsByRole('admin')
    const userMenuItems = getDatabaseAdminMenuItemsByRole(currentRole)
    
    setStats({
      totalModels: allMenuItems.length,
      userModels: userMenuItems.length,
      recentlyAccessed: Math.floor(Math.random() * 5) + 1, // Mock data
      lastAccess: new Date().toLocaleString('hu-HU')
    })
  }, [currentRole])

  const handleQuickAccess = (modelPath: string) => {
    const adminUrl = getDatabaseAdminUrl(modelPath)
    window.open(adminUrl, '_blank')
  }

  // Quick access models for different roles
  const getQuickAccessModels = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { name: 'Felhasználók', modelPath: DATABASE_MODELS.AUTH_USER, icon: Users },
          { name: 'Forgatások', modelPath: DATABASE_MODELS.FORGATAS, icon: Activity },
          { name: 'Beosztások', modelPath: DATABASE_MODELS.BEOSZTAS, icon: Settings },
          { name: 'Partnerek', modelPath: DATABASE_MODELS.PARTNER, icon: Shield }
        ]
      default:
        return []
    }
  }

  const quickAccessModels = getQuickAccessModels()

  if (currentRole !== 'admin') {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <CardTitle>Hozzáférés megtagadva</CardTitle>
                  <CardDescription>
                    Ez az oldal csak adminisztrátorok számára elérhető.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl shadow-sm">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Adatbázis Adminisztráció</h1>
                <p className="text-base text-muted-foreground">
                  Django admin felület elérése és adatbázis modellek kezelése
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              <Database className="w-3 h-3 mr-1" />
              Django Admin
            </Badge>
          </div>

          {/* Disclaimer for Advanced Users
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Shield className="h-5 w-5" />
                ⚠️ FIGYELEM - Csak haladó felhasználóknak
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-700 dark:text-amber-300">
              <p className="mb-2">
                <strong>Ez az adminisztrációs felület közvetlen hozzáférést biztosít az adatbázishoz.</strong>
              </p>
              <p className="mb-2">
                Az adatok megfelelő ismeretek nélküli módosítása <strong>destruktív lehet</strong> és 
                <strong> kritikus problémákat okozhat</strong> a rendszer működésében.
              </p>
              <p className="text-sm">
                <strong>Kritikus hibák esetén azonnal vegye fel a kapcsolatot a fejlesztővel: </strong>
                <a 
                  href={`mailto:${CONTACT_CONFIG.DEVELOPER_EMAIL}?subject=KRITIKUS HIBA - Adatbázis adminisztráció`}
                  className="underline text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100"
                >
                  {CONTACT_CONFIG.DEVELOPER_EMAIL}
                </a>
              </p>
            </CardContent>
          </Card> */}

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Összes modell</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalModels}</div>
                <p className="text-xs text-muted-foreground">adatbázis modell</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Elérhető számodra</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.userModels}</div>
                <p className="text-xs text-muted-foreground">modell elérhető</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Legutóbb elért</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentlyAccessed}</div>
                <p className="text-xs text-muted-foreground">modell ma</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Státusz</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">Django admin elérhető</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access */}
          {quickAccessModels.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Gyors elérés
                </CardTitle>
                <CardDescription>
                  Gyakran használt adatbázis modellek közvetlen elérése
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {quickAccessModels.map((model) => (
                    <button
                      key={model.modelPath}
                      onClick={() => handleQuickAccess(model.modelPath)}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <model.icon className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{model.name}</p>
                        <p className="text-xs text-muted-foreground">Django admin</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Database Admin Menu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Összes adatbázis modell
              </CardTitle>
              <CardDescription>
                Teljes lista az elérhető Django admin felületekről kategóriák szerint rendezve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseAdminMenu 
                userRole={currentRole} 
                layout="list" 
                showCategories={true}
                className="max-w-none"
              />
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Rendszerinformációk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Backend URL</p>
                  <p className="text-sm text-muted-foreground">
                    {process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ftvapi.szlg.info'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Admin útvonal</p>
                  <p className="text-sm text-muted-foreground">/admin/</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Felhasználó</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.last_name} {user?.first_name} ({user?.username})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Szerepkör</p>
                  <p className="text-sm text-muted-foreground">
                    {currentRole === 'admin' ? 'Adminisztrátor' : currentRole}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
