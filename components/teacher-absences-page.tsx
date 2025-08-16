"use client"

import { StandardizedLayout } from "@/components/standardized-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Calendar,
  Search,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  getSchoolAbsences,
  updateSchoolAbsence,
  getAbsenceStatusColor,
  getAbsenceStatusText,
  type Absence,
} from "@/lib/config/absences"

const SCHOOL_SCHEDULE = {
  1: { name: "1. óra", start: "08:25", end: "09:10" },
  2: { name: "2. óra", start: "09:20", end: "10:05" },
  3: { name: "3. óra", start: "10:20", end: "11:05" },
  4: { name: "4. óra", start: "11:15", end: "12:00" },
  5: { name: "5. óra", start: "12:20", end: "13:05" },
  6: { name: "6. óra", start: "13:25", end: "14:10" },
  7: { name: "7. óra", start: "14:20", end: "15:05" },
  8: { name: "8. óra", start: "15:15", end: "16:00" },
}

// Extended absence type for UI display
type ExtendedAbsence = Absence & {
  studentName: string
  studentId: string
  studentClass: string
  shootingTitle: string
  shootingId: string
  affectedClasses: number[]
  timeFrom: string
  timeTo: string
}

export function TeacherAbsencesPage() {
  const { user } = useAuth()
  const [allAbsences, setAllAbsences] = useState<ExtendedAbsence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<Set<number>>(new Set())
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "excused" | "unexcused">("all")
  const [selectedStudent, setSelectedStudent] = useState<string>("all")
  const [groupBy, setGroupBy] = useState<"shooting" | "student">("shooting")

  // Load absences from API
  const loadAbsences = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const rawAbsences = await getSchoolAbsences()
      
      // Transform to extended format for UI
      const transformedAbsences: ExtendedAbsence[] = rawAbsences.map(absence => ({
        ...absence,
        studentName: absence.diak.full_name,
        studentId: absence.diak.id.toString(),
        studentClass: absence.osztaly?.name || "Ismeretlen",
        shootingTitle: absence.forgatas.name,
        shootingId: absence.forgatas.id.toString(),
        affectedClasses: absence.affected_classes,
        timeFrom: absence.time_from,
        timeTo: absence.time_to
      }))
      
      setAllAbsences(transformedAbsences)
    } catch (err) {
      console.error('Error loading absences:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt a hiányzások betöltése során')
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    loadAbsences()
  }, [])

  const filteredAbsences = allAbsences.filter((absence) => {
    const matchesSearch =
      absence.shootingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.date.includes(searchTerm)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !absence.excused && !absence.unexcused) ||
      (statusFilter === "excused" && absence.excused) ||
      (statusFilter === "unexcused" && absence.unexcused)

    const matchesStudent = selectedStudent === "all" || absence.studentId === selectedStudent

    return matchesSearch && matchesStatus && matchesStudent
  })

  const getStatusIcon = (absence: ExtendedAbsence) => {
    if (absence.excused) return CheckCircle
    if (absence.unexcused) return XCircle
    return AlertCircle
  }

  const getClassCircleColor = (classNum: number, absence: ExtendedAbsence) => {
    if (!absence.affectedClasses.includes(classNum)) {
      return "bg-gray-700/50 text-gray-500 border border-gray-600/30" // Nem érintett óra
    }

    if (absence.excused) {
      return "bg-green-500 text-white shadow-lg shadow-green-500/25" // Igazolt
    } else if (absence.unexcused) {
      return "bg-red-500 text-white shadow-lg shadow-red-500/25" // Igazolatlan
    } else {
      return "bg-yellow-500 text-white shadow-lg shadow-yellow-500/25" // Elbírálás alatt
    }
  }

  const stats = {
    total: allAbsences.length,
    pending: allAbsences.filter((a) => !a.excused && !a.unexcused).length,
    excused: allAbsences.filter((a) => a.excused).length,
    unexcused: allAbsences.filter((a) => a.unexcused).length,
  }

  const uniqueStudents = Array.from(new Set(allAbsences.map((a) => ({ id: a.studentId, name: a.studentName }))))

  const handleApprove = async (absenceId: number) => {
    try {
      setUpdating(prev => new Set(prev).add(absenceId))
      
      await updateSchoolAbsence(absenceId, {
        excused: true,
        unexcused: false
      })
      
      // Update local state
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: true, unexcused: false, status: 'igazolt' as const }
          : absence
      ))
      
    } catch (err) {
      console.error('Error approving absence:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt az igazolás során')
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev)
        newSet.delete(absenceId)
        return newSet
      })
    }
  }

  const handleReject = async (absenceId: number) => {
    try {
      setUpdating(prev => new Set(prev).add(absenceId))
      
      await updateSchoolAbsence(absenceId, {
        excused: false,
        unexcused: true
      })
      
      // Update local state
      setAllAbsences(prev => prev.map(absence => 
        absence.id === absenceId 
          ? { ...absence, excused: false, unexcused: true, status: 'igazolatlan' as const }
          : absence
      ))
      
    } catch (err) {
      console.error('Error rejecting absence:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt az elutasítás során')
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev)
        newSet.delete(absenceId)
        return newSet
      })
    }
  }

  // Csoportosítás logika
  const groupedAbsences =
    groupBy === "shooting"
      ? filteredAbsences.reduce(
          (groups: Record<string, { shootingTitle: string; date: string; absences: ExtendedAbsence[] }>, absence) => {
            const key = `${absence.shootingId}-${absence.date}`
            if (!groups[key]) {
              groups[key] = {
                shootingTitle: absence.shootingTitle,
                date: absence.date,
                absences: [],
              }
            }
            groups[key].absences.push(absence)
            return groups
          },
          {},
        )
      : filteredAbsences.reduce(
          (groups: Record<string, { studentName: string; studentClass: string; absences: ExtendedAbsence[] }>, absence) => {
            const key = absence.studentId
            if (!groups[key]) {
              groups[key] = {
                studentName: absence.studentName,
                studentClass: absence.studentClass,
                absences: [],
              }
            }
            groups[key].absences.push(absence)
            return groups
          },
          {},
        )

  if (loading) {
    return (
      <StandardizedLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Adatok betöltése...</span>
        </div>
      </StandardizedLayout>
    )
  }

  return (
    <StandardizedLayout>
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Osztály Igazolások
            </h1>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              Osztályfőnök
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Diákok forgatás alapú hiányzásainak kezelése
            </p>
            <Button onClick={loadAbsences} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Frissítés
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{error}</p>
                <Button onClick={() => setError(null)} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Összes hiányzás</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Elbírálás alatt</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold">{stats.excused}</div>
                  <div className="text-sm text-muted-foreground">Igazolt</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-400" />
                <div>
                  <div className="text-2xl font-bold">{stats.unexcused}</div>
                  <div className="text-sm text-muted-foreground">Igazolatlan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Keresés diák, forgatás vagy dátum alapján..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Csoportosítás kapcsoló */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-md border border-border bg-background/50">
                  <span className="text-sm font-medium">Csoportosítás:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGroupBy(groupBy === "shooting" ? "student" : "shooting")}
                    className="h-8 p-1 hover:bg-transparent"
                  >
                    {groupBy === "shooting" ? (
                      <ToggleLeft className="h-5 w-5 text-blue-400" />
                    ) : (
                      <ToggleRight className="h-5 w-5 text-blue-400" />
                    )}
                  </Button>
                  <span className="text-sm font-medium text-blue-400">
                    {groupBy === "shooting" ? "Forgatás" : "Diák"}
                  </span>
                </div>

                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="px-3 py-2 rounded-md border border-border bg-background/50 text-sm min-w-[140px]"
                >
                  <option value="all">Minden diák</option>
                  {uniqueStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className="bg-transparent"
                  >
                    Összes
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                    className="bg-transparent"
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Elbírálás alatt
                  </Button>
                  <Button
                    variant={statusFilter === "excused" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("excused")}
                    className="bg-transparent"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Igazolt
                  </Button>
                  <Button
                    variant={statusFilter === "unexcused" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("unexcused")}
                    className="bg-transparent"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Igazolatlan
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className="text-muted-foreground font-medium">Jelmagyarázat:</span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-green-500/25">
                  1
                </div>
                <span>Igazolt hiányzás</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-red-500/25">
                  2
                </div>
                <span>Igazolatlan hiányzás</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-yellow-500/25">
                  3
                </div>
                <span>Elbírálás alatt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-700/50 border border-gray-600/30 flex items-center justify-center text-gray-500 text-xs font-bold">
                  4
                </div>
                <span>Nem érintett óra</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Absences List */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Osztály Hiányzások ({filteredAbsences.length})
              <Badge variant="outline" className="ml-2">
                {groupBy === "shooting" ? "Forgatás szerint" : "Diák szerint"}
              </Badge>
            </CardTitle>
            <CardDescription>Diákok forgatások alapján automatikusan generált hiányzásai</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(groupedAbsences).length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nincs hiányzás</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || selectedStudent !== "all"
                    ? "Nincs a szűrési feltételeknek megfelelő hiányzás."
                    : "Jelenleg nincs rögzített hiányzás az osztályban."}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedAbsences).map(([key, group], groupIndex) => (
                  <div key={key} className="space-y-4">
                    {/* Csoport fejléc */}
                    <div className="flex items-center gap-3 pb-3 border-b border-border/30">
                      <h3 className="font-semibold text-xl">
                        {groupBy === "shooting"
                          ? `${(group as any).shootingTitle} - ${(group as any).date}`
                          : `${(group as any).studentName} (${(group as any).studentClass})`}
                      </h3>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {(group as any).absences.length} hiányzás
                      </Badge>
                    </div>

                    {/* Csoport elemei */}
                    <div className="space-y-3 ml-6">
                      {(group as any).absences.map((absence: ExtendedAbsence, index: number) => {
                        const StatusIcon = getStatusIcon(absence)
                        const isPending = !absence.excused && !absence.unexcused
                        const isUpdating = updating.has(absence.id)

                        return (
                          <div
                            key={absence.id}
                            className="flex items-center gap-6 p-4 rounded-lg bg-background/30 border border-border/30 hover:bg-background/50 transition-all duration-200"
                            style={{ animationDelay: `${groupIndex * 100 + index * 50}ms` }}
                          >
                            {/* Tanórák körök */}
                            <div className="flex gap-2">
                              {Object.keys(SCHOOL_SCHEDULE).map((classNum) => {
                                const num = Number.parseInt(classNum)
                                return (
                                  <div
                                    key={num}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-110 ${getClassCircleColor(
                                      num,
                                      absence,
                                    )}`}
                                    title={`${SCHOOL_SCHEDULE[num as keyof typeof SCHOOL_SCHEDULE].name} (${
                                      SCHOOL_SCHEDULE[num as keyof typeof SCHOOL_SCHEDULE].start
                                    }-${SCHOOL_SCHEDULE[num as keyof typeof SCHOOL_SCHEDULE].end})`}
                                  >
                                    {num}
                                  </div>
                                )
                              })}
                            </div>

                            {/* Tanuló neve és információk */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-medium text-lg truncate">
                                  {groupBy === "shooting" ? absence.studentName : absence.shootingTitle}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span className="font-medium">
                                    {groupBy === "shooting" ? absence.studentClass : absence.date}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {absence.timeFrom} - {absence.timeTo}
                              </p>
                            </div>

                            {/* Státusz és akciók */}
                            <div className="flex items-center gap-3">
                              <Badge className={`${getAbsenceStatusColor(absence)} px-3 py-1`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {getAbsenceStatusText(absence)}
                              </Badge>

                              {isPending && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprove(absence.id)}
                                    disabled={isUpdating}
                                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30 h-9 px-3"
                                  >
                                    {isUpdating ? (
                                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4 mr-1" />
                                    )}
                                    Igazol
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReject(absence.id)}
                                    disabled={isUpdating}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30 h-9 px-3"
                                  >
                                    {isUpdating ? (
                                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                      <X className="h-4 w-4 mr-1" />
                                    )}
                                    Elutasít
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StandardizedLayout>
  )
}
