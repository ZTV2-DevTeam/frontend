'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SimpleLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  showText?: boolean
  className?: string
  variant?: 'default' | 'minimal' | 'gradient'
}

export function SimpleLoading({ 
  size = 'md', 
  text = 'Betöltés...', 
  showText = true,
  className,
  variant = 'default'
}: SimpleLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <Loader2 className={cn(sizeClasses[size], "animate-spin text-muted-foreground")} />
      </div>
    )
  }

  if (variant === 'gradient') {
    return (
      <div className={cn("flex items-center justify-center gap-3", className)}>
        <div className="relative">
          <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
          <Sparkles className="absolute -top-0.5 -right-0.5 h-3 w-3 text-primary animate-pulse" />
        </div>
        {showText && (
          <span className={cn(
            textSizeClasses[size], 
            "font-medium bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
          )}>
            {text}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
      {showText && (
        <span className={cn(textSizeClasses[size], "text-muted-foreground")}>
          {text}
        </span>
      )}
    </div>
  )
}

// Skeleton loading component for lists and cards
export function SkeletonLoader({ 
  lines = 3, 
  className 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={cn("animate-pulse space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-md",
            i === 0 && "w-3/4",
            i === 1 && "w-full", 
            i === 2 && "w-1/2",
            i > 2 && "w-2/3"
          )} 
        />
      ))}
    </div>
  )
}

// Loading overlay for full page
export function LoadingOverlay({ 
  isVisible, 
  text = 'Betöltés...', 
  className 
}: { 
  isVisible: boolean
  text?: string
  className?: string 
}) {
  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center",
      className
    )}>
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
        </div>
        <p className="text-lg font-medium text-foreground">{text}</p>
      </div>
    </div>
  )
}
