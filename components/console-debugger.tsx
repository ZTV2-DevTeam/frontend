'use client'

import { useEffect } from 'react'
import { ConsoleErrorFilter } from '@/lib/console-error-filter'

export function ConsoleDebugger() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Initialize console error filtering
      ConsoleErrorFilter.init()

      // Override console methods to detect empty calls specifically
      const originalConsoleError = console.error
      const originalConsoleLog = console.log
      const originalConsoleWarn = console.warn

      // Track empty console calls
      let emptyCallCount = 0

      const wrapConsoleMethod = (method: any, methodName: string) => {
        return (...args: any[]) => {
          // Check for truly empty calls
          if (args.length === 0) {
            emptyCallCount++
            console.warn(`🚨 Empty ${methodName} call #${emptyCallCount} detected at:`, new Error().stack)
            return
          }

          // Check for undefined/null/empty string single arguments
          if (args.length === 1 && (args[0] === undefined || args[0] === null || args[0] === '')) {
            emptyCallCount++
            console.warn(`🚨 ${methodName} with empty argument #${emptyCallCount}:`, {
              argument: args[0],
              type: typeof args[0],
              stack: new Error().stack
            })
            return
          }

          // Call original method
          method(...args)
        }
      }

      console.error = wrapConsoleMethod(originalConsoleError, 'console.error')
      console.log = wrapConsoleMethod(originalConsoleLog, 'console.log')
      console.warn = wrapConsoleMethod(originalConsoleWarn, 'console.warn')

      console.log('🔍 Console debugger initialized. Tracking empty console calls...')

      // Monitor for Next.js hydration errors
      const checkForHydrationErrors = () => {
        const hydrationErrors = document.querySelectorAll('[data-nextjs-hydration-error]')
        if (hydrationErrors.length > 0) {
          console.warn('🚨 Hydration errors detected:', hydrationErrors)
        }
      }

      // Check for hydration errors after a short delay
      const timeoutId = setTimeout(checkForHydrationErrors, 1000)

      return () => {
        clearTimeout(timeoutId)
        console.error = originalConsoleError
        console.log = originalConsoleLog
        console.warn = originalConsoleWarn
      }
    }
  }, [])

  return null
}
