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
  FileCheck
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
                  Ez az útmutató csak osztályfőnökök számára elérhető.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nincs jogosultságod az osztályfőnöki útmutató megtekintéséhez.</p>
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
      title: "1. Osztály áttekintése",
      description: "Diákjaid és osztályod állapotának megismerése",
      icon: Users,
      tasks: [
        "Osztály összetételének áttekintése",
        "Diákok elérhetőségeinek ellenőrzése",
        "Aktuális statisztikák megtekintése",
        "Értesítési beállítások konfigurálása"
      ]
    },
    {
      title: "2. Hiányzások kezelése",
      description: "Igazolások áttekintése és jóváhagyása",
      icon: ClipboardCheck,
      tasks: [
        "Beérkező igazolások áttekintése",
        "Igazolások jóváhagyása/elutasítása",
        "Hiányzási statisztikák követése",
        "Szülők értesítése szükség esetén"
      ]
    },
    {
      title: "3. Forgatási koordináció",
      description: "Diákok forgatási tevékenységeinek nyomon követése",
      icon: Video,
      tasks: [
        "Forgatási beosztások ellenőrzése",
        "Diákok részvételének koordinálása",
        "Hiányzások összehangolása forgatásokkal",
        "Teljesítmény értékelése"
      ]
    },
    {
      title: "4. Kommunikáció",
      description: "Hatékony kapcsolattartás diákokkal és szülőkkel",
      icon: MessageSquare,
      tasks: [
        "Üzenetek küldése az osztálynak",
        "Egyéni megbeszélések szervezése",
        "Szülői értekezletek koordinálása",
        "Visszajelzések gyűjtése"
      ]
    }
  ]

  const classTeacherTasks = [
    {
      category: "Hiányzások kezelése",
      items: [
        { task: "Igazolások áttekintése", location: "Igazolások → Beérkező kérések", description: "Új igazolási kérések ellenőrzése és jóváhagyása" },
        { task: "Hiányzási statisztikák", location: "Irányítópult → Osztály statisztikák", description: "Osztály hiányzási trendjének követése" },
        { task: "Egyéni hiányzások", location: "Diákok → [Diák] → Hiányzások", description: "Konkrét diák hiányzásainak részletes áttekintése" },
        { task: "Havi jelentések", location: "Jelentések → Hiányzási összesítő", description: "Havi összesítő jelentések generálása" }
      ]
    },
    {
      category: "Osztálykezelés",
      items: [
        { task: "Osztály áttekintése", location: "Irányítópult → Osztályom", description: "Összes diák aktuális státuszának megtekintése" },
        { task: "Diák profilok", location: "Diákok → [Diák] → Profil", description: "Egyéni diák adatok és elérhetőségek ellenőrzése" },
        { task: "Teljesítmény követése", location: "Diákok → [Diák] → Forgatások", description: "Diákok forgatási aktivitásának nyomon követése" },
        { task: "Kapcsolattartás", location: "Üzenetek → Osztály", description: "Üzenetek küldése az egész osztálynak" }
      ]
    },
    {
      category: "Forgatási koordináció",
      items: [
        { task: "Forgatási beosztások", location: "Forgatások → Aktuális", description: "Diákok aktuális forgatási beosztásainak áttekintése" },
        { task: "Részvétel nyomon követése", location: "Forgatások → Résztvevők", description: "Ki vesz részt melyik forgatáson" },
        { task: "Ütközések ellenőrzése", location: "Naptár → Osztály nézet", description: "Forgatások és hiányzások közötti ütközések" },
        { task: "Teljesítmény értékelése", location: "Diákok → [Diák] → Értékelés", description: "Forgatási teljesítmény dokumentálása" }
      ]
    }
  ]

  const commonIssues = [
    {
      category: "Igazolások",
      problems: [
        {
          issue: "Diák nem kapta meg az igazolás állapotáról szóló értesítést",
          solution: "Az értesítések automatikusak. Ellenőrizd, hogy a diák email címe helyes-e a rendszerben."
        },
        {
          issue: "Hibás igazolási kérés érkezett",
          solution: "Utasítsd el az igazolást megjegyzéssel, hogy mit kell módosítani, és kérd újra beküldeni."
        },
        {
          issue: "Több igazolás ugyanarra a napra",
          solution: "Ellenőrizd az összes kérést, és csak a valóban indokolt igazolásokat hagyd jóvá."
        }
      ]
    },
    {
      category: "Forgatási koordináció",
      problems: [
        {
          issue: "Diák nem jelent meg forgatáson",
          solution: "Ellenőrizd, hogy van-e bejegyzett hiányzása, és szükség esetén egyeztess a forgatásvezetővel."
        },
        {
          issue: "Ütközés forgatás és tanóra között",
          solution: "Koordinálj a szaktanárral és a forgatásvezetővel a legoptimálisabb megoldás érdekében."
        },
        {
          issue: "Diák túlterhelt forgatásokkal",
          solution: "Beszélj a diákkal a prioritásokról, és szükség esetén koordinálj a forgatásvezetőkkel."
        }
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
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Osztályfőnöki Útmutató
              </h1>
              <p className="text-muted-foreground">
                Osztálykezelés, hiányzások és forgatási koordináció útmutatója
              </p>
            </div>
            <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
              <GraduationCap className="w-3 h-3 mr-1" />
              Osztályfőnöki Szint
            </Badge>
          </div>

          <Tabs defaultValue="quickstart" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="quickstart">Gyors Kezdés</TabsTrigger>
              <TabsTrigger value="tasks">Feladatok</TabsTrigger>
              <TabsTrigger value="coordination">Koordináció</TabsTrigger>
              <TabsTrigger value="troubleshooting">Hibaelhárítás</TabsTrigger>
            </TabsList>

            {/* Quick Start Tab */}
            <TabsContent value="quickstart" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Első Lépések Osztályfőnökként</CardTitle>
                  <CardDescription>
                    Kezdd el az osztálykezelést ezekkel a alapvető lépésekkel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {quickStartSteps.map((step, index) => (
                      <Card key={index} className="border-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <step.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
                  <CardTitle>Osztályfőnöki Feladatok</CardTitle>
                  <CardDescription>
                    Gyakori osztályfőnöki műveletek és azok helye a rendszerben
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {classTeacherTasks.map((category, index) => (
                      <AccordionItem key={index} value={`category-${index}`}>
                        <AccordionTrigger className="text-left">
                          <span className="font-semibold">{category.category}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {category.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="font-medium text-sm">{item.task}</div>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5" />
                                </div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  📍 {item.location}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.description}
                                </div>
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

            {/* Coordination Tab */}
            <TabsContent value="coordination" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Forgatási Koordináció</CardTitle>
                  <CardDescription>
                    Hogyan koordináld a diákok forgatási tevékenységeit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          Napi Koordináció
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Reggeli beosztások ellenőrzése</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Hiányzók azonosítása</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Pótlások szervezése</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Visszajelzések dokumentálása</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <BarChart3 className="h-5 w-5 text-green-600" />
                          Heti/Havi Értékelés
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Részvételi statisztikák</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Teljesítmény értékelése</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Fejlődési területek azonosítása</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Szülői tájékoztatás</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                        <FileCheck className="h-5 w-5" />
                        Igazolások Best Practices
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-blue-700 dark:text-blue-300">
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong>Gyors jóváhagyás:</strong> Az igazolások automatikusan generálódnak a rendszerben, csak akkor jelezz vissza, ha a KRÉTA rendszerbe már naplóztad az igazolást.
                        </div>
                        <div>
                          <strong>Hitelesség:</strong> Minden igazolás hiteles, amely megjelenik a rendszerben, mivel kizárólag adminisztrátori jogosultsággal lehet módosítani a forgatásokat.
                        </div>
                        <div>
                          <strong>Kommunikáció:</strong> A rendszer automatikusan értesíti a diákokat az igazolás státuszváltozásáról.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Troubleshooting Tab */}
            <TabsContent value="troubleshooting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gyakori Problémák és Megoldások</CardTitle>
                  <CardDescription>
                    Tipikus osztályfőnöki problémák és azok megoldási módjai
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {commonIssues.map((category, index) => (
                      <AccordionItem key={index} value={`issue-category-${index}`}>
                        <AccordionTrigger className="text-left">
                          <span className="font-semibold">{category.category}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {category.problems.map((problem, problemIndex) => (
                              <div key={problemIndex} className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <div className="font-medium text-sm mb-2 text-blue-800 dark:text-blue-200">
                                  ❓ {problem.issue}
                                </div>
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                  <span className="font-medium">Megoldás:</span> {problem.solution}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <Separator className="my-4" />

                  <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                        <Bell className="h-5 w-5" />
                        Mikor kérj segítséget?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-orange-700 dark:text-orange-300">
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Technikai problémák:</strong> Ha a rendszer nem működik megfelelően, fordulj a rendszergazdákhoz.
                        </div>
                        <div>
                          <strong>Adminisztratív kérdések:</strong> Komplex esetekben kérj segítséget a tanulmányi osztálytól.
                        </div>
                        <div>
                          <strong>Forgatási koordináció:</strong> Nehéz esetekben egyeztess a forgatásvezetőkkel és a szakmai koordinátorral.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                  <a href="/app/igazolasok">
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Igazolások
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/forgatasok">
                    <Video className="h-4 w-4 mr-2" />
                    Forgatások
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/app/naptar">
                    <Calendar className="h-4 w-4 mr-2" />
                    Naptár
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
