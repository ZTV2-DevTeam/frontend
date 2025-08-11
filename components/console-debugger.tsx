'use client'

import { useEffect } from 'react'
import { ConsoleErrorFilter } from '@/lib/console-error-filter'

export function ConsoleDebugger() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Initialize console error filtering only once
      ConsoleErrorFilter.init()
      
      // Log initialization without additional overrides
      console.log('🔧 Console debugger initialized')

      // Monitor for Next.js hydration errors
      const checkForHydrationErrors = () => {
        const hydrationErrors = document.querySelectorAll('[data-nextjs-hydration-error]')
        if (hydrationErrors.length > 0) {
          console.warn('🚨 Hydration errors detected:', hydrationErrors)
        }
      }

      // Check for hydration errors after a short delay
      const timeoutId = setTimeout(checkForHydrationErrors, 1000)

      // Cleanup on unmount
      return () => {
        clearTimeout(timeoutId)
        ConsoleErrorFilter.restore()
      }
    }
  }, [])

  return null
}
