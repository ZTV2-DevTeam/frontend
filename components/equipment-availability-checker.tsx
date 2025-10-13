'use client'

import * as React from 'react'
import { useState } from 'react'
import { Calendar, Clock, AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react'
import { format, parseISO, isWithinInterval } from 'date-fns'
import { hu } from 'date-fns/locale'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { apiClient } from '@/lib/api'
import type { EquipmentSchema, ForgatSchema, EquipmentTipusSchema } from '@/lib/api'
import { useApiQuery } from '@/lib/api-helpers'

interface AvailabilityResult {
  equipment: EquipmentSchema
  isAvailable: boolean
  conflicts: {
    session: ForgatSchema
    startTime: Date
    endTime: Date
  }[]
}

interface EquipmentAvailabilityCheckerProps {
  className?: string
}

export function EquipmentAvailabilityChecker({ className }: EquipmentAvailabilityCheckerProps) {
  const [inputMode, setInputMode] = useState<'manual' | 'session'>('manual')
  const [selectedSession, setSelectedSession] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [checking, setChecking] = useState(false)
  const [availabilityResults, setAvailabilityResults] = useState<AvailabilityResult[]>([])

  // Fetch data
  const { data: equipment = [] } = useApiQuery(
    () => apiClient.getEquipment(true), // Only functional equipment
    []
  )

  const { data: equipmentTypes = [] } = useApiQuery(
    () => apiClient.getEquipmentTypes(),
    []
  )

  const { data: filmingSessions = [] } = useApiQuery(
    () => apiClient.getFilmingSessions(),
    []
  )

  // Update date/time when session is selected
  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId)
    
    if (sessionId) {
      const session = (filmingSessions || []).find((s: ForgatSchema) => s.id.toString() === sessionId)
      if (session) {
        setStartDate(session.date)
        setEndDate(session.date)
        setStartTime(session.time_from)
        setEndTime(session.time_to)
      }
    }
  }

  // Check availability for a date/time range
  const checkAvailability = async () => {
    let checkStartDateTime: Date, checkEndDateTime: Date

    if (inputMode === 'session' && selectedSession) {
      const session = (filmingSessions || []).find((s: ForgatSchema) => s.id.toString() === selectedSession)
      if (!session) return
      
      checkStartDateTime = new Date(`${session.date}T${session.time_from}`)
      checkEndDateTime = new Date(`${session.date}T${session.time_to}`)
    } else if (inputMode === 'manual') {
      if (!startDate || !endDate || !startTime || !endTime) {
        return
      }
      checkStartDateTime = new Date(`${startDate}T${startTime}`)
      checkEndDateTime = new Date(`${endDate}T${endTime}`)
    } else {
      return
    }

    setChecking(true)
    try {
      const results: AvailabilityResult[] = []

      // Check each equipment item
      for (const equip of equipment || []) {
        const conflicts: AvailabilityResult['conflicts'] = []

        // Find conflicting sessions for this equipment
        for (const session of filmingSessions || []) {
          // Check if equipment is assigned to this session
          if (session.equipment_ids && session.equipment_ids.includes(equip.id)) {
            const sessionStart = new Date(`${session.date}T${session.time_from}`)
            const sessionEnd = new Date(`${session.date}T${session.time_to}`)

            // Check if there's a time overlap
            const hasOverlap = (
              isWithinInterval(checkStartDateTime, { start: sessionStart, end: sessionEnd }) ||
              isWithinInterval(checkEndDateTime, { start: sessionStart, end: sessionEnd }) ||
              isWithinInterval(sessionStart, { start: checkStartDateTime, end: checkEndDateTime }) ||
              isWithinInterval(sessionEnd, { start: checkStartDateTime, end: checkEndDateTime })
            )

            if (hasOverlap) {
              conflicts.push({
                session,
                startTime: sessionStart,
                endTime: sessionEnd
              })
            }
          }
        }

        results.push({
          equipment: equip,
          isAvailable: conflicts.length === 0,
          conflicts
        })
      }

      setAvailabilityResults(results)
    } catch (error) {
      console.error('Error checking availability:', error)
    } finally {
      setChecking(false)
    }
  }

  // Filter results
  const filteredResults = availabilityResults.filter((result) => {
    const matchesSearch = searchTerm === '' ||
      result.equipment.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.equipment.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.equipment.model?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === 'all' ||
      (result.equipment.equipment_type?.id.toString() === selectedType)

    const matchesAvailability = availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && result.isAvailable) ||
      (availabilityFilter === 'unavailable' && !result.isAvailable)

    return matchesSearch && matchesType && matchesAvailability
  })

  const availableCount = availabilityResults.filter(r => r.isAvailable).length
  const unavailableCount = availabilityResults.filter(r => !r.isAvailable).length

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Date/Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Időszak megadása
            </CardTitle>
            <CardDescription>
              Válasszon egy forgatást vagy adja meg manuálisan az időszakot az elérhetőség ellenőrzéséhez.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input Mode Selection */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  {inputMode === 'session' ? 'Forgatás kiválasztása' : 'Manuális megadás'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {inputMode === 'session' 
                    ? 'Válasszon egy létező forgatást az időszak automatikus beállításához'
                    : 'Adja meg manuálisan a dátum és időpont intervallumot'
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="input-mode-switch" className="text-sm text-muted-foreground">
                  Manuális
                </Label>
                <Switch
                  id="input-mode-switch"
                  checked={inputMode === 'session'}
                  onCheckedChange={(checked) => setInputMode(checked ? 'session' : 'manual')}
                />
                <Label htmlFor="input-mode-switch" className="text-sm text-muted-foreground">
                  Forgatás
                </Label>
              </div>
            </div>

            {/* Session Selection */}
            {inputMode === 'session' && (
              <div className="space-y-2">
                <Label htmlFor="session-select">Forgatás kiválasztása</Label>
                <Select value={selectedSession} onValueChange={handleSessionSelect}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Válasszon forgatást">
                      {selectedSession && (
                        (() => {
                          const session = (filmingSessions || []).find((s: ForgatSchema) => s.id.toString() === selectedSession)
                          return session ? (
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="truncate">{session.name}</span>
                              <Badge variant="outline" className="flex-shrink-0">
                                {format(new Date(`${session.date}T${session.time_from}`), 'MMM dd', { locale: hu })}
                              </Badge>
                            </div>
                          ) : null
                        })()
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
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Selected session details */}
                {selectedSession && (() => {
                  const session = (filmingSessions || []).find((s: ForgatSchema) => s.id.toString() === selectedSession)
                  return session ? (
                    <div className="p-4 bg-muted/50 border border-muted-foreground/20 rounded-lg mt-3">
                      <div className="text-sm font-semibold mb-3">{session.name}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono bg-background border rounded px-2 py-1">
                            {format(new Date(`${session.date}T${session.time_from}`), 'yyyy. MMM dd. (eeee)', { locale: hu })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono bg-background border rounded px-2 py-1">
                            {format(new Date(`${session.date}T${session.time_from}`), 'HH:mm', { locale: hu })} - 
                            {format(new Date(`${session.date}T${session.time_to}`), 'HH:mm', { locale: hu })}
                          </span>
                        </div>
                        {session.location && (
                          <div className="sm:col-span-2 flex items-start gap-2">
                            <div className="h-3 w-3 text-muted-foreground mt-0.5">📍</div>
                            <div className="bg-primary/10 border border-primary/20 text-primary px-2 py-1 rounded text-xs">
                              {typeof session.location === 'object' && session.location !== null
                                ? (
                                  <div className="space-y-0.5">
                                    <div className="font-medium">{session.location.name || 'Névtelen helyszín'}</div>
                                    {session.location.address && (
                                      <div className="text-xs opacity-80">{session.location.address}</div>
                                    )}
                                  </div>
                                )
                                : session.location
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            {/* Manual Date/Time Input */}
            {inputMode === 'manual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Kezdő dátum</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Befejező dátum</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Kezdő időpont</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">Befejező időpont</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button 
                onClick={checkAvailability}
                disabled={checking || (inputMode === 'manual' ? (!startDate || !endDate) : !selectedSession)}
                className="gap-2"
              >
                {checking ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                {checking ? 'Ellenőrzés...' : 'Elérhetőség ellenőrzése'}
              </Button>
              
              {/* Quick actions */}
              {inputMode === 'manual' && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0]
                      setStartDate(today)
                      setEndDate(today)
                    }}
                    className="text-xs"
                  >
                    Ma
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      const tomorrowStr = tomorrow.toISOString().split('T')[0]
                      setStartDate(tomorrowStr)
                      setEndDate(tomorrowStr)
                    }}
                    className="text-xs"
                  >
                    Holnap
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {availabilityResults.length > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Összes felszerelés</CardTitle>
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{availabilityResults.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Ellenőrzött elem</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Elérhető</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{availableCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {availabilityResults.length > 0 ? Math.round((availableCount / availabilityResults.length) * 100) : 0}% az összesből
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Foglalt</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{unavailableCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {unavailableCount > 0 ? `${unavailableCount} ütközés` : 'Nincs ütközés'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Szűrők</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {filteredResults.length} / {availabilityResults.length} elem
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Keresés</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Név, márka vagy modell..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setSearchTerm('')}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Típus</Label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Minden típus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Minden típus</SelectItem>
                          {(equipmentTypes || []).map((type: EquipmentTipusSchema) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.emoji && `${type.emoji} `}{type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Elérhetőség</Label>
                      <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Minden állapot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Minden állapot</SelectItem>
                          <SelectItem value="available">✅ Elérhető</SelectItem>
                          <SelectItem value="unavailable">❌ Foglalt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Filter summary */}
                {(searchTerm || selectedType !== 'all' || availabilityFilter !== 'all') && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">Aktív szűrők:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="text-xs">
                        Keresés: &ldquo;{searchTerm}&rdquo;
                      </Badge>
                    )}
                    {selectedType !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        Típus: {(() => {
                          const type = (equipmentTypes || []).find((t: EquipmentTipusSchema) => t.id.toString() === selectedType)
                          return type ? `${type.emoji} ${type.name}` : selectedType
                        })()}
                      </Badge>
                    )}
                    {availabilityFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        {availabilityFilter === 'available' ? 'Csak elérhető' : 'Csak foglalt'}
                      </Badge>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedType('all')
                        setAvailabilityFilter('all')
                      }}
                      className="ml-auto h-6 text-xs px-2"
                    >
                      Szűrők törlése
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Elérhetőségi eredmények</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {filteredResults.length} elem
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {(() => {
                    if (inputMode === 'session' && selectedSession) {
                      const session = (filmingSessions || []).find((s: ForgatSchema) => s.id.toString() === selectedSession)
                      return session ? (
                        <>Időszak: {session.name} • {format(new Date(`${session.date}T${session.time_from}`), 'yyyy. MMM dd. HH:mm', { locale: hu })} - 
                        {format(new Date(`${session.date}T${session.time_to}`), 'HH:mm', { locale: hu })}</>
                      ) : null
                    }
                    return startDate && endDate ? (
                      <>Időszak: {format(parseISO(startDate), 'yyyy. MMM dd.', { locale: hu })} {startTime} - {' '}
                      {format(parseISO(endDate), 'yyyy. MMM dd.', { locale: hu })} {endTime}</>
                    ) : null
                  })()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredResults.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-1">Nincs eredmény</p>
                      <p className="text-sm">
                        {availabilityResults.length === 0 
                          ? 'Indítsa el az elérhetőség ellenőrzését'
                          : 'Módosítsa a szűrőket más eredmények megtekintéséhez'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block border rounded-lg">
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                              <TableHead className="w-[30%]">Felszerelés</TableHead>
                              <TableHead className="w-[20%]">Típus</TableHead>
                              <TableHead className="w-[15%]">Állapot</TableHead>
                              <TableHead className="w-[35%]">Ütközések</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredResults.map((result) => (
                              <TableRow key={result.equipment.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{result.equipment.nickname}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {result.equipment.brand && `${result.equipment.brand} `}
                                      {result.equipment.model}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {result.equipment.equipment_type && (
                                    <Badge variant="secondary" className="text-xs">
                                      {result.equipment.equipment_type.emoji} {result.equipment.equipment_type.name}
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {result.isAvailable ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                      <CheckCircle2 className="h-4 w-4" />
                                      <span className="text-sm">Elérhető</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-red-600">
                                      <AlertCircle className="h-4 w-4" />
                                      <span className="text-sm">Foglalt</span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {result.conflicts.length > 0 ? (
                                    <div className="space-y-1">
                                      {result.conflicts.map((conflict, index) => (
                                        <div key={index} className="text-sm">
                                          <div className="font-medium text-red-700">
                                            {conflict.session.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground font-mono">
                                            {format(conflict.startTime, 'MMM dd. HH:mm', { locale: hu })} - {' '}
                                            {format(conflict.endTime, 'MMM dd. HH:mm', { locale: hu })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">Nincs ütközés</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden space-y-3">
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3 pr-3">
                          {filteredResults.map((result) => (
                            <Card key={result.equipment.id} className={`${result.isAvailable ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/30' : 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/30'}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm">{result.equipment.nickname}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {result.equipment.brand && `${result.equipment.brand} `}
                                      {result.equipment.model}
                                    </div>
                                    {result.equipment.equipment_type && (
                                      <Badge variant="secondary" className="text-xs mt-2">
                                        {result.equipment.equipment_type.emoji} {result.equipment.equipment_type.name}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex-shrink-0 ml-3">
                                    {result.isAvailable ? (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span className="text-xs font-medium">Elérhető</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-xs font-medium">Foglalt</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {result.conflicts.length > 0 && (
                                  <div className="border-t pt-3">
                                    <div className="text-xs font-medium text-muted-foreground mb-2">Ütközések:</div>
                                    <div className="space-y-2">
                                      {result.conflicts.map((conflict, index) => (
                                        <div key={index} className="bg-background border border-red-200 dark:border-red-800 rounded p-2">
                                          <div className="font-medium text-red-600 text-xs">
                                            {conflict.session.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground font-mono mt-1">
                                            {format(conflict.startTime, 'MMM dd. HH:mm', { locale: hu })} - {' '}
                                            {format(conflict.endTime, 'MMM dd. HH:mm', { locale: hu })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}