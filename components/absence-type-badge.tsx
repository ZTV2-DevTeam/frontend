import React from 'react'
import { TavolletTipusBasicSchema } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AbsenceTypeBadgeProps {
  tipus?: TavolletTipusBasicSchema | null
  showTooltip?: boolean
  size?: 'sm' | 'default'
  className?: string
}

export function AbsenceTypeBadge({ 
  tipus, 
  showTooltip = true,
  size = 'default',
  className 
}: AbsenceTypeBadgeProps) {
  if (!tipus) {
    return (
      <div className="text-xs text-muted-foreground italic">
        Nincs típus
      </div>
    )
  }

  const getIgnoredCountsAsDisplay = (ignoredCountsAs: string) => {
    switch (ignoredCountsAs) {
      case 'approved':
        return { 
          icon: CheckCircle, 
          // Updated for better dark mode support and modern design
          color: 'text-emerald-700 dark:text-emerald-400', 
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', 
          borderColor: 'border-emerald-200 dark:border-emerald-800',
          hoverColor: 'hover:bg-emerald-100 dark:hover:bg-emerald-950/50',
          description: 'Jóváhagyatlan állapotban elfogadottnak számít'
        }
      case 'denied':
        return { 
          icon: XCircle, 
          // Updated for better dark mode support and modern design
          color: 'text-rose-700 dark:text-rose-400', 
          bgColor: 'bg-rose-50 dark:bg-rose-950/30', 
          borderColor: 'border-rose-200 dark:border-rose-800',
          hoverColor: 'hover:bg-rose-100 dark:hover:bg-rose-950/50',
          description: 'Jóváhagyatlan állapotban elutasítottnak számít'
        }
      default:
        return { 
          icon: HelpCircle, 
          // Updated for better dark mode support and modern design
          color: 'text-slate-600 dark:text-slate-400', 
          bgColor: 'bg-slate-50 dark:bg-slate-900/30', 
          borderColor: 'border-slate-200 dark:border-slate-700',
          hoverColor: 'hover:bg-slate-100 dark:hover:bg-slate-900/50',
          description: 'Ismeretlen viselkedés'
        }
    }
  }

  const display = getIgnoredCountsAsDisplay(tipus.ignored_counts_as)
  const IconComponent = display.icon
  
  const badge = (
    <Badge 
      variant="outline" 
      className={`
        ${display.color}
        ${display.bgColor}
        ${display.borderColor}
        ${display.hoverColor}
        font-medium transition-colors duration-200
        ${size === 'sm' ? 'text-xs px-2 py-0.5 h-5' : 'text-sm px-2.5 py-1 h-6'}
        ${className || ''}
      `.replace(/\s+/g, ' ').trim()}
    >
      <IconComponent className={`${size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} mr-1.5 flex-shrink-0`} />
      <span className="truncate">{tipus.name}</span>
    </Badge>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            align="center"
            className="max-w-xs p-3 bg-popover border border-border shadow-lg"
          >
            <div className="space-y-2">
              <div className="font-semibold text-sm text-popover-foreground">{tipus.name}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {display.description}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badge
}

// Utility function to get absence type display info
export function getAbsenceTypeInfo(tipus?: TavolletTipusBasicSchema | null) {
  if (!tipus) return null
  
  return {
    name: tipus.name,
    ignoredCountsAs: tipus.ignored_counts_as,
    isApprovedWhenPending: tipus.ignored_counts_as === 'approved',
    isDeniedWhenPending: tipus.ignored_counts_as === 'denied'
  }
}