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
  ExternalLink
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
            answer: "A naptár és analitika menüpontokban láthatod a diákok aktivitását és részvételi statisztikáit."
          },
          {
            question: "Hogyan készítek jelentést a diákok teljesítményéről?",
            answer: "Az analitika felületen generálhatsz részletes jelentéseket az osztályod aktivitásáról."
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
      question: "Kihez fordulhatok technikai problémák esetén?",
      answer: `Technikai támogatás esetén a ${CONTACT_CONFIG.DEVELOPER_EMAIL} e-mail címen érheted el a fejlesztőket. A válaszidő legfeljebb 24 óra.`
    },
    {
      question: "Honnan tudhatom mi számít technikai problémának?",
      answer: "Technikai problémának számít minden olyan hiba vagy kérdés, amely a rendszer működésével kapcsolatos. Ez nem tér ki a forgatásokkal vagy a beosztásokkal kapcsolatos kérdésekre, hanem kizárólag a rendszer technikai működésére vonatkozik."
    },
    {
      question: "Javaslatom van a rendszer fejlesztésére, hová írhatom?",
      answer: `Javaslatokat a ${CONTACT_CONFIG.SUPPORT_EMAIL} e-mail címen vár a fejlesztői csapat. Kérjük, hogy a javaslatokat részletesen írjátok le, hogy minél jobban megérthessük az igényeiteket.`
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Általános
              </TabsTrigger>
              <TabsTrigger value="role-specific" className="flex items-center gap-2">
                <roleContent.icon className="w-4 h-4" />
                {currentRole === 'admin' ? 'Admin' : currentRole === 'class-teacher' ? 'Osztályfőnök' : 'Hallgató'}
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
                      Sürgős esetben a tárgy sorában jelöld meg: "SÜRGŐS"
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
