"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import { apiClient } from "@/lib/api"

export function CreateForgatásDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { currentRole } = useUserRole()
  const { user } = useAuth()
  const { hasPermission, permissions } = usePermissions()

  const classDisplayName = permissions?.role_info?.class_display_name || permissions?.role_info?.class_assignment?.display_name
  const is10FStudent = currentRole === 'student' && classDisplayName === '10F'
  const canCreateForgatás = hasPermission('can_create_forgatas') || hasPermission('is_admin') || currentRole === 'admin' || is10FStudent

  if (!canCreateForgatás) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Map form data to API schema
      const forgatásData = {
        name: title,
        description: description,
        date: date,
        time_from: "09:00", // Default time - could be made configurable
        time_to: "17:00",   // Default time - could be made configurable
        type: type,
        notes: `Helyszín: ${location}`,
      }
      
      console.log('Creating forgatás:', forgatásData)
      
      // Make actual API call
      await apiClient.createFilmingSession(forgatásData)
      
      // Reset form and close dialog
      setTitle("")
      setType("")
      setDate("")
      setLocation("")
      setDescription("")
      setOpen(false)
      
      // Show success message (you might want to use a toast library)
      alert('Forgatás sikeresen létrehozva!')
      
    } catch (error) {
      console.error('Error creating forgatás:', error)
      alert('Hiba történt a forgatás létrehozása során')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Létrehozás
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Új forgatás létrehozása</DialogTitle>
            <DialogDescription>
              Hozz létre egy új forgatás projektet. Minden kötelező mezőt tölts ki.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Cím *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pl. Ballagási ünnepség"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Típus *</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz típust" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iskolai-esemeny">Iskolai esemény</SelectItem>
                  <SelectItem value="oktatasi-video">Oktatási videó</SelectItem>
                  <SelectItem value="sportesemseny">Sportesemény</SelectItem>
                  <SelectItem value="kulturalis-esemeny">Kulturális esemény</SelectItem>
                  <SelectItem value="promocios-anyag">Promóciós anyag</SelectItem>
                  <SelectItem value="temahét">Témahét</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Dátum *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Helyszín *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Pl. Sportcsarnok"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Leírás</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Részletes leírás a forgatásról..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Mégse
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Létrehozás..." : "Létrehozás"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
