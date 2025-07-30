import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Users, UserCheck, GraduationCap, ShieldCheck, Mail, Phone, Pencil } from "lucide-react"

const classes = ["NYF", "9F", "10F", "11F", "12F"]

// Sample student data - normally this would come from a database
const studentData = [
  // NYF osztály - A stáb
  { id: 1, name: "Kiss Anna", class: "NYF", crew: "A", status: "Aktív", email: "kiss.anna@student.ztv.hu", phone: "+36 30 111 1111", role: "Diák" },
  { id: 2, name: "Nagy Péter", class: "NYF", crew: "A", status: "Aktív", email: "nagy.peter@student.ztv.hu", phone: "+36 30 111 1112", role: "Diák" },
  { id: 3, name: "Szabó Mária", class: "NYF", crew: "A", status: "Aktív", email: "szabo.maria@student.ztv.hu", phone: "+36 30 111 1113", role: "Diák" },
  { id: 4, name: "Tóth János", class: "NYF", crew: "A", status: "Aktív", email: "toth.janos@student.ztv.hu", phone: "+36 30 111 1114", role: "Diák" },
  { id: 5, name: "Kovács Eszter", class: "NYF", crew: "A", status: "Aktív", email: "kovacs.eszter@student.ztv.hu", phone: "+36 30 111 1115", role: "Diák" },
  { id: 6, name: "Horváth Gábor", class: "NYF", crew: "A", status: "Aktív", email: "horvath.gabor@student.ztv.hu", phone: "+36 30 111 1116", role: "Diák" },
  { id: 7, name: "Varga Zsuzsanna", class: "NYF", crew: "A", status: "Aktív", email: "varga.zsuzsanna@student.ztv.hu", phone: "+36 30 111 1117", role: "Diák" },
  { id: 8, name: "Molnár László", class: "NYF", crew: "A", status: "Aktív", email: "molnar.laszlo@student.ztv.hu", phone: "+36 30 111 1118", role: "Diák" },
  { id: 9, name: "Farkas Réka", class: "NYF", crew: "A", status: "Aktív", email: "farkas.reka@student.ztv.hu", phone: "+36 30 111 1119", role: "Diák" },
  
  // NYF osztály - B stáb
  { id: 10, name: "Takács Dávid", class: "NYF", crew: "B", status: "Aktív", email: "takacs.david@student.ztv.hu", phone: "+36 30 111 1121", role: "Diák" },
  { id: 11, name: "Balogh Emma", class: "NYF", crew: "B", status: "Aktív", email: "balogh.emma@student.ztv.hu", phone: "+36 30 111 1122", role: "Diák" },
  { id: 12, name: "Simon Bence", class: "NYF", crew: "B", status: "Aktív", email: "simon.bence@student.ztv.hu", phone: "+36 30 111 1123", role: "Diák" },
  { id: 13, name: "Kelemen Lilla", class: "NYF", crew: "B", status: "Aktív", email: "kelemen.lilla@student.ztv.hu", phone: "+36 30 111 1124", role: "Diák" },
  { id: 14, name: "Papp Márton", class: "NYF", crew: "B", status: "Aktív", email: "papp.marton@student.ztv.hu", phone: "+36 30 111 1125", role: "Diák" },
  { id: 15, name: "Juhász Vivien", class: "NYF", crew: "B", status: "Aktív", email: "juhasz.vivien@student.ztv.hu", phone: "+36 30 111 1126", role: "Diák" },
  { id: 16, name: "Lakatos Tamás", class: "NYF", crew: "B", status: "Aktív", email: "lakatos.tamas@student.ztv.hu", phone: "+36 30 111 1127", role: "Diák" },
  { id: 17, name: "Mészáros Nóra", class: "NYF", crew: "B", status: "Aktív", email: "meszaros.nora@student.ztv.hu", phone: "+36 30 111 1128", role: "Diák" },
  { id: 18, name: "Rácz Ádám", class: "NYF", crew: "B", status: "Aktív", email: "racz.adam@student.ztv.hu", phone: "+36 30 111 1129", role: "Diák" },
  
  // 9F osztály - A stáb
  { id: 19, name: "Horváth Zsuzsanna", class: "9F", crew: "A", status: "Aktív", email: "horvath.zsuzsanna@student.ztv.hu", phone: "+36 30 222 2221", role: "Diák" },
  { id: 20, name: "Varga László", class: "9F", crew: "A", status: "Aktív", email: "varga.laszlo@student.ztv.hu", phone: "+36 30 222 2222", role: "Diák" },
  { id: 21, name: "Molnár Eszter", class: "9F", crew: "A", status: "Aktív", email: "molnar.eszter@student.ztv.hu", phone: "+36 30 222 2223", role: "Diák" },
  { id: 22, name: "Farkas Gábor", class: "9F", crew: "A", status: "Aktív", email: "farkas.gabor9f@student.ztv.hu", phone: "+36 30 222 2224", role: "Diák" },
  { id: 23, name: "Kovács Réka", class: "9F", crew: "A", status: "Aktív", email: "kovacs.reka9f@student.ztv.hu", phone: "+36 30 222 2225", role: "Diák" },
  { id: 24, name: "Nagy Dominik", class: "9F", crew: "A", status: "Aktív", email: "nagy.dominik@student.ztv.hu", phone: "+36 30 222 2226", role: "Diák" },
  { id: 25, name: "Szabó Klára", class: "9F", crew: "A", status: "Aktív", email: "szabo.klara@student.ztv.hu", phone: "+36 30 222 2227", role: "Diák" },
  { id: 26, name: "Tóth Levente", class: "9F", crew: "A", status: "Aktív", email: "toth.levente@student.ztv.hu", phone: "+36 30 222 2228", role: "Diák" },
  { id: 27, name: "Kiss Fanni", class: "9F", crew: "A", status: "Aktív", email: "kiss.fanni@student.ztv.hu", phone: "+36 30 222 2229", role: "Diák" },
  
  // 9F osztály - B stáb (példa, további 9 diák)
  { id: 28, name: "Oláh Máté", class: "9F", crew: "B", status: "Aktív", email: "olah.mate@student.ztv.hu", phone: "+36 30 222 2231", role: "Diák" },
  { id: 29, name: "Pálinkás Sára", class: "9F", crew: "B", status: "Aktív", email: "palinkas.sara@student.ztv.hu", phone: "+36 30 222 2232", role: "Diák" },
  { id: 30, name: "Vincze Alex", class: "9F", crew: "B", status: "Aktív", email: "vincze.alex@student.ztv.hu", phone: "+36 30 222 2233", role: "Diák" },
  
  // 10F osztály példa diákok
  { id: 31, name: "Borbély Dániel", class: "10F", crew: "A", status: "Aktív", email: "borbely.daniel@student.ztv.hu", phone: "+36 30 333 3331", role: "Diák" },
  { id: 32, name: "Csík Vivien", class: "10F", crew: "A", status: "Aktív", email: "csik.vivien@student.ztv.hu", phone: "+36 30 333 3332", role: "Diák" },
  { id: 33, name: "Dorogi Bence", class: "10F", crew: "B", status: "Aktív", email: "dorogi.bence@student.ztv.hu", phone: "+36 30 333 3333", role: "Diák" },
  
  // 11F osztály példa diákok
  { id: 34, name: "Erdős Petra", class: "11F", crew: "A", status: "Aktív", email: "erdos.petra@student.ztv.hu", phone: "+36 30 444 4441", role: "Diák" },
  { id: 35, name: "Fekete Zoltán", class: "11F", crew: "A", status: "Aktív", email: "fekete.zoltan@student.ztv.hu", phone: "+36 30 444 4442", role: "Diák" },
  { id: 36, name: "Gál Noémi", class: "11F", crew: "B", status: "Aktív", email: "gal.noemi@student.ztv.hu", phone: "+36 30 444 4443", role: "Diák" },
  
  // 12F osztály példa diákok
  { id: 37, name: "Hegedűs Kristóf", class: "12F", crew: "A", status: "Aktív", email: "hegedus.kristof@student.ztv.hu", phone: "+36 30 555 5551", role: "Diák" },
  { id: 38, name: "Illés Boglárka", class: "12F", crew: "A", status: "Aktív", email: "illes.boglarka@student.ztv.hu", phone: "+36 30 555 5552", role: "Diák" },
  { id: 39, name: "Jakab Roland", class: "12F", crew: "B", status: "Aktív", email: "jakab.roland@student.ztv.hu", phone: "+36 30 555 5553", role: "Diák" },
]

