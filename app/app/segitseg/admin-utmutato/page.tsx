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
                  Ez a dokumentáció kizárólag rendszergazdai jogosultságokkal rendelkező felhasználók számára elérhető.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nincs megfelelő jogosultsága a rendszergazdai dokumentáció megtekintéséhez.</p>
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
                Rendszergazdai Dokumentáció
              </h1>
              <p className="text-muted-foreground">
                Átfogó dokumentáció a rendszergazdai funkciók és a Django adminisztrációs felület használatához
              </p>
            </div>
            <Badge variant="outline" className="text-sm bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
              <Shield className="w-3 h-3 mr-1" />
              Adminisztrátori Hozzáférés
            </Badge>
          </div>

          {/* Main Application Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Alkalmazás navigációs rendszere
              </CardTitle>
              <CardDescription>
                Rendszergazdák számára elérhető menüpontok és azok funkcióinak részletes ismertetése
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Menu Items */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Főmenü elemei
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Home className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium">Irányítópult</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Rendszerállapot áttekintése, statisztikai adatok megjelenítése és gyors műveletek végrehajtása.
                    </p>
                    <p className="text-xs text-blue-600">
                      Navigációs útvonal: /app/iranyitopult
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="h-5 w-5 text-orange-600" />
                      <h5 className="font-medium">Üzenőfal</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Közlemények publikálása, üzenetek moderálása és kommunikációs tartalmak kezelése.
                    </p>
                    <p className="text-xs text-orange-600">
                      Navigációs útvonal: /app/uzenofal
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <h5 className="font-medium">Stáb</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Stábtagok kezelése, szerepkörök hozzárendelése és csapatszervezési feladatok koordinálása.
                    </p>
                    <p className="text-xs text-purple-600">
                      Navigációs útvonal: /app/stab
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                      <h5 className="font-medium">Naptár</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Naptár áttekintése, események szerkesztése és időpontütközések kezelése.
                    </p>
                    <p className="text-xs text-indigo-600">
                      Navigációs útvonal: /app/naptar
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Activity Menu */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Tevékenységi menü
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <BellDot className="h-5 w-5 text-red-600" />
                      <h5 className="font-medium">Forgatások</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Forgatások létrehozása, szerkesztése, beosztások kezelése és teljes felügyeleti tevékenység.
                    </p>
                    <p className="text-xs text-red-600">
                      Navigációs útvonal: /app/forgatasok
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <TreePalm className="h-5 w-5 text-green-600" />
                      <h5 className="font-medium">Távollét</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Hiányzások felügyelete, igazolások moderálása és távollétkezelési feladatok koordinálása.
                    </p>
                    <p className="text-xs text-green-600">
                      Navigációs útvonal: /app/tavollet
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Secondary Menu */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Adminisztrációs menüpontok</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <h5 className="font-medium">Beállítások</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Rendszer globális beállításainak kezelése, konfigurációs paraméterek és adminisztrátori jogosultságok.
                    </p>
                    <p className="text-xs text-gray-600">
                      Navigációs útvonal: /app/beallitasok
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Database className="h-5 w-5 text-emerald-600" />
                      <h5 className="font-medium">Adatbázis Admin</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Django adminisztrációs felület elérése közvetlen adatbázis-kezelési műveletekhez.
                    </p>
                    <p className="text-xs text-emerald-600">
                      Navigációs útvonal: /app/database-admin
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium">Segítség</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Részletes dokumentáció, útmutatók és fejlesztői támogatási információk.
                    </p>
                    <p className="text-xs text-blue-600">
                      Navigációs útvonal: /app/segitseg
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
                Django adminisztrációs útmutató: Adatok kezelése
              </CardTitle>
              <CardDescription>
                Hogyan adj hozzá és módosíts adatokat a Django admin felületen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Figyelmeztetés</h4>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  A Django admin felület közvetlen adatbázis hozzáférést ad. Csak akkor használd, ha tudod mit csinálsz. Hibás adatok károsíthatják a rendszert!
                </p>
              </div>

              {/* Django Admin Core Features */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Django Admin Központi Funkciók</h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Az adatbázis közvetlen szerkesztése, tömeges importálás és exportálás a Django Admin felületen érhető el.
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    <a href="/app/database-admin" target="_blank" className="cursor-pointer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Django Admin megnyitása
                    </a>
                  </Button>
                </div>
              </div>

              {/* Critical Model Relationships */}
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-800 dark:text-red-200">Kritikus Kapcsolatok</h4>
                </div>
                <div className="space-y-3 text-sm text-red-700 dark:text-red-300">
                  <div>
                    <strong>🔗 Felhasználó ↔ Profil kapcsolat:</strong>
                    <p className="mt-1">
                      A felhasználók nem tudnak bejelentkezni vagy nem lehet őket hivatkozni a megfelelő Profil rekord nélkül. 
                      Minden User objektumhoz kötelező egy kapcsolódó Profile rekord létrehozása!
                    </p>
                  </div>
                  <div>
                    <strong>🎬 Forgatás ↔ Beosztás kapcsolat:</strong>
                    <p className="mt-1">
                      A beosztások automatikusan generálják a hiányzásokat (Absence). A forgatás adatok módosítása hatással van az összes kapcsolódó hiányzásra.
                    </p>
                  </div>
                  <div>
                    <strong>🏫 Osztály ↔ Tanév kapcsolat:</strong>
                    <p className="mt-1">
                      Az osztályok tanév hozzárendelése nélkül nem jelennek meg megfelelően. A Tanév rekordok a dátumok alapján határozzák meg az aktív időszakokat.
                    </p>
                  </div>
                </div>
              </div>

              {/* Django Admin Access */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">1. Django admin elérése</h4>
                
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
                <h4 className="font-semibold text-lg">2. Új beosztás létrehozása</h4>
                
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Lépések:</span>
                    </div>
                    <ol className="text-sm text-muted-foreground space-y-2 ml-6">
                      <li><strong>1.</strong> Menj az &quot;API&quot; → &quot;Beosztások&quot; menüpontra</li>
                      <li><strong>2.</strong> Kattints a &quot;Beosztás hozzáadása&quot; gombra</li>
                      <li><strong>3.</strong> Töltsd ki a mezőket:
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>• <strong>Kész:</strong> Jelöld be, ha a beosztás végleges</li>
                          <li>• <strong>Szerepkör relációk:</strong> Add hozzá a diák-szerepkör párokat</li>
                          <li>• <strong>Szerző:</strong> Válaszd ki, ki készítette</li>
                          <li>• <strong>Tanév:</strong> Válaszd ki a megfelelő tanévet</li>
                          <li>• <strong>Forgatás:</strong> Válaszd ki, melyik forgatáshoz tartozik</li>
                        </ul>
                      </li>
                      <li><strong>4.</strong> Kattints a &quot;Mentés&quot; gombra</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Creating Announcements */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">3. Új közlemény létrehozása</h4>
                
                <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 border rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Lépések:</span>
                    </div>
                    <ol className="text-sm text-muted-foreground space-y-2 ml-6">
                      <li><strong>1.</strong> Menj az &quot;API&quot; → &quot;Közlemények&quot; menüpontra</li>
                      <li><strong>2.</strong> Kattints a &quot;Közlemény hozzáadása&quot; gombra</li>
                      <li><strong>3.</strong> Töltsd ki a mezőket:
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>• <strong>Szerző:</strong> Válaszd ki, ki írja a közleményt</li>
                          <li>• <strong>Cím:</strong> A közlemény címe</li>
                          <li>• <strong>Tartalom:</strong> A közlemény teljes szövege</li>
                          <li>• <strong>Címzettek:</strong> Válaszd ki, kik kapják meg (üresen hagyva mindenki kapja)</li>
                        </ul>
                      </li>
                      <li><strong>4.</strong> Kattints a &quot;Mentés&quot; gombra</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Other Common Tasks */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">4. További gyakori feladatok Django adminban</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">👥 Felhasználók kezelése</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> Hitelesítés és engedélyezés → Felhasználók
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új felhasználók létrehozása</li>
                      <li>• Jelszavak megváltoztatása</li>
                      <li>• Jogosultságok beállítása</li>
                      <li>• Felhasználók aktív/inaktív állapota</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">📝 Profilok kezelése</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Profilok
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Telefonszám hozzáadása</li>
                      <li>• Stáb és osztály beállítása</li>
                      <li>• Admin típus megadása (developer, teacher, system_admin)</li>
                      <li>• Különleges szerepkör beállítása (production_leader)</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">🎬 Forgatások kezelése</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Forgatások
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új forgatások létrehozása</li>
                      <li>• Dátum, idő és helyszín módosítása</li>
                      <li>• Riporter kijelölése</li>
                      <li>• Típus beállítása (kacsa, rendezvény, egyéb)</li>
                      <li>• Felszerelések hozzárendelése</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">🏫 Osztályok kezelése</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Osztályok
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új osztályok hozzáadása</li>
                      <li>• Indulási év és szekció beállítása</li>
                      <li>• Tanév hozzárendelése</li>
                      <li>• Osztályfőnökök kijelölése</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">🔧 Szerepkörök</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Szerepkörök
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új szerepkörök létrehozása (pl. Riporter, Operatőr)</li>
                      <li>• Szerepkör név és év megadása</li>
                      <li>• Szerepkör relációk kezelése</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">📅 Tanévek kezelése</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Tanévek
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új tanévek létrehozása</li>
                      <li>• Kezdő és záró dátum beállítása</li>
                      <li>• Osztályok hozzárendelése tanévhez</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">🤝 Partnerek kezelése</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Partnerek
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Új partnerek hozzáadása</li>
                      <li>• Név, cím és intézmény típus beállítása</li>
                      <li>• Kapcsolattartók hozzáadása</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">📻 Rádiós stábok (9F diákoknak)</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Útvonal:</strong> API → Rádiós stábok
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• A1, A2, B3, B4 csapatok kezelése</li>
                      <li>• Rádiós összejátszások ütemezése</li>
                      <li>• Résztvevők hozzárendelése</li>
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
                Adminisztrátori szabályok és tippek
              </CardTitle>
              <CardDescription>
                Fontos szabályok és hasznos tanácsok a biztonságos adminisztrációhoz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">🚨 Kritikus szabályok</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Soha ne törölj adatokat a Django adminban, hacsak nem vagy 100%-ban biztos benne</li>
                  <li>• Mindig készíts adatbázis mentést nagyobb változtatások előtt</li>
                  <li>• Ne oszd meg az admin jelszavadat senkivel</li>
                  <li>• Ellenőrizd kétszer az adatokat mentés előtt</li>
                  <li>• Figyelj a kötelező mezőkre (piros csillag *)</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Hasznos tippek</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Használd a keresést és szűrőket nagyobb adatmennyiség esetén</li>
                  <li>• A &quot;Módosítás&quot; linkre kattintva szerkesztheted a meglévő elemeket</li>
                  <li>• A tömeges műveletek segítségével egyszerre több elemet kezelhetsz</li>
                  <li>• Az &quot;Újabb hozzáadása&quot; gombbal gyorsan adhatsz hozzá több elemet</li>
                  <li>• A &quot;Történet&quot; fülön láthatod, ki mit változtatott</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Ellenőrző lista</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Minden kötelező mező ki van töltve?</li>
                  <li>• A kapcsolatok (dropdown menük) helyesen vannak beállítva?</li>
                  <li>• A dátumok és időpontok megfelelőek?</li>
                  <li>• A felhasználók jogosultságai helyesek?</li>
                  <li>• A beosztás &quot;Kész&quot; jelölése megfelelő?</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🔍 Django admin tippek</h4>
                <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• A magyar felület miatt a menük magyarul jelennek meg</li>
                  <li>• Automatikus mentés nincs - mindig kattints a &quot;Mentés&quot; gombra</li>
                  <li>• Ha egy kapcsolódó elemet szeretnél létrehozni, használd a &quot;+&quot; gombot</li>
                  <li>• A &quot;Mentés és újabb hozzáadása&quot; gombbal folytathatod a munkát</li>
                  <li>• A hiányzások automatikusan létrejönnek a beosztások alapján</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Adminisztrátori gyorselérési funkciók</CardTitle>
              <CardDescription>Gyakran használt rendszerfunkciók közvetlen elérhetősége</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/app/iranyitopult" className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Irányítópult
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/app/database-admin" className="cursor-pointer">
                    <Database className="h-4 w-4 mr-2" />
                    Django Admin
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/app/forgatasok" className="cursor-pointer">
                    <Video className="h-4 w-4 mr-2" />
                    Forgatások
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/app/stab" className="cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    Stáb
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
