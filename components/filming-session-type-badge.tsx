"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Camera, Users, Calendar, Settings } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FilmingSessionTypeBadgeProps {
  type: string
  label?: string
  showIcon?: boolean
  showTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'secondary'
}

export function FilmingSessionTypeBadge({
  type,
  label,
  showIcon = true,
  showTooltip = true,
  size = 'md',
  variant = 'outline'
}: FilmingSessionTypeBadgeProps) {
  const getFilmingTypeInfo = (typeValue: string) => {
    const typeMap = {
      'kacsa': { 
        icon: Users, 
        color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200', 
        description: 'Kacsa összejátszás',
        fullDescription: 'Kacsa összejátszás - csapatépítés és gyakorlás céljából tartott forgatás',
        defaultLabel: 'Kacsa összejátszás'
      },
      'rendes': { 
        icon: Camera, 
        color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200', 
        description: 'KaCsa forgatás',
        fullDescription: 'KaCsa forgatás - hivatalos műsor készítése céljából tartott forgatás',
        defaultLabel: 'KaCsa forgatás'
      },
      'rendezveny': { 
        icon: Calendar, 
        color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200', 
        description: 'Rendezvény forgatás',
        fullDescription: 'Rendezvény forgatás - események, ünnepségek dokumentálása céljából',
        defaultLabel: 'Rendezvény forgatás'
      },
      'egyeb': { 
        icon: Settings, 
        color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200', 
        description: 'Egyéb forgatás',
        fullDescription: 'Egyéb forgatás - speciális projektek és különleges felvételek',
        defaultLabel: 'Egyéb forgatás'
      }
    }
    return typeMap[typeValue as keyof typeof typeMap] || {
      ...typeMap.egyeb,
      description: `Ismeretlen típus: ${typeValue}`,
      fullDescription: `Ismeretlen forgatás típus: ${typeValue}`,
      defaultLabel: typeValue
    }
  }

  const info = getFilmingTypeInfo(type)
  const Icon = info.icon
  const displayLabel = label || info.defaultLabel

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-1.5 py-0.5 gap-1'
      case 'lg':
        return 'text-sm px-3 py-1.5 gap-2'
      default:
        return 'text-xs px-2 py-1 gap-1.5'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-2.5 w-2.5'
      case 'lg':
        return 'h-4 w-4'
      default:
        return 'h-3 w-3'
    }
  }

  const badgeContent = (
    <Badge 
      variant={variant}
      className={`inline-flex items-center ${getSizeClasses()} ${info.color} transition-colors cursor-help`}
    >
      {showIcon && <Icon className={getIconSize()} />}
      <span className="whitespace-nowrap">{displayLabel}</span>
    </Badge>
  )

  if (!showTooltip) {
    return badgeContent
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-medium">{info.description}</p>
            <p className="text-sm text-muted-foreground mt-1">{info.fullDescription}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Helper function to get filming type display information
export function getFilmingTypeDisplayInfo(type: string) {
  const typeMap = {
    'kacsa': { 
      label: 'Kacsa összejátszás', 
      color: 'blue', 
      icon: 'Users',
      description: 'Csapatépítés és gyakorlás céljából tartott forgatás'
    },
    'rendes': { 
      label: 'KaCsa forgatás', 
      color: 'green', 
      icon: 'Camera',
      description: 'Hivatalos műsor készítése céljából tartott forgatás'
    },
    'rendezveny': { 
      label: 'Rendezvény forgatás', 
      color: 'purple', 
      icon: 'Calendar',
      description: 'Események, ünnepségek dokumentálása céljából'
    },
    'egyeb': { 
      label: 'Egyéb forgatás', 
      color: 'gray', 
      icon: 'Settings',
      description: 'Speciális projektek és különleges felvételek'
    }
  }
  
  return typeMap[type as keyof typeof typeMap] || {
    label: type || 'Ismeretlen',
    color: 'gray',
    icon: 'Settings',
    description: 'Ismeretlen forgatás típus'
  }
}