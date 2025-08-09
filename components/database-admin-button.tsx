/**
 * DatabaseAdminButton Component
 * 
 * A reusable button component that redirects to Django admin pages
 * for database model management. Uses the centralized database models configuration.
 */

"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { 
  DATABASE_MODELS, 
  getDatabaseAdminUrl, 
  getModelDisplayName,
  type DatabaseAdminMenuItem 
} from '@/lib/database-models'

interface DatabaseAdminButtonProps {
  modelPath?: string
  modelName?: keyof typeof DATABASE_MODELS
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
}

/**
 * Button component that opens Django admin page for a specific model
 */
export function DatabaseAdminButton({ 
  modelPath, 
  modelName, 
  variant = 'outline', 
  size = 'sm', 
  className = '',
  children 
}: DatabaseAdminButtonProps) {
  const path = modelPath || (modelName ? DATABASE_MODELS[modelName] : '')
  
  if (!path) {
    console.warn('DatabaseAdminButton: No modelPath or valid modelName provided')
    return null
  }

  const handleClick = () => {
    const adminUrl = getDatabaseAdminUrl(path)
    window.open(adminUrl, '_blank')
  }

  const displayName = children || getModelDisplayName(path) || 'Database Admin'

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleClick}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <ExternalLink className="h-4 w-4" />
      {displayName}
    </Button>
  )
}

/**
 * Dropdown menu item for database admin access
 */
interface DatabaseAdminMenuItemProps {
  modelPath?: string
  modelName?: keyof typeof DATABASE_MODELS
  onClick?: () => void
  children?: React.ReactNode
}

export function DatabaseAdminMenuItem({ 
  modelPath, 
  modelName, 
  onClick,
  children 
}: DatabaseAdminMenuItemProps) {
  const path = modelPath || (modelName ? DATABASE_MODELS[modelName] : '')
  
  if (!path) {
    return null
  }

  const handleClick = () => {
    const adminUrl = getDatabaseAdminUrl(path)
    window.open(adminUrl, '_blank')
    onClick?.()
  }

  const displayName = children || `${getModelDisplayName(path)} szerkesztése`

  return (
    <div 
      onClick={handleClick}
      className="flex items-center cursor-pointer px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      {displayName}
    </div>
  )
}
