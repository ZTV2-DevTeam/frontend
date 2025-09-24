'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useUserRole } from '@/contexts/user-role-context'
import { useAuth } from '@/contexts/auth-context'
import { StandardizedLayout } from '@/components/standardized-layout'
import { CalendarDays, Clock, FileText, RefreshCw, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  getAbsenceStatusColor, 
  getAbsenceStatusText, 
  getAffectedClassesText,
  type Absence
} from '@/lib/config/absences'
import { format, parseISO } from 'date-fns'
import { hu } from 'date-fns/locale'

export function StudentAbsencesPage() {
  const { currentRole } = useUserRole()
  const { user } = useAuth()
  const [absences, setAbsences] = useState<Absence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load student's absences
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // For students, this page has been converted to an informational page
      // about automatic absence handling - no longer showing demo data
      
      // Demo absence data for students
      const demoAbsences: Absence[] = [
        {
          id: 1,
          diak: {
            id: user?.user_id || 1,
            username: user?.username || 'student',
            first_name: user?.first_name || 'Demo',
            last_name: user?.last_name || 'Student',
            full_name: `${user?.last_name || 'Student'} ${user?.first_name || 'Demo'}`
          },
          forgatas: {
            id: 1,
            name: 'Karácsonyi műsor felvétel',
            date: '2024-12-20',
            time_from: '08:00',
            time_to: '11:30',
            type: 'rendes'
          },
          date: '2024-12-20',
          time_from: '08:00',
          time_to: '11:30',
          excused: true,
          unexcused: false,
          status: 'igazolt',
          affected_classes: [1, 2, 3],
          affected_classes_with_student_time: [1, 2, 3],
          student_extra_time_before: 0,
          student_extra_time_after: 0,
          student_edited: false,
          effective_time_from: '08:00',
          effective_time_to: '11:30',
          osztaly: {
            id: 1,
            name: 'NYF',
            szekcio: 'NYF',
            start_year: 2024
          }
        },
        {
          id: 2,
          diak: {
            id: user?.user_id || 1,
            username: user?.username || 'student',
            first_name: user?.first_name || 'Demo',
            last_name: user?.last_name || 'Student',
            full_name: `${user?.last_name || 'Student'} ${user?.first_name || 'Demo'}`
          },
          forgatas: {
            id: 2,
            name: 'Interjú készítése',
            date: '2024-12-18',
            time_from: '13:00',
            time_to: '15:30',
            type: 'rendes'
          },
          date: '2024-12-18',
          time_from: '13:00',
          time_to: '15:30',
          excused: false,
          unexcused: false,
          status: 'nincs_dontes',
          affected_classes: [6, 7],
          affected_classes_with_student_time: [6, 7],
          student_extra_time_before: 0,
          student_extra_time_after: 0,
          student_edited: false,
          effective_time_from: '13:00',
          effective_time_to: '15:30',
          osztaly: {
            id: 1,
            name: 'NYF',
            szekcio: 'NYF',
            start_year: 2024
          }
        }
      ]
      
      setAbsences(demoAbsences)

    } catch (err) {
      console.error('Error loading absence data:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt az adatok betöltése során')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [loadData])

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
    unexcused: absences.filter(a => a.unexcused && !a.excused).length,
    pending: absences.filter(a => !a.excused && !a.unexcused).length,
  }

  // Group absences by date
  const groupedAbsences = absences.reduce((groups, absence) => {
    const date = absence.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(absence)
    return groups
  }, {} as Record<string, Absence[]>)

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
      <div className="p-6 space-y-6">
        {/* Info about demo data */}
        <Alert className="mb-6">
          <AlertDescription>
            <strong>Figyelem:</strong> Ez egy demo nézet. A diák specifikus API végpontok még fejlesztés alatt állnak.
            Itt láthatók a mintaadatok, hogy tesztelhessük a felület működését.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Saját hiányzások</h1>
            <p className="text-muted-foreground">
              Forgatások miatti hiányzásaim áttekintése
            </p>
          </div>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Frissítés
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <FileText className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Összes hiányzás</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Igazolt</CardTitle>
              <CalendarDays className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.excused}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Igazolatlan</CardTitle>
              <FileText className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.unexcused}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Elbírálás alatt</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Student Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Diák információk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Név:</span>
                <p className="font-medium">{user?.last_name} {user?.first_name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Felhasználónév:</span>
                <p className="font-medium">{user?.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Absences List */}
        <div className="space-y-6">
          {Object.entries(groupedAbsences)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, absences]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    {format(parseISO(date), 'yyyy. MMMM d. (EEEE)', { locale: hu })}
                  </CardTitle>
                  <CardDescription>
                    {absences.length} hiányzás ezen a napon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {absences.map((absence) => (
                      <div
                        key={absence.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-lg mb-1">
                            {absence.forgatas.name}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Forgatás típusa: {absence.forgatas.type}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {absence.time_from} - {absence.time_to}
                            </div>
                            <div>
                              Érintett órák: {getAffectedClassesText(absence.affected_classes)}
                            </div>
                          </div>
                          {absence.osztaly && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Osztály: {absence.osztaly.name}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getAbsenceStatusColor(absence)}>
                            {getAbsenceStatusText(absence)}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            #{absence.id}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

          {absences.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nincs hiányzás</h3>
                <p className="text-muted-foreground">
                  Jelenleg nincs regisztrált hiányzásod forgatások miatt.
                </p>
              </CardContent>
            </Card>
          )}
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
              <p>• A hiányzások automatikusan létrejönnek, amikor forgatásra vagy beosztva.</p>
              <p>• Az osztályfőnököd dönt a hiányzások igazolásáról.</p>
              <p>• Az igazolt hiányzások nem számítanak bele a hiányzási statisztikákba.</p>
              <p>• Kérdés esetén fordulj az osztályfőnöködhöz.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardizedLayout>
  )
}
