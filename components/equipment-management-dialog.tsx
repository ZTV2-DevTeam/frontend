'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

import { apiClient } from '@/lib/api'
import type { 
  EquipmentSchema, 
  EquipmentCreateSchema, 
  EquipmentUpdateSchema,
  EquipmentTipusSchema 
} from '@/lib/api'

interface EquipmentManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment?: EquipmentSchema | null
  equipmentTypes: EquipmentTipusSchema[]
  onSuccess?: () => void
}

export function EquipmentManagementDialog({
  open,
  onOpenChange,
  equipment = null,
  equipmentTypes,
  onSuccess
}: EquipmentManagementDialogProps) {
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Form state
  const [nickname, setNickname] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [equipmentTypeId, setEquipmentTypeId] = useState<string>('')
  const [functional, setFunctional] = useState(true)
  const [notes, setNotes] = useState('')

  const isEditing = !!equipment

  // Reset form when dialog opens/closes or equipment changes
  useEffect(() => {
    if (open) {
      if (equipment) {
        // Editing existing equipment
        setNickname(equipment.nickname)
        setBrand(equipment.brand || '')
        setModel(equipment.model || '')
        setSerialNumber(equipment.serial_number || '')
        setEquipmentTypeId(equipment.equipment_type?.id?.toString() || '')
        setFunctional(equipment.functional)
        setNotes(equipment.notes || '')
      } else {
        // Creating new equipment
        resetForm()
      }
    }
  }, [open, equipment])

  const resetForm = () => {
    setNickname('')
    setBrand('')
    setModel('')
    setSerialNumber('')
    setEquipmentTypeId('')
    setFunctional(true)
    setNotes('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nickname.trim()) {
      toast.error('A felszerelés beceneve kötelező!')
      return
    }

    setLoading(true)
    
    try {
      if (isEditing && equipment) {
        // Update existing equipment
        const updateData: EquipmentUpdateSchema = {
          nickname: nickname.trim(),
          brand: brand.trim() || undefined,
          model: model.trim() || undefined,
          serial_number: serialNumber.trim() || undefined,
          equipment_type_id: equipmentTypeId ? parseInt(equipmentTypeId) : undefined,
          functional,
          notes: notes.trim() || undefined,
        }

        await apiClient.updateEquipment(equipment.id, updateData)
        toast.success('Felszerelés sikeresen frissítve!')
      } else {
        // Create new equipment
        const createData: EquipmentCreateSchema = {
          nickname: nickname.trim(),
          brand: brand.trim() || undefined,
          model: model.trim() || undefined,
          serial_number: serialNumber.trim() || undefined,
          equipment_type_id: equipmentTypeId ? parseInt(equipmentTypeId) : undefined,
          functional,
          notes: notes.trim() || undefined,
        }

        await apiClient.createEquipment(createData)
        toast.success('Felszerelés sikeresen létrehozva!')
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error managing equipment:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : `Hiba történt a felszerelés ${isEditing ? 'frissítése' : 'létrehozása'} során.`
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!equipment) return

    setDeleteLoading(true)
    
    try {
      await apiClient.deleteEquipment(equipment.id)
      toast.success('Felszerelés sikeresen törölve!')
      setShowDeleteConfirm(false)
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error deleting equipment:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Hiba történt a felszerelés törlése során.'
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  const selectedType = equipmentTypes.find(type => type.id.toString() === equipmentTypeId)

  return (
    <>
      <Dialog open={open && !showDeleteConfirm} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Felszerelés szerkesztése' : 'Új felszerelés hozzáadása'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nickname - Required */}
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-sm font-medium">
                  Becenév <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="pl. Kamera-1, Mikrofon-A"
                  required
                />
              </div>

              {/* Equipment Type */}
              <div className="space-y-2">
                <Label htmlFor="equipment-type" className="text-sm font-medium">
                  Típus
                </Label>
                <Select value={equipmentTypeId} onValueChange={setEquipmentTypeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Válasszon típust">
                      {selectedType && (
                        <div className="flex items-center gap-2">
                          {selectedType.emoji && <span>{selectedType.emoji}</span>}
                          <span>{selectedType.name}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        <div className="flex items-center gap-2">
                          {type.emoji && <span>{type.emoji}</span>}
                          <span>{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brand */}
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">
                  Márka
                </Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="pl. Sony, Canon, Panasonic"
                />
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium">
                  Modell
                </Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="pl. FX6, EOS R5, AG-CX10"
                />
              </div>
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label htmlFor="serial-number" className="text-sm font-medium">
                Sorozatszám
              </Label>
              <Input
                id="serial-number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="A felszerelés egyedi sorozatszáma"
              />
            </div>

            {/* Functional Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="functional" className="text-sm font-medium">
                  Működőképes
                </Label>
                <p className="text-sm text-muted-foreground">
                  A felszerelés jelenleg használható-e
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="functional"
                  checked={functional}
                  onCheckedChange={(checked) => setFunctional(!!checked)}
                />
                <Badge variant={functional ? 'default' : 'destructive'}>
                  {functional ? 'Működőképes' : 'Karbantartásra szorul'}
                </Badge>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Megjegyzések
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="További információk, karbantartási megjegyzések..."
                className="min-h-[100px]"
              />
            </div>

            <DialogFooter className="flex justify-between">
              <div>
                {isEditing && equipment && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Törlés
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Mégse
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {loading
                    ? 'Mentés...'
                    : isEditing
                    ? 'Frissítés'
                    : 'Létrehozás'
                  }
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Biztosan törli a felszerelést?</DialogTitle>
            <DialogDescription>
              Ez a művelet visszavonhatatlan. A &quot;{equipment?.nickname}&quot; felszerelés véglegesen törlődik.
              {equipment && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <div className="text-sm space-y-1">
                    <div><strong>Becenév:</strong> {equipment.nickname}</div>
                    {equipment.brand && <div><strong>Márka:</strong> {equipment.brand}</div>}
                    {equipment.model && <div><strong>Modell:</strong> {equipment.model}</div>}
                    {equipment.equipment_type && (
                      <div><strong>Típus:</strong> {equipment.equipment_type.name}</div>
                    )}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Mégse
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="gap-2"
            >
              {deleteLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {deleteLoading ? 'Törlés...' : 'Törlés'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}