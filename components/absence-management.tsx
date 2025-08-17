"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { usePermissions } from '@/contexts/permissions-context'
import { apiClient, TavolletSchema, TavolletCreateSchema, TavolletUpdateSchema } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-time-components'
import { FormDialog, ConfirmDialog } from '@/components/ui/form-dialog'
import { DataTable } from '@/components/ui/enhanced-data-table'
import { AbsenceStats, StatusBadge } from '@/components/absence-stats'
import { AbsenceFiltersComponent, type AbsenceFilters } from '@/components/absence-filters'
import { BulkActions, SelectionCheckbox } from '@/components/bulk-actions'
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
  AlertTriangle
} from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'
import { hu } from 'date-fns/locale'
import { toast } from 'sonner'
import { validateDateRange, formatDateForDisplay, getTodayISOString } from '@/lib/absence-utils'

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
    status: '',
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
  
  const currentRole = getCurrentRole()
  const isAdmin = hasPermission('is_admin') || currentRole === 'admin'
  
  // Form data
  const [createForm, setCreateForm] = useState<TavolletCreateSchema>({
    start_date: getTodayISOString(),
    end_date: getTodayISOString(),
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
        const userName = `${absence.user.first_name} ${absence.user.last_name}`.toLowerCase()
        const reason = (absence.reason || '').toLowerCase()
        return userName.includes(searchLower) || reason.includes(searchLower)
      })
    }

    // Status filter
    if (filters.status) {
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
      status: '',
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
        start_date: getTodayISOString(), 
        end_date: getTodayISOString(), 
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
      toast.success(`${absence.user.full_name || `${absence.user.first_name} ${absence.user.last_name}`} távollétét jóváhagyva`)
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a jóváhagyáskor'
      toast.error(message)
    }
  }

  const handleDeny = async (absence: TavolletSchema) => {
    try {
      await apiClient.denyAbsence(absence.id)
      toast.success(`${absence.user.full_name || `${absence.user.first_name} ${absence.user.last_name}`} távollétét elutasítva`)
      fetchAbsences()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt az elutasításkor'
      toast.error(message)
    }
  }

  const handleReset = async (absence: TavolletSchema) => {
    try {
      await apiClient.resetAbsenceStatus(absence.id)
      toast.success(`${absence.user.full_name || `${absence.user.first_name} ${absence.user.last_name}`} távollétének státusza visszaállítva`)
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
              <div className="font-medium">
                {user.full_name || `${user.first_name} ${user.last_name}`}
              </div>
            )
          },
        }),
      ] : []),
      
      columnHelper.accessor('start_date', {
        header: 'Kezdő dátum',
        cell: ({ getValue }) => formatDateForDisplay(getValue()),
      }),
      
      columnHelper.accessor('end_date', {
        header: 'Záró dátum',
        cell: ({ getValue }) => formatDateForDisplay(getValue()),
      }),
      
      columnHelper.accessor('duration_days', {
        header: 'Időtartam',
        cell: ({ getValue }) => {
          const days = getValue()
          return `${days} nap`
        },
      }),
      
      columnHelper.accessor('reason', {
        header: 'Indoklás',
        cell: ({ getValue }) => {
          const reason = getValue()
          return (
            <div className="max-w-xs truncate" title={reason || 'Nincs indoklás'}>
              {reason || 'Nincs indoklás'}
            </div>
          )
        },
      }),
      
      columnHelper.accessor('status', {
        header: 'Státusz',
        cell: ({ row }) => {
          const { status, denied, approved } = row.original
          return <StatusBadge status={status} denied={denied} approved={approved} />
        },
      }),
      
      columnHelper.display({
        id: 'actions',
        header: 'Műveletek',
        cell: ({ row }) => {
          const absence = row.original
          const canEdit = isAdmin || (!absence.denied && absence.user.id === user?.user_id)
          const canDelete = isAdmin || (!absence.denied && absence.user.id === user?.user_id)
          
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedAbsence(absence)
                  setShowViewDialog(true)
                }}
              >
                <Eye className="h-4 w-4" />
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
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {canDelete && (
                <ConfirmDialog
                  title="Távollét törlése"
                  description="Biztosan törli ezt a távollétet? Ez a művelet nem vonható vissza."
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                  onConfirm={() => handleDelete(absence)}
                  isLoading={deleteLoading}
                  confirmLabel="Törlés"
                  variant="destructive"
                />
              )}
              
              {isAdmin && (
                <div className="flex items-center gap-1">
                  {!absence.approved && !absence.denied && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(absence)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Jóváhagyás"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeny(absence)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Elutasítás"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  {(absence.approved || absence.denied) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReset(absence)}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      title="Státusz visszaállítása függőben állapotra"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Távollét kezelés</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Diákok távolléteinek kezelése és jóváhagyása'
              : 'Távolléteid kezelése és benyújtása'
            }
          </p>
        </div>
        
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Új távollét
        </Button>
      </div>

      {/* Stats Cards */}
      <AbsenceStats absences={filteredAbsences} isAdmin={isAdmin} />

      {/* Filters */}
      <AbsenceFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        onRefresh={fetchAbsences}
        isAdmin={isAdmin}
        loading={loading}
        totalCount={absences.length}
        filteredCount={filteredAbsences.length}
      />

      {/* Bulk Actions (Admin only) */}
      {isAdmin && (
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
      <Card>
        <CardContent className="p-0">
          <DataTable
            table={table}
            columns={columns}
            data={filteredAbsences}
            loading={loading}
            onRefresh={fetchAbsences}
            searchPlaceholder="Keresés távollétekben..."
            showActions={false} // We handle actions in the table
            showSearch={false} // We have our own search in filters
          />
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
            start_date: getTodayISOString(), 
            end_date: getTodayISOString(), 
            reason: '' 
          })
        }}
        isLoading={createLoading}
        submitLabel="Létrehozás"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="start_date">Kezdő dátum *</Label>
            <Input
              id="start_date"
              type="date"
              value={createForm.start_date}
              onChange={(e) => setCreateForm({ ...createForm, start_date: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="end_date">Záró dátum *</Label>
            <Input
              id="end_date"
              type="date"
              value={createForm.end_date}
              onChange={(e) => setCreateForm({ ...createForm, end_date: e.target.value })}
              required
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
            <Label htmlFor="edit_start_date">Kezdő dátum</Label>
            <Input
              id="edit_start_date"
              type="date"
              value={editForm.start_date}
              onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="edit_end_date">Záró dátum</Label>
            <Input
              id="edit_end_date"
              type="date"
              value={editForm.end_date}
              onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
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
                  {selectedAbsence.user.full_name || `${selectedAbsence.user.first_name} ${selectedAbsence.user.last_name}`}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kezdő dátum</Label>
                <div className="text-sm">
                  {formatDateForDisplay(selectedAbsence.start_date)}
                </div>
              </div>
              
              <div>
                <Label>Záró dátum</Label>
                <div className="text-sm">
                  {formatDateForDisplay(selectedAbsence.end_date)}
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
