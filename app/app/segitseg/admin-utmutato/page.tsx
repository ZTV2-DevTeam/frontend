"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useUserRole } from "@/contexts/user-role-context"
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
  AlertTriangle
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

  const quickStartSteps = [
    {
      title: "1. Rendszer konfigurálása",
      description: "Alapvető beállítások és adatok feltöltése",
      icon: Settings,
      tasks: [
        "Konfiguráció varázsló futtatása",
        "Osztályok és szekciók létrehozása",
        "Stábok és szerepkörök beállítása",
        "Tanárok és diákok importálása"
      ]
    },
    {
      title: "2. Felhasználó kezelése",
      description: "Jogosultságok és szerepkörök beállítása",
      icon: Users,
      tasks: [
        "Felhasználói szerepkörök kiosztása",
        "Jogosultságok ellenőrzése",
        "Új felhasználók hozzáadása",
        "Regisztrációs linkek generálása"
      ]
    },
    {
      title: "3. Forgatások kezelése",
      description: "Forgatási események és beosztások",
      icon: Video,
      tasks: [
        "Új forgatás létrehozása",
        "Stáb beosztása forgatásokra",
        "Felszerelések hozzárendelése",
        "Forgatási naptár kezelése"
      ]
    },
    {
      title: "4. Kommunikáció",
      description: "Üzenetek és értesítések kezelése",
      icon: Bell,
      tasks: [
        "Közlemények közzététele",
        "Értesítések küldése",
        "Üzenőfal moderálása",
        "Visszajelzések kezelése"
      ]
    }
  ]

  const adminTasks = [
    {
      category: "Felhasználó kezelés",
      items: [
        { task: "Új felhasználó hozzáadása", location: "Database Admin → Users" },
        { task: "Szerepkörök módosítása", location: "Database Admin → User Permissions" },
        { task: "Jelszó visszaállítása", location: "Database Admin → Users → Edit" },
        { task: "Felhasználó deaktiválása", location: "Database Admin → Users → Active field" }
      ]
    },
    {
      category: "Forgatások",
      items: [
        { task: "Új forgatás létrehozása", location: "Forgatások → Új forgatás" },
        { task: "Beosztás készítése", location: "Forgatások → [Forgatás] → Beosztás" },
        { task: "Felszerelés hozzárendelése", location: "Database Admin → Equipment" },
        { task: "Forgatás törlése/módosítása", location: "Database Admin → Filming Sessions" }
      ]
    },
    {
      category: "Rendszer adminisztráció",
      items: [
        { task: "Adatbázis backup", location: "Kérjen segítséget a fejlesztőktől" },
        { task: "Rendszer frissítése", location: "Automatikus - szerver oldali" },
        { task: "Hibajelentések áttekintése", location: "Fejlesztői eszközök" },
        { task: "Statisztikák megtekintése", location: "Irányítópult → Jelentések" }
      ]
    }
  ]

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
                Adminisztrátori Útmutató
              </h1>
              <p className="text-muted-foreground">
                Rendszergazdai feladatok és beállítások részletes útmutatója
              </p>
            </div>
            <Badge variant="outline" className="text-sm bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
              <Shield className="w-3 h-3 mr-1" />
              Adminisztrátori Szint
            </Badge>
          </div>

          <Tabs defaultValue="quickstart" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quickstart">Gyors Kezdés</TabsTrigger>
              <TabsTrigger value="tasks">Feladatok</TabsTrigger>
              <TabsTrigger value="troubleshooting">Hibaelhárítás</TabsTrigger>
            </TabsList>

            {/* Quick Start Tab */}
            <TabsContent value="quickstart" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Első Lépések Adminisztrátorként</CardTitle>
                  <CardDescription>
                    Kövesse ezt a lépéssor az optimális rendszer beállításhoz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {quickStartSteps.map((step, index) => (
                      <Card key={index} className="border-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                              <step.icon className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            {step.title}
                          </CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {step.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Adminisztrátori Feladatok</CardTitle>
                  <CardDescription>
                    Gyakori adminisztrátori műveletek és azok helye a rendszerben
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {adminTasks.map((category, index) => (
                      <AccordionItem key={index} value={`category-${index}`}>
                        <AccordionTrigger className="text-left">
                          <span className="font-semibold">{category.category}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {category.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{item.task}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    📍 {item.location}
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5" />
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Troubleshooting Tab */}
            <TabsContent value="troubleshooting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gyakori Problémák és Megoldások</CardTitle>
                  <CardDescription>
                    Tipikus hibák és azok megoldási módjai
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="users">
                      <AccordionTrigger>Felhasználói problémák</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Felhasználó nem tud bejelentkezni</div>
                          <div className="text-sm text-muted-foreground">
                            1. Ellenőrizze a Database Admin → Users menüben, hogy aktív-e a felhasználó<br />
                            2. Resetelj jelszót, ha szükséges<br />
                            3. Ellenőrizd a jogosultságokat
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Nincs megfelelő jogosultsága</div>
                          <div className="text-sm text-muted-foreground">
                            Database Admin → Users → [Felhasználó] → Groups és User permissions mezők beállítása
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="filming">
                      <AccordionTrigger>Forgatási problémák</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Nem lehet forgatást létrehozni</div>
                          <div className="text-sm text-muted-foreground">
                            Ellenőrizd, hogy minden kötelező mező ki van-e töltve, és a felhasználónak van-e jogosultsága
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Beosztás nem működik</div>
                          <div className="text-sm text-muted-foreground">
                            Ideiglenesen a Database Admin felületen keresztül kell elvégezni a beosztásokat
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="system">
                      <AccordionTrigger>Rendszer problémák</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Lassú betöltés</div>
                          <div className="text-sm text-muted-foreground">
                            Ez egy ismert probléma a BETA verzióban. A fejlesztők aktívan dolgoznak a megoldáson.
                          </div>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Adatvesztés vagy kritikus hiba</div>
                          <div className="text-sm text-muted-foreground">
                            Azonnal vedd fel a kapcsolatot a fejlesztőkkel: fejlesztes@szlgbp.hu
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Gyors Linkek</CardTitle>
              <CardDescription>Hasznos linkek adminisztrátorok számára</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/database-admin" target="_blank">
                    <Database className="h-4 w-4 mr-2" />
                    Database Admin
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/konfiguracio">
                    <Settings className="h-4 w-4 mr-2" />
                    Konfiguráció Varázsló
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/segitseg">
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
