"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useUserRole } from "@/contexts/user-role-context"
import Link from "next/link"
import { 
  User, 
  Video, 
  Calendar, 
  FileText, 
  MessageSquare, 
  AlertTriangle,
  Mail,
  TreePalm,
  BellDot,
  Settings,
  Plus,
  Info,
  Home,
  LogIn,
  Eye,
  TicketCheck,
  Star,
  Users
} from "lucide-react"

export default function StudentGuidePage() {
  const { currentRole } = useUserRole()

  // Check if user has student access
  if (currentRole !== 'student' && currentRole !== 'admin') {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <Card className="border-destructive/50 bg-destructive/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Hozzáférés megtagadva
                </CardTitle>
                <CardDescription>
                  Ez az útmutató csak diákok számára elérhető.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nincs jogosultságod a diák útmutató megtekintéséhez.</p>
                </div>
              </CardContent>
            </Card>
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
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Diák Útmutató
              </h1>
              <p className="text-muted-foreground">
                Útmutató a rendszer használatához és a forgatásokhoz
              </p>
            </div>
            <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
              <User className="w-3 h-3 mr-1" />
              Diák Szint
            </Badge>
          </div>

          {/* Navigation Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Navigáció a rendszerben
              </CardTitle>
              <CardDescription>
                Milyen menük érhetők el számodra és mit csinálnak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Menu Items */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Főmenü
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Home className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium">Irányítópult</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Itt látod a legfontosabb információkat: közelgő forgatásokat, új üzeneteket, és gyors hivatkozásokat.
                    </p>
                    <p className="text-xs text-blue-600">
                      Útvonal: /app/iranyitopult
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="h-5 w-5 text-orange-600" />
                      <h5 className="font-medium">Üzenőfal</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Itt olvashatod az általános közleményeket, bejelentéseket és fontos információkat.
                    </p>
                    <p className="text-xs text-orange-600">
                      Útvonal: /app/uzenofal
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <h5 className="font-medium">Naptár</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      A naptárban láthatod az összes forgatást, eseményt és fontosabb dátumokat.
                    </p>
                    <p className="text-xs text-purple-600">
                      Útvonal: /app/naptar
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Activity Menu */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Tevékenység menü
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <BellDot className="h-5 w-5 text-red-600" />
                      <h5 className="font-medium">Forgatások</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Itt láthatsz minden elérhető forgatást, jelentkezhetsz rájuk, és megnézheted a beosztásaidat.
                    </p>
                    <p className="text-xs text-red-600">
                      Útvonal: /app/forgatasok
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <TreePalm className="h-5 w-5 text-green-600" />
                      <h5 className="font-medium">Távollét</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ebben a menüpontban rögzítheted azt, ha előre láthatóan nem leszel elérhető egy adott időpontban (pl. betegség, családi okok). Amennyiben elfogadják ezt a tanárok, nem leszel ebben az időszakban beosztva forgatásra.
                    </p>
                    <p className="text-xs text-green-600">
                      Útvonal: /app/tavollet
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Class Menu */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Osztályom menü
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <TicketCheck className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium">Igazolások</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Itt láthatod az általad beküldött igazolások státuszát és részleteit.
                    </p>
                    <p className="text-xs text-blue-600">
                      Útvonal: /app/igazolasok
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Secondary Menu */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Alsó menü</h4>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <h5 className="font-medium">Beállítások</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Profil adatok módosítása, jelszó változtatás és értesítési beállítások.
                    </p>
                    <p className="text-xs text-gray-600">
                      Útvonal: /app/beallitasok
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium">Segítség</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Általános tudásbázis, GYIK és ez az útmutató.
                    </p>
                    <p className="text-xs text-blue-600">
                      Útvonal: /app/segitseg
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporter Manual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Riporter útmutató: Új forgatás létrehozása
              </CardTitle>
              <CardDescription>
                Hogyan hozz létre új forgatást riporterként (csak 10F osztály diákjai számára)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-amber-600" />
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Fontos</h4>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Ez a funkció csak a 10F osztály diákjai számára érhető el, akik riporter jogosultsággal rendelkeznek.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <h4 className="font-medium">Menj a Forgatások oldalra</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kattints a &quot;Forgatások&quot; menüpontra a bal oldali navigációban.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <h4 className="font-medium">Keresd az &quot;Új forgatás&quot; gombot</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ha megvan a jogosultságod, látni fogsz egy &quot;Új forgatás&quot; gombot az oldal tetején.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <h4 className="font-medium">Töltsd ki az űrlapot</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kattints a gombra, és egy űrlap jelenik meg. Töltsd ki az összes kötelező mezőt (cím, dátum, helyszín, stb.).
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <h4 className="font-medium">Mentsd el</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kattints a &quot;Forgatás létrehozása&quot; gombra. A forgatás létrejön és megjelenik a forgatások listájában.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Tipp</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  A forgatás beosztását a tanárok végzik el. Amint létrehozod a forgatást, a tanárok látni fogják és amint lehet beosztják diáktársaidat.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hasznos Linkek</CardTitle>
              <CardDescription>Gyakran használt funkciók gyors elérése</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/app/forgatasok" className="cursor-pointer">
                    <Video className="h-4 w-4 mr-2" />
                    Forgatások
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/tavollet" className="cursor-pointer">
                    <TreePalm className="h-4 w-4 mr-2" />
                    Távollét
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/igazolasok" className="cursor-pointer">
                    <TicketCheck className="h-4 w-4 mr-2" />
                    Igazolások
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/segitseg" className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    Általános Súgó
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
