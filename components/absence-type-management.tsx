"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { usePermissions } from '@/contexts/permissions-context'
import { apiClient, TavolletTipusSchema, TavolletTipusCreateSchema, TavolletTipusUpdateSchema } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FormDialog, ConfirmDialog } from '@/components/ui/form-dialog'
import { DataTable } from '@/components/ui/enhanced-data-table'
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
  Edit, 
  Trash2, 
  AlertTriangle,
  Settings,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const columnHelper = createColumnHelper<TavolletTipusSchema>()

export function AbsenceTypeManagement() {
  const { } = useAuth()
  const { hasPermission, getCurrentRole } = usePermissions()
  
  const [absenceTypes, setAbsenceTypes] = useState<TavolletTipusSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search and filtering
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTypes, setFilteredTypes] = useState<TavolletTipusSchema[]>([])
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedType, setSelectedType] = useState<TavolletTipusSchema | null>(null)
  
  // Form states
  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  const currentRole = getCurrentRole()
  const isAdmin = hasPermission('is_admin') || currentRole === 'admin'
  
  // Form data
  const [createForm, setCreateForm] = useState<TavolletTipusCreateSchema>({
    name: '',
    explanation: '',
    ignored_counts_as: 'approved'
  })
  
  const [editForm, setEditForm] = useState<TavolletTipusUpdateSchema>({
    name: '',
    explanation: '',
    ignored_counts_as: ''
  })

  // Fetch absence types
  const fetchAbsenceTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const types = await apiClient.getAbsenceTypes()
      setAbsenceTypes(types)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a távolléti típusok betöltésekor'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAbsenceTypes()
  }, [])

  // Apply search filter
  useEffect(() => {
    let filtered = [...absenceTypes]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(type => 
        type.name.toLowerCase().includes(searchLower) ||
        (type.explanation && type.explanation.toLowerCase().includes(searchLower))
      )
    }

    setFilteredTypes(filtered)
  }, [absenceTypes, searchTerm])

  // Create absence type
  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast.error('A név mező kitöltése kötelező')
      return
    }

    try {
      setCreateLoading(true)
      
      await apiClient.createAbsenceType(createForm)
      
      toast.success('Távolléti típus sikeresen létrehozva')
      setShowCreateDialog(false)
      setCreateForm({
        name: '',
        explanation: '',
        ignored_counts_as: 'approved'
      })
      fetchAbsenceTypes()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a távolléti típus létrehozásakor'
      toast.error(message)
    } finally {
      setCreateLoading(false)
    }
  }

  // Update absence type
  const handleUpdate = async () => {
    if (!selectedType) return

    try {
      setUpdateLoading(true)
      
      await apiClient.updateAbsenceType(selectedType.id, editForm)
      
      toast.success('Távolléti típus sikeresen módosítva')
      setShowEditDialog(false)
      setSelectedType(null)
      setEditForm({ name: '', explanation: '', ignored_counts_as: '' })
      fetchAbsenceTypes()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a távolléti típus módosításakor'
      toast.error(message)
    } finally {
      setUpdateLoading(false)
    }
  }

  const getIgnoredCountsAsDisplay = (ignoredCountsAs: string) => {
    switch (ignoredCountsAs) {
      case 'approved':
        return { text: 'Elfogadva', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
      case 'denied':
        return { text: 'Elutasítva', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
      default:
        return { text: ignoredCountsAs, icon: HelpCircle, color: 'text-muted-foreground', bgColor: 'bg-muted/50', borderColor: 'border-muted' }
    }
  }

  // Delete absence type
  const handleDelete = async (type: TavolletTipusSchema) => {
    try {
      setDeleteLoading(true)
      
      await apiClient.deleteAbsenceType(type.id)
      
      toast.success(`${type.name} távolléti típus sikeresen törölve`)
      fetchAbsenceTypes()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hiba történt a távolléti típus törlésekor'
      toast.error(message)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Table columns
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Név',
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue()}</div>
      ),
      size: 150,
    }),
    
    columnHelper.accessor('explanation', {
      header: 'Magyarázat',
      cell: ({ getValue }) => {
        const explanation = getValue()
        return (
          <div className="max-w-xs">
            {explanation ? (
              <div className="text-sm text-muted-foreground truncate" title={explanation}>
                {explanation}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">Nincs megadva</span>
            )}
          </div>
        )
      },
      size: 200,
    }),
    
    columnHelper.accessor('ignored_counts_as', {
      header: 'Jóváhagyatlan állapotban',
      cell: ({ getValue }) => {
        const ignoredCountsAs = getValue()
        const display = getIgnoredCountsAsDisplay(ignoredCountsAs)
        const IconComponent = display.icon
        
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className={`${display.color} ${display.bgColor} ${display.borderColor} font-medium`}>
                  <IconComponent className="h-3 w-3 mr-1" />
                  {display.text}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {ignoredCountsAs === 'approved' 
                    ? 'Ha nincs jóváhagyva vagy elutasítva, akkor elfogadottnak számít'
                    : 'Ha nincs jóváhagyva vagy elutasítva, akkor elutasítottnak számít'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      size: 150,
    }),
    
    columnHelper.accessor('usage_count', {
      header: 'Használat',
      cell: ({ getValue }) => {
        const count = getValue()
        return (
          <div className="text-center">
            <Badge variant={count > 0 ? "default" : "outline"} className="font-medium">
              {count} távollét
            </Badge>
          </div>
        )
      },
      size: 100,
    }),
    
    columnHelper.display({
      id: 'actions',
      header: 'Műveletek',
      cell: ({ row }) => {
        const type = row.original
        
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedType(type)
                setEditForm({
                  name: type.name,
                  explanation: type.explanation || '',
                  ignored_counts_as: type.ignored_counts_as,
                })
                setShowEditDialog(true)
              }}
              className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
              title="Szerkesztés"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            
            <ConfirmDialog
              title="Távolléti típus törlése"
              description={
                <div className="space-y-2">
                  <p>Biztosan törli a &apos;<strong>{type.name}</strong>&apos; távolléti típust?</p>
                  {type.usage_count > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Figyelem!</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        Ezt a típust {type.usage_count} távollét használja. A törlés nem lehetséges.
                      </p>
                    </div>
                  )}
                </div>
              }
              trigger={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600" 
                  title="Törlés"
                  disabled={type.usage_count > 0}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
              onConfirm={() => handleDelete(type)}
              isLoading={deleteLoading}
              confirmLabel="Törlés"
              variant="destructive"
              disabled={type.usage_count > 0}
            />
          </div>
        )
      },
      size: 100,
    }),
  ], [deleteLoading])

  const table = useReactTable({
    data: filteredTypes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Nincs jogosultság a távolléti típusok kezeléséhez</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <Button onClick={fetchAbsenceTypes} className="mt-4">
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
            <Settings className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Távolléti típusok</h1>
            <p className="text-base text-muted-foreground">
              Távolléti típusok kezelése és beállítása
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="whitespace-nowrap shadow-sm"
          size="lg"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Új típus</span>
          <span className="sm:hidden">Új</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Összes típus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absenceTypes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Elfogadva számító</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {absenceTypes.filter(t => t.ignored_counts_as === 'approved').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Elutasítva számító</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {absenceTypes.filter(t => t.ignored_counts_as === 'denied').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="shadow-sm border-0 bg-card">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Keresés név, magyarázat alapján..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 shadow-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                {/* Results Count */}
                {filteredTypes.length !== absenceTypes.length && (
                  <Badge variant="secondary" className="text-sm px-3 py-1 font-medium">
                    {filteredTypes.length} / {absenceTypes.length}
                  </Badge>
                )}
                
                {/* Refresh */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAbsenceTypes}
                  disabled={loading}
                  className="h-10 px-3 shadow-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline ml-2">Frissítés</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <DataTable
              table={table}
              columns={columns}
              data={filteredTypes}
              loading={loading}
              showSearch={false}
              showFilters={false}
              showActions={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <FormDialog
        title="Új távolléti típus létrehozása"
        description="Adja meg a típus adatait"
        trigger={null}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        onCancel={() => {
          setShowCreateDialog(false)
          setCreateForm({
            name: '',
            explanation: '',
            ignored_counts_as: 'approved'
          })
        }}
        isLoading={createLoading}
        submitLabel="Létrehozás"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="create_name">Név *</Label>
            <Input
              id="create_name"
              placeholder="Távolléti típus neve..."
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="create_explanation">Magyarázat</Label>
            <Textarea
              id="create_explanation"
              placeholder="Típus magyarázata (opcionális)..."
              value={createForm.explanation}
              onChange={(e) => setCreateForm({ ...createForm, explanation: e.target.value })}
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="create_ignored_counts_as">Jóváhagyatlan állapotban</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Ha egy távollét nincs jóváhagyva vagy elutasítva, akkor ez határozza meg, 
                      hogy elfogadottnak vagy elutasítottnak számít-e.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select 
              value={createForm.ignored_counts_as} 
              onValueChange={(value: string) => setCreateForm({ ...createForm, ignored_counts_as: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Elfogadva számít</span>
                  </div>
                </SelectItem>
                <SelectItem value="denied">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Elutasítva számít</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      {/* Edit Dialog */}
      <FormDialog
        title="Távolléti típus szerkesztése"
        description="Módosítsa a típus adatait"
        trigger={null}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={handleUpdate}
        onCancel={() => {
          setShowEditDialog(false)
          setSelectedType(null)
          setEditForm({ name: '', explanation: '', ignored_counts_as: '' })
        }}
        isLoading={updateLoading}
        submitLabel="Mentés"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit_name">Név</Label>
            <Input
              id="edit_name"
              placeholder="Távolléti típus neve..."
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="edit_explanation">Magyarázat</Label>
            <Textarea
              id="edit_explanation"
              placeholder="Típus magyarázata (opcionális)..."
              value={editForm.explanation}
              onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="edit_ignored_counts_as">Jóváhagyatlan állapotban</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Ha egy távollét nincs jóváhagyva vagy elutasítva, akkor ez határozza meg, 
                      hogy elfogadottnak vagy elutasítottnak számít-e.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select 
              value={editForm.ignored_counts_as} 
              onValueChange={(value: string) => setEditForm({ ...editForm, ignored_counts_as: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Elfogadva számít</span>
                  </div>
                </SelectItem>
                <SelectItem value="denied">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Elutasítva számít</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedType && selectedType.usage_count > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Ezt a típust {selectedType.usage_count} távollét használja.
              </span>
            </div>
          )}
        </div>
      </FormDialog>
    </div>
  )
}