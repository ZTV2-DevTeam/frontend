'use client'

import * as React from 'react'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Settings } from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { apiClient } from '@/lib/api'
import { useApiQuery } from '@/lib/api-helpers'
import type { EquipmentTipusSchema, EquipmentTipusCreateSchema } from '@/lib/api'

interface CreateEquipmentTypeDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function CreateEquipmentTypeDialog({ 
  children, 
  onSuccess 
}: CreateEquipmentTypeDialogProps) {
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingType, setEditingType] = useState<EquipmentTipusSchema | null>(null)
  const [deletingType, setDeletingType] = useState<EquipmentTipusSchema | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    emoji: ''
  })
  const [loading, setLoading] = useState(false)
  
  // Fetch equipment types
  const { data: equipmentTypes = [] } = useApiQuery(
    () => apiClient.getEquipmentTypes(),
    []
  )

  const resetForm = () => {
    setFormData({ name: '', emoji: '' })
    setEditingType(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('A típus neve kötelező!')
      return
    }

    setLoading(true)
    try {
      const data: EquipmentTipusCreateSchema = {
        name: formData.name.trim(),
        emoji: formData.emoji.trim() || undefined
      }

      if (editingType) {
        // Update existing type - API doesn't show update endpoint, so we'll use a generic approach
        toast.info('Szerkesztés funkció hamarosan elérhető.')
      } else {
        // Create new type
        await apiClient.createEquipmentType(data)
        toast.success('Felszerelés típus sikeresen létrehozva!')
        setCreateOpen(false)
        resetForm()
        // TODO: Refetch data or invalidate cache
        onSuccess?.()
      }
    } catch (error) {
      console.error('Error managing equipment type:', error)
      toast.error(error instanceof Error ? error.message : 'Hiba történt a típus kezelése során.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (type: EquipmentTipusSchema) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      emoji: type.emoji || ''
    })
    setCreateOpen(true)
  }

  const handleDelete = async (type: EquipmentTipusSchema) => {
    if (type.equipment_count > 0) {
      toast.error('Nem törölhető olyan típus, amelyhez felszerelések tartoznak!')
      return
    }

    try {
      // API doesn't show delete endpoint, so we'll show a message
      toast.info('Törlés funkció hamarosan elérhető.')
      setDeletingType(null)
    } catch (error) {
      console.error('Error deleting equipment type:', error)
      toast.error('Hiba történt a típus törlése során.')
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Felszerelés típusok kezelése
            </DialogTitle>
            <DialogDescription>
              Adjon hozzá új típusokat vagy szerkessze a meglévőket. A típusok segítségével kategorizálhatja a felszereléseket.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setCreateOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Új típus
              </Button>
            </div>

            {(!equipmentTypes || equipmentTypes.length === 0) ? (
              <div className="text-center py-8">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">Nincs típus</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Kezdjen el egy új felszerelés típus hozzáadásával.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <div className="max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead>Név</TableHead>
                        <TableHead>Emoji</TableHead>
                        <TableHead>Felszerelések száma</TableHead>
                        <TableHead className="w-[100px]">Műveletek</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipmentTypes?.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>
                          {type.emoji ? (
                            <span className="text-lg">{type.emoji}</span>
                          ) : (
                            <span className="text-muted-foreground italic">Nincs</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{type.equipment_count}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(type)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingType(type)}
                              disabled={type.equipment_count > 0}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => {
        setCreateOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? 'Típus szerkesztése' : 'Új típus létrehozása'}
            </DialogTitle>
            <DialogDescription>
              {editingType 
                ? 'Módosítsa a felszerelés típus adatait.'
                : 'Adjon hozzá egy új felszerelés típust.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Típus neve *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="pl. Kamera, Mikrofon, Világítás"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji (opcionális)</Label>
              <Input
                id="emoji"
                value={formData.emoji}
                onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                placeholder="pl. 📹, 🎤, 💡"
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground">
                Válasszon egy emoji ikont a típus vizuális megkülönböztetéséhez.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={loading}
              >
                Mégse
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Mentés...' : (editingType ? 'Mentés' : 'Létrehozás')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingType} onOpenChange={() => setDeletingType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Biztosan törli a típust?</DialogTitle>
            <DialogDescription>
              Ez a művelet visszavonhatatlan. A &quot;{deletingType?.name}&quot; típus véglegesen törlődik.
              {deletingType?.equipment_count === 0 ? (
                " Ehhez a típushoz nem tartozik felszerelés."
              ) : (
                ` Ehhez a típushoz ${deletingType?.equipment_count} felszerelés tartozik, ezért nem törölhető.`
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingType(null)}>
              Mégse
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingType && handleDelete(deletingType)}
              disabled={deletingType?.equipment_count ? deletingType.equipment_count > 0 : true}
            >
              Törlés
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}