// Administrator data
const adminData = [
  {
    id: 101,
    name: "Dr. Kovács János",
    role: "Médiatanár",
    status: "Aktív",
    email: "kovacs.janos@ztv.hu",
    phone: "+36 30 123 4567",
    department: "Média Oktatás",
    type: "admin"
  },
  {
    id: 102,
    name: "Nagy Anna",
    role: "Médiatanár",
    status: "Aktív",
    email: "nagy.anna@ztv.hu",
    phone: "+36 30 234 5678",
    department: "Média Oktatás",
    type: "admin"
  },
  {
    id: 103,
    name: "Dr. Szabó Péter",
    role: "Vezető Médiatanár",
    status: "Aktív",
    email: "szabo.peter@ztv.hu",
    phone: "+36 30 345 6789",
    department: "Média Oktatás",
    type: "admin"
  },
  {
    id: 104,
    name: "Tóth Mária",
    role: "Médiatanár",
    status: "Aktív",
    email: "toth.maria@ztv.hu",
    phone: "+36 30 456 7890",
    department: "Média Oktatás",
    type: "admin"
  }
]

export default function StaffPage() {
  const totalStudents = studentData.length
  const activeStudents = studentData.filter(student => student.status === "Aktív").length
  const totalCrewA = studentData.filter(student => student.crew === "A").length
  const totalCrewB = studentData.filter(student => student.crew === "B").length
  const totalAdmins = adminData.length

  const getCrewCount = (className: string, crewLetter: string) => {
    return studentData.filter(student => student.class === className && student.crew === crewLetter).length
  }

  return (
    <TooltipProvider>
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">Stáb és Diák Kezelése</h1>
                    <p className="text-muted-foreground">Diákok és médiatanárok nyilvántartása és kezelése</p>
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Új diák
                    </Button>
                    <Button variant="outline">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Új médiatanár
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="students" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="students" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Diákok
                    </TabsTrigger>
                    <TabsTrigger value="admins" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Médiatanárok
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="students" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4 mb-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Összes diák</CardTitle>
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{totalStudents}</div>
                          <p className="text-xs text-muted-foreground">
                            5 osztály, 2 stáb/osztály
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Aktív</CardTitle>
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">A stáb összesen</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">{totalCrewA}</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">B stáb összesen</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">{totalCrewB}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Class overview grid */}
                    <div className="grid gap-4 md:grid-cols-5 mb-6">
                      {classes.map((className) => (
                        <Card key={className}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{className} osztály</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">A stáb:</span>
                                <Badge variant="outline">{getCrewCount(className, "A")} fő</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">B stáb:</span>
                                <Badge variant="outline">{getCrewCount(className, "B")} fő</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Diákok</CardTitle>
                        <CardDescription>
                          Az összes regisztrált diák listája osztályok és stábok szerint
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Név</th>
                                <th className="text-left p-2">Osztály</th>
                                <th className="text-left p-2">Stáb</th>
                                <th className="text-left p-2">Státusz</th>
                                <th className="text-left p-2">Elérhetőség</th>
                                <th className="text-left p-2">Műveletek</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentData.map((student) => (
                                <tr key={student.id} className="border-b">
                                  <td className="p-2 font-medium">{student.name}</td>
                                  <td className="p-2">
                                    <Badge variant="secondary">{student.class}</Badge>
                                  </td>
                                  <td className="p-2">
                                    <Badge variant="outline">{student.crew} stáb</Badge>
                                  </td>
                                  <td className="p-2">
                                    <Badge variant={student.status === "Hiányzik" ? "default" : "destructive"}>
                                      {student.status}
                                    </Badge>
                                  </td>
                                  <td className="p-2">
                                    <div className="text-sm">
                                      <div>{student.email}</div>
                                      <div className="text-muted-foreground">{student.phone}</div>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <div className="flex gap-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="outline" size="sm" asChild>
                                            <a href={`mailto:${student.email}`}>
                                              <Mail className="h-4 w-4" />
                                            </a>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>E-mail írása</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="outline" size="sm" asChild>
                                            <a href={`tel:${student.phone}`}>
                                              <Phone className="h-4 w-4" />
                                            </a>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Telefonhívás</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Szerkesztés</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="admins" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Médiatanárok</CardTitle>
                          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{totalAdmins}</div>
                          <p className="text-xs text-muted-foreground">
                            Csak kontakt megtekintés
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Aktív tanárok</CardTitle>
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {adminData.filter(admin => admin.status === "Aktív").length}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Médiatanárok</CardTitle>
                        <CardDescription>
                          Médiatanárok listája - csak kontakt adatok megtekintése engedélyezett
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Név</th>
                                <th className="text-left p-2">Beosztás</th>
                                <th className="text-left p-2">Részleg</th>
                                <th className="text-left p-2">Státusz</th>
                                <th className="text-left p-2">Elérhetőség</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminData.map((admin) => (
                                <tr key={admin.id} className="border-b">
                                  <td className="p-2 font-medium">
                                    <div className="flex items-center gap-2">
                                      {admin.name}
                                      <Badge variant="secondary" className="text-xs">
                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                        Médiatanár
                                      </Badge>
                                    </div>
                                  </td>
                                  <td className="p-2">{admin.role}</td>
                                  <td className="p-2">{admin.department}</td>
                                  <td className="p-2">
                                    <Badge variant={admin.status === "Aktív" ? "default" : "secondary"}>
                                      {admin.status}
                                    </Badge>
                                  </td>
                                  <td className="p-2">
                                    <div className="text-sm">
                                      <div>{admin.email}</div>
                                      <div className="text-muted-foreground">{admin.phone}</div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  )
}
