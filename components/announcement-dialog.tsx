"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Save, X, Users, Globe, Search, Loader2, AlertCircle, Eye, Edit } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useApiQuery } from '@/lib/api-helpers'
import { AnnouncementCreateSchema, AnnouncementUpdateSchema, AnnouncementDetailSchema, UserBasicSchema, UserProfileSchema, OsztalySchema } from '@/lib/types'
import { EnhancedMarkdownRenderer } from '@/components/enhanced-markdown-renderer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarkdownHelpDialog } from '@/components/markdown-help-dialog'

interface AnnouncementDialogProps {
  trigger?: React.ReactNode
  announcement?: AnnouncementDetailSchema
  onSuccess?: () => void
  mode?: 'create' | 'edit'
}

export function AnnouncementDialog({ 
  trigger, 
  announcement, 
  onSuccess, 
  mode = 'create' 
}: AnnouncementDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Open dialog programmatically when trigger is null (controlled mode)
  useEffect(() => {
    if (trigger === null) {
      setOpen(true)
    }
  }, [trigger])
  
  // Form state
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [targetingType, setTargetingType] = useState<'public' | 'targeted'>('public')
  const [selectedRecipients, setSelectedRecipients] = useState<UserBasicSchema[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // Data fetching
  const { data: users = [], loading: usersLoading } = useApiQuery(
    () => apiClient.getAllUsers(),
    []
  )

  const { data: classes = [], loading: classesLoading } = useApiQuery(
    () => apiClient.getClasses(),
    []
  )

  // Helper function to convert UserProfileSchema to UserBasicSchema
  const toUserBasic = (user: UserProfileSchema): UserBasicSchema => ({
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    full_name: `${user.first_name} ${user.last_name}`.trim()
  })

  // Initialize form when editing
  useEffect(() => {
    if (mode === 'edit' && announcement) {
      setTitle(announcement.title)
      setBody(announcement.body)
      setTargetingType(announcement.is_targeted ? 'targeted' : 'public')
      setSelectedRecipients(announcement.recipients || [])
    } else {
      // Reset form for create mode
      setTitle('')
      setBody('')
      setTargetingType('public')
      setSelectedRecipients([])
      setSelectedClass('')
    }
  }, [mode, announcement, open])

  // Reset form and state when dialog closes
  const resetForm = () => {
    setTitle('')
    setBody('')
    setTargetingType('public')
    setSelectedRecipients([])
    setSelectedClass('')
    setSearchTerm('')
    setError(null)
    setSuccess(false)
    setLoading(false)
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(resetForm, 200) // Delay reset to avoid flash
  }

  // Filter users based on search and class selection
  const filteredUsers = (users || []).filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.trim()
    const matchesSearch = searchTerm === '' || 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = selectedClass === '' || user.osztaly_name === selectedClass
    
    return matchesSearch && matchesClass
  })

  // Handle recipient selection
  const toggleRecipient = (user: UserProfileSchema) => {
    const userBasic = toUserBasic(user)
    setSelectedRecipients(prev => {
      const exists = prev.find(r => r.id === userBasic.id)
      if (exists) {
        return prev.filter(r => r.id !== userBasic.id)
      } else {
        return [...prev, userBasic]
      }
    })
  }

  const selectAllInClass = (className: string) => {
    const classUsers = (users || []).filter(user => user.osztaly_name === className)
    const allSelected = classUsers.every(user => 
      selectedRecipients.find(r => r.id === user.id)
    )
    
    if (allSelected) {
      // Deselect all in this class
      setSelectedRecipients(prev => 
        prev.filter(r => !classUsers.find(u => u.id === r.id))
      )
    } else {
      // Select all in this class
      const newRecipients = classUsers
        .filter(user => !selectedRecipients.find(r => r.id === user.id))
        .map(toUserBasic)
      setSelectedRecipients(prev => [...prev, ...newRecipients])
    }
  }

  const removeRecipient = (userId: number) => {
    setSelectedRecipients(prev => prev.filter(r => r.id !== userId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !body.trim()) {
      setError('A cím és tartalom megadása kötelező')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const recipientIds = targetingType === 'targeted' 
        ? selectedRecipients.map(r => r.id)
        : []

      if (mode === 'create') {
        const data: AnnouncementCreateSchema = {
          title: title.trim(),
          body: body.trim(),
          recipient_ids: recipientIds
        }
        await apiClient.createAnnouncement(data)
      } else if (mode === 'edit' && announcement) {
        const data: AnnouncementUpdateSchema = {
          title: title.trim(),
          body: body.trim(),
          recipient_ids: recipientIds
        }
        await apiClient.updateAnnouncement(announcement.id, data)
      }

      setSuccess(true)
      
      // Close dialog and call success callback after a brief delay
      setTimeout(() => {
        handleClose()
        onSuccess?.()
      }, 1000)

    } catch (error) {
      console.error('Error saving announcement:', error)
      setError(error instanceof Error ? error.message : 'Hiba történt a közlemény mentésekor')
    } finally {
      setLoading(false)
    }
  }

  const getUniqueClasses = () => {
    const classNames = [...new Set((users || []).map(user => user.osztaly_name).filter(Boolean))] as string[]
    return classNames.sort()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Új közlemény létrehozása' : 'Közlemény szerkesztése'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>
                Közlemény sikeresen {mode === 'create' ? 'létrehozva' : 'frissítve'}!
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Cím *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Közlemény címe"
                disabled={loading || success}
                required
              />
            </div>

            <div>
              <Label htmlFor="body">Tartalom *</Label>
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Szerkesztés
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Előnézet
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-2">
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Közlemény teljes szövege..."
                    rows={6}
                    disabled={loading || success}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1 flex items-center justify-between">
                    <span>
                      Markdown formázás támogatott: **félkövér**, *dőlt*, `kód`, ~~áthúzott~~, 
                      [linkek](url), táblázatok, felsorolások, kódrészletek, matematikai kifejezések és emoji :smile:
                    </span>
                    <MarkdownHelpDialog />
                  </p>
                </TabsContent>
                <TabsContent value="preview" className="mt-2">
                  <div className="min-h-[152px] border rounded-md p-3 bg-muted/50">
                    {body.trim() ? (
                      <EnhancedMarkdownRenderer className="text-sm">
                        {body}
                      </EnhancedMarkdownRenderer>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        Írj valamit a tartalom mezőbe az előnézet megtekintéséhez...
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Targeting Options */}
          <div className="space-y-4">
            <Label>Címzettek</Label>
            
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="targeting"
                  checked={targetingType === 'public'}
                  onChange={() => setTargetingType('public')}
                  disabled={loading || success}
                  className="w-4 h-4"
                  defaultChecked
                />
                <Globe className="h-4 w-4" />
                <span>Közérdekű (minden felhasználó)</span>
              </label>
              
              {/* <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="targeting"
                  checked={targetingType === 'targeted'}
                  onChange={() => setTargetingType('targeted')}
                  disabled={loading || success}
                  className="w-4 h-4"
                />
                <Users className="h-4 w-4" />
                <span>Célzott (kiválasztott felhasználók)</span>
              </label> */}
            </div>

            {targetingType === 'targeted' && (
              <div className="border rounded-lg p-4 space-y-4">
                {/* Recipient Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left: User Selection */}
                  <div className="space-y-3">
                    <Label>Felhasználók kiválasztása</Label>
                    
                    {/* Search and Class Filter */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Keresés név vagy felhasználónév alapján..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                          disabled={loading || success}
                        />
                      </div>
                      
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger>
                          <SelectValue placeholder="Osztály szűrése" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Minden osztály</SelectItem>
                          {getUniqueClasses().map(className => (
                            <SelectItem key={className} value={className}>
                              {className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quick Class Selection */}
                    {selectedClass && (
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm font-medium">{selectedClass}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => selectAllInClass(selectedClass)}
                          disabled={loading || success}
                        >
                          {(users || []).filter(u => u.osztaly_name === selectedClass)
                               .every(u => selectedRecipients.find(r => r.id === u.id))
                            ? 'Kijelölés megszüntetése' 
                            : 'Összes kijelölése'
                          }
                        </Button>
                      </div>
                    )}

                    {/* User List */}
                    <ScrollArea className="h-64 border rounded">
                      <div className="p-2 space-y-1">
                        {usersLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Felhasználók betöltése...
                          </div>
                        ) : filteredUsers.length === 0 ? (
                          <div className="text-center text-muted-foreground p-4">
                            Nincs találat
                          </div>
                        ) : (
                          filteredUsers.map(user => (
                            <div
                              key={user.id}
                              className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                              onClick={() => toggleRecipient(user)}
                            >
                              <Checkbox
                                checked={!!selectedRecipients.find(r => r.id === user.id)}
                                onCheckedChange={() => toggleRecipient(user)}
                                disabled={loading || success}
                              />
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {user.first_name?.[0]}{user.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{`${user.first_name} ${user.last_name}`.trim()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {user.username} • {user.osztaly_name || 'Nincs osztály'}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Right: Selected Recipients */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Kiválasztott címzettek</Label>
                      <Badge variant="secondary">
                        {selectedRecipients.length} felhasználó
                      </Badge>
                    </div>
                    
                    <ScrollArea className="h-64 border rounded">
                      <div className="p-2 space-y-1">
                        {selectedRecipients.length === 0 ? (
                          <div className="text-center text-muted-foreground p-4">
                            Nincs kiválasztott címzett
                          </div>
                        ) : (
                          selectedRecipients.map(recipient => (
                            <div
                              key={recipient.id}
                              className="flex items-center justify-between p-2 bg-accent rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {recipient.first_name?.[0]}{recipient.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{recipient.full_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {recipient.username}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRecipient(recipient.id)}
                                disabled={loading || success}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Mégse
            </Button>
            
            <Button
              type="submit"
              disabled={loading || success || !title.trim() || !body.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === 'create' ? 'Létrehozás...' : 'Mentés...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Közlemény létrehozása' : 'Változások mentése'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
