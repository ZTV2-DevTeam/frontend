"use client"

import { useState, useEffect } from "react"
import { StandardizedLayout } from "@/components/standardized-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Calendar,
  RefreshCw,
  Edit2,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
  Users,
} from "lucide-react"
import { useUserRole } from "@/contexts/user-role-context"
import {
  getMyAbsences,
  getStudentAbsenceStatusColor,
  getStudentAbsenceStatusText,
  type Absence
} from "@/lib/config/absences"
import { StudentAbsenceEditModal } from "./student-absence-edit-modal"

export function StudentAbsenceManagement() {
  const { currentRole } = useUserRole()
  const [absences, setAbsences] = useState<Absence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Load student's absences
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getMyAbsences()
      setAbsences(data)
    } catch (err) {
      console.error('Error loading absence data:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt az adatok betöltése során')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Check authorization
  if (currentRole !== 'student') {
    return (
      <StandardizedLayout>
        <Alert className="m-6">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            Ez az oldal csak diákok számára érhető el.
          </AlertDescription>
        </Alert>
      </StandardizedLayout>
    )
  }

  // Calculate statistics
  const stats = {
    total: absences.length,
    excused: absences.filter(a => a.excused && !a.unexcused).length,
    unexcused: absences.filter(a => !a.excused && a.unexcused).length,
    pending: absences.filter(a => !a.excused && !a.unexcused).length,
    edited: absences.filter(a => a.student_edited).length,
  }

  const handleEditAbsence = (absence: Absence) => {
    setSelectedAbsence(absence)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    // Reload data after successful edit
    loadData()
    setEditModalOpen(false)
    setSelectedAbsence(null)
  }

  const formatTime = (timeString: string): string => {
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return timeString
    }
  }

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <StandardizedLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Hiányzások betöltése...
          </div>
        </div>
      </StandardizedLayout>
    )
  }

  return (
    <StandardizedLayout>
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Saját hiányzások</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Forgatások miatti hiányzásaim kezelése és korrigálása
            </p>
          </div>
          <Button onClick={loadData} variant="outline" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Frissítés
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Összes</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Igazolt</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.excused}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Igazolatlan</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.unexcused}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Elbírálás alatt</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Korrigálva</CardTitle>
              <Edit2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.edited}</div>
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tudnivalók
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Hiányzásaid automatikusan létrejönnek, amikor forgatásra vagy beosztva.</p>
              <p>• Korrigálhatod a hiányzásaidat, ha a rendszerben lévő információ nem pontos.</p>
              <p>• A korrigálás alatt megadhatod, hogy korábban kell távoznod vagy később térsz vissza.</p>
              <p>• Az osztályfőnökök mostantól a hiányzásaidat az <a href="https://igazolas.szlg.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Igazoláskezelő felületén</a> érik el.</p>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Jelmagyarázat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-green-500/25 flex-shrink-0">
                  1
                </div>
                <span>Igazolt hiányzás</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-red-500/25 flex-shrink-0">
                  2
                </div>
                <span>Igazolatlan hiányzás</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-yellow-500/25 flex-shrink-0">
                  3
                </div>
                <span>Elbírálás alatt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-700/50 border border-gray-600/30 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                  4
                </div>
                <span>Nem érintett óra</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex-shrink-0">
                  K
                </div>
                <span>Korrigálva (diák által)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Absences List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Saját hiányzások ({absences.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {absences.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nincs hiányzás</h3>
                <p className="text-muted-foreground">
                  Jelenleg nincsenek hiányzásaid a rendszerben.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {absences.map((absence, index) => {
                  const getClassCircleColor = (classNum: number) => {
                    const isAffected = absence.student_edited 
                      ? absence.affected_classes_with_student_time.includes(classNum)
                      : absence.affected_classes.includes(classNum)
                    
                    if (!isAffected) {
                      return "bg-gray-700/50 text-gray-500 border border-gray-600/30" // Nem érintett óra
                    }

                    // If student edited, show purple overlay for new affected classes
                    if (absence.student_edited && absence.affected_classes_with_student_time.includes(classNum) && !absence.affected_classes.includes(classNum)) {
                      return "bg-purple-500 text-white shadow-lg shadow-purple-500/25" // Új óra korrigálás után
                    }

                    if (absence.excused) {
                      return "bg-green-500 text-white shadow-lg shadow-green-500/25" // Igazolt
                    } else if (absence.unexcused) {
                      return "bg-red-500 text-white shadow-lg shadow-red-500/25" // Igazolatlan
                    } else {
                      return "bg-yellow-500 text-white shadow-lg shadow-yellow-500/25" // Elbírálás alatt
                    }
                  }

                  return (
                    <div
                      key={absence.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 rounded-lg bg-background/30 border border-border/30 hover:bg-background/50 transition-all duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Tanórák körök */}
                      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((classNum) => (
                          <div
                            key={classNum}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all hover:scale-110 flex-shrink-0 ${getClassCircleColor(classNum)}`}
                            title={`${classNum}. óra`}
                          >
                            {classNum}
                          </div>
                        ))}
                      </div>

                      {/* Forgatás neve és információk */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <h4 className="font-medium text-base sm:text-lg truncate">{absence.forgatas.name}</h4>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="font-medium">{formatDate(absence.date)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            {absence.student_edited ? (
                              <span className="block sm:inline">
                                <span className="line-through opacity-60">
                                  {formatTime(absence.time_from)} - {formatTime(absence.time_to)}
                                </span>
                                <span className="block sm:inline sm:ml-2 font-medium text-purple-600 mt-1 sm:mt-0">
                                  {formatTime(absence.effective_time_from)} - {formatTime(absence.effective_time_to)}
                                </span>
                              </span>
                            ) : (
                              `${formatTime(absence.time_from)} - ${formatTime(absence.time_to)}`
                            )}
                          </p>
                          
                          {absence.student_edited && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs text-purple-600">
                              <div className="flex items-center gap-1">
                                <Edit2 className="h-3 w-3" />
                                <span>Korrigálva</span>
                              </div>
                              {absence.student_edit_timestamp && (
                                <span className="text-muted-foreground text-xs">
                                  {new Date(absence.student_edit_timestamp).toLocaleString('hu-HU')}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {absence.student_edit_note && (
                            <p className="text-xs text-purple-700 dark:text-purple-300 italic">
                              &ldquo;{absence.student_edit_note}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Státusz és akciók */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Badge className={getStudentAbsenceStatusColor(absence)}>
                            {getStudentAbsenceStatusText(absence)}
                          </Badge>
                          
                          {absence.student_edited && (
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                              Korrigálva
                            </Badge>
                          )}
                        </div>

                        <Button
                          onClick={() => handleEditAbsence(absence)}
                          size="sm"
                          variant="outline"
                          className="flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Korrigálás</span>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        {selectedAbsence && (
          <StudentAbsenceEditModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            absence={selectedAbsence}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </StandardizedLayout>
  )
}