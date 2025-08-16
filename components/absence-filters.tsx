"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  RefreshCw,
  Download
} from 'lucide-react'
import { format } from 'date-fns'

export interface AbsenceFilters {
  search: string
  status: string
  dateFrom: string
  dateTo: string
  userId?: number
}

interface AbsenceFiltersComponentProps {
  filters: AbsenceFilters
  onFiltersChange: (filters: AbsenceFilters) => void
  onReset: () => void
  onRefresh: () => void
  onExport?: () => void
  isAdmin: boolean
  loading?: boolean
  totalCount: number
  filteredCount: number
}

export function AbsenceFiltersComponent({
  filters,
  onFiltersChange,
  onReset,
  onRefresh,
  onExport,
  isAdmin,
  loading = false,
  totalCount,
  filteredCount
}: AbsenceFiltersComponentProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof AbsenceFilters, value: string | number) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const isFiltered = filters.search || filters.status || filters.dateFrom || filters.dateTo

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Szűrés és keresés</CardTitle>
          <div className="flex items-center gap-2">
            {filteredCount !== totalCount && (
              <Badge variant="secondary">
                {filteredCount} / {totalCount}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            {onExport && isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isAdmin ? "Keresés név, indoklás alapján..." : "Keresés indoklás alapján..."}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showAdvanced ? 'Kevesebb' : 'Több szűrő'}
          </Button>
          
          {isFiltered && (
            <Button
              variant="outline"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Törlés
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <Label>Státusz</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Minden státusz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Minden státusz</SelectItem>
                  <SelectItem value="jövőbeli">Jövőbeli</SelectItem>
                  <SelectItem value="folyamatban">Folyamatban</SelectItem>
                  <SelectItem value="lezárt">Lezárt</SelectItem>
                  <SelectItem value="denied">Elutasítva</SelectItem>
                  <SelectItem value="approved">Jóváhagyva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Kezdő dátum (tól)</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            
            <div>
              <Label>Záró dátum (ig)</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {isFiltered && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Aktív szűrők:</span>
            
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Keresés: "{filters.search}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('search', '')}
                />
              </Badge>
            )}
            
            {filters.status && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Státusz: {getStatusLabel(filters.status)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('status', '')}
                />
              </Badge>
            )}
            
            {filters.dateFrom && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Tól: {format(new Date(filters.dateFrom), 'yyyy.MM.dd')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('dateFrom', '')}
                />
              </Badge>
            )}
            
            {filters.dateTo && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Ig: {format(new Date(filters.dateTo), 'yyyy.MM.dd')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('dateTo', '')}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'jövőbeli': return 'Jövőbeli'
    case 'folyamatban': return 'Folyamatban'
    case 'lezárt': return 'Lezárt'
    case 'denied': return 'Elutasítva'
    case 'approved': return 'Jóváhagyva'
    default: return status
  }
}
