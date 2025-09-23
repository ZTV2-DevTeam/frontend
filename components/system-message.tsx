"use client"

import { useState } from "react"
import { X, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SystemMessageSchema } from "@/lib/api"

interface SystemMessageProps {
  message: SystemMessageSchema
  onDismiss: (messageId: number) => void
  isDismissed: boolean
  className?: string
}

const getSeverityConfig = (severity: 'info' | 'warning' | 'error') => {
  switch (severity) {
    case 'error':
      return {
        icon: AlertCircle,
        variant: 'destructive' as const,
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-600 dark:text-red-400',
        badgeColor: 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300'
      }
    case 'warning':
      return {
        icon: AlertTriangle,
        variant: 'warning' as const,
        bgColor: 'bg-amber-50 dark:bg-amber-950/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badgeColor: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300'
      }
    case 'info':
    default:
      return {
        icon: Info,
        variant: 'info' as const,
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-600 dark:text-blue-400',
        badgeColor: 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300'
      }
  }
}

const getMessageTypeDisplay = (messageType: 'user' | 'developer' | 'operator' | 'support'): string => {
  switch (messageType) {
    case 'user':
      return 'Rendszergazdai tájékoztatás'
    case 'developer':
      return 'Fejlesztői tájékoztatás'
    case 'operator':
      return 'Üzemeltetői tájékoztatás'
    case 'support':
      return 'Támogatói tájékoztatás'
    default:
      return 'Rendszerüzenet'
  }
}

const getMessageTypeConfig = (title: string, message: string) => {
  const content = `${title} ${message}`.toLowerCase()
  
  if (content.includes('kritikus') || content.includes('sürgős') || content.includes('hibaelhárítás') || content.includes('leállás')) {
    return {
      icon: AlertCircle,
      variant: 'destructive' as const,
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      badgeColor: 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300'
    }
  }
  
  if (content.includes('figyelmeztetés') || content.includes('figyelj') || content.includes('karbantartás') || content.includes('határidő')) {
    return {
      icon: AlertTriangle,
      variant: 'warning' as const,
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
      badgeColor: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300'
    }
  }
  
  if (content.includes('sikeres') || content.includes('befejezve') || content.includes('megoldva') || content.includes('helyreállítva')) {
    return {
      icon: CheckCircle,
      variant: 'success' as const,
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      badgeColor: 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-300'
    }
  }
  
  // Default info type
  return {
    icon: Info,
    variant: 'info' as const,
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeColor: 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300'
  }
}

const formatMessageDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ''
    }
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('hu-HU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (diffDays === 1) {
      return 'tegnap'
    } else if (diffDays < 7) {
      return `${diffDays} napja`
    } else {
      return date.toLocaleDateString('hu-HU', {
        month: 'short',
        day: 'numeric'
      })
    }
  } catch (error) {
    console.warn('Error formatting message date:', error)
    return ''
  }
}

export function SystemMessage({ message, onDismiss, isDismissed, className }: SystemMessageProps) {
  const [isVisible, setIsVisible] = useState(!isDismissed)
  
  // Use severity for styling, fallback to content analysis for backward compatibility
  const severityConfig = message.severity 
    ? getSeverityConfig(message.severity)
    : getMessageTypeConfig(message.title, message.message)
    
  const IconComponent = severityConfig.icon
  
  const handleDismiss = () => {
    setIsVisible(false)
    // Small delay before calling onDismiss to allow exit animation
    setTimeout(() => {
      onDismiss(message.id)
    }, 200)
  }
  
  if (!isVisible) {
    return null
  }
  
  return (
    <Card 
      className={cn(
        "relative transition-all duration-200 ease-in-out",
        severityConfig.bgColor,
        severityConfig.borderColor,
        "border-l-4",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <IconComponent 
              className={cn("h-5 w-5 mt-0.5", severityConfig.iconColor)} 
              aria-hidden="true"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground mb-1">
                  {message.title}
                </h4>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {message.message}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="flex-shrink-0 h-8 w-8 p-0 hover:bg-background/60 transition-colors"
                aria-label="Üzenet bezárása"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Message metadata */}
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-medium",
                  severityConfig.badgeColor
                )}
              >
                {message.messageType ? getMessageTypeDisplay(message.messageType) : 'Rendszerüzenet'}
              </Badge>
              {message.severity && (
                <>
                  <span>•</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-medium capitalize",
                      severityConfig.badgeColor
                    )}
                  >
                    {message.severity === 'info' ? 'Információ' : 
                     message.severity === 'warning' ? 'Figyelmeztetés' : 
                     'Hiba'}
                  </Badge>
                </>
              )}
              <span>•</span>
              <time dateTime={message.created_at}>
                {formatMessageDate(message.created_at)}
              </time>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}