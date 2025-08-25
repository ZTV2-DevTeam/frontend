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
  Shield, 
  Users, 
  Settings, 
  Video, 
  FileText, 
  BarChart3, 
  Database,
  UserPlus,
  Calendar,
  Bell,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Home,
  LogIn,
  Eye,
  Info,
  Mail,
  TreePalm,
  BellDot,
  TicketCheck,
  Plus,
  Wrench,
  Globe,
  Star
} from "lucide-react"

export default function AdminGuidePage() {
  const { currentRole } = useUserRole()

  // Check if user has admin access
  if (currentRole !== 'admin') {
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
                  Ez az útmutató csak rendszergazdák számára elérhető.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nincs jogosultságod az adminisztrátori útmutató megtekintéséhez.</p>
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
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                Adminisztrátor Útmutató
              </h1>
              <p className="text-muted-foreground">
                Teljes útmutató minden adminisztrátori funkcióhoz és a Django admin használatához
              </p>
            </div>
            <Badge variant="outline" className="text-sm bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
              <Shield className="w-3 h-3 mr-1" />
              Admin Szint
            </Badge>
          </div>

          {/* Login Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-blue-600" />
                Bejelentkezés
              </CardTitle>
              <CardDescription>
                Hogyan jelentkezz be a rendszerbe adminisztrátorként
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <h4 className="font-medium">Nyisd meg a weboldalt</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Használd az adminisztrációs URL-t, amely kizárólag adminok számára elérhető.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <h4 className="font-medium">Admin adatok megadása</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Írd be az admin felhasználóneved és jelszavad. Ezeket kizárólag a főrendszergazdától kaphatsz.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <h4 className="font-medium">Biztonságos bejelentkezés</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Admin joggal teljes hozzáférésed van minden funkcióhoz, kezeld felelősséggel!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Application Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Navigáció a fő alkalmazásban
              </CardTitle>
              <CardDescription>
                Adminisztrátorként elérhető menük és azok funkcióinak részletes bemutatása
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
                      Általános áttekintés a rendszer állapotáról, statisztikákról és gyors műveletek.
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
                      Közlemények publikálása, üzenetek moderálása és kommunikáció kezelése.
                    </p>
                    <p className="text-xs text-orange-600">
                      Útvonal: /app/uzenofal
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <h5 className="font-medium">Stáb</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Stábok kezelése, szerepkörök hozzárendelése és csapatkezelés.
                    </p>
                    <p className="text-xs text-purple-600">
                      Útvonal: /app/stab
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                      <h5 className="font-medium">Naptár</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Teljes naptár áttekintés, események szerkesztése és ütközések kezelése.
                    </p>
                    <p className="text-xs text-indigo-600">
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
                      Forgatások létrehozása, szerkesztése, beosztások kezelése és teljes felügyelet.
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
                      Hiányzások felügyelete, igazolások moderálása és távollétkezelés.
                    </p>
                    <p className="text-xs text-green-600">
                      Útvonal: /app/tavollet
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Secondary Menu */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Adminisztrációs menük</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <h5 className="font-medium">Beállítások</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Rendszer globális beállításai, konfiguráció és admin jogosultságok.
                    </p>
                    <p className="text-xs text-gray-600">
                      Útvonal: /app/beallitasok
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Database className="h-5 w-5 text-emerald-600" />
                      <h5 className="font-medium">Adatbázis Admin</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Django admin felület elérése közvetlen adatbázis kezeléshez.
                    </p>
                    <p className="text-xs text-emerald-600">
                      Útvonal: /app/database-admin
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium">Segítség</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Teljes dokumentáció, útmutatók és fejlesztői információk.
                    </p>
                    <p className="text-xs text-blue-600">
                      Útvonal: /app/segitseg
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Django Admin Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-600" />
                Django Admin útmutató: Beosztás és közlemény létrehozása
              </CardTitle>
              <CardDescription>
                Hogyan adj hozzá új beosztásokat, közleményeket és egyéb adatokat a Django admin felületen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Figyelem!</h4>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  A Django admin közvetlen adatbázis hozzáférést biztosít. Csak akkor használd, ha pontosan tudod, mit csinálsz. Rossz adatok károsíthatják a rendszert!
                </p>
              </div>

              {/* Django Admin Access */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">1. Django Admin elérése</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <h4 className="font-medium">Adatbázis Admin menü</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Kattints az &quot;Adatbázis Admin&quot; menüpontra a bal oldali navigációban.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <h4 className="font-medium">Modell kiválasztása</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Válaszd ki a megfelelő modellt (pl. Beosztás, Közlemény) a listából.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Creating Assignments */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">2. Új beosztás (Assignment) létrehozása</h4>
                
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Lépések:</span>
                    </div>
                    <ol className="text-sm text-muted-foreground space-y-2 ml-6">
                      <li><strong>1.</strong> Menj az &quot;Adatbázis Admin&quot; → &quot;Beosztások&quot; menüpontra</li>
                      <li><strong>2.</strong> Kattints a &quot;Add Beosztas&quot; (Új hozzáadása) gombra</li>
                      <li><strong>3.</strong> Töltsd ki a kötelező mezőket:
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>• <strong>Forgatas:</strong> Válaszd ki, melyik forgatáshoz tartozik</li>
                          <li>• <strong>Szerepkor relaciok:</strong> Adj hozzá diák-szerepkör párokat</li>
                          <li>• <strong>Kesz:</strong> Jelöld be, ha a beosztás kész</li>
                        </ul>
                      </li>
                      <li><strong>4.</strong> Kattints a "Save" (Mentés) gombra</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Creating Announcements */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">3. Új közlemény (Announcement) létrehozása</h4>
                
                <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 border rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Lépések:</span>
                    </div>
                    <ol className="text-sm text-muted-foreground space-y-2 ml-6">
                      <li><strong>1.</strong> Menj az &quot;Adatbázis Admin&quot; → &quot;Közlemények&quot; menüpontra</li>
                      <li><strong>2.</strong> Kattints a &quot;Add Announcement&quot; (Új hozzáadása) gombra</li>
                      <li><strong>3.</strong> Töltsd ki a kötelező mezőket:
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>• <strong>Title:</strong> A közlemény címe</li>
                          <li>• <strong>Content:</strong> A közlemény teljes szövege</li>
                          <li>• <strong>Author:</strong> Ki írta a közleményt (általában te)</li>
                          <li>• <strong>Published:</strong> Jelöld be, ha látható legyen</li>
                          <li>• <strong>Important:</strong> Jelöld be, ha kiemelt közlemény</li>
                        </ul>
                      </li>
                      <li><strong>4.</strong> Kattints a "Save" (Mentés) gombra</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Other Common Tasks */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">4. Egyéb gyakori feladatok Django Adminban</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">👥 Felhasználó kezelés</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> Auth → Users
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új felhasználók hozzáadása</li>
                      <li>• Jelszavak visszaállítása</li>
                      <li>• Jogosultságok módosítása</li>
                      <li>• Felhasználók aktív/inaktív állapota</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">🎬 Forgatás kezelés</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Forgatas
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új forgatások létrehozása</li>
                      <li>• Helyszín és idő módosítása</li>
                      <li>• Forgatás törlése</li>
                      <li>• Státusz változtatása</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">🏫 Osztály kezelés</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Osztaly
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új osztályok hozzáadása</li>
                      <li>• Évfolyam és szekció beállítása</li>
                      <li>• Tanév hozzárendelése</li>
                      <li>• Osztály információk módosítása</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">🔧 Szerepkörök</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Szerepkor
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új szerepkörök létrehozása</li>
                      <li>• Szerepkör relációk kezelése</li>
                      <li>• Évhez kötött szerepkörök</li>
                      <li>• Szerepkör módosítások</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Adminisztrátori legjobb gyakorlatok
              </CardTitle>
              <CardDescription>
                Fontos szabályok és tippek a biztonságos adminisztrációhoz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">🚨 Kritikus szabályok</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Soha ne törölj adatokat a Django adminban, hacsak nem vagy 100%-ban biztos benne</li>
                  <li>• Mindig készíts adatbázis biztonsági mentést nagyobb változtatások előtt</li>
                  <li>• Ne oszd meg az admin jelszavad senkivel</li>
                  <li>• Ellenőrizd kétszer az adatokat mentés előtt</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Hasznos tippek</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Használd a keresést és szűrőket nagyobb adatmennyiség esetén</li>
                  <li>• A &quot;Change&quot; linkre kattintva szerkesztheted a meglévő elemeket</li>
                  <li>• A tömeges műveletek (Bulk actions) segítségével egyszerre több elemet kezelhetsz</li>
                  <li>• Az &quot;Add another&quot; gombbal gyorsan adhatsz hozzá több elemet</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Ellenőrző lista</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Minden kötelező mező ki van töltve?</li>
                  <li>• A kapcsolatok (foreign keys) helyesen vannak beállítva?</li>
                  <li>• A dátumok és időpontok megfelelőek?</li>
                  <li>• A felhasználók jogosultságai helyesek?</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Adminisztrátori Gyorshivatkozások</CardTitle>
              <CardDescription>Gyakran használt funkciók gyors elérése</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/iranyitopult" className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Irányítópult
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/database-admin" className="cursor-pointer">
                    <Database className="h-4 w-4 mr-2" />
                    Django Admin
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/app/forgatasok" className="cursor-pointer">
                    <Video className="h-4 w-4 mr-2" />
                    Forgatások
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/stab" className="cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    Stáb
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
