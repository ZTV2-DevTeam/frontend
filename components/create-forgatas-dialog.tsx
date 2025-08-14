"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ExternalLink } from "lucide-react"
import { useUserRole } from "@/contexts/user-role-context"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/contexts/permissions-context"
import { DATABASE_MODELS, getDatabaseAdminUrl } from "@/lib/database-models"

export function CreateForgatásDialog() {
  const { currentRole } = useUserRole()
  const { user } = useAuth()
  const { hasPermission, permissions } = usePermissions()

  const classDisplayName = permissions?.role_info?.class_display_name || permissions?.role_info?.class_assignment?.display_name
  const is10FStudent = currentRole === 'student' && classDisplayName === '10F'
  const canCreateForgatás = hasPermission('can_create_forgatas') || hasPermission('is_admin') || currentRole === 'admin' || is10FStudent

  if (!canCreateForgatás) {
    return null
  }

  const handleCreateNew = () => {
    const adminUrl = getDatabaseAdminUrl(DATABASE_MODELS.FORGATAS + '/add')
    window.open(adminUrl, '_blank')
  }

  return (
    <Button onClick={handleCreateNew} size="sm" className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Új forgatás
      <ExternalLink className="h-3 w-3" />
    </Button>
  )
}
