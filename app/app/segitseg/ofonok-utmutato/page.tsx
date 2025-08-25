"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useUserRole } from "@/contexts/user-role-context"
import { 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  Video, 
  FileText, 
  MessageSquare, 
  Calendar,
  UserCheck,
  BarChart3,
  Bell,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Settings,
  FileCheck,
  Home,
  LogIn,
  Eye,
  TicketCheck,
  Info
} from "lucide-react"

export default function ClassTeacherGuidePage() {
  const { currentRole } = useUserRole()

  // Check if user has class teacher access
  if (currentRole !== 'class-teacher' && currentRole !== 'admin') {
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
                  Ez az útmutató kizárólag osztályfőnökök számára érhető el.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Ön nem rendelkezik jogosultsággal az osztályfőnöki útmutató megtekintéséhez.</p>
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
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Osztályfőnöki Útmutató
              </h1>
              <p className="text-muted-foreground">
                Teljes körű útmutató minden menühöz és funkcióhoz
              </p>
            </div>
            <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
              <GraduationCap className="w-3 h-3 mr-1" />
              Osztályfőnöki Szint
            </Badge>
          </div>

          {/* Navigation Guide for Class Teachers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Navigáció az osztályfőnöki rendszerben
              </CardTitle>
              <CardDescription>
                Az osztályfőnökök számára elérhető menüpontok és funkciók részletes bemutatása
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Menu Items */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Főmenü – Irányítópult
                </h4>
                
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Home className="h-6 w-6 text-blue-600" />
                    <h5 className="font-semibold text-lg">Irányítópult</h5>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Útvonal:</strong> /app/iranyitopult
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h6 className="font-medium mb-2">Megtekinthető információk:</h6>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Összefoglaló statisztikák az osztályról</li>
                        <li>• Közelgő forgatások és események</li>
                        <li>• Függőben lévő igazolások száma</li>
                        <li>• Új üzenetek és közlemények</li>
                        <li>• Gyors hivatkozások a legfontosabb funkciókhoz</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h6 className="font-medium mb-2">Elérhető műveletek:</h6>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Gyors áttekintés a napi feladatokról</li>
                        <li>• Közvetlen navigáció a fontos menüpontokra</li>
                        <li>• Értesítések és figyelmeztetések megtekintése</li>
                        <li>• Rendszer státusz és kapcsolati információk elérése</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Class Menu */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Osztályom menü – Igazolások kezelése
                </h4>
                
                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-3 mb-3">
                    <TicketCheck className="h-6 w-6 text-green-600" />
                    <h5 className="font-semibold text-lg">Igazolások</h5>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Útvonal:</strong> /app/igazolasok
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h6 className="font-medium mb-2">Megtekinthető információk:</h6>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Beérkezett igazolási kérelmek</li>
                        <li>• Igazolások státusza (Függőben, Jóváhagyva, Elutasítva)</li>
                        <li>• Hiányzás dátuma, időtartama és oka</li>
                        <li>• Diák neve és osztálya</li>
                        <li>• Csatolt dokumentumok és fájlok</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h6 className="font-medium mb-2">Elérhető műveletek:</h6>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• <strong>Igazolások jóváhagyása:</strong> Elfogadhatja a beérkezett kérelmeket</li>
                        <li>• <strong>Igazolások elutasítása:</strong> Indoklással elutasíthatja a kérelmeket</li>
                        <li>• <strong>Részletek megtekintése:</strong> Minden adat és csatolmány ellenőrzése</li>
                        <li>• <strong>Szűrés és keresés:</strong> Dátum, diák vagy státusz alapján</li>
                        <li>• <strong>Exportálás:</strong> Jelentések készítése a hiányzásokról</li>
                        <li>• <strong>Tömeges műveletek:</strong> Több igazolás egyidejű kezelése</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Secondary Menu */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Alsó menü – Beállítások és Súgó</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <h5 className="font-medium">Beállítások</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Útvonal:</strong> /app/beallitasok
                    </p>
                    
                    <div className="space-y-2">
                      <div>
                        <h6 className="font-medium text-sm">Megtekinthető információk:</h6>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-3">
                          <li>• Profil adatok és elérhetőségek</li>
                          <li>• Jelszó módosítási lehetőség</li>
                          <li>• Értesítési beállítások</li>
                          <li>• Rendszer preferenciák</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-sm">Elérhető műveletek:</h6>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-3">
                          <li>• Személyes adatok módosítása</li>
                          <li>• Biztonságos jelszó beállítása</li>
                          <li>• E-mail értesítések be- vagy kikapcsolása</li>
                          <li>• Felhasználói preferenciák testreszabása</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Info className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium">Súgó</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Útvonal:</strong> /app/segitseg
                    </p>
                    
                    <div className="space-y-2">
                      <div>
                        <h6 className="font-medium text-sm">Megtekinthető információk:</h6>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-3">
                          <li>• Általános tudásbázis és GYIK</li>
                          <li>• Specifikus osztályfőnöki útmutatók</li>
                          <li>• Rendszer dokumentáció</li>
                          <li>• Kapcsolati információk</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-sm">Elérhető műveletek:</h6>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-3">
                          <li>• Segítség keresése problémák esetén</li>
                          <li>• Útmutatók böngészése</li>
                          <li>• Kapcsolatfelvétel a támogatással</li>
                          <li>• A rendszer funkcióinak megismerése</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Tips and Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Hasznos tippek a hatékony munkavégzéshez
              </CardTitle>
              <CardDescription>
                Praktikus tanácsok a rendszer optimális használatához
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">📅 Tippek és trükkök</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Használja a tömeghes kijelölés funkciót, hogy a hasonló kérelmeket gyorsan el tudja fogadni</li>
                  <li>• A hiányzások jelenleg Iskolaérdekű távollétnek minősülnek, automatikusan generálás jellegéből adódóan ezek hitelesek. Önnek van lehetősége ezeket elutasítani, azonban ezt kérem csak indokolt esetben tegye! Kérdések esetén keresse a média tagozatot vezető tanárt!</li>
                </ul>
              </div>

            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hasznos linkek</CardTitle>
              <CardDescription>Gyakran használt funkciók gyors elérése</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/iranyitopult" className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Irányítópult
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
