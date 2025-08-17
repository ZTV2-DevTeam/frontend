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
  User, 
  Video, 
  Calendar, 
  FileText, 
  MessageSquare, 
  ClipboardList,
  Award,
  BookOpen,
  Bell,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Star,
  Camera,
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

  const quickStartSteps = [
    {
      title: "1. Profil beállítása",
      description: "Alapvető információk és beállítások",
      icon: User,
      tasks: [
        "Profil adatok ellenőrzése",
        "Elérhetőségek frissítése",
        "Jelszó megváltoztatása",
        "Értesítési beállítások"
      ]
    },
    {
      title: "2. Forgatásokra jelentkezés",
      description: "Hogyan vegyél részt forgatásokon",
      icon: Video,
      tasks: [
        "Elérhető forgatások megtekintése",
        "Jelentkezés forgatásokra",
        "Beosztások ellenőrzése",
        "Forgatási szabályok megismerése"
      ]
    },
    {
      title: "3. Hiányzások kezelése",
      description: "Hiányzások igazolása és nyomon követése",
      icon: Calendar,
      tasks: [
        "Hiányzások megtekintése",
        "Igazolás beküldése",
        "Statisztikák ellenőrzése",
        "Értesítések figyelése"
      ]
    },
    {
      title: "4. Kommunikáció",
      description: "Kapcsolattartás és információszerzés",
      icon: MessageSquare,
      tasks: [
        "Üzenetek olvasása",
        "Osztályfőnökkel való kapcsolattartás",
        "Közlemények követése",
        "Segítségkérés"
      ]
    }
  ]

  const filmingRoles = [
    {
      role: "Kamerás",
      description: "Kamerahasználat és képi világ kialakítása",
      skills: ["Kamerahasználat", "Komponálás", "Fények ismerete", "Stabil kézitartás"],
      icon: Camera
    },
    {
      role: "Hangos",
      description: "Hangfelvétel és hang utómunka",
      skills: ["Mikrofon használata", "Hangtechnika", "Zajmentesség", "Szinkronizálás"],
      icon: Users
    },
    {
      role: "Rendező",
      description: "Forgatás irányítása és koordinálása",
      skills: ["Vezetői képességek", "Kreatívitás", "Kommunikáció", "Időbeosztás"],
      icon: Star
    },
    {
      role: "Szerkesztő",
      description: "Videó utómunka és összeállítás",
      skills: ["Vágóprogramok", "Színkorrekció", "Effektek", "Exportálás"],
      icon: BookOpen
    }
  ]

  const filmingTips = [
    {
      category: "Felkészülés",
      tips: [
        "Érkezz időben vagy korábban a forgatásra",
        "Hozd magaddal a szükséges eszközöket (jegyzetfüzet, toll)",
        "Öltözz megfelelően (kényelmes, mozgást nem akadályozó ruha)",
        "Tájékozódj a forgatás témájáról előre"
      ]
    },
    {
      category: "Forgatás alatt",
      tips: [
        "Figyelj a rendező utasításaira",
        "Legyél proaktív és segítőkész",
        "Tedd fel a kérdéseket, ha nem vagy biztos valamiben",
        "Tartsd be a forgatási szabályokat és határidőket"
      ]
    },
    {
      category: "Technikai tudnivalók",
      tips: [
        "Ismerd meg a használt eszközöket",
        "Kérdezz rá a beállításokra",
        "Figyelj a hangzavarokra",
        "Ellenőrizd a felvétel minőségét rendszeresen"
      ]
    },
    {
      category: "Utómunka",
      tips: [
        "Segítsd a felszerelések összepakolását",
        "Adj visszajelzést a forgatásról",
        "Jegyezd fel a tanulságokat",
        "Oszd meg ötleteidet a csapattal"
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
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Diák Útmutató
              </h1>
              <p className="text-muted-foreground">
                Minden, amit tudnod kell a rendszer használatáról és a forgatásokról
              </p>
            </div>
            <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
              <User className="w-3 h-3 mr-1" />
              Diák Szint
            </Badge>
          </div>

          <Tabs defaultValue="quickstart" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="quickstart">Gyors Kezdés</TabsTrigger>
              <TabsTrigger value="filming">Forgatás</TabsTrigger>
              <TabsTrigger value="tips">Tippek</TabsTrigger>
              <TabsTrigger value="troubleshooting">Hibaelhárítás</TabsTrigger>
            </TabsList>

            {/* Quick Start Tab */}
            <TabsContent value="quickstart" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Első Lépések Diákként</CardTitle>
                  <CardDescription>
                    Kezdd el a rendszer használatát ezekkel a lépésekkel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {quickStartSteps.map((step, index) => (
                      <Card key={index} className="border-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                              <step.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
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

            {/* Filming Tab */}
            <TabsContent value="filming" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Forgatási Szerepkörök</CardTitle>
                  <CardDescription>
                    Ismerd meg a különböző pozíciókat és azok követelményeit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {filmingRoles.map((role, index) => (
                      <Card key={index} className="border">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <role.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            {role.role}
                          </CardTitle>
                          <CardDescription>{role.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Szükséges készségek:</div>
                            <div className="flex flex-wrap gap-1">
                              {role.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tips Tab */}
            <TabsContent value="tips" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Forgatási Tippek és Tanácsok</CardTitle>
                  <CardDescription>
                    Hasznos ötletek a sikeres forgatásokhoz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {filmingTips.map((category, index) => (
                      <AccordionItem key={index} value={`category-${index}`}>
                        <AccordionTrigger className="text-left">
                          <span className="font-semibold">{category.category}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {category.tips.map((tip, tipIndex) => (
                              <div key={tipIndex} className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{tip}</span>
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
                    Mit tegyél, ha problémába ütközöl
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="login">
                      <AccordionTrigger>Bejelentkezési problémák</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Elfelejtettem a jelszavam</div>
                          <div className="text-sm text-muted-foreground">
                            Használd az "Elfelejtett jelszó" funkciót a bejelentkezési képernyőn, vagy kérd az osztályfőnököd segítségét.
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Nem tudok bejelentkezni</div>
                          <div className="text-sm text-muted-foreground">
                            Ellenőrizd a felhasználóneved és jelszavad helyességét. Ha továbbra sem működik, fordulj az osztályfőnöködhöz.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="filming-issues">
                      <AccordionTrigger>Forgatási problémák</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Nem tudok jelentkezni forgatásra</div>
                          <div className="text-sm text-muted-foreground">
                            Ellenőrizd, hogy van-e még hely, és hogy megfelelő jogosultságod van-e. Kérdezd meg az osztályfőnöködet.
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Nem kaptam értesítést a forgatásról</div>
                          <div className="text-sm text-muted-foreground">
                            Ellenőrizd az értesítési beállításaidat, és figyelj a rendszerbe belépéskor megjelenő üzenetekre.
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Nem tudok részt venni egy forgatáson</div>
                          <div className="text-sm text-muted-foreground">
                            Minél hamarabb jelezd az osztályfőnöködnek vagy a forgatásvezetőnek, hogy mást tudjanak beosztani.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="technical">
                      <AccordionTrigger>Technikai problémák</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Az oldal lassan tölt be</div>
                          <div className="text-sm text-muted-foreground">
                            Ez egy ismert probléma a BETA verzióban. Próbálj meg frissíteni az oldalt, vagy kicsit később visszatérni.
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Nem működik egy funkció</div>
                          <div className="text-sm text-muted-foreground">
                            Először próbálj meg frissíteni az oldalt. Ha továbbra sem működik, jelezd az osztályfőnöködnek.
                          </div>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <div className="font-medium text-sm mb-1">Hiba üzenet jelent meg</div>
                          <div className="text-sm text-muted-foreground">
                            Készíts képernyőképet a hibaüzenetről, és küldd el az osztályfőnöködnek vagy a rendszergazdának.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hasznos Linkek</CardTitle>
              <CardDescription>Gyakran használt funkciók gyors elérése</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/forgatasok">
                    <Video className="h-4 w-4 mr-2" />
                    Forgatások
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/hianyzasok">
                    <Calendar className="h-4 w-4 mr-2" />
                    Hiányzásaim
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/uzenetek">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Üzenetek
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
