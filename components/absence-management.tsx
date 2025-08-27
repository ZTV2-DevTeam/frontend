"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { usePermissions } from '@/contexts/permissions-context'
import { apiClient, TavolletSchema, TavolletCreateSchema, TavolletUpdateSchema } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SystemDateTimePicker } from '@/components/ui/system-date-time-picker'
import { FormDialog, ConfirmDialog } from '@/components/ui/form-dialog'
import { DataTable } from '@/components/ui/enhanced-data-table'
import { AbsenceStats, StatusBadge } from '@/components/absence-stats'
import { type AbsenceFilters } from '@/components/absence-filters'
import { BulkActions, SelectionCheckbox } from '@/components/bulk-actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  createColumnHelper, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  getSortedRowModel,
  useReactTable 
} from '@tanstack/react-table'
import { 
  Plus, 
  Check, 
  X, 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle,
  TreePalm,
  Search,
  RefreshCw,
  Filter
} from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'
import { hu } from 'date-fns/locale'
import { toast } from 'sonner'
import { validateDateRange, formatDateTimeForDisplay, formatDateTimeForDisplaySplit, getTodayDateTimeISOString, getEndOfDayISOString, formatDateTimeForApi, parseDateTimeFromInput } from '@/lib/absence-utils'

const columnHelper = createColumnHelper<TavolletSchema>()

