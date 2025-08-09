"use client"

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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Users, UserCheck, GraduationCap, ShieldCheck, Mail, Phone, Pencil, Search, Filter, Eye, MoreHorizontal } from "lucide-react"
import { useState } from "react"

const classes = ["NYF", "9F", "10F", "11F", "12F"]

const studentData = [
  // NYF osztály - A stáb
  { id: 1, name: "Kiss Anna", class: "NYF", crew: "A", status: "Aktív", email: "kiss.anna@szlgbp.hu", phone: "+36 30 111 1111", role: "Diák" },
  { id: 2, name: "Nagy Péter", class: "NYF", crew: "A", status: "Aktív", email: "nagy.peter@szlgbp.hu", phone: "+36 30 111 1112", role: "Diák" },
  { id: 3, name: "Szabó Mária", class: "NYF", crew: "A", status: "Aktív", email: "szabo.maria@szlgbp.hu", phone: "+36 30 111 1113", role: "Diák" },
  { id: 4, name: "Tóth János", class: "NYF", crew: "A", status: "Aktív", email: "toth.janos@szlgbp.hu", phone: "+36 30 111 1114", role: "Diák" },
  { id: 5, name: "Kovács Eszter", class: "NYF", crew: "A", status: "Aktív", email: "kovacs.eszter@szlgbp.hu", phone: "+36 30 111 1115", role: "Diák" },
  { id: 6, name: "Horváth Gábor", class: "NYF", crew: "A", status: "Aktív", email: "horvath.gabor@szlgbp.hu", phone: "+36 30 111 1116", role: "Diák" },
  { id: 7, name: "Varga Zsuzsanna", class: "NYF", crew: "A", status: "Aktív", email: "varga.zsuzsanna@szlgbp.hu", phone: "+36 30 111 1117", role: "Diák" },
  { id: 8, name: "Molnár László", class: "NYF", crew: "A", status: "Aktív", email: "molnar.laszlo@szlgbp.hu", phone: "+36 30 111 1118", role: "Diák" },
  { id: 9, name: "Farkas Réka", class: "NYF", crew: "A", status: "Aktív", email: "farkas.reka@szlgbp.hu", phone: "+36 30 111 1119", role: "Diák" },
  
  // NYF osztály - B stáb
  { id: 10, name: "Takács Dávid", class: "NYF", crew: "B", status: "Aktív", email: "takacs.david@szlgbp.hu", phone: "+36 30 111 1121", role: "Diák" },
  { id: 11, name: "Balogh Emma", class: "NYF", crew: "B", status: "Aktív", email: "balogh.emma@szlgbp.hu", phone: "+36 30 111 1122", role: "Diák" },
  { id: 12, name: "Simon Bence", class: "NYF", crew: "B", status: "Aktív", email: "simon.bence@szlgbp.hu", phone: "+36 30 111 1123", role: "Diák" },
  { id: 13, name: "Kelemen Lilla", class: "NYF", crew: "B", status: "Aktív", email: "kelemen.lilla@szlgbp.hu", phone: "+36 30 111 1124", role: "Diák" },
  { id: 14, name: "Papp Márton", class: "NYF", crew: "B", status: "Aktív", email: "papp.marton@szlgbp.hu", phone: "+36 30 111 1125", role: "Diák" },
  { id: 15, name: "Juhász Vivien", class: "NYF", crew: "B", status: "Aktív", email: "juhasz.vivien@szlgbp.hu", phone: "+36 30 111 1126", role: "Diák" },
  { id: 16, name: "Lakatos Tamás", class: "NYF", crew: "B", status: "Aktív", email: "lakatos.tamas@szlgbp.hu", phone: "+36 30 111 1127", role: "Diák" },
  { id: 17, name: "Mészáros Nóra", class: "NYF", crew: "B", status: "Aktív", email: "meszaros.nora@szlgbp.hu", phone: "+36 30 111 1128", role: "Diák" },
  { id: 18, name: "Rácz Ádám", class: "NYF", crew: "B", status: "Aktív", email: "racz.adam@szlgbp.hu", phone: "+36 30 111 1129", role: "Diák" },
  
  // 9F osztály - A stáb
  { id: 19, name: "Horváth Zsuzsanna", class: "9F", crew: "A", status: "Aktív", email: "horvath.zsuzsanna@szlgbp.hu", phone: "+36 30 222 2221", role: "Diák" },
  { id: 20, name: "Varga László", class: "9F", crew: "A", status: "Aktív", email: "varga.laszlo@szlgbp.hu", phone: "+36 30 222 2222", role: "Diák" },
  { id: 21, name: "Molnár Eszter", class: "9F", crew: "A", status: "Aktív", email: "molnar.eszter@szlgbp.hu", phone: "+36 30 222 2223", role: "Diák" },
  { id: 22, name: "Farkas Gábor", class: "9F", crew: "A", status: "Aktív", email: "farkas.gabor9f@szlgbp.hu", phone: "+36 30 222 2224", role: "Diák" },
  { id: 23, name: "Kovács Réka", class: "9F", crew: "A", status: "Aktív", email: "kovacs.reka9f@szlgbp.hu", phone: "+36 30 222 2225", role: "Diák" },
  { id: 24, name: "Nagy Dominik", class: "9F", crew: "A", status: "Aktív", email: "nagy.dominik@szlgbp.hu", phone: "+36 30 222 2226", role: "Diák" },
  { id: 25, name: "Szabó Klára", class: "9F", crew: "A", status: "Aktív", email: "szabo.klara@szlgbp.hu", phone: "+36 30 222 2227", role: "Diák" },
  { id: 26, name: "Tóth Levente", class: "9F", crew: "A", status: "Aktív", email: "toth.levente@szlgbp.hu", phone: "+36 30 222 2228", role: "Diák" },
  { id: 27, name: "Kiss Fanni", class: "9F", crew: "A", status: "Aktív", email: "kiss.fanni@szlgbp.hu", phone: "+36 30 222 2229", role: "Diák" },
  
  // 9F osztály - B stáb (példa, további 9 diák)
  { id: 28, name: "Oláh Máté", class: "9F", crew: "B", status: "Aktív", email: "olah.mate@szlgbp.hu", phone: "+36 30 222 2231", role: "Diák" },
  { id: 29, name: "Pálinkás Sára", class: "9F", crew: "B", status: "Aktív", email: "palinkas.sara@szlgbp.hu", phone: "+36 30 222 2232", role: "Diák" },
  { id: 30, name: "Vincze Alex", class: "9F", crew: "B", status: "Aktív", email: "vincze.alex@szlgbp.hu", phone: "+36 30 222 2233", role: "Diák" },
  
  // 10F osztály példa diákok
  { id: 31, name: "Borbély Dániel", class: "10F", crew: "A", status: "Aktív", email: "borbely.daniel@szlgbp.hu", phone: "+36 30 333 3331", role: "Diák" },
  { id: 32, name: "Csík Vivien", class: "10F", crew: "A", status: "Aktív", email: "csik.vivien@szlgbp.hu", phone: "+36 30 333 3332", role: "Diák" },
  { id: 33, name: "Dorogi Bence", class: "10F", crew: "B", status: "Aktív", email: "dorogi.bence@szlgbp.hu", phone: "+36 30 333 3333", role: "Diák" },
  
  // 11F osztály példa diákok
  { id: 34, name: "Erdős Petra", class: "11F", crew: "A", status: "Aktív", email: "erdos.petra@szlgbp.hu", phone: "+36 30 444 4441", role: "Diák" },
  { id: 35, name: "Fekete Zoltán", class: "11F", crew: "A", status: "Aktív", email: "fekete.zoltan@szlgbp.hu", phone: "+36 30 444 4442", role: "Diák" },
  { id: 36, name: "Gál Noémi", class: "11F", crew: "B", status: "Aktív", email: "gal.noemi@szlgbp.hu", phone: "+36 30 444 4443", role: "Diák" },
  
  // 12F osztály példa diákok
  { id: 37, name: "Hegedűs Kristóf", class: "12F", crew: "A", status: "Aktív", email: "hegedus.kristof@szlgbp.hu", phone: "+36 30 555 5551", role: "Diák" },
  { id: 38, name: "Illés Boglárka", class: "12F", crew: "A", status: "Aktív", email: "illes.boglarka@szlgbp.hu", phone: "+36 30 555 5552", role: "Diák" },
  { id: 39, name: "Jakab Roland", class: "12F", crew: "B", status: "Aktív", email: "jakab.roland@szlgbp.hu", phone: "+36 30 555 5553", role: "Diák" },
]

