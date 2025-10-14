'use client'

import * as React from 'react'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Settings, Loader2, Save, X } from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
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
        <DialogContent className="w-[calc(100vw-2rem)] max-w-4xl max-h-[85vh] p-4 sm:p-6">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Settings className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="truncate">Felszerelés típusok</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Adjon hozzá új típusokat vagy szerkessze a meglévőket.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 -mx-4 px-4 sm:-mx-6 sm:px-6 max-h-[calc(85vh-10rem)]">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setCreateOpen(true)} size="sm" className="h-9 sm:h-10 text-xs sm:text-sm">
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Új típus</span>
                </Button>
              </div>

              {(!equipmentTypes || equipmentTypes.length === 0) ? (
                <div className="text-center py-8 sm:py-12">
                  <Settings className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
                  <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-muted-foreground">Nincs típus</h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground px-4">
                    Kezdjen el egy új felszerelés típus hozzáadásával.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View - Hidden on mobile */}
                  <div className="hidden md:block border rounded-lg overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Név</TableHead>
                          <TableHead className="whitespace-nowrap">Emoji</TableHead>
                          <TableHead className="whitespace-nowrap">Felszerelések száma</TableHead>
                          <TableHead className="w-[120px] text-right whitespace-nowrap">Műveletek</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {equipmentTypes?.map((type) => (
                          <TableRow key={type.id}>
                            <TableCell className="font-medium whitespace-nowrap">{type.name}</TableCell>
                            <TableCell>
                              {type.emoji ? (
                                <span className="text-2xl">{type.emoji}</span>
                              ) : (
                                <span className="text-muted-foreground italic text-sm">Nincs</span>
                              )}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant="secondary" className="font-medium">
                                {type.equipment_count}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(type)}
                                  className="h-9 w-9"
                                  title="Szerkesztés"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeletingType(type)}
                                  disabled={type.equipment_count > 0}
                                  className="h-9 w-9 disabled:opacity-50"
                                  title={type.equipment_count > 0 ? "Nem törölhető, mert használatban van" : "Törlés"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View - Hidden on desktop */}
                  <div className="md:hidden space-y-2">
                    {equipmentTypes?.map((type) => (
                      <Card key={type.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {type.emoji && (
                                <span className="text-xl flex-shrink-0">{type.emoji}</span>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">{type.name}</h3>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                    {type.equipment_count} db
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(type)}
                                className="h-9 w-9 p-0"
                                title="Szerkesztés"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingType(type)}
                                disabled={type.equipment_count > 0}
                                className="h-9 w-9 p-0 disabled:opacity-30"
                                title={type.equipment_count > 0 ? "Nem törölhető" : "Törlés"}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => {
        setCreateOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[425px] max-h-[85vh] p-4 sm:p-6">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              {editingType ? (
                <>
                  <Pencil className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="truncate">Típus szerkesztése</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="truncate">Új típus</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {editingType 
                ? 'Módosítsa a felszerelés típus adatait. A *-gal jelölt mezők kötelezők.'
                : 'Adjon hozzá egy új felszerelés típust. A *-gal jelölt mezők kötelezők.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-sm">Típus neve *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="pl. Kamera, Mikrofon"
                className="h-10 sm:h-11 text-sm sm:text-base"
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Adjon meg egy egyértelmű nevet.
              </p>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="emoji" className="text-sm">Emoji (opcionális)</Label>
              <Input
                id="emoji"
                value={formData.emoji}
                onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                placeholder="pl. 📹, 🎤, 💡"
                className="h-10 sm:h-11 text-xl sm:text-2xl"
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground">
                Emoji ikon a megkülönböztetéshez.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={loading}
                className="h-10 sm:h-11 flex-1 sm:flex-none text-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Mégse
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="h-10 sm:h-11 flex-1 sm:flex-none sm:min-w-[120px] text-sm"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mentés...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {editingType ? 'Mentés' : 'Létrehozás'}
                  </div>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingType} onOpenChange={() => setDeletingType(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[425px] p-4 sm:p-6">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Trash2 className="h-5 w-5 text-destructive flex-shrink-0" />
              <span className="truncate">Típus törlése</span>
            </DialogTitle>
            <DialogDescription className="text-left text-xs sm:text-sm">
              Ez visszavonhatatlan. A <span className="font-semibold">&quot;{deletingType?.name}&quot;</span> típus véglegesen törlődik.
              {deletingType?.equipment_count === 0 ? (
                <span className="block mt-2">Nincs hozzá felszerelés.</span>
              ) : (
                <span className="block mt-2 font-medium text-destructive">
                  {deletingType?.equipment_count} felszerelés tartozik hozzá, nem törölhető.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3 sm:pt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeletingType(null)}
              className="h-10 sm:h-11 flex-1 sm:flex-none text-sm"
            >
              <X className="h-4 w-4 mr-2" />
              Mégse
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingType && handleDelete(deletingType)}
              disabled={deletingType?.equipment_count ? deletingType.equipment_count > 0 : true}
              className="h-10 sm:h-11 flex-1 sm:flex-none sm:min-w-[100px] text-sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Törlés
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}