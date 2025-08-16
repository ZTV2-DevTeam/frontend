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
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm font-medium"
            >
              {allSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : someSelected ? (
                <Square className="h-4 w-4 border-2" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {selectedIds.length} távollét kiválasztva
            </button>
            
            <Badge variant="secondary">
              {pendingAbsences.length} függőben
            </Badge>
            {processedAbsences.length > 0 && (
              <Badge variant="outline">
                {processedAbsences.length} feldolgozott
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
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
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Jóváhagyás ({pendingAbsences.length})
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
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Elutasítás ({pendingAbsences.length})
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
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Visszaállítás ({processedAbsences.length})
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
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Törlés ({selectedIds.length})
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