// Administrator data
const adminData = [
  {
    id: 101,
    name: "Dr. Kovács János",
    role: "Médiatanár",
    status: "Aktív",
    email: "kovacs.janos@szlgbp.hu",
    phone: "+36 30 123 4567",
    department: "Média Oktatás",
    type: "admin"
  },
  {
    id: 102,
    name: "Nagy Anna",
    role: "Médiatanár",
    status: "Aktív",
    email: "nagy.anna@szlgbp.hu",
    phone: "+36 30 234 5678",
    department: "Média Oktatás",
    type: "admin"
  },
  {
    id: 103,
    name: "Dr. Szabó Péter",
    role: "Vezető Médiatanár",
    status: "Aktív",
    email: "szabo.peter@szlgbp.hu",
    phone: "+36 30 345 6789",
    department: "Média Oktatás",
    type: "admin"
  },
  {
    id: 104,
    name: "Tóth Mária",
    role: "Médiatanár",
    status: "Aktív",
    email: "toth.maria@szlgbp.hu",
    phone: "+36 30 456 7890",
    department: "Média Oktatás",
    type: "admin"
  }
]

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedCrew, setSelectedCrew] = useState("all")
  const [activeTab, setActiveTab] = useState("students")

  // Filter functions
  const filteredStudents = studentData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === "all" || student.class === selectedClass
    const matchesCrew = selectedCrew === "all" || student.crew === selectedCrew
    return matchesSearch && matchesClass && matchesCrew
  })

  const filteredAdmins = adminData.filter(admin => {
    return admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Stats based on current tab and filters
  const getCurrentStats = () => {
    if (activeTab === "students") {
      const totalStudents = filteredStudents.length
      const activeStudents = filteredStudents.filter(student => student.status === "Aktív").length
      const crewACount = filteredStudents.filter(student => student.crew === "A").length
      const crewBCount = filteredStudents.filter(student => student.crew === "B").length
      
      return {
        total: totalStudents,
        active: activeStudents,
        crewA: crewACount,
        crewB: crewBCount
      }
    } else {
      const totalAdmins = filteredAdmins.length
      const activeAdmins = filteredAdmins.filter(admin => admin.status === "Aktív").length
      
      return {
        total: totalAdmins,
        active: activeAdmins,
        crewA: 0,
        crewB: 0
      }
    }
  }

  const stats = getCurrentStats()

  const getCrewCount = (className: string, crewLetter: string) => {
    return studentData.filter(student => student.class === className && student.crew === crewLetter).length
  }

  const getClassStats = (className: string) => {
    const classStudents = studentData.filter(student => student.class === className)
    const crewA = classStudents.filter(student => student.crew === "A").length
    const crewB = classStudents.filter(student => student.crew === "B").length
    const total = classStudents.length
    const active = classStudents.filter(student => student.status === "Aktív").length
    
    return { crewA, crewB, total, active }
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
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">Stáb Kezelése</h1>
                      <p className="text-muted-foreground">Diákok és médiatanárok nyilvántartása</p>
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Új személy hozzáadása
                      </Button>
                    </div>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                      <TabsTrigger value="students" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Diákok
                      </TabsTrigger>
                      <TabsTrigger value="admins" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Médiatanárok
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Összesen: <strong>{stats.total}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Aktív: <strong>{stats.active}</strong></span>
                      </div>
                      {activeTab === "students" && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>A stáb: <strong>{stats.crewA}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>B stáb: <strong>{stats.crewB}</strong></span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={`${activeTab === "students" ? "Diák" : "Médiatanár"} keresése név vagy email alapján...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {activeTab === "students" && (
                      <>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Osztály" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Összes osztály</SelectItem>
                            {classes.map((className) => (
                              <SelectItem key={className} value={className}>{className}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={selectedCrew} onValueChange={setSelectedCrew}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Stáb" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Összes stáb</SelectItem>
                            <SelectItem value="A">A stáb</SelectItem>
                            <SelectItem value="B">B stáb</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </div>

                  <TabsContent value="students" className="space-y-6">
                    {selectedClass === "all" && selectedCrew === "all" && !searchTerm && (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
                        {classes.map((className) => {
                          const classStats = getClassStats(className)
                          return (
                            <Card key={className} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg font-semibold">{className}</CardTitle>
                                  <Badge variant="outline" className="text-xs">
                                    {classStats.total} fő
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">A stáb</span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      <span className="font-medium">{classStats.crewA}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">B stáb</span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                      <span className="font-medium">{classStats.crewB}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between pt-2 border-t">
                                    <span className="text-sm font-medium">Aktív</span>
                                    <span className="font-medium text-green-600">{classStats.active}/{classStats.total}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}

                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Diákok listája</CardTitle>
                            <CardDescription>
                              {filteredStudents.length} diák találat
                              {(selectedClass !== "all" || selectedCrew !== "all" || searchTerm) && 
                                ` szűrés után`
                              }
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Filter className="mr-2 h-4 w-4" />
                              Exportálás
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {filteredStudents.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Users className="mx-auto h-12 w-12 opacity-50 mb-4" />
                            <p className="text-lg font-medium">Nincs találat</p>
                            <p className="text-sm">Próbálj meg más keresési feltételekkel</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-3 font-medium">Diák</th>
                                  <th className="text-left p-3 font-medium">Osztály & Stáb</th>
                                  <th className="text-left p-3 font-medium">Státusz</th>
                                  <th className="text-left p-3 font-medium">Kapcsolat</th>
                                  <th className="text-left p-3 font-medium">Műveletek</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredStudents.map((student) => (
                                  <tr key={student.id} className="border-b hover:bg-muted/50 transition-colors">
                                    <td className="p-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                          {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div>
                                          <div className="font-medium">{student.name}</div>
                                          <div className="text-sm text-muted-foreground">{student.email}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <div className="flex gap-2">
                                        <Badge variant="secondary" className="font-medium">
                                          {student.class}
                                        </Badge>
                                        <Badge 
                                          variant="outline" 
                                          className={`font-medium ${
                                            student.crew === "A" 
                                              ? "border-purple-200 text-purple-700 bg-purple-50" 
                                              : "border-orange-200 text-orange-700 bg-orange-50"
                                          }`}
                                        >
                                          {student.crew} stáb
                                        </Badge>
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <Badge 
                                        variant={student.status === "Aktív" ? "default" : "destructive"}
                                        className="font-medium"
                                      >
                                        {student.status}
                                      </Badge>
                                    </td>
                                    <td className="p-3">
                                      <div className="text-sm space-y-1">
                                        <div className="font-medium">{student.phone}</div>
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <div className="flex gap-1">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="sm" asChild>
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
                                            <Button variant="ghost" size="sm" asChild>
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
                                            <Button variant="ghost" size="sm">
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Részletek megtekintése</p>
                                          </TooltipContent>
                                        </Tooltip>
                                        
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>További műveletek</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="admins" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Médiatanárok</CardTitle>
                            <CardDescription>
                              {filteredAdmins.length} médiatanár - csak megtekintés engedélyezett
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Csak olvasás
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {filteredAdmins.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <ShieldCheck className="mx-auto h-12 w-12 opacity-50 mb-4" />
                            <p className="text-lg font-medium">Nincs találat</p>
                            <p className="text-sm">Próbálj meg más keresési feltételekkel</p>
                          </div>
                        ) : (
                          <div className="grid gap-4 md:grid-cols-2">
                            {filteredAdmins.map((admin) => (
                              <Card key={admin.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                  <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                      {admin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{admin.name}</h3>
                                        <Badge 
                                          variant={admin.status === "Aktív" ? "default" : "secondary"}
                                          className="text-xs"
                                        >
                                          {admin.status}
                                        </Badge>
                                      </div>
                                      <p className="text-sm font-medium text-muted-foreground">{admin.role}</p>
                                      <p className="text-xs text-muted-foreground">{admin.department}</p>
                                      
                                      <div className="pt-3 space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                          <Mail className="h-3 w-3 text-muted-foreground" />
                                          <a href={`mailto:${admin.email}`} className="text-blue-600 hover:underline">
                                            {admin.email}
                                          </a>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <Phone className="h-3 w-3 text-muted-foreground" />
                                          <a href={`tel:${admin.phone}`} className="text-blue-600 hover:underline">
                                            {admin.phone}
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
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
