"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Clock,
  AlertCircle,
  Calendar,
  Minus,
  Plus,
  RotateCcw,
  Save
} from "lucide-react"
import {
  updateMyAbsenceExtraTime,
  resetMyAbsenceExtraTime,
  type Absence,
  SCHOOL_SCHEDULE
} from "@/lib/config/absences"

interface StudentAbsenceEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  absence: Absence
  onSuccess: () => void
}

export function StudentAbsenceEditModal({
  open,
  onOpenChange,
  absence,
  onSuccess
}: StudentAbsenceEditModalProps) {
  const [extraTimeBefore, setExtraTimeBefore] = useState(absence.student_extra_time_before || 0)
  const [extraTimeAfter, setExtraTimeAfter] = useState(absence.student_extra_time_after || 0)
  const [note, setNote] = useState(absence.student_edit_note || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when absence changes or modal opens
  useEffect(() => {
    if (open) {
      setExtraTimeBefore(absence.student_extra_time_before || 0)
      setExtraTimeAfter(absence.student_extra_time_after || 0)
      setNote(absence.student_edit_note || '')
      setError(null)
    }
  }, [open, absence])

  // Calculate effective times
  const calculateEffectiveTimes = () => {
    const originalFrom = new Date(`2000-01-01T${absence.time_from}`)
    const originalTo = new Date(`2000-01-01T${absence.time_to}`)
    
    const effectiveFrom = new Date(originalFrom.getTime() - (extraTimeBefore * 60000))
    const effectiveTo = new Date(originalTo.getTime() + (extraTimeAfter * 60000))
    
    return {
      from: effectiveFrom.toTimeString().slice(0, 5),
      to: effectiveTo.toTimeString().slice(0, 5)
    }
  }

  // Calculate affected classes based on effective time
  const calculateAffectedClasses = () => {
    const effectiveTimes = calculateEffectiveTimes()
    const affectedClasses = []
    
    for (const [classNum, classTime] of Object.entries(SCHOOL_SCHEDULE)) {
      const classStart = new Date(`2000-01-01T${classTime.start}`)
      const classEnd = new Date(`2000-01-01T${classTime.end}`)
      const effectiveStart = new Date(`2000-01-01T${effectiveTimes.from}`)
      const effectiveEnd = new Date(`2000-01-01T${effectiveTimes.to}`)
      
      // Check if there's any overlap
      if (effectiveStart < classEnd && effectiveEnd > classStart) {
        affectedClasses.push(parseInt(classNum))
      }
    }
    
    return affectedClasses.sort((a, b) => a - b)
  }

  const handleClassClick = (classNum: number) => {
    const classTime = SCHOOL_SCHEDULE[classNum as keyof typeof SCHOOL_SCHEDULE]
    if (!classTime) return
    
    const originalFrom = new Date(`2000-01-01T${absence.time_from}`)
    const originalTo = new Date(`2000-01-01T${absence.time_to}`)
    const classStart = new Date(`2000-01-01T${classTime.start}`)
    const classEnd = new Date(`2000-01-01T${classTime.end}`)
    
    // Calculate how much earlier/later we need to go
    let newExtraTimeBefore = extraTimeBefore
    let newExtraTimeAfter = extraTimeAfter
    
    // If class starts before our original time, we need extra time before
    if (classStart < originalFrom) {
      const minutesBefore = Math.ceil((originalFrom.getTime() - classStart.getTime()) / 60000)
      newExtraTimeBefore = Math.max(newExtraTimeBefore, minutesBefore)
    }
    
    // If class ends after our original time, we need extra time after
    if (classEnd > originalTo) {
      const minutesAfter = Math.ceil((classEnd.getTime() - originalTo.getTime()) / 60000)
      newExtraTimeAfter = Math.max(newExtraTimeAfter, minutesAfter)
    }
    
    setExtraTimeBefore(newExtraTimeBefore)
    setExtraTimeAfter(newExtraTimeAfter)
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await updateMyAbsenceExtraTime(absence.id, {
        extra_time_before: extraTimeBefore,
        extra_time_after: extraTimeAfter,
        note: note.trim() || undefined
      })
      
      onSuccess()
    } catch (err) {
      console.error('Error updating absence:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt a mentés során')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await resetMyAbsenceExtraTime(absence.id)
      onSuccess()
    } catch (err) {
      console.error('Error resetting absence:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt a visszaállítás során')
    } finally {
      setLoading(false)
    }
  }

  const effectiveTimes = calculateEffectiveTimes()
  const affectedClasses = calculateAffectedClasses()
  const hasChanges = extraTimeBefore !== (absence.student_extra_time_before || 0) || 
                    extraTimeAfter !== (absence.student_extra_time_after || 0) || 
                    note !== (absence.student_edit_note || '')

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hiányzás korrigálása
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Absence Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{absence.forgatas.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(absence.date).toLocaleDateString('hu-HU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Eredeti idő:</span>
                <span className="font-medium">
                  {formatTime(absence.time_from)} - {formatTime(absence.time_to)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Time Adjustment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Idő korrigálás</h3>
            
            {/* Extra time before */}
            <div className="space-y-2">
              <Label htmlFor="extraTimeBefore">Extra idő előtte (perc)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExtraTimeBefore(Math.max(0, extraTimeBefore - 15))}
                  disabled={extraTimeBefore <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="extraTimeBefore"
                  type="number"
                  min="0"
                  max="480"
                  value={extraTimeBefore}
                  onChange={(e) => setExtraTimeBefore(Math.max(0, Math.min(480, parseInt(e.target.value) || 0)))}
                  className="w-24 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExtraTimeBefore(Math.min(480, extraTimeBefore + 15))}
                  disabled={extraTimeBefore >= 480}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  (korábban távozás)
                </span>
              </div>
            </div>

            {/* Extra time after */}
            <div className="space-y-2">
              <Label htmlFor="extraTimeAfter">Extra idő utána (perc)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExtraTimeAfter(Math.max(0, extraTimeAfter - 15))}
                  disabled={extraTimeAfter <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="extraTimeAfter"
                  type="number"
                  min="0"
                  max="480"
                  value={extraTimeAfter}
                  onChange={(e) => setExtraTimeAfter(Math.max(0, Math.min(480, parseInt(e.target.value) || 0)))}
                  className="w-24 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExtraTimeAfter(Math.min(480, extraTimeAfter + 15))}
                  disabled={extraTimeAfter >= 480}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  (később visszatérés)
                </span>
              </div>
            </div>

            {/* Effective time display */}
            {(extraTimeBefore > 0 || extraTimeAfter > 0) && (
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Korrigált idő:</span>
                  <span className="font-mono font-medium text-blue-600">
                    {formatTime(effectiveTimes.from)} - {formatTime(effectiveTimes.to)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Class Circles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tanórák gyorsválasztás</h3>
            <p className="text-sm text-muted-foreground">
              Kattints egy tanórára, hogy automatikusan beállítsd az időt annak lefedéséhez.
            </p>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
              {Object.entries(SCHOOL_SCHEDULE).map(([classNum, classTime]) => {
                const isAffected = affectedClasses.includes(parseInt(classNum))
                const isOriginallyAffected = absence.affected_classes.includes(parseInt(classNum))
                
                return (
                  <button
                    key={classNum}
                    onClick={() => handleClassClick(parseInt(classNum))}
                    className={`
                      relative p-3 rounded-full border-2 transition-all text-sm font-medium
                      ${isAffected 
                        ? 'bg-blue-500 border-blue-600 text-white shadow-lg' 
                        : isOriginallyAffected
                        ? 'bg-yellow-500 border-yellow-600 text-white'
                        : 'bg-background border-border hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950'
                      }
                    `}
                    title={`${classTime.name}: ${classTime.start}-${classTime.end}`}
                  >
                    {classNum}
                    {isAffected && !isOriginallyAffected && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></span>
                    )}
                  </button>
                )
              })}
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Eredeti hiányzás</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Korrigált hiányzás</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span>Új érintett óra</span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Megjegyzés (opcionális)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Magyarázat a korrigáláshoz..."
              maxLength={500}
              rows={3}
            />
            <div className="text-xs text-muted-foreground text-right">
              {note.length}/500 karakter
            </div>
          </div>

          {/* Affected Classes Summary */}
          {affectedClasses.length > 0 && (
            <div className="space-y-2">
              <Label>Érintett tanórák</Label>
              <div className="flex flex-wrap gap-2">
                {affectedClasses.map(classNum => {
                  const classTime = SCHOOL_SCHEDULE[classNum as keyof typeof SCHOOL_SCHEDULE]
                  const isNew = !absence.affected_classes.includes(classNum)
                  return (
                    <Badge
                      key={classNum}
                      variant={isNew ? "default" : "secondary"}
                      className={isNew ? "bg-purple-500 text-white" : ""}
                    >
                      {classTime.name} ({classTime.start}-{classTime.end})
                      {isNew && " *"}
                    </Badge>
                  )
                })}
              </div>
              {affectedClasses.some(c => !absence.affected_classes.includes(c)) && (
                <p className="text-xs text-muted-foreground">
                  * = Új érintett óra a korrigálás miatt
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {absence.student_edited && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Visszaállítás
            </Button>
          )}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Mégse
          </Button>
          
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading || !hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Mentés...' : 'Mentés'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}