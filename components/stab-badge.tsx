'use client'

import { Badge } from "./ui/badge"

/**
 * Derive the A/B team letter from a Stab's name (e.g. "A stáb" -> "A").
 * Returns undefined when the stab is missing or doesn't match either team
 * (e.g. a "None"/unassigned stab) - callers should treat that as "no badge".
 */
export function getStabTeam(stab?: { name?: string | null } | null): 'A' | 'B' | undefined {
  const name = stab?.name?.toLowerCase()
  if (!name) return undefined
  if (name.includes('a stáb') || name.includes('a-stáb')) return 'A'
  if (name.includes('b stáb') || name.includes('b-stáb')) return 'B'
  return undefined
}

interface StabBadgeProps {
  stab: {
    id: number
    name: string
    member_count?: number
  } | null
  size?: 'sm' | 'md' | 'lg'
  showMemberCount?: boolean
  className?: string
}

export function StabBadge({ stab, size = 'md', showMemberCount = false, className = '' }: StabBadgeProps) {
  if (!stab) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1'
  }

  // Determine color based on stab name with dark mode support
  const isAStab = stab.name.toLowerCase().includes('a stáb') || stab.name.toLowerCase().includes('a-stáb')
  const isBStab = stab.name.toLowerCase().includes('b stáb') || stab.name.toLowerCase().includes('b-stáb')
  
  let colorClasses = "bg-blue-500/10 border border-blue-500/30 text-blue-400 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/30"
  
  if (isAStab) {
    colorClasses = "bg-blue-500/10 border border-blue-500/30 text-blue-400 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/30"
  } else if (isBStab) {
    colorClasses = "bg-green-500/10 border border-green-500/30 text-green-400 dark:bg-green-400/10 dark:text-green-300 dark:border-green-400/30"
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${colorClasses} ${sizeClasses[size]} ${className}`}>
      <span>🎬</span>
      <span className="font-medium">{stab.name}</span>
      {showMemberCount && stab.member_count !== undefined && (
        <span className="text-xs opacity-75">({stab.member_count} tag)</span>
      )}
    </span>
  )
}

interface UserStabBadgeProps {
  stabName: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserStabBadge({ stabName, size = 'md', className = '' }: UserStabBadgeProps) {
  if (!stabName) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 h-5',
    md: 'text-xs px-2.5 py-1 h-6',
    lg: 'text-sm px-3 py-1 h-7'
  }

  // Determine color based on stab name with dark mode support
  const isAStab = stabName.toLowerCase().includes('a stáb') || stabName.toLowerCase().includes('a-stáb')
  const isBStab = stabName.toLowerCase().includes('b stáb') || stabName.toLowerCase().includes('b-stáb')
  
  let colorClasses = "bg-slate-500/10 text-slate-600 border-slate-500/30 dark:bg-slate-400/10 dark:text-slate-300 dark:border-slate-400/30"
  
  if (isAStab) {
    colorClasses = "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/30"
  } else if (isBStab) {
    colorClasses = "bg-green-500/10 text-green-600 border-green-500/30 dark:bg-green-400/10 dark:text-green-300 dark:border-green-400/30"
  }

  return (
    <Badge
      variant="outline"
      className={`font-medium ${sizeClasses[size]} ${colorClasses} ${className}`}
    >
      {stabName}
    </Badge>
  )
}
