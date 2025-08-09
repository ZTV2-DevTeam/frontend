/**
 * DatabaseAdminMenu Component
 * 
 * Generates a complete database admin menu based on the centralized 
 * database models configuration. Can be used in sidebars, dropdown menus, 
 * or as standalone navigation.
 */

"use client"

import React from 'react'
import { 
  getDatabaseAdminMenuItemsByRole,
  getDatabaseAdminUrl,
  type DatabaseAdminMenuItem 
} from '@/lib/database-models'
import { useUserRole } from '@/contexts/user-role-context'
import { Button } from '@/components/ui/button'
import { ExternalLink, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Icon mapping - we need to import the actual icon components
import { 
  Video, 
  TableProperties, 
  UserCheck, 
  Users, 
  Wrench, 
  Settings, 
  Tag, 
  Phone, 
  GraduationCap, 
  Calendar, 
  User, 
  BellDot, 
  Shield, 
  Network, 
  Handshake,
  Database
} from 'lucide-react'

const iconComponents = {
  Video,
  TableProperties,
  UserCheck,
  Users,
  Wrench,
  Settings,
  Tag,
  Phone,
  GraduationCap,
  Calendar,
  User,
  BellDot,
  Shield,
  Network,
  Handshake,
  Database,
}

interface DatabaseAdminMenuProps {
  userRole?: string
  layout?: 'grid' | 'list' | 'sidebar'
  showCategories?: boolean
  className?: string
}

/**
 * Complete database admin menu component
 */
export function DatabaseAdminMenu({ 
  userRole, 
  layout = 'list',
  showCategories = true,
  className = '' 
}: DatabaseAdminMenuProps) {
  const { currentRole } = useUserRole()
  const role = userRole || currentRole
  
  const menuItems = getDatabaseAdminMenuItemsByRole(role)
  
  if (menuItems.length === 0) {
    return null
  }

  const handleItemClick = (item: DatabaseAdminMenuItem) => {
    const adminUrl = getDatabaseAdminUrl(item.modelPath)
    window.open(adminUrl, '_blank')
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents]
    return IconComponent || Database
  }

  // Group items by category if categories are enabled
  const groupedItems = showCategories 
    ? menuItems.reduce((acc, item) => {
        const category = item.category || 'Egyéb'
        if (!acc[category]) acc[category] = []
        acc[category].push(item)
        return acc
      }, {} as Record<string, DatabaseAdminMenuItem[]>)
    : { 'Database Admin': menuItems }

  if (layout === 'grid') {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {Object.entries(groupedItems).map(([category, items]) => (
          <Card key={category}>
            {showCategories && (
              <CardHeader>
                <CardTitle className="text-sm">{category}</CardTitle>
              </CardHeader>
            )}
            <CardContent className="space-y-2">
              {items.map((item) => {
                const IconComponent = getIconComponent(item.icon)
                return (
                  <Button
                    key={item.modelPath}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleItemClick(item)}
                    className="w-full justify-start"
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {item.name}
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (layout === 'sidebar') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            {showCategories && (
              <>
                <h4 className="text-sm font-medium text-muted-foreground px-2 py-1">
                  {category}
                </h4>
                <Separator className="mb-2" />
              </>
            )}
            <div className="space-y-1">
              {items.map((item) => {
                const IconComponent = getIconComponent(item.icon)
                return (
                  <button
                    key={item.modelPath}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center w-full px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default list layout
  return (
    <div className={`space-y-4 ${className}`}>
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category}>
          {showCategories && (
            <h3 className="text-lg font-semibold mb-2">{category}</h3>
          )}
          <div className="space-y-1">
            {items.map((item) => {
              const IconComponent = getIconComponent(item.icon)
              return (
                <div
                  key={item.modelPath}
                  onClick={() => handleItemClick(item)}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <IconComponent className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <span className="text-sm mr-2">Django Admin</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Quick access database admin toolbar
 */
interface DatabaseAdminToolbarProps {
  userRole?: string
  maxItems?: number
  className?: string
}

export function DatabaseAdminToolbar({ 
  userRole, 
  maxItems = 5,
  className = '' 
}: DatabaseAdminToolbarProps) {
  const { currentRole } = useUserRole()
  const role = userRole || currentRole
  
  const menuItems = getDatabaseAdminMenuItemsByRole(role).slice(0, maxItems)
  
  if (menuItems.length === 0) {
    return null
  }

  const handleItemClick = (item: DatabaseAdminMenuItem) => {
    const adminUrl = getDatabaseAdminUrl(item.modelPath)
    window.open(adminUrl, '_blank')
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents]
    return IconComponent || Database
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Database Admin:</span>
      {menuItems.map((item) => {
        const IconComponent = getIconComponent(item.icon)
        return (
          <Button
            key={item.modelPath}
            variant="outline"
            size="sm"
            onClick={() => handleItemClick(item)}
            className="inline-flex items-center gap-1"
          >
            <IconComponent className="h-3 w-3" />
            {item.name}
          </Button>
        )
      })}
    </div>
  )
}
