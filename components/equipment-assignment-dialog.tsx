'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Calendar, AlertCircle, CheckCircle2, XCircle, Search } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

import { apiClient } from '@/lib/api'
import type { 
  EquipmentSchema,
  ForgatSchema
} from '@/lib/api'
import { useApiQuery } from '@/lib/api-helpers'

interface EquipmentAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  initialSessionId?: string | null
}

interface AvailabilityConflict {
  equipmentId: number
  equipmentName: string
  conflictingSession: {
    id: number
    title: string
    startDate: string
    endDate: string
  }
}

export function EquipmentAssignmentDialog({
  open,
  onOpenChange,
  onSuccess,
  initialSessionId
}: EquipmentAssignmentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form state
  const [selectedSession, setSelectedSession] = useState<string>('')
  const [selectedEquipment, setSelectedEquipment] = useState<number[]>([])
  const [availabilityConflicts, setAvailabilityConflicts] = useState<AvailabilityConflict[]>([])

  // Fetch data
  const { data: filmingSessions = [] } = useApiQuery(
    () => open ? apiClient.getFilmingSessions() : Promise.resolve([]),
    [open]
  )

  const { data: equipment = [] } = useApiQuery(
    () => open ? apiClient.getEquipment(true) : Promise.resolve([]), // Only functional equipment
    [open]
  )

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setAvailabilityConflicts([])
      setSearchTerm('')
      
      // Only reset session if no initial session is provided
      if (!initialSessionId) {
        setSelectedSession('')
        setSelectedEquipment([])
      }
    }
  }, [open, initialSessionId])

  // Handle initial session selection when filming sessions data is available
  useEffect(() => {
    if (open && initialSessionId && filmingSessions && filmingSessions.length > 0) {
      setSelectedSession(initialSessionId)
      
      // Auto-load equipment for the initial session
      const session = filmingSessions.find((s: ForgatSchema) => s.id.toString() === initialSessionId)
      if (session && session.equipment_ids) {
        setSelectedEquipment(session.equipment_ids)
      } else {
        setSelectedEquipment([])
      }
    }
  }, [open, initialSessionId, filmingSessions])

  // Filter equipment based on search
  const filteredEquipment = (equipment || []).filter((item: EquipmentSchema) =>
    item.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.equipment_type?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Check availability function
  const checkAvailability = React.useCallback(async () => {
    if (!selectedSession || selectedEquipment.length === 0) return

    setCheckingAvailability(true)
    try {
      const targetSession = (filmingSessions || []).find((s: ForgatSchema) => s.id.toString() === selectedSession)
      if (!targetSession) return

      const conflicts: AvailabilityConflict[] = []
      
      // Check each selected equipment for conflicts
      selectedEquipment.forEach(equipId => {
        const equip = (equipment || []).find((e: EquipmentSchema) => e.id === equipId)
        if (!equip) return

        // Find all sessions that have this equipment assigned (except the target session)
        const conflictingSessions = (filmingSessions || []).filter((session: ForgatSchema) => {
          if (session.id === targetSession.id) return false // Skip the target session
          if (!session.equipment_ids || !session.equipment_ids.includes(equipId)) return false

          // Check if there's a time overlap
          const targetStart = new Date(`${targetSession.date}T${targetSession.time_from}`)
          const targetEnd = new Date(`${targetSession.date}T${targetSession.time_to}`)
          const sessionStart = new Date(`${session.date}T${session.time_from}`)
          const sessionEnd = new Date(`${session.date}T${session.time_to}`)

          // Check for overlap
          return (
            (targetStart >= sessionStart && targetStart < sessionEnd) ||
            (targetEnd > sessionStart && targetEnd <= sessionEnd) ||
            (sessionStart >= targetStart && sessionStart < targetEnd) ||
            (sessionEnd > targetStart && sessionEnd <= targetEnd)
          )
        })

        // Add conflicts for this equipment
        conflictingSessions.forEach(session => {
          conflicts.push({
            equipmentId: equipId,
            equipmentName: equip.nickname,
            conflictingSession: {
              id: session.id,
              title: session.name,
              startDate: session.date,
              endDate: session.date
            }
          })
        })
      })
      
      setAvailabilityConflicts(conflicts)
    } catch (error) {
      console.error('Error checking availability:', error)
      toast.error('Hiba történt az elérhetőség ellenőrzése során.')
    } finally {
      setCheckingAvailability(false)
    }
  }, [selectedSession, selectedEquipment, filmingSessions, equipment])

  // Check availability when session or equipment selection changes
  useEffect(() => {
    if (selectedSession && selectedEquipment.length > 0) {
      checkAvailability()
    } else {
      setAvailabilityConflicts([])
    }
  }, [selectedSession, selectedEquipment, checkAvailability])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSession) {
      toast.error('Válasszon ki egy forgatást!')
      return
    }

    // Allow empty selection (for removing all equipment)
    // But check for conflicts only if equipment is selected
    if (selectedEquipment.length > 0 && availabilityConflicts.length > 0) {
      toast.error('Van ütközés a kiválasztott felszerelésekkel!')
      return
    }

    setLoading(true)
    
    try {
      // Get the current filming session data to compare changes
      const currentSession = await apiClient.getFilmingSession(parseInt(selectedSession))
      const existingEquipment = currentSession.equipment_ids || []
      
      // Update the filming session with the exact selected equipment
      await apiClient.updateFilmingSession(parseInt(selectedSession), {
        equipment_ids: selectedEquipment
      })
      
      const newlyAssigned = selectedEquipment.filter(id => !existingEquipment.includes(id))
      const removed = existingEquipment.filter(id => !selectedEquipment.includes(id))
      const unchanged = selectedEquipment.filter(id => existingEquipment.includes(id))
      
      // Build success message based on changes
      const messages = []
      if (newlyAssigned.length > 0) {
        messages.push(`${newlyAssigned.length} új felszerelés hozzárendelve`)
      }
      if (removed.length > 0) {
        messages.push(`${removed.length} felszerelés eltávolítva`)
      }
      if (unchanged.length > 0 && (newlyAssigned.length > 0 || removed.length > 0)) {
        messages.push(`${unchanged.length} változatlan`)
      }
      
      if (messages.length > 0) {
        toast.success(`Frissítve: ${messages.join(', ')}`)
      } else {
        toast.info('Nincs változás a felszerelés-hozzárendelésekben.')
      }
      
      // Reset form
      setSelectedSession('')
      setSelectedEquipment([])
      setAvailabilityConflicts([])
      
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error assigning equipment:', error)
      toast.error('Hiba történt a felszerelés hozzárendelése során.')
    } finally {
      setLoading(false)
    }
  }

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId)
    
    // Automatically select equipment that's already assigned to this session
    if (sessionId) {
      const session = (filmingSessions || []).find((s: ForgatSchema) => s.id.toString() === sessionId)
      if (session && session.equipment_ids) {
        setSelectedEquipment(session.equipment_ids)
      } else {
        setSelectedEquipment([])
      }
    } else {
      setSelectedEquipment([])
    }
    
    // Clear any previous conflicts since equipment selection changed
    setAvailabilityConflicts([])
  }

  const toggleEquipmentSelection = (equipmentId: number) => {
    setSelectedEquipment(prev => 
      prev.includes(equipmentId)
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    )
  }

  const selectedSessionData = (filmingSessions || []).find((s: ForgatSchema) => s.id.toString() === selectedSession)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Felszerelés hozzárendelése forgatáshoz
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Session Selection */}
          <div className="space-y-2">
            <Label htmlFor="session-select" className="text-sm font-medium">
              Forgatás kiválasztása <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedSession} onValueChange={handleSessionSelect}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Válasszon forgatást">
                  {selectedSessionData && (
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="truncate">{selectedSessionData.name}</span>
                      <Badge variant="outline" className="flex-shrink-0">
                        {format(new Date(`${selectedSessionData.date}T${selectedSessionData.time_from}`), 'MMM dd', { locale: hu })}
                      </Badge>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {(filmingSessions || []).map((session: ForgatSchema) => (
                  <SelectItem key={session.id} value={session.id.toString()} className="py-3">
                    <div className="flex flex-col items-start gap-1 w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium truncate pr-2">{session.name}</span>
                        <Badge variant="outline" className="flex-shrink-0 text-xs">
                          {format(new Date(`${session.date}T${session.time_from}`), 'MMM dd', { locale: hu })}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(`${session.date}T${session.time_from}`), 'HH:mm', { locale: hu })} - 
                        {format(new Date(`${session.date}T${session.time_to}`), 'HH:mm', { locale: hu })}
                        {session.location && ` • ${JSON.stringify(session.location)}`}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Details */}
          {selectedSessionData && (
            <Card className="bg-muted/50 border-muted-foreground/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Forgatás részletei
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kezdés</span>
                    <div className="font-mono text-sm bg-background border rounded px-2 py-1">
                      {format(new Date(`${selectedSessionData.date}T${selectedSessionData.time_from}`), 'yyyy. MMM dd. HH:mm', { locale: hu })}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Befejezés</span>
                    <div className="font-mono text-sm bg-background border rounded px-2 py-1">
                      {format(new Date(`${selectedSessionData.date}T${selectedSessionData.time_to}`), 'yyyy. MMM dd. HH:mm', { locale: hu })}
                    </div>
                  </div>
                </div>
                {selectedSessionData.location && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Helyszín</span>
                    <div className="bg-primary/10 border border-primary/20 text-primary px-2 py-1 rounded text-xs">
                      {typeof selectedSessionData.location === 'object' && selectedSessionData.location !== null
                        ? (
                          <div className="space-y-0.5">
                            <div className="font-medium">{selectedSessionData.location.name || 'Névtelen helyszín'}</div>
                            {selectedSessionData.location.address && (
                              <div className="text-xs opacity-80">{selectedSessionData.location.address}</div>
                            )}
                          </div>
                        )
                        : selectedSessionData.location
                      }
                    </div>
                  </div>
                )}
                {selectedSessionData.notes && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Megjegyzések</span>
                    <div className="text-sm bg-background border rounded p-2">
                      {selectedSessionData.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Equipment Search */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="equipment-search" className="text-sm font-medium">
                Felszerelés keresése
              </Label>
              <Badge variant="secondary" className="text-xs">
                {filteredEquipment.length} találat
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="equipment-search"
                placeholder="Keresés név, márka, modell vagy típus alapján..."
                className="pl-10 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-9 w-9 p-0"
                  onClick={() => setSearchTerm('')}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Equipment Selection */}
          <div className="space-y-3 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Felszerelések
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant={selectedEquipment.length > 0 ? "default" : "secondary"} className="text-xs">
                  {(() => {
                    const alreadyAssigned = selectedSessionData?.equipment_ids || []
                    const newlySelected = selectedEquipment.filter(id => !alreadyAssigned.includes(id))
                    const total = selectedEquipment.length
                    
                    if (total === 0) return '0 kiválasztva'
                    if (newlySelected.length === 0) return `${total} (mind régi)`
                    if (alreadyAssigned.length === 0) return `${total} (mind új)`
                    return `${total} (${newlySelected.length} új)`
                  })()}
                </Badge>
                {selectedEquipment.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Keep only the equipment that was already assigned to this session
                        const alreadyAssigned = selectedSessionData?.equipment_ids || []
                        setSelectedEquipment(alreadyAssigned)
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      Újak törlése
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEquipment([])}
                      className="h-7 px-2 text-xs"
                    >
                      Összes törlése
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <ScrollArea className="flex-1 border rounded-lg">
              <div className="p-2 space-y-1">
                {filteredEquipment.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="text-center">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nincs találat</p>
                      {searchTerm && (
                        <p className="text-xs mt-1">
                          Próbáljon más keresési kifejezést
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredEquipment.map((item: EquipmentSchema) => {
                    const isSelected = selectedEquipment.includes(item.id)
                    const hasConflict = availabilityConflicts.some(c => c.equipmentId === item.id)
                    const wasAlreadyAssigned = selectedSessionData?.equipment_ids?.includes(item.id) || false
                    
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? hasConflict 
                              ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 shadow-sm' 
                              : 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 shadow-sm'
                            : 'hover:bg-muted/50 hover:shadow-sm'
                        }`}
                        onClick={() => toggleEquipmentSelection(item.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors ${
                              isSelected 
                                ? hasConflict
                                  ? 'bg-red-500 border-red-500'
                                  : 'bg-primary border-primary'
                                : 'border-muted-foreground/50 hover:border-muted-foreground'
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{item.nickname}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <span className="truncate">
                                {item.brand && `${item.brand} `}
                                {item.model}
                              </span>
                              {item.equipment_type && (
                                <Badge variant="secondary" className="text-xs flex-shrink-0">
                                  {item.equipment_type.emoji} {item.equipment_type.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {wasAlreadyAssigned && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                              Már hozzárendelve
                            </Badge>
                          )}
                          {checkingAvailability && isSelected && (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          )}
                          {hasConflict && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-xs hidden sm:inline">Ütközés</span>
                            </div>
                          )}
                          {isSelected && !hasConflict && !checkingAvailability && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-xs hidden sm:inline">Elérhető</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Availability conflicts */}
          {availabilityConflicts.length > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Elérhetőségi ütközések ({availabilityConflicts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {availabilityConflicts.map((conflict) => (
                    <div key={conflict.equipmentId} className="bg-white border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-red-700">
                            {conflict.equipmentName}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Már foglalt: <span className="font-medium">{conflict.conflictingSession.title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 font-mono">
                            {format(new Date(conflict.conflictingSession.startDate), 'MMM dd. HH:mm', { locale: hu })} - 
                            {format(new Date(conflict.conflictingSession.endDate), 'MMM dd. HH:mm', { locale: hu })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Mégse
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedSession || availabilityConflicts.length > 0}
            >
              {loading ? 'Mentés...' : 'Mentés'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}