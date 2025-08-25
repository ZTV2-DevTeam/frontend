/**
 * Help Page - Tudásbázis
 * 
 * Comprehensive knowledge base for Students, Admins, and Officers (Ofős)
 * Provides role-specific guidance and resources.
 */

"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { CONTACT_CONFIG } from "@/lib/config"
import { 
  BookOpen, 
  Users, 
  Shield, 
  HelpCircle, 
  Mail, 
  Phone, 
  AlertTriangle,
  User,
  UserCheck,
  Crown,
  FileText,
  Settings,
  Calendar,
  Database,
  Activity,
  ExternalLink,
  MessageSquare,
  Bug,
  Lightbulb,
  AlertOctagon,
  CheckCircle,
  GraduationCap,
  MailPlus,
  TicketCheck,
  MessageCircleQuestionIcon,
  Calendar1,
  CalendarRange,
  ShieldBan
} from "lucide-react"

export default function HelpPage() {
  const { currentRole } = useUserRole()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("general")

  // Role-specific content
  const studentContent = {
    title: "Tanulói tudásbázis",
    icon: User,
    sections: [
      {
        title: "Első lépések",
        items: [
          {
            question: "Hogyan jelentkezek be a rendszerbe?",
            answer: "A bejelentkezéshez használd az intézményi azonosítódat és jelszavadat. Ha problémád van, keresd az adminisztrátort."
          },
          {
            question: "Hol találom a naptáramat?",
            answer: "A főmenüben kattints a 'Naptár' menüpontra. Itt láthatod az összes forgatásod és eseményeid."
          },
          {
            question: "Hogyan jelentkezem forgatásra?",
            answer: "A 'Forgatások' menüpontban böngészheted az elérhető forgatásokat és jelentkezhetsz azokra."
          }
        ]
      },
      {
        title: "Forgatások",
        items: [
          {
            question: "Mikor látom a forgatási beosztásomat?",
            answer: "A forgatásokat a kiírásuk pillanatától látod a Forgatások menüpontban. A stáb és a felszerelések beosztása később történik, várj türelemmel. Amint egy beosztás kiírásra vagy módosításra kerül, E-mailes értesítést kapsz."
          },
          {
            question: "Mit tegyek, ha nem tudok részt venni egy forgatáson?",
            answer: "Ha nem tudsz egy forgatáson részt venni, azonnal értesítsd a beosztást készítő szaktanárt."
          },
          {
            question: "Hol találom a forgatási információkat?",
            answer: "A forgatás részleteit a 'Forgatások' menüpontban tekintheted meg."
          }
        ]
      },
    ]
  }

  const adminContent = {
    title: "Adminisztrátori tudásbázis",
    icon: UserCheck,
    sections: [
      {
        title: "Felhasználó kezelés",
        items: [
          {
            question: "Hogyan adhatok hozzá új felhasználót?",
            answer: "A Django admin felületen keresztül a 'Felhasználók' menüpontban adhat hozzá új felhasználókat. Ügyeljen a megfelelő jogosultságok beállítására!"
          },
          {
            question: "Hogyan változtathatom meg egy felhasználó jogosultságait?",
            answer: "A felhasználó profiljában szerkesztheti a csoporttagságokat és az egyedi jogosultságokat."
          },
          {
            question: "Mi a különbség a szerepkörök között?",
            answer: "Diák: alapvető funkciók, Admin: teljes rendszerkezelés, Ofők: igazolások megtekintése."
          }
        ]
      },
      {
        title: "Forgatások kezelése",
        items: [
          {
            question: "Hogyan hozok létre új forgatást?",
            answer: "A 'Forgatások' menüpontban található Új Forgatás gombra kattintva hozhat létre új forgatást."
          },
          {
            question: "Hogyan osztom be a diákokat forgatásokra?",
            answer: "Egylőre a Django Admin felületen egy új Beosztás rekordot kell létrehoznia, majd ezen belül a diákokat úgynevezett Szerepkör Relációk segítségével lehet a megfelelő mezőhöz hozzáadni. Amennyiben nem létezik még megfelelő reláció, a + gombbal hozhat létre újat."
          },
        ]
      },
      {
        title: "Rendszer adminisztráció",
        items: [
          {
            question: "Hogyan készítek biztonsági másolatot?",
            answer: "Vegye fel a kapcsolatot az üzemeltetővel."
          },
          {
            question: "Mit tegyek adatbázis hiba esetén?",
            answer: "Azonnal vegye fel a kapcsolatot a fejlesztővel! Ne próbálja meg egyedül javítani kritikus hibákat. Az adatbázis véletlenszerű szerkesztése még több problémát okozhat."
          }
        ]
      }
    ]
  }

  const ofoContent = {
    title: "Osztályfőnök tudásbázis", 
    icon: Crown,
    sections: [
      {
        title: "Igazolások kezelése",
        items: [
          {
            question: "Hogyan hagyok jóvá igazolásokat?",
            answer: "Az igazolások menüpontban áttekintheti a beérkezett kéréseket és egyenként jóváhagyhatja vagy elutasíthatja azokat. Best practice: akkor jelezzen vissza, ha a KRÉTA rendszerbe már naplózta az igazolást."
          },
          {
            question: "Minden igazolás hiteles?",
            answer: "Igen, minden igazolás hiteles, amely jelenleg megjelenik a rendszerben. Kizárólag adminisztrátori jogosultsággal rendelkező felhasználók módosíthatják a forgatásokat és a beosztásokat, melyek alapján automatikusan generálódnak az igazolások."
          },
          {
            question: "Hogyan értesülnek a diákok az igazolás állapotáról?",
            answer: "A rendszer automatikusan értesíti a diákokat az igazolásuk státuszváltozásáról."
          }
        ]
      },
      {
        title: "Diák nyomon követése",
        items: [
          {
            question: "Hogyan készítek jelentést a diákok teljesítményéről?",
            answer: "Az ilyen jellegű egyedi jelentések elkészítéséhez, vegye fel a kapcsolatot a fejlesztőkkel."
          }
        ]
      },
      {
        title: "Adminisztratív feladatok",
        items: [
          {
            question: "Hogyan kezeljem a hiányzásokat?",
            answer: "A hiányzások automatikusan rögzítésre kerülnek, de szükség esetén manuálisan is módosíthatja őket."
          },
        ]
      }
    ]
  }

  const getCurrentRoleContent = () => {
    switch (currentRole) {
      case 'admin':
        return adminContent
      case 'class-teacher': // osztályfőnök
        return ofoContent
      case 'student':
      default:
        return studentContent
    }
  }

  const generalFaqs = [
    {
      question: "Mi az Early Access BETA verzió?",
      answer: "Az FTV platform jelenleg Early Access BETA verzióban érhető el. Ez azt jelenti, hogy a rendszer még fejlesztés alatt áll, és előfordulhatnak hibák, hiányos funkciók vagy nem várt viselkedések. A BETA verzió célja, hogy valós környezetben tesztelhessük a funkciókat és visszajelzéseket gyűjthessünk a fejlesztéshez. Köszönjük a türelmedet és aktív részvételedet a tesztelésben!"
    },
    {
      question: "Mire számíthatok a BETA verzió használata során?",
      answer: "BETA verzió használata során előfordulhatnak: betöltési problémák, lassabb válaszidők, hiányos vagy váratlanul működő funkciók, adatok átmeneti nem elérhetősége. Ha bármilyen hibát észlelsz, kérjük jelezd a fejlesztőknek a visszajelzési űrlapon vagy emailben."
    },
    {
      question: "Hogyan adhatok visszajelzést vagy jelenthetek be hibát?",
      answer: "Használhatod az általános visszajelzési űrlapunkat kisebb hibák, javaslatok és általános visszajelzések esetén. Kritikus hibáknál (rendszer leállás, adatvesztés, biztonsági problémák) azonnal írj emailt a fejlesztőknek. A Visszajelzés fülön találod az összes opciót."
    },
    {
      question: "Kihez fordulhatok technikai problémák esetén?",
      answer: `Technikai támogatás esetén a ${CONTACT_CONFIG.DEVELOPER_EMAIL} e-mail címen érheted el a fejlesztőket. Postafordultával válaszolunk a megkeresésekre.`
    },
    {
      question: "Honnan tudhatom mi számít technikai problémának?",
      answer: "Technikai problémának számít minden olyan hiba vagy kérdés, amely a rendszer működésével kapcsolatos. Ez nem tér ki a forgatásokkal vagy a beosztásokkal kapcsolatos kérdésekre, hanem kizárólag a rendszer technikai működésére vonatkozik."
    },
    {
      question: "Javaslatom van a rendszer fejlesztésére, hová írhatom?",
      answer: `Javaslatokat a ${CONTACT_CONFIG.SUPPORT_EMAIL} e-mail címen vár a fejlesztői csapat, vagy még egyszerűbb, ha a visszajelzési űrlapunkat használod. Kérjük, hogy a javaslatokat részletesen írjátok le, hogy minél jobban megérthessük az igényeiteket. Ne habozzatok írni nekünk, a rendszer nektek készül!`
    },
    {
      question: "Elfejtettem a jelszavam, mit tegyek?",
      answer: "Használd az \"Elfelejtett jelszó?\" funkciót a bejelentkezési oldalon."
    },
    {
      question: "Miért nem látom az összes menüpontot?",
      answer: "A menüpontok láthatósága a felhasználói szerepkörödhöz igazodik. Csak azokat a funkciókat látod, amelyekhez jogosultságod van."
    }
  ]

  const roleContent = getCurrentRoleContent()

  const elkeszultBadge = <Badge className="ml-2 text-xs px-2 py-1 bg-green-500 text-green-50 dark:bg-green-900 dark:text-green-300">
    Elkészült
  </Badge>
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Súgó és Tudásbázis
              </h1>
              <p className="text-muted-foreground">
                Útmutatók, gyakran ismételt kérdések és technikai támogatás
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              <BookOpen className="w-3 h-3 mr-1" />
              Tudásbázis
            </Badge>
          </div>

          {/* Contact Information Card */}
          {/* Beta Version Notice */}
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <div className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full border border-orange-200 dark:border-orange-700">
                  EARLY ACCESS BETA
                </div>
                Korai hozzáférési verzió
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Ez a platform jelenleg fejlesztés alatt áll és még nem tökéletes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-orange-700 dark:text-orange-300">
              <div className="space-y-3">
                <p className="text-sm">
                  Az FTV platform <strong>Early Access BETA verzióban</strong> érhető el. Ez azt jelenti:
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Mire számíthatsz:</h4>
                    <ul className="text-xs space-y-1 text-orange-600 dark:text-orange-400">
                      <li>• Előfordulhatnak hibák vagy váratlan viselkedések</li>
                      <li>• Egyes funkciók még hiányosak lehetnek</li>
                      <li>• Alkalmanként lassabb betöltési idők</li>
                      <li>• Rendszeres frissítések és változások</li>
                      <li>• Megszokottnál nagyobb adatforgalom</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Hogyan segíthetsz:</h4>
                    <ul className="text-xs space-y-1 text-orange-600 dark:text-orange-400">
                      <li>• Jelezd a hibákat és problémákat</li>
                      <li>• Oszd meg ötleteidet és javaslataidat</li>
                      <li>• Légy türelmes a fejlesztési folyamattal</li>
                      <li>• Használd a visszajelzési űrlapunkat</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm font-medium text-center text-orange-800 dark:text-orange-200">
                    🙏 Köszönjük a türelmedet és aktív részvételedet a fejlesztésben!
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    A te visszajelzéseid segítenek tökéletesíteni a platformot
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Általános
              </TabsTrigger>
              <TabsTrigger value="role-specific" className="flex items-center gap-2">
                <roleContent.icon className="w-4 h-4" />
                {currentRole === 'admin' ? 'Admin' : currentRole === 'class-teacher' ? 'Osztályfőnök' : 'Diák'}
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Útmutatók
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Visszajelzés
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Erőforrások
              </TabsTrigger>
            </TabsList>

            {/* General FAQ Tab */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gyakran Ismételt Kérdések</CardTitle>
                  <CardDescription>
                    Általános kérdések és válaszok minden felhasználó számára
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {generalFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`general-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Role-Specific Tab */}
            <TabsContent value="role-specific" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <roleContent.icon className="h-5 w-5" />
                    {roleContent.title}
                  </CardTitle>
                  <CardDescription>
                    Specializált útmutatók a te szerepkörödhöz ({currentRole === 'admin' ? 'Adminisztrátor' : currentRole === 'class-teacher' ? 'Osztályfőnök' : 'Diák'})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {roleContent.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                        <Accordion type="single" collapsible className="w-full">
                          {section.items.map((item, itemIndex) => (
                            <AccordionItem key={itemIndex} value={`role-${sectionIndex}-${itemIndex}`}>
                              <AccordionTrigger>{item.question}</AccordionTrigger>
                              <AccordionContent>{item.answer}</AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                        {sectionIndex < roleContent.sections.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Részletes Útmutatók
                  </CardTitle>
                  <CardDescription>
                    Szerepkör-specifikus útmutatók részletes lépésenkénti instrukciókkal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Admin Guide */}
                    <Card className="border-2 transition-all hover:shadow-md">
                      <CardHeader className="text-center pb-3">
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg mx-auto mb-3 w-fit">
                          <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-lg">Adminisztrátori Útmutató</CardTitle>
                        <CardDescription className="text-sm">
                          Rendszergazdai feladatok és beállítások részletes útmutatója
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Rendszer konfigurálása</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Felhasználó kezelés</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Forgatások adminisztrálása</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Hibaelhárítás</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4" 
                          variant={currentRole === 'admin' ? 'default' : 'outline'}
                          disabled={currentRole !== 'admin'}
                          asChild={currentRole === 'admin'}
                        >
                          {currentRole === 'admin' ? (
                            <a href="/app/segitseg/admin-utmutato">
                              <Shield className="w-4 h-4 mr-2" />
                              Útmutató megnyitása
                            </a>
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-2" />
                              Adminisztrátori hozzáférés szükséges
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Class Teacher Guide */}
                    <Card className="border-2 transition-all hover:shadow-md">
                      <CardHeader className="text-center pb-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3 w-fit">
                          <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-lg">Osztályfőnöki Útmutató</CardTitle>
                        <CardDescription className="text-sm">
                          Osztálykezelés, hiányzások és forgatási koordináció útmutatója
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Osztály áttekintése</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Hiányzások kezelése</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Forgatási koordináció</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Kommunikáció</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4" 
                          variant={currentRole === 'class-teacher' || currentRole === 'admin' ? 'default' : 'outline'}
                          disabled={currentRole !== 'class-teacher' && currentRole !== 'admin'}
                          asChild={currentRole === 'class-teacher' || currentRole === 'admin'}
                        >
                          {currentRole === 'class-teacher' || currentRole === 'admin' ? (
                            <a href="/app/segitseg/ofonok-utmutato">
                              <GraduationCap className="w-4 h-4 mr-2" />
                              Útmutató megnyitása
                            </a>
                          ) : (
                            <>
                              <GraduationCap className="w-4 h-4 mr-2" />
                              Osztályfőnöki hozzáférés szükséges
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Student Guide */}
                    <Card className="border-2 transition-all hover:shadow-md">
                      <CardHeader className="text-center pb-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3 w-fit">
                          <User className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-lg">Diák Útmutató</CardTitle>
                        <CardDescription className="text-sm">
                          Minden, amit tudnod kell a rendszer használatáról és a forgatásokról
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Profil beállítása</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Forgatásokra jelentkezés</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Hiányzások kezelése</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Forgatási tippek és tanácsok</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4" 
                          variant={currentRole === 'student' || currentRole === 'admin' ? 'default' : 'outline'}
                          disabled={currentRole !== 'student' && currentRole !== 'admin'}
                          asChild={currentRole === 'student' || currentRole === 'admin'}
                        >
                          {currentRole === 'student' || currentRole === 'admin' ? (
                            <a href="/app/segitseg/diak-utmutato">
                              <User className="w-4 h-4 mr-2" />
                              Útmutató megnyitása
                            </a>
                          ) : (
                            <>
                              <User className="w-4 h-4 mr-2" />
                              Diák hozzáférés szükséges
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Visszajelzés és Hibabejelentés
                  </CardTitle>
                  <CardDescription>
                    Segítsd a rendszer fejlesztését visszajelzéseiddel, hibák bejelentésével és új funkciók javaslásával
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main feedback form link */}
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border border-green-200 dark:border-green-800">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <h3 className="text-lg font-semibold mb-2">Általános Visszajelzési Űrlap</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Használd ezt az űrlapot általános visszajelzések, fejlesztési javaslatok és kisebb hibák bejelentésére
                    </p>
                    <Button 
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => window.open('https://forms.gle/ATyvgiutqNNaKT46A', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visszajelzési Űrlap Megnyitása
                    </Button>
                  </div>

                  {/* Issue severity guide */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-green-700">
                          <Lightbulb className="h-5 w-5" />
                          Javaslatok és Visszajelzések
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Használd az űrlapot az alábbiak esetén:</p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Új funkciók javaslása</li>
                          <li>• UI/UX fejlesztési ötletek</li>
                          <li>• Általános visszajelzések</li>
                          <li>• Workflow javítási javaslatok</li>
                        </ul>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full mt-3 border-green-200 hover:bg-green-50"
                          onClick={() => window.open('https://forms.gle/ATyvgiutqNNaKT46A', '_blank')}
                        >
                          Javaslat beküldése
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-yellow-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-yellow-700">
                          <Bug className="h-5 w-5" />
                          Kisebb Hibák
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Használd az űrlapot az alábbiak esetén:</p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Megjelenítési problémák</li>
                          <li>• Kezelői felület hibái</li>
                          <li>• Lassú betöltési idők</li>
                          <li>• Nem kritikus funkcióhibák</li>
                        </ul>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full mt-3 border-yellow-200 hover:bg-yellow-50"
                          onClick={() => window.open('https://forms.gle/ATyvgiutqNNaKT46A', '_blank')}
                        >
                          Hiba bejelentése
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-red-700">
                          <AlertOctagon className="h-5 w-5" />
                          Kritikus Problémák
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Írj AZONNALI emailt az alábbiak esetén:</p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Rendszer leállás</li>
                          <li>• Adatvesztés</li>
                          <li>• Biztonsági rések</li>
                          <li>• Bejelentkezési problémák</li>
                        </ul>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="w-full mt-3"
                          onClick={() => window.open(`mailto:${CONTACT_CONFIG.PRIMARY_EMAIL}?subject=KRITIKUS HIBA - Azonnali intézkedés szükséges&body=Kritikus hiba részletes leírása:%0A%0AFelhasználó: ${user?.username || 'N/A'}%0ASzerepkör: ${currentRole}%0AIdőpont: ${new Date().toLocaleString('hu-HU')}%0A%0A⚠️ KRITIKUS HIBA - Azonnali figyelmet igényel!`, '_blank')}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Azonnali Email
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Best practices */}
                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                        <HelpCircle className="h-5 w-5" />
                        Hogyan írj hatékony visszajelzést?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-blue-700 dark:text-blue-300">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium mb-2">Hibák bejelentésekor:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Írd le lépésről lépésre, hogyan reprodukálható</li>
                            <li>• Add meg az eszközöd típusát</li>
                            <li>• Csatolj képernyőképet, ha lehetséges</li>
                            <li>• Írd meg, milyen viselkedésre számítottál</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Javaslatok esetén:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Írd le részletesen az ötletedet</li>
                            <li>• Magyarázd el, miért lenne hasznos</li>
                            <li>• Add meg, hogy kit érintene</li>
                            <li>• Ha van, adj példát hasonló megoldásokra</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-4">
              {/* Future Development Plans */}
              <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                    <Lightbulb className="h-5 w-5" />
                    Mik várhatóak a jövőben?
                  </CardTitle>
                  <CardDescription className="text-purple-700 dark:text-purple-300">
                    Tervezett funkciók és fejlesztések a rendszerben (nem prioritási sorrendben)
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-purple-700 dark:text-purple-300">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Minden adat kezelése ezen a modern felületen
                      </h4>
                      <p className="text-sm mb-3 text-muted-foreground">
                        Jelenleg vannak olyan információk, melyek csak közvetlenül a backend (ftvapi) felületen kezelhetőek, 
                        ezek szerkesztésére a jövőben új felületeket hozunk létre ezen az oldalon:
                      </p>
                      <ul className="text-sm space-y-1 pl-4">
                        <li>• <strong>Beosztáskezelő felület</strong> - Egy adott forgatást kiválasztva a szaktanárok láthatják a beosztás tervezetében szereplő diákok előre bejelentett távollétét, valamint az ütközéseket rádiós összejátszásokkal. A rendszer most is tudja ezeket kezelni, csupán nincs egy összesítő felület ahol ezek könnyedén áttekinthetőek</li>
                        <li>• <strong>Közlemények kiírása</strong> - Közlemények létrehozása és kezelése az adminisztrátorok számára {elkeszultBadge} </li>
                        <li>• <strong>Partnerkezelő felület</strong> - Minden partner áttekintése és kezelése</li>
                        <li>• <strong>Eszközkezelő felület</strong> - Minden eszköz áttekintése és kezelése</li>
                        <li>• <strong>Felhasználókezelő felület</strong> - Minden felhasználó áttekintése és kezelése (szerepkörök, stábok, rádiós stábok)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MailPlus className="w-4 h-4" />
                        BetterEmails - Dinamikus e-mail értesítés minden helyzetben
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        A rendszer által küldött e-mailek korlátozottak és csak bár kritikus esetben kerülnek kiküldésre, többnyire technikai okok miatt. Minél előbb igyekszünk ezeket orvosolni és minden lehetséges helyzetben egy informatív értesítést küldeni, melyek testreszabhatóak lennének a felhasználók számára.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Naptár integrációk - Google, Apple
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        A naptár integrációk lehetővé teszik a felhasználók számára, hogy a Google és Apple naptárjaikba közvetlenül importálják az eseményeket és határidőket. Ez megkönnyíti az események nyomon követését és a határidők betartását.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CalendarRange className="w-4 h-4" />
                        Megszokott felület - Operációs Rendszerek integrációja
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        A modern webfejlesztési technológiák lehetővé teszik, hogy a felhasználók az operációs rendszerük megszokott felületén keresztül érjék el a funkciókat. Ez például azt jelenti, hogy egy dátum megadásánál a megszokott Android (Material) vagy Apple (SwiftUI) dátumválasztó mezők jelennek meg.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ShieldBan className="w-4 h-4" />
                        Google Fiók alapú authentikáció
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        A Google Fiók alapú authentikáció lehetővé teszi a felhasználók számára, hogy a Google fiókjukkal jelentkezzenek be a rendszerbe. Ez egyszerűsíti a bejelentkezési folyamatot, és növeli a biztonságot. E funkció bevezetésével megszűnnek a fiókokhoz tartozó jelszavak és az intézményi fiókokkal lehet majd belépni. Ez lehetővé teszi jelszavak helyett, Azonosítókulcsok használatát is.
                        <br />
                        Frissítés: Az applikációt bejegyeztük a Google-nél, jelenleg a hitelesítésre várunk
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MessageCircleQuestionIcon className="w-4 h-4" />
                        Globális rendszerüzenetek
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        A rendszer által küldött globális üzenetek célja, hogy tájékoztassa a felhasználókat technikai problémákról, karbantartásokról, előre bejelentett leállásokról, üzemeltetői és fejlesztői támogatás szüneteiről. Az ehhez megfelelő infrastruktúrát ki fogjuk építeni az oldalon.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <TicketCheck className="w-4 h-4" />
                        Igazolásaim
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        A diákok igazolásait a rendszer automatikusan kezeli és generálja az aktuális beosztások alapján. A jövőben a diákok is hozzáférhetnek saját igazolásaikhoz, láthatják azok állapotát.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Reakciók az üzenőfalon
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Emoji alapú reakciók, valamint kommentek bekapcsolásának lehetősége adminisztrátorok számára
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Forgatástörténet, statisztika
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Minden múltbeli forgatás adatainak és abból készített statisztikák áttekintése
                      </p>
                    </div>

                    <div className="relative">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Stáb adatainak exportálása
                      {elkeszultBadge}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                      Teljes stáb adatainak exportálása nyomtatható (PDF) formátumban
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Technikai módosítások
                      </h4>
                      <ul className="text-sm space-y-2">
                        <li>
                          <strong>Gyorsabb felület</strong><br />
                          <span className="text-muted-foreground">
                            Felhasználói felület betöltési idejének csökkentése, a biztonsági protokollok megtartásával
                          </span>
                        </li>
                        <li>
                          <strong>Docker konténerek a backenden</strong><br />
                          <span className="text-muted-foreground">
                            Úgynevezett "Docker konténerek" használata a backend szerver üzemeltetése során sok időt, energiát és számítási kapacitást takarít meg, ezáltal a rendszer stabilabb és gyorsabb lesz.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800">
                      <p className="text-sm font-medium text-center text-purple-800 dark:text-purple-200">
                        💡 Hiányolsz valamit? Jelezd a fejleszőknek!
                      </p>
                      <p className="text-xs text-center text-muted-foreground mt-1">
                        Használd a visszajelzési űrlapunkat új funkciók javaslására
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Rendszer állapot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API szerver:</span>
                      <Badge variant="outline" className="text-green-600">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Adatbázis:</span>
                      <Badge variant="outline" className="text-green-600">
                        Működik
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Django Admin:</span>
                      <Badge variant="outline" className="text-green-600">
                        Elérhető
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* External Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Hasznos linkek
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentRole === 'admin' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => window.open('/app/database-admin', '_blank')}
                      >
                        <Database className="w-4 h-4 mr-2" />
                        Adatbázis adminisztráció
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => window.open(CONTACT_CONFIG.WEBSITE_URL, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {CONTACT_CONFIG.ORG_NAME} weboldal
                    </Button>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="md:col-span-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                      <AlertTriangle className="h-5 w-5" />
                      Sürgős esetekben
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-red-700 dark:text-red-300">
                    <p className="mb-2">
                      Kritikus rendszerhiba vagy sürgős technikai probléma esetén:
                    </p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a 
                        href={`mailto:${CONTACT_CONFIG.EMERGENCY_CONTACT}?subject=SÜRGŐS - Kritikus rendszerhiba&body=Probléma leírása:%0A%0AFelhasználó: ${user?.username || 'N/A'}%0ASzerepkör: ${currentRole}%0AIdőpont: ${new Date().toLocaleString('hu-HU')}`}
                        className="underline hover:text-red-800 dark:hover:text-red-200"
                      >
                        {CONTACT_CONFIG.EMERGENCY_CONTACT}
                      </a>
                    </div>
                    <p className="text-sm mt-2">
                      Sürgős esetben a tárgy sorában jelöld meg: &quot;SÜRGŐS&quot;
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