export function AbsenceManagement() {
  const { user } = useAuth()
  const { hasPermission, getCurrentRole } = usePermissions()
  
  const [absences, setAbsences] = useState<TavolletSchema[]>([])
  const [filteredAbsences, setFilteredAbsences] = useState<TavolletSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [filters, setFilters] = useState<AbsenceFilters>({
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  })
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedAbsence, setSelectedAbsence] = useState<TavolletSchema | null>(null)
  
  // Form states
  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Selection state for bulk actions (admin only)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  
  // UI states
  const [showFilters, setShowFilters] = useState(false)
  
  const currentRole = getCurrentRole()
  const isAdmin = hasPermission('is_admin') || currentRole === 'admin'
  
  // Form data
  const [createForm, setCreateForm] = useState<TavolletCreateSchema>({
    start_date: getTodayDateTimeISOString(),
    end_date: getEndOfDayISOString(),
    reason: ''
  })
  
  const [editForm, setEditForm] = useState<TavolletUpdateSchema>({
    start_date: '',
    end_date: '',
    reason: ''
  })

  // Fetch absences
  const fetchAbsences = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Admins see all absences, students see only their own
      const data = isAdmin 
        ? await apiClient.getAbsences()
        : await apiClient.getAbsences(undefined, undefined, undefined, true)
      
      setAbsences(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a távollét adatok betöltésekor'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAbsences()
  }, [isAdmin])

  // Apply filters whenever absences or filters change
  useEffect(() => {
    let filtered = [...absences]

    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(absence => {
        const userName = `${absence.user.last_name} ${absence.user.first_name}`.toLowerCase()
        const reason = (absence.reason || '').toLowerCase()
        return userName.includes(searchLower) || reason.includes(searchLower)
      })
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'denied') {
        filtered = filtered.filter(a => a.denied)
      } else if (filters.status === 'approved') {
        filtered = filtered.filter(a => a.approved && !a.denied)
      } else if (filters.status === 'pending') {
        filtered = filtered.filter(a => !a.approved && !a.denied)
      } else {
        filtered = filtered.filter(a => a.status === filters.status)
      }
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(a => a.end_date >= filters.dateFrom)
    }
    if (filters.dateTo) {
      filtered = filtered.filter(a => a.start_date <= filters.dateTo)
    }

    setFilteredAbsences(filtered)
  }, [absences, filters])

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateFrom: '',
      dateTo: '',
    })
  }

  // Create absence
  const handleCreate = async () => {
    if (!createForm.start_date || !createForm.end_date) {
      toast.error('Kérjük, töltse ki a kötelező mezőket')
      return
    }

    // Validate dates
    const validation = validateDateRange(createForm.start_date, createForm.end_date)
    if (!validation.valid) {
      toast.error(validation.error || 'Hibás dátum')
      return
    }

    try {
      setCreateLoading(true)
      
      await apiClient.createAbsence(createForm)
      
      toast.success('Távollét sikeresen létrehozva')
      setShowCreateDialog(false)
      setCreateForm({ 
        start_date: getTodayDateTimeISOString(), 
        end_date: getEndOfDayISOString(), 
        reason: '' 
      })
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a távollét létrehozásakor'
      toast.error(message)
    } finally {
      setCreateLoading(false)
    }
  }

  // Update absence
  const handleUpdate = async () => {
    if (!selectedAbsence) return

    if (editForm.start_date && editForm.end_date) {
      const validation = validateDateRange(editForm.start_date, editForm.end_date)
      if (!validation.valid) {
        toast.error(validation.error || 'Hibás dátum')
        return
      }
    }

    try {
      setUpdateLoading(true)
      
      await apiClient.updateAbsence(selectedAbsence.id, editForm)
      
      toast.success('Távollét sikeresen módosítva')
      setShowEditDialog(false)
      setSelectedAbsence(null)
      setEditForm({ start_date: '', end_date: '', reason: '' })
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a távollét módosításakor'
      toast.error(message)
    } finally {
      setUpdateLoading(false)
    }
  }

  // Delete absence
  const handleDelete = async (absence: TavolletSchema) => {
    try {
      setDeleteLoading(true)
      
      await apiClient.deleteAbsence(absence.id)
      
      toast.success('Távollét sikeresen törölve')
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a távollét törlésekor'
      toast.error(message)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Approve/Deny/Reset absence (admin only)
  const handleApprove = async (absence: TavolletSchema) => {
    try {
      await apiClient.approveAbsence(absence.id)
      toast.success(`${absence.user.full_name || `${absence.user.last_name} ${absence.user.first_name}`} távollétét jóváhagyva`)
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a jóváhagyáskor'
      toast.error(message)
    }
  }

  const handleDeny = async (absence: TavolletSchema) => {
    try {
      await apiClient.denyAbsence(absence.id)
      toast.success(`${absence.user.full_name || `${absence.user.last_name} ${absence.user.first_name}`} távollétét elutasítva`)
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt az elutasításkor'
      toast.error(message)
    }
  }

  const handleReset = async (absence: TavolletSchema) => {
    try {
      await apiClient.resetAbsenceStatus(absence.id)
      toast.success(`${absence.user.full_name || `${absence.user.last_name} ${absence.user.first_name}`} távollétének státusza visszaállítva`)
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a státusz visszaállításakor'
      toast.error(message)
    }
  }

  // Bulk actions (admin only)
  const handleBulkApprove = async (ids: number[]) => {
    try {
      const promises = ids.map(id => apiClient.approveAbsence(id))
      await Promise.all(promises)
      toast.success(`${ids.length} távollét jóváhagyva`)
      setSelectedIds([])
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a tömeges jóváhagyáskor'
      toast.error(message)
    }
  }

  const handleBulkDeny = async (ids: number[]) => {
    try {
      const promises = ids.map(id => apiClient.denyAbsence(id))
      await Promise.all(promises)
      toast.success(`${ids.length} távollét elutasítva`)
      setSelectedIds([])
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a tömeges elutasításkor'
      toast.error(message)
    }
  }

  const handleBulkReset = async (ids: number[]) => {
    try {
      const promises = ids.map(id => apiClient.resetAbsenceStatus(id))
      await Promise.all(promises)
      toast.success(`${ids.length} távollét státusza visszaállítva`)
      setSelectedIds([])
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a tömeges státusz visszaállításkor'
      toast.error(message)
    }
  }

  const handleBulkDelete = async (ids: number[]) => {
    try {
      const promises = ids.map(id => apiClient.deleteAbsence(id))
      await Promise.all(promises)
      toast.success(`${ids.length} távollét törölve`)
      setSelectedIds([])
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a tömeges törléskor'
      toast.error(message)
    }
  }

  // Table columns
  const columns = useMemo(() => {
    const baseColumns = [
      // Selection column for admins
      ...(isAdmin ? [
        columnHelper.display({
          id: 'select',
          header: ({ table }) => (
            <SelectionCheckbox
              checked={selectedIds.length === filteredAbsences.length && filteredAbsences.length > 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedIds(filteredAbsences.map(a => a.id))
                } else {
                  setSelectedIds([])
                }
              }}
            />
          ),
          cell: ({ row }) => (
            <SelectionCheckbox
              checked={selectedIds.includes(row.original.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedIds([...selectedIds, row.original.id])
                } else {
                  setSelectedIds(selectedIds.filter(id => id !== row.original.id))
                }
              }}
            />
          ),
          size: 40,
        }),
      ] : []),
      ...(isAdmin ? [
        columnHelper.accessor('user', {
          header: 'Diák',
          cell: ({ getValue }) => {
            const user = getValue()
            return (
              <div className="font-medium min-w-0">
                <div className="truncate text-sm max-w-[120px]" title={user.full_name || `${user.last_name} ${user.first_name}`}>
                  {user.full_name || `${user.last_name} ${user.first_name}`}
                </div>
              </div>
            )
          },
          size: 140,
        }),
      ] : []),
      
      columnHelper.accessor('start_date', {
        header: 'Kezdő időpont',
        cell: ({ getValue }) => {
          const { date, time } = formatDateTimeForDisplaySplit(getValue())
          return (
            <div className="text-sm font-medium leading-tight">
              <div className="text-xs text-muted-foreground">{date}</div>
              <div className="font-semibold">{time}</div>
            </div>
          )
        },
        size: 100,
      }),
      
      columnHelper.accessor('end_date', {
        header: 'Záró időpont',
        cell: ({ getValue }) => {
          const { date, time } = formatDateTimeForDisplaySplit(getValue())
          return (
            <div className="text-sm font-medium leading-tight">
              <div className="text-xs text-muted-foreground">{date}</div>
              <div className="font-semibold">{time}</div>
            </div>
          )
        },
        size: 100,
      }),
      
      columnHelper.accessor('duration_days', {
        header: 'Időtartam',
        cell: ({ getValue }) => {
          const days = getValue()
          return (
            <div className="whitespace-nowrap text-sm">
              <Badge variant="outline" className="font-medium text-xs">
                {days} nap
              </Badge>
            </div>
          )
        },
        size: 90,
      }),
      
      columnHelper.accessor('reason', {
        header: 'Indoklás',
        cell: ({ getValue }) => {
          const reason = getValue()
          return (
            <div className="max-w-[150px]">
              {reason ? (
                <div className="text-sm truncate bg-muted/50 px-2 py-1 rounded-md" title={reason}>
                  {reason}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">Nincs indoklás</span>
              )}
            </div>
          )
        },
        size: 180,
      }),
      
      columnHelper.accessor('status', {
        header: 'Státusz',
        cell: ({ row }) => {
          const { status, denied, approved } = row.original
          return (
            <div>
              <StatusBadge status={status} denied={denied} approved={approved} />
            </div>
          )
        },
        size: 100,
      }),
      
      columnHelper.display({
        id: 'actions',
        header: 'Műveletek',
        cell: ({ row }) => {
          const absence = row.original
          const canEdit = isAdmin || (!absence.denied && absence.user.id === user?.user_id)
          const canDelete = isAdmin || (!absence.denied && absence.user.id === user?.user_id)
          
          return (
            <div className="flex items-center justify-end gap-1 min-w-[140px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedAbsence(absence)
                  setShowViewDialog(true)
                }}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                title="Megtekintés"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              
              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAbsence(absence)
                    setEditForm({
                      start_date: absence.start_date,
                      end_date: absence.end_date,
                      reason: absence.reason || '',
                    })
                    setShowEditDialog(true)
                  }}
                  className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                  title="Szerkesztés"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
              
              {canDelete && (
                <ConfirmDialog
                  title="Távollét törlése"
                  description="Biztosan törli ezt a távollétet? Ez a művelet nem vonható vissza."
                  trigger={
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600" title="Törlés">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  }
                  onConfirm={() => handleDelete(absence)}
                  isLoading={deleteLoading}
                  confirmLabel="Törlés"
                  variant="destructive"
                />
              )}
              
              {isAdmin && (
                <div className="flex items-center gap-1 ml-1 pl-1 border-l border-border">
                  {!absence.approved && !absence.denied && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(absence)}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Jóváhagyás"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeny(absence)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Elutasítás"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                  
                  {(absence.approved || absence.denied) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReset(absence)}
                      className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      title="Státusz visszaállítása függőben állapotra"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        },
        size: 160,
      }),
    ]
    
    return baseColumns
  }, [isAdmin, user?.user_id, deleteLoading, selectedIds, filteredAbsences])

  const table = useReactTable({
    data: filteredAbsences,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchAbsences} className="mt-4">
            Újrapróbálás
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-sm">
            <TreePalm className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Távollét</h1>
            <p className="text-base text-muted-foreground">
              {isAdmin 
                ? 'Diákok távolléteinek kezelése és jóváhagyása'
                : 'Távolléteid kezelése és benyújtása'
              }
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="whitespace-nowrap shadow-sm"
          size="lg"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Új távollét</span>
          <span className="sm:hidden">Új</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <AbsenceStats absences={filteredAbsences} isAdmin={isAdmin} />

      {/* Bulk Actions (Admin only) */}
      {isAdmin && selectedIds.length > 0 && (
        <BulkActions
          absences={filteredAbsences}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onBulkApprove={handleBulkApprove}
          onBulkDeny={handleBulkDeny}
          onBulkReset={handleBulkReset}
          onBulkDelete={handleBulkDelete}
          loading={loading}
        />
      )}

      {/* Data Table */}
      <Card className="shadow-sm border-0 bg-card">
        <CardContent className="p-0">
          {/* Table Header with Search and Actions */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex flex-col gap-4">
              {/* Top Row: Search, Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={isAdmin ? "Keresés név, indoklás alapján..." : "Keresés indoklás alapján..."}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 h-10 shadow-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Results Count */}
                  {filteredAbsences.length !== absences.length && (
                    <Badge variant="secondary" className="text-sm px-3 py-1 font-medium">
                      {filteredAbsences.length} / {absences.length}
                    </Badge>
                  )}
                  
                  {/* Filter Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-10 px-3 shadow-sm"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Szűrők</span>
                  </Button>
                  
                  {/* Clear Filters */}
                  {(filters.search || (filters.status && filters.status !== 'all') || filters.dateFrom || filters.dateTo) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="h-10 px-3 shadow-sm text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Törlés</span>
                    </Button>
                  )}
                  
                  {/* Refresh */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAbsences}
                    disabled={loading}
                    className="h-10 px-3 shadow-sm"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline ml-2">Frissítés</span>
                  </Button>
                </div>
              </div>
              
              {/* Filters Row (Collapsible) */}
              {showFilters && (
                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t">
                  {/* Status Filter */}
                  <Select 
                    value={filters.status} 
                    onValueChange={(value: string) => setFilters({ ...filters, status: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] h-10 shadow-sm">
                      <SelectValue placeholder="Státusz szűrő" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Minden státusz</SelectItem>
                      <SelectItem value="pending">Függőben</SelectItem>
                      <SelectItem value="approved">Jóváhagyva</SelectItem>
                      <SelectItem value="denied">Elutasítva</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Date Range Filters */}
                  <div className="flex gap-2 flex-1">
                    <Input
                      type="datetime-local"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="flex-1 h-10 shadow-sm"
                      placeholder="Kezdő időpont"
                    />
                    <Input
                      type="datetime-local"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="flex-1 h-10 shadow-sm"
                      placeholder="Záró időpont"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Mobile Card View (hidden on larger screens) */}
          <div className="block sm:hidden">
            {loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : filteredAbsences.length > 0 ? (
              <div className="space-y-3 p-4">
                {filteredAbsences.map((absence) => (
                  <div key={absence.id} className="border border-border rounded-xl p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        {isAdmin && (
                          <div className="text-sm font-semibold mb-2 truncate text-foreground">
                            {absence.user.full_name || `${absence.user.last_name} ${absence.user.first_name}`}
                          </div>
                        )}
                        <div className="flex flex-col gap-2 mb-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Kezdés:</span>
                            <span className="font-semibold">
                              {formatDateTimeForDisplay(absence.start_date)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Befejezés:</span>
                            <span className="font-semibold">
                              {formatDateTimeForDisplay(absence.end_date)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs px-2 py-1 font-medium">
                              {absence.duration_days} nap
                            </Badge>
                          </div>
                        </div>
                        {absence.reason && (
                          <div className="text-xs text-muted-foreground truncate mb-2 bg-muted/50 p-2 rounded-md" title={absence.reason}>
                            {absence.reason}
                          </div>
                        )}
                        <StatusBadge status={absence.status} denied={absence.denied} approved={absence.approved} />
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAbsence(absence)
                            setShowViewDialog(true)
                          }}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(isAdmin || (!absence.denied && absence.user.id === user?.user_id)) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAbsence(absence)
                              setEditForm({
                                start_date: absence.start_date,
                                end_date: absence.end_date,
                                reason: absence.reason || '',
                              })
                              setShowEditDialog(true)
                            }}
                            className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="space-y-3">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <TreePalm className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Nincsenek távollét adatok</p>
                    <p className="text-sm">Még nem adott fel távollétet</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
              <DataTable
                table={table}
                columns={columns}
                data={filteredAbsences}
                loading={loading}
                searchPlaceholder="Keresés távollétekben..."
                showActions={false} // We handle actions in the table
                showSearch={false} // We have our own search in the header
                showFilters={false} // We have our own filters in the header
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <FormDialog
        title="Új távollét létrehozása"
        description="Adja meg a távollét részleteit"
        trigger={null}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        onCancel={() => {
          setShowCreateDialog(false)
          setCreateForm({ 
            start_date: getTodayDateTimeISOString(), 
            end_date: getEndOfDayISOString(), 
            reason: '' 
          })
        }}
        isLoading={createLoading}
        submitLabel="Létrehozás"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="start_date">Kezdő időpont *</Label>
            <SystemDateTimePicker
              date={createForm.start_date ? new Date(createForm.start_date) : undefined}
              onSelect={(date) => {
                if (date) {
                  setCreateForm({ ...createForm, start_date: formatDateTimeForApi(date) })
                } else {
                  setCreateForm({ ...createForm, start_date: '' })
                }
              }}
              placeholder="Válassz kezdő időpontot"
              timeStep={15}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="end_date">Záró időpont *</Label>
            <SystemDateTimePicker
              date={createForm.end_date ? new Date(createForm.end_date) : undefined}
              onSelect={(date) => {
                if (date) {
                  setCreateForm({ ...createForm, end_date: formatDateTimeForApi(date) })
                } else {
                  setCreateForm({ ...createForm, end_date: '' })
                }
              }}
              placeholder="Válassz záró időpontot"
              timeStep={15}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="reason">Indoklás</Label>
            <Textarea
              id="reason"
              placeholder="Adja meg a távollét indoklását..."
              value={createForm.reason}
              onChange={(e) => setCreateForm({ ...createForm, reason: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      {/* Edit Dialog */}
      <FormDialog
        title="Távollét szerkesztése"
        description="Módosítsa a távollét részleteit"
        trigger={null}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={handleUpdate}
        onCancel={() => {
          setShowEditDialog(false)
          setSelectedAbsence(null)
          setEditForm({ start_date: '', end_date: '', reason: '' })
        }}
        isLoading={updateLoading}
        submitLabel="Mentés"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit_start_date">Kezdő időpont</Label>
            <SystemDateTimePicker
              date={editForm.start_date ? new Date(editForm.start_date) : undefined}
              onSelect={(date) => {
                if (date) {
                  setEditForm({ ...editForm, start_date: formatDateTimeForApi(date) })
                } else {
                  setEditForm({ ...editForm, start_date: '' })
                }
              }}
              placeholder="Válassz kezdő időpontot"
              timeStep={15}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="edit_end_date">Záró időpont</Label>
            <SystemDateTimePicker
              date={editForm.end_date ? new Date(editForm.end_date) : undefined}
              onSelect={(date) => {
                if (date) {
                  setEditForm({ ...editForm, end_date: formatDateTimeForApi(date) })
                } else {
                  setEditForm({ ...editForm, end_date: '' })
                }
              }}
              placeholder="Válassz záró időpontot"
              timeStep={15}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="edit_reason">Indoklás</Label>
            <Textarea
              id="edit_reason"
              placeholder="Adja meg a távollét indoklását..."
              value={editForm.reason}
              onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
              rows={3}
            />
          </div>

          {isAdmin && selectedAbsence && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm">
                Adminként módosíthatja a távollét státuszát a jóváhagyás/elutasítás gombokkal.
              </span>
            </div>
          )}
        </div>
      </FormDialog>

      {/* View Dialog */}
      {selectedAbsence && (
        <FormDialog
          title="Távollét részletei"
          description="A távollét teljes információi"
          trigger={null}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
          onCancel={() => {
            setShowViewDialog(false)
            setSelectedAbsence(null)
          }}
          showFooter={false}
        >
          <div className="space-y-4">
            {isAdmin && (
              <div>
                <Label>Diák</Label>
                <div className="text-sm font-medium">
                  {selectedAbsence.user.full_name || `${selectedAbsence.user.last_name} ${selectedAbsence.user.first_name}`}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kezdő időpont</Label>
                <div className="text-sm">
                  {formatDateTimeForDisplay(selectedAbsence.start_date)}
                </div>
              </div>
              
              <div>
                <Label>Záró időpont</Label>
                <div className="text-sm">
                  {formatDateTimeForDisplay(selectedAbsence.end_date)}
                </div>
              </div>
            </div>
            
            <div>
              <Label>Időtartam</Label>
              <div className="text-sm">{selectedAbsence.duration_days} nap</div>
            </div>
            
            <div>
              <Label>Státusz</Label>
              <div className="mt-1">
                <StatusBadge status={selectedAbsence.status} denied={selectedAbsence.denied} approved={selectedAbsence.approved} />
              </div>
            </div>
            
            <div>
              <Label>Indoklás</Label>
              <div className="text-sm">
                {selectedAbsence.reason || 'Nincs indoklás megadva'}
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2 pt-4 border-t">
                {!selectedAbsence.approved && !selectedAbsence.denied ? (
                  <>
                    <Button
                      onClick={() => handleApprove(selectedAbsence)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      Jóváhagyás
                    </Button>
                    
                    <Button
                      variant="destructive"
                      onClick={() => handleDeny(selectedAbsence)}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Elutasítás
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleReset(selectedAbsence)}
                    className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Státusz visszaállítása
                  </Button>
                )}
              </div>
            )}
          </div>
        </FormDialog>
      )}
    </div>
  )
}
