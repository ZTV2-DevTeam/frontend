'use client'

import { useEffect } from 'react'

interface DebugConsoleProps {
  label: string
  data: any
  enabled?: boolean
}

export function DebugConsole({ label, data, enabled = process.env.NODE_ENV === 'development' }: DebugConsoleProps) {
  useEffect(() => {
    if (enabled) {
      console.log(`🐛 [${label}]:`, data)
      
      // Additional safety checks for React rendering
      if (typeof data === 'object' && data !== null) {
        console.log(`⚠️ [${label}] Object detected - ensure safe rendering:`)
        
        // Check for common problematic patterns
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            console.warn(`🔴 [${label}] Property "${key}" is an object:`, value)
            console.warn(`   Consider extracting as: ${key}: value.name || value.id || String(value)`)
          }
        })
      }
    }
  }, [label, data, enabled])

  return null // This component doesn't render anything
}

export default DebugConsole
