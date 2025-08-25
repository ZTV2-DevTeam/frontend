"use client"

import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { MoreHorizontal, Edit, Trash2, Eye, Loader2, AlertTriangle } from 'lucide-react'
import { AnnouncementDetailSchema, AnnouncementSchema } from '@/lib/types'
import { apiClient } from '@/lib/api'
import { AnnouncementDialog } from './announcement-dialog'

interface AnnouncementActionsProps {
  announcement: AnnouncementSchema | AnnouncementDetailSchema
  onSuccess?: () => void
  userCanEdit?: boolean
  userCanDelete?: boolean
  userCanView?: boolean
}

export function AnnouncementActions({ 
  announcement, 
  onSuccess, 
  userCanEdit = false, 
  userCanDelete = false,
  userCanView = true 
}: AnnouncementActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcementDetails, setAnnouncementDetails] = useState<AnnouncementDetailSchema | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const fetchAnnouncementDetails = async () => {
    if ('recipients' in announcement) {
      setAnnouncementDetails(announcement as AnnouncementDetailSchema)
      return
    }

    setLoadingDetails(true)
    try {
      const details = await apiClient.getAnnouncementDetails(announcement.id)
      setAnnouncementDetails(details)
    } catch (error) {
      console.error('Error fetching announcement details:', error)
      setError('Nem sikerült betölteni a közlemény részleteit')
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleEdit = async () => {
    await fetchAnnouncementDetails()
    setShowEditDialog(true)
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError(null)
    
    try {
      await apiClient.deleteAnnouncement(announcement.id)
      setShowDeleteDialog(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error deleting announcement:', error)
      setError(error instanceof Error ? error.message : 'Hiba történt a közlemény törlésekor')
    } finally {
      setDeleting(false)
    }
  }

  // Don't show actions if user has no permissions
  if (!userCanEdit && !userCanDelete && !userCanView) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          {/* {userCanView && (
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="h-4 w-4 mr-2" />
              Részletek megtekintése
            </DropdownMenuItem>
          )} */}
          
          {userCanEdit && (
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Szerkesztés
            </DropdownMenuItem>
          )}
          
          {userCanDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Törlés
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      {showEditDialog && announcementDetails && (
        <AnnouncementDialog
          mode="edit"
          announcement={announcementDetails}
          onSuccess={() => {
            setShowEditDialog(false)
            onSuccess?.()
          }}
          trigger={null}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Közlemény törlése
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p>Biztosan törölni szeretné ezt a közleményt?</p>
            
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium text-sm">{announcement.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {announcement.recipient_count > 0 
                  ? `${announcement.recipient_count} címzett`
                  : 'Nyilvános közlemény'
                }
              </p>
            </div>
            
            <p className="text-sm text-destructive">
              Ez a művelet nem vonható vissza.
            </p>
            
            {error && (
              <p className="text-sm text-destructive">
                Hiba: {error}
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Mégse
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Törlés...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Törlés
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
