"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useApiQuery } from "@/lib/api-helpers"
import { apiClient } from "@/lib/api"
import type { SystemMessageSchema } from "@/lib/api"
import { SystemMessage } from "./system-message"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemMessagesProps {
  className?: string
  maxMessages?: number
  severityFilter?: 'info' | 'warning' | 'error'
  messageTypeFilter?: 'user' | 'developer' | 'operator' | 'support'
}

interface DismissedMessage {
  messageId: number
  dismissedAt: string
}

const STORAGE_KEY = 'ftv_dismissed_system_messages'
const DISMISS_EXPIRY_DAYS = 7 // Messages stay dismissed for 7 days

export function SystemMessages({ 
  className, 
  maxMessages = 5, 
  severityFilter, 
  messageTypeFilter 
}: SystemMessagesProps) {
  const { isAuthenticated } = useAuth()
  const [dismissedMessages, setDismissedMessages] = useState<DismissedMessage[]>([])
  
  // Fetch system messages from API with optional filters
  const { data: systemMessages, loading, error } = useApiQuery(
    () => isAuthenticated 
      ? apiClient.getSystemMessages(severityFilter, messageTypeFilter) 
      : Promise.resolve([]),
    [isAuthenticated, severityFilter, messageTypeFilter]
  )

  // Load dismissed messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed: DismissedMessage[] = JSON.parse(stored)
          
          // Filter out expired dismissals
          const now = new Date()
          const validDismissals = parsed.filter(dismissed => {
            const dismissedDate = new Date(dismissed.dismissedAt)
            const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
            return daysSinceDismissed <= DISMISS_EXPIRY_DAYS
          })
          
          setDismissedMessages(validDismissals)
          
          // Update localStorage if we filtered out expired items
          if (validDismissals.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validDismissals))
          }
        }
      } catch (error) {
        console.warn('Error loading dismissed system messages:', error)
        // Clear corrupted storage
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Save dismissed messages to localStorage
  const saveDismissedMessages = useCallback((dismissed: DismissedMessage[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed))
      } catch (error) {
        console.warn('Error saving dismissed system messages:', error)
      }
    }
  }, [])

  // Handle message dismissal
  const handleDismissMessage = useCallback((messageId: number) => {
    const newDismissed: DismissedMessage = {
      messageId,
      dismissedAt: new Date().toISOString()
    }
    
    setDismissedMessages(prev => {
      const updated = [...prev.filter(d => d.messageId !== messageId), newDismissed]
      saveDismissedMessages(updated)
      return updated
    })
  }, [saveDismissedMessages])

  // Check if a message is dismissed
  const isMessageDismissed = useCallback((messageId: number): boolean => {
    return dismissedMessages.some(dismissed => dismissed.messageId === messageId)
  }, [dismissedMessages])

  // Filter and sort messages
  const displayMessages = (() => {
    if (!systemMessages || systemMessages.length === 0) {
      return []
    }

    // Get current time for filtering active messages
    const now = new Date()
    
    // Filter active messages - use is_active field if available, fallback to date range
    const activeMessages = systemMessages.filter((message: SystemMessageSchema) => {
      // If message has is_active field, use it
      if (typeof message.is_active === 'boolean') {
        return message.is_active
      }
      
      // Fallback to date range check
      try {
        const showFrom = new Date(message.showFrom)
        const showTo = new Date(message.showTo)
        
        // Check if dates are valid
        if (isNaN(showFrom.getTime()) || isNaN(showTo.getTime())) {
          console.warn('Invalid date in system message:', message.id, message.showFrom, message.showTo)
          return false
        }
        
        return now >= showFrom && now <= showTo
      } catch (error) {
        console.warn('Error filtering system message dates:', error, message)
        return false
      }
    })

    // Filter out dismissed messages
    const visibleMessages = activeMessages.filter((message: SystemMessageSchema) => 
      !isMessageDismissed(message.id)
    )

    // Sort by creation date (newest first), with priority for severity
    const sortedMessages = visibleMessages.sort((a: SystemMessageSchema, b: SystemMessageSchema) => {
      try {
        // First sort by severity priority (error > warning > info)
        const severityPriority = { 'error': 3, 'warning': 2, 'info': 1 }
        const aPriority = severityPriority[a.severity] || 1
        const bPriority = severityPriority[b.severity] || 1
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority
        }
        
        // Then sort by creation date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } catch (error) {
        console.warn('Error sorting system messages:', error)
        return 0
      }
    })

    // Limit to maxMessages
    return sortedMessages.slice(0, maxMessages)
  })()

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Rendszerüzenetek betöltése...</span>
        </div>
      </div>
    )
  }

  // Error state - don't show errors for system messages as they're not critical
  if (error) {
    console.warn('Failed to load system messages:', error)
    return null
  }

  // No messages to show
  if (displayMessages.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-3", className)} role="region" aria-label="Rendszerüzenetek">
      {displayMessages.map((message: SystemMessageSchema) => (
        <SystemMessage
          key={message.id}
          message={message}
          onDismiss={handleDismissMessage}
          isDismissed={isMessageDismissed(message.id)}
        />
      ))}
    </div>
  )
}