"use client"

import React, { useState } from 'react'
import { apiClient } from '@/lib/api'
import type { ForgatSchema } from '@/lib/api'

// Helper functions for formatting
const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

const formatTime = (timeStr: string) => {
  return timeStr?.slice(0, 5) || ''
}
import { FilmingSessionTypeSelector } from '@/components/filming-session-type-selector'
import { FilmingSessionTypeBadge } from '@/components/filming-session-type-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Users, MapPin, Clock, Search, Filter, Loader2, AlertCircle } from 'lucide-react'

import { useApiQuery } from '@/lib/api-helpers'


interface FilmingSessionFiltersProps {
  onFiltersChange: (filters: FilmingSessionFilters) => void
  className?: string
}

interface FilmingSessionFilters {
  type?: string | null
  startDate?: string
  endDate?: string
  search?: string
}

export function FilmingSessionFilters({
  onFiltersChange,
  className = ""
}: FilmingSessionFiltersProps) {
  const [filters, setFilters] = useState<FilmingSessionFilters>({})

  const updateFilters = (newFilters: Partial<FilmingSessionFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Szűrők
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type Filter */}
        <div>
          <FilmingSessionTypeSelector
            value={filters.type}
            onValueChange={(type) => updateFilters({ type })}
            label="Forgatás típusa"
            showAllOption={true}
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Kezdő dátum</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => updateFilters({ startDate: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="endDate">Záró dátum</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => updateFilters({ endDate: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        {/* Text Search */}
        <div>
          <Label htmlFor="search">Keresés</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Keresés név, leírás vagy hely alapján..."
              value={filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={() => {
            setFilters({})
            onFiltersChange({})
          }}
          className="w-full"
        >
          Szűrők törlése
        </Button>
      </CardContent>
    </Card>
  )
}

interface FilmingSessionManagerProps {
  showFilters?: boolean
  defaultFilters?: FilmingSessionFilters
  mode?: 'all' | 'upcoming' | 'unassigned' | 'with-roles'
}

export function FilmingSessionManager({
  showFilters = true,
  defaultFilters = {},
  mode = 'all'
}: FilmingSessionManagerProps) {
  const [filters, setFilters] = useState<FilmingSessionFilters>(defaultFilters)

  // Choose the appropriate API method based on mode
  const getSessionsMethod = () => {
    switch (mode) {
      case 'upcoming':
        return () => apiClient.getUpcomingFilmingSessionsWithRoles(filters.type || undefined)
      case 'unassigned':
        return () => apiClient.getUnassignedFilmingSessions(filters.type || undefined)
      case 'with-roles':
        return () => apiClient.getFilmingSessionsWithRoles(
          filters.startDate,
          filters.endDate,
          filters.type || undefined
        )
      default:
        return () => apiClient.getFilmingSessions(
          filters.startDate,
          filters.endDate,
          filters.type || undefined
        )
    }
  }

  const { data: sessions = [], loading, error } = useApiQuery(
    getSessionsMethod(),
    [filters, mode]
  )

  // Client-side filtering for search
  const filteredSessions = (sessions || []).filter(session => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      return (
        session.name.toLowerCase().includes(searchTerm) ||
        session.description.toLowerCase().includes(searchTerm) ||
        session.location?.name?.toLowerCase().includes(searchTerm)
      )
    }
    return true
  })

  const SessionCard = ({ session }: { session: ForgatSchema }) => (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <FilmingSessionTypeBadge
              type={session.type}
              label={session.type_display}
              size="sm"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="font-semibold text-sm truncate">{session.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{session.description}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(session.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(session.time_from)} - {formatTime(session.time_to)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{session.location?.name || 'Nincs megadva'}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {session.equipment_count || 0} eszköz
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Forgatások betöltése...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <p className="text-lg font-medium text-destructive">Hiba történt</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <FilmingSessionFilters onFiltersChange={setFilters} />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Forgatások
              {mode !== 'all' && (
                <Badge variant="secondary">
                  {mode === 'upcoming' && 'Közelgő szerepekkel'}
                  {mode === 'unassigned' && 'Nem beosztott'}
                  {mode === 'with-roles' && 'Szerepekkel'}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{filteredSessions.length} forgatás</Badge>
              {filters.type && (
                <FilmingSessionTypeBadge
                  type={filters.type}
                  size="sm"
                  showTooltip={false}
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nincs találat a szűrőknek megfelelően</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}