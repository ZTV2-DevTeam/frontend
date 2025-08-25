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
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            <span className="hidden sm:inline">Szűrés és keresés</span>
            <span className="sm:hidden">Szűrők</span>
          </CardTitle>
          <div className="flex items-center gap-3">
            {filteredCount !== totalCount && (
              <Badge variant="secondary" className="text-sm px-3 py-1 font-medium">
                {filteredCount} / {totalCount}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="flex-shrink-0 h-9 shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline ml-2">Frissítés</span>
            </Button>
            {onExport && isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex-shrink-0 h-9 shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Export</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Basic Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isAdmin ? "Keresés név, indoklás alapján..." : "Keresés indoklás alapján..."}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 h-10 shadow-sm"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 whitespace-nowrap h-10 px-4 shadow-sm"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{showAdvanced ? 'Kevesebb szűrő' : 'Több szűrő'}</span>
              <span className="sm:hidden">{showAdvanced ? 'Kevesebb' : 'Szűrő'}</span>
            </Button>
            
            {isFiltered && (
              <Button
                variant="outline"
                onClick={onReset}
                className="flex items-center gap-2 whitespace-nowrap h-10 px-4 shadow-sm text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Szűrők törlése</span>
                <span className="sm:hidden">Törlés</span>
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Státusz</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-full h-10 shadow-sm">
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
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Kezdő dátum (tól)</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full h-10 shadow-sm"
              />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1 space-y-2">
              <Label className="text-sm font-semibold">Záró dátum (ig)</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full h-10 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {isFiltered && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
            <span className="text-sm font-medium text-muted-foreground flex-shrink-0">Aktív szűrők:</span>
            
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-2 max-w-xs px-3 py-1">
                <span className="truncate">Keresés: "{filters.search}"</span>
                <X 
                  className="h-3 w-3 cursor-pointer flex-shrink-0 hover:text-destructive" 
                  onClick={() => handleFilterChange('search', '')}
                />
              </Badge>
            )}
            
            {filters.status && (
              <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                <span className="whitespace-nowrap">Státusz: {getStatusLabel(filters.status)}</span>
                <X 
                  className="h-3 w-3 cursor-pointer flex-shrink-0 hover:text-destructive" 
                  onClick={() => handleFilterChange('status', '')}
                />
              </Badge>
            )}
            
            {filters.dateFrom && (
              <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                <span className="whitespace-nowrap">Tól: {format(new Date(filters.dateFrom), 'yyyy.MM.dd')}</span>
                <X 
                  className="h-3 w-3 cursor-pointer flex-shrink-0 hover:text-destructive" 
                  onClick={() => handleFilterChange('dateFrom', '')}
                />
              </Badge>
            )}
            
            {filters.dateTo && (
              <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                <span className="whitespace-nowrap">Ig: {format(new Date(filters.dateTo), 'yyyy.MM.dd')}</span>
                <X 
                  className="h-3 w-3 cursor-pointer flex-shrink-0 hover:text-destructive" 
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
