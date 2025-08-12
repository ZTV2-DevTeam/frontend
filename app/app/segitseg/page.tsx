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
  AlertOctagon
} from "lucide-react"

export default function HelpPage() {
  const { currentRole } = useUserRole()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("general")

  // Role-specific content
  const studentContent = {
    title: "Hallgatói tudásbázis",
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
            answer: "A beosztások általában egy héttel a forgatás előtt jelennek meg. Értesítést kapsz, ha felkerültél egy forgatásra."
          },
          {
            question: "Mit tegyek, ha nem tudok részt venni egy forgatáson?",
            answer: "Minél előbb jelezd az adminisztrátornak vagy az ofősnek. A lemondási határidők változhatnak."
          },
          {
            question: "Hol találom a forgatási információkat?",
            answer: "A forgatás részleteit a 'Forgatások' menüpontban, vagy a naptáradban tekintheted meg."
          }
        ]
      },
      {
        title: "Felszerelések",
        items: [
          {
            question: "Hogyan béreljem ki a felszereléseket?",
            answer: "A 'Felszerelések' menüpontban láthatod az elérhető eszközöket. A kölcsönzési kérelmet az adminisztrátorok hagyják jóvá."
          },
          {
            question: "Meddig használhatom a kibérelt felszerelést?",
            answer: "A kölcsönzési időtartam eszközönként változik. A visszaadási határidőt mindig tartsd be."
          }
        ]
      }
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
            answer: "A Django admin felületen keresztül a 'Felhasználók' menüpontban adhatsz hozzá új felhasználókat. Ügyelj a megfelelő jogosultságok beállítására."
          },
          {
            question: "Hogyan változtathatom meg egy felhasználó jogosultságait?",
            answer: "A felhasználó profiljában szerkesztheted a csoporttagságokat és az egyedi jogosultságokat."
          },
          {
            question: "Mi a különbség a szerepkörök között?",
            answer: "Hallgató: alapvető funkciók, Admin: teljes rendszerkezelés, Ofős: forgatások és beosztások kezelése."
          }
        ]
      },
      {
        title: "Forgatások kezelése",
        items: [
          {
            question: "Hogyan hozok létre új forgatást?",
            answer: "A 'Forgatások' adminisztráció alatt adhatsz hozzá új forgatást. Add meg az összes szükséges információt és határidőket."
          },
          {
            question: "Hogyan osztom be a hallgatókat forgatásokra?",
            answer: "A beosztások kezelése menüpontban tudod létrehozni és szerkeszteni a beosztásokat."
          },
          {
            question: "Hogyan kezeljem a forgatási jelentkezéseket?",
            answer: "A jelentkezések automatikusan megjelennek a rendszerben. Döntsd el, kit veszel fel az adott forgatásra."
          }
        ]
      },
      {
        title: "Rendszer adminisztráció",
        items: [
          {
            question: "Hogyan készítek biztonsági másolatot?",
            answer: "A biztonsági mentések automatikusan készülnek. Kritikus változtatások előtt mindig készíts manuális mentést."
          },
          {
            question: "Mit tegyek adatbázis hiba esetén?",
            answer: "Azonnal vedd fel a kapcsolatot a fejlesztővel! Ne próbálj meg egyedül javítani kritikus hibákat."
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
            answer: "Az igazolások menüpontban áttekintheted a beérkezett kéréseket és egyenként jóváhagyhatod vagy elutasíthatod azokat."
          },
          {
            question: "Milyen igazolásokat adhatok ki?",
            answer: "Távolmaradási igazolások, részvételi igazolások és egyéb iskolai igazolások tartoznak a hatáskörödhöz."
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
            question: "Hogyan követhetem figyelemmel a diákok részvételét?",
            answer: "A naptár menüpontban láthatod a diákok aktivitását és részvételi statisztikáit."
          },
          {
            question: "Hogyan készítek jelentést a diákok teljesítményéről?",
            answer: "A naptár és egyéb menüpontokon keresztül követheted nyomon az osztályod aktivitását."
          }
        ]
      },
      {
        title: "Adminisztratív feladatok",
        items: [
          {
            question: "Hogyan kezeljem a hiányzásokat?",
            answer: "A hiányzások automatikusan rögzítésre kerülnek, de szükség esetén manuálisan is módosíthatod őket."
          },
          {
            question: "Mikor és hogyan készítsek összefoglalót?",
            answer: "Havi rendszerességgel készíts összefoglalót az osztályod aktivitásáról és küldd meg az igazgatóságnak."
          }
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
      question: "Hogyan adhatok visszajelzést vagy jelenthetek be hibát?",
      answer: "Használhatod az általános visszajelzési űrlapunkat kisebb hibák, javaslatok és általános visszajelzések esetén. Kritikus hibáknál (rendszer leállás, adatvesztés, biztonsági problémák) azonnal írj emailt a fejlesztőknek. A Visszajelzés fülön találod az összes opciót."
    },
    {
      question: "Kihez fordulhatok technikai problémák esetén?",
      answer: `Technikai támogatás esetén a ${CONTACT_CONFIG.DEVELOPER_EMAIL} e-mail címen érheted el a fejlesztőket. A válaszidő legfeljebb 24 óra.`
    },
    {
      question: "Honnan tudhatom mi számít technikai problémának?",
      answer: "Technikai problémának számít minden olyan hiba vagy kérdés, amely a rendszer működésével kapcsolatos. Ez nem tér ki a forgatásokkal vagy a beosztásokkal kapcsolatos kérdésekre, hanem kizárólag a rendszer technikai működésére vonatkozik."
    },
    {
      question: "Javaslatom van a rendszer fejlesztésére, hová írhatom?",
      answer: `Javaslatokat a ${CONTACT_CONFIG.SUPPORT_EMAIL} e-mail címen vár a fejlesztői csapat, vagy még egyszerűbb, ha a visszajelzési űrlapunkat használod. Kérjük, hogy a javaslatokat részletesen írjátok le, hogy minél jobban megérthessük az igényeiteket.`
    },
    {
      question: "Elfejtettem a jelszavam, mit tegyek?",
      answer: "Keresd meg az adminisztrátort személyesen vagy írj a támogatásnak. Biztonsági okokból jelszó visszaállítás csak személyes egyeztetés után lehetséges."
    },
    {
      question: "Miért nem látom az összes menüpontot?",
      answer: "A menüpontok láthatósága a felhasználói szerepkörödhöz igazodik. Csak azokat a funkciókat látod, amelyekhez jogosultságod van."
    }
  ]

  const roleContent = getCurrentRoleContent()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Súgó és Tudásbázis</h1>
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
          {/* Feedback and Issue Reporting Card */}
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <MessageSquare className="h-5 w-5" />
                Visszajelzés és Hibabejelentés
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                Segítsd a rendszer fejlesztését visszajelzéseiddel és javaslatoddal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-green-700 dark:text-green-300">
              <div className="grid gap-4 md:grid-cols-3">
                {/* General Feedback */}
                <div className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800">
                  <Lightbulb className="h-8 w-8 mb-2 text-green-600" />
                  <h3 className="font-medium text-center mb-2">Általános visszajelzés</h3>
                  <p className="text-xs text-center text-muted-foreground mb-3">
                    Fejlesztési javaslatok, funkció kérések
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.open('https://forms.gle/ATyvgiutqNNaKT46A', '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Kitöltés
                  </Button>
                </div>

                {/* Minor Issues */}
                <div className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-900 border border-yellow-200 dark:border-yellow-800">
                  <Bug className="h-8 w-8 mb-2 text-yellow-600" />
                  <h3 className="font-medium text-center mb-2">Kisebb hibák</h3>
                  <p className="text-xs text-center text-muted-foreground mb-3">
                    Kezelői hibák, megjelenítési problémák
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                    onClick={() => window.open('https://forms.gle/ATyvgiutqNNaKT46A', '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Bejelentés
                  </Button>
                </div>

                {/* Critical Issues */}
                <div className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800">
                  <AlertOctagon className="h-8 w-8 mb-2 text-red-600" />
                  <h3 className="font-medium text-center mb-2">Kritikus hibák</h3>
                  <p className="text-xs text-center text-muted-foreground mb-3">
                    Rendszerleállás, adatvesztés, biztonsági problémák
                  </p>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    className="w-full"
                    onClick={() => window.open(`mailto:${CONTACT_CONFIG.PRIMARY_EMAIL}?subject=KRITIKUS HIBA - Azonnali intézkedés szükséges&body=Kritikus hiba részletes leírása:%0A%0AFelhasználó: ${user?.username || 'N/A'}%0ASzerepkör: ${currentRole}%0AIdőpont: ${new Date().toLocaleString('hu-HU')}%0A%0A⚠️ KRITIKUS HIBA - Azonnali figyelmet igényel!`, '_blank')}
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Email küldése
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-4 p-3 rounded-lg bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Mikor melyik opciót használjam?
                </h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p><strong>Google Form:</strong> Általános visszajelzések, javaslatok, kisebb hibák</p>
                  <p><strong>Azonnali email:</strong> Kritikus hibák, amelyek megakadályozzák a munkát vagy adatvesztést okozhatnak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Mail className="h-5 w-5" />
                Gyors kapcsolatfelvétel
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 text-blue-700 dark:text-blue-300">
              <div>
                <p className="font-medium">Technikai támogatás:</p>
                <a 
                  href={`mailto:${CONTACT_CONFIG.DEVELOPER_EMAIL}?subject=Technikai támogatás kérése`}
                  className="text-sm underline hover:text-blue-800 dark:hover:text-blue-200"
                >
                  {CONTACT_CONFIG.DEVELOPER_EMAIL}
                </a>
              </div>
              <div>
                <p className="font-medium">Általános kérdések:</p>
                <a 
                  href={`mailto:${CONTACT_CONFIG.SUPPORT_EMAIL}?subject=Általános kérdés`}
                  className="text-sm underline hover:text-blue-800 dark:hover:text-blue-200"
                >
                  {CONTACT_CONFIG.SUPPORT_EMAIL}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Általános
              </TabsTrigger>
              <TabsTrigger value="role-specific" className="flex items-center gap-2">
                <roleContent.icon className="w-4 h-4" />
                {currentRole === 'admin' ? 'Admin' : currentRole === 'class-teacher' ? 'Osztályfőnök' : 'Hallgató'}
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
                    Specializált útmutatók a te szerepkörödhöz ({currentRole === 'admin' ? 'Adminisztrátor' : currentRole === 'class-teacher' ? 'Osztályfőnök' : 'Hallgató'})
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
                            <li>• Add meg a böngésző típusát és verzióját</li>
                            <li>• Csatolj képernyőképet, ha lehetséges</li>
                            <li>• Írd meg, mit vártál volna helyette</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Javaslatok esetén:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Írd le részletesen az ötletedet</li>
                            <li>• Magyarázd el, miért lenne hasznos</li>
                            <li>• Add meg, hogy ki használná</li>
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
