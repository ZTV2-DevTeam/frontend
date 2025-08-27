'use client'

import { Badge } from "./ui/badge"

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

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/30 ${sizeClasses[size]} ${className}`}>
      <span className="text-blue-400">🎬</span>
      <span className="font-medium text-blue-400">{stab.name}</span>
      {showMemberCount && stab.member_count !== undefined && (
        <span className="text-blue-300 text-xs">({stab.member_count} tag)</span>
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
    sm: 'text-xs px-1 py-0 h-3',
    md: 'text-sm px-1 py-0 h-4',
    lg: 'text-base px-2 py-1 h-5'
  }

  // Determine color based on stab name
  const isAStab = stabName.toLowerCase().includes('a stáb') || stabName.toLowerCase().includes('a-stáb')
  const isBStab = stabName.toLowerCase().includes('b stáb') || stabName.toLowerCase().includes('b-stáb')
  
  let colorClasses = "bg-slate-500/10 text-slate-400 border-slate-500/30"
  
  if (isAStab) {
    colorClasses = "bg-blue-500/10 text-blue-400 border-blue-500/30"
  } else if (isBStab) {
    colorClasses = "bg-green-500/10 text-green-400 border-green-500/30"
  }

  return (
    <Badge
      variant="outline"
      className={`${sizeClasses[size]} ${colorClasses} ${className}`}
    >
      {stabName}
    </Badge>
  )
}
