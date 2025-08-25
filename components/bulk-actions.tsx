"use client"

import React, { useState } from 'react'
import { TavolletSchema } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfirmDialog } from '@/components/ui/form-dialog'
import { 
  Check, 
  X, 
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle
} from 'lucide-react'

interface BulkActionsProps {
  absences: TavolletSchema[]
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
  onBulkApprove: (ids: number[]) => Promise<void>
  onBulkDeny: (ids: number[]) => Promise<void>
  onBulkReset?: (ids: number[]) => Promise<void>
  onBulkDelete: (ids: number[]) => Promise<void>
  loading?: boolean
}

export function BulkActions({
  absences,
  selectedIds,
  onSelectionChange,
  onBulkApprove,
  onBulkDeny,
  onBulkReset,
  onBulkDelete,
  loading = false
}: BulkActionsProps) {
  const [bulkLoading, setBulkLoading] = useState<string | null>(null)

  const selectedAbsences = absences.filter(a => selectedIds.includes(a.id))
  const pendingAbsences = selectedAbsences.filter(a => !a.denied && !a.approved)
  const processedAbsences = selectedAbsences.filter(a => a.denied || a.approved)
  const allSelected = absences.length > 0 && selectedIds.length === absences.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < absences.length

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(absences.map(a => a.id))
    }
  }

  const handleBulkAction = async (
    action: 'approve' | 'deny' | 'reset' | 'delete',
    ids: number[]
  ) => {
    if (ids.length === 0) return

    try {
      setBulkLoading(action)
      
      switch (action) {
        case 'approve':
          await onBulkApprove(ids)
          break
        case 'deny':
          await onBulkDeny(ids)
          break
        case 'reset':
          if (onBulkReset) await onBulkReset(ids)
          break
        case 'delete':
          await onBulkDelete(ids)
          break
      }
      
      onSelectionChange([]) // Clear selection after action
    } finally {
      setBulkLoading(null)
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm dark:from-orange-900 dark:to-amber-900 dark:bg-opacity-50 dark:border-orange-700">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-3 text-sm font-semibold text-orange-800 hover:text-orange-900 transition-colors dark:text-orange-200 dark:hover:text-orange-100 cursor-pointer"
            >
              {allSelected ? (
                <CheckSquare className="h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
              ) : someSelected ? (
                <Square className="h-5 w-5 border-2 border-orange-600 flex-shrink-0 dark:border-orange-400" />
              ) : (
                <Square className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="whitespace-nowrap">{selectedIds.length} távollét kiválasztva</span>
            </button>
            
            <div className="flex gap-3">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1 dark:bg-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-700">
                {pendingAbsences.length} függőben
              </Badge>
              {processedAbsences.length > 0 && (
                <Badge variant="outline" className="border-orange-300 text-orange-700 px-3 py-1 dark:border-orange-400 dark:text-orange-300">
                  {processedAbsences.length} feldolgozott
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {pendingAbsences.length > 0 && (
              <>
                <ConfirmDialog
                  title="Tömeges jóváhagyás"
                  description={`Biztosan jóváhagyja a kiválasztott ${pendingAbsences.length} távollétet?`}
                  trigger={
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loading || bulkLoading === 'approve'}
                      className="text-green-700 border-green-300 hover:bg-green-50 bg-green-50/50 shadow-sm px-4 py-2 dark:text-green-200 dark:border-green-700 dark:hover:bg-green-600 dark:bg-green-800 cursor-pointer"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Jóváhagyás ({pendingAbsences.length})</span>
                      <span className="sm:hidden">✓ ({pendingAbsences.length})</span>
                    </Button>
                  }
                  onConfirm={() => handleBulkAction('approve', pendingAbsences.map(a => a.id))}
                  isLoading={bulkLoading === 'approve'}
                  confirmLabel="Jóváhagyás"
                />
                
                <ConfirmDialog
                  title="Tömeges elutasítás"
                  description={`Biztosan elutasítja a kiválasztott ${pendingAbsences.length} távollétet?`}
                  trigger={
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loading || bulkLoading === 'deny'}
                      className="text-red-700 border-red-300 hover:bg-red-50 bg-red-50/50 shadow-sm px-4 py-2 dark:text-red-200 dark:border-red-700 dark:hover:bg-red-600 dark:bg-red-800 cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Elutasítás ({pendingAbsences.length})</span>
                      <span className="sm:hidden">✗ ({pendingAbsences.length})</span>
                    </Button>
                  }
                  onConfirm={() => handleBulkAction('deny', pendingAbsences.map(a => a.id))}
                  isLoading={bulkLoading === 'deny'}
                  confirmLabel="Elutasítás"
                  variant="destructive"
                />
              </>
            )}
            
            {processedAbsences.length > 0 && onBulkReset && (
              <ConfirmDialog
                title="Státusz visszaállítása"
                description={`Biztosan visszaállítja a kiválasztott ${processedAbsences.length} távollét státuszát függőben állapotra?`}
                trigger={
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loading || bulkLoading === 'reset'}
                    className="text-orange-700 border-orange-300 hover:bg-orange-100 bg-orange-50/50 shadow-sm px-4 py-2 dark:text-orange-200 dark:border-orange-700 dark:hover:bg-orange-600 dark:bg-orange-700 cursor-pointer"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Visszaállítás ({processedAbsences.length})</span>
                    <span className="sm:hidden">⚠ ({processedAbsences.length})</span>
                  </Button>
                }
                onConfirm={() => handleBulkAction('reset', processedAbsences.map(a => a.id))}
                isLoading={bulkLoading === 'reset'}
                confirmLabel="Visszaállítás"
              />
            )}
            
            <ConfirmDialog
              title="Tömeges törlés"
              description={`Biztosan törli a kiválasztott ${selectedIds.length} távollétet? Ez a művelet nem vonható vissza.`}
              trigger={
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading || bulkLoading === 'delete'}
                  className="text-red-700 border-red-300 hover:bg-red-50 bg-red-50/50 shadow-sm px-4 py-2 dark:text-red-200 dark:border-red-700 dark:hover:bg-red-600 dark:bg-red-800 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Törlés ({selectedIds.length})</span>
                  <span className="sm:hidden">🗑 ({selectedIds.length})</span>
                </Button>
              }
              onConfirm={() => handleBulkAction('delete', selectedIds)}
              isLoading={bulkLoading === 'delete'}
              confirmLabel="Törlés"
              variant="destructive"
            />
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSelectionChange([])}
              className="text-orange-700 hover:text-orange-800 hover:bg-orange-100 px-4 py-2 dark:text-orange-200 dark:hover:bg-orange-600 cursor-pointer"
            >
              Mégsem
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper component for row selection checkbox
export function SelectionCheckbox({ 
  checked, 
  onCheckedChange,
  disabled = false 
}: { 
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label="Távollét kiválasztása"
    />
  )
}
