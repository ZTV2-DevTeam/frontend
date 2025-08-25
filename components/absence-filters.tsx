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
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <CardTitle className="text-base sm:text-lg">
            <span className="hidden sm:inline">Szűrés és keresés</span>
            <span className="sm:hidden">Szűrők</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {filteredCount !== totalCount && (
              <Badge variant="secondary" className="text-xs">
                {filteredCount} / {totalCount}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="flex-shrink-0 h-8"
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline ml-2">Frissítés</span>
            </Button>
            {onExport && isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex-shrink-0 h-8"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-2">Export</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Basic Search */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isAdmin ? "Keresés név, indoklás alapján..." : "Keresés indoklás alapján..."}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 whitespace-nowrap h-9"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{showAdvanced ? 'Kevesebb' : 'Több szűrő'}</span>
              <span className="sm:hidden">{showAdvanced ? 'Kevesebb' : 'Szűrő'}</span>
            </Button>
            
            {isFiltered && (
              <Button
                variant="outline"
                onClick={onReset}
                className="flex items-center gap-2 whitespace-nowrap h-9"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Törlés</span>
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t">
            <div>
              <Label className="text-sm font-medium">Státusz</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Minden státusz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Minden státusz</SelectItem>
                  <SelectItem value="pending">Függőben</SelectItem>
                  <SelectItem value="approved">Jóváhagyva</SelectItem>
                  <SelectItem value="denied">Elutasítva</SelectItem>
                  <SelectItem value="jövőbeli">Jövőbeli</SelectItem>
                  <SelectItem value="folyamatban">Folyamatban</SelectItem>
                  <SelectItem value="lezárt">Lezárt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Kezdő dátum (tól)</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full h-9"
              />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <Label className="text-sm font-medium">Záró dátum (ig)</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full h-9"
              />
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {isFiltered && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground flex-shrink-0">Aktív szűrők:</span>
            
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1 max-w-xs">
                <span className="truncate">Keresés: "{filters.search}"</span>
                <X 
                  className="h-3 w-3 cursor-pointer flex-shrink-0" 
                  onClick={() => handleFilterChange('search', '')}
                />
              </Badge>
            )}
            
            {filters.status && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span className="whitespace-nowrap">Státusz: {getStatusLabel(filters.status)}</span>
                <X 
                  className="h-3 w-3 cursor-pointer flex-shrink-0" 
                  onClick={() => handleFilterChange('status', '')}
                />
              </Badge>
            )}
            
            {filters.dateFrom && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span className="whitespace-nowrap">Tól: {format(new Date(filters.dateFrom), 'yyyy.MM.dd')}</span>
                <X 
                  className="h-3 w-3 cursor-pointer flex-shrink-0" 
                  onClick={() => handleFilterChange('dateFrom', '')}
                />
              </Badge>
            )}
            
            {filters.dateTo && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span className="whitespace-nowrap">Ig: {format(new Date(filters.dateTo), 'yyyy.MM.dd')}</span>
                <X 
                  className="h-3 w-3 cursor-pointer flex-shrink-0" 
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
