'use client'

// Console error filter to prevent empty/undefined console logs
// This will help identify and filter out empty console errors

export class ConsoleErrorFilter {
  private static originalLog = console.log
  private static originalError = console.error
  private static originalWarn = console.warn
  private static originalDebug = console.debug
  private static isInitialized = false

  static init() {
    // Only filter in development to avoid interfering with production
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // Prevent double initialization
    if (ConsoleErrorFilter.isInitialized) {
      return
    }

    ConsoleErrorFilter.isInitialized = true

    // Override console.log to filter empty calls
    console.log = (...args) => {
      // Allow React and Next.js internal calls to pass through
      if (args.length === 0) {
        return // Silently ignore empty calls instead of warning
      }
      if (args.length === 1 && (args[0] === undefined || args[0] === null || args[0] === '')) {
        return // Silently ignore empty calls
      }
      ConsoleErrorFilter.originalLog(...args)
    }

    // Override console.error to filter empty calls
    console.error = (...args) => {
      // Allow React and Next.js internal calls to pass through
      if (args.length === 0) {
        return // Silently ignore empty calls
      }
      if (args.length === 1 && (args[0] === undefined || args[0] === null || args[0] === '')) {
        return // Silently ignore empty calls
      }
      ConsoleErrorFilter.originalError(...args)
    }

    // Override console.warn to filter empty calls
    console.warn = (...args) => {
      if (args.length === 0) {
        return // Silently ignore empty calls
      }
      if (args.length === 1 && (args[0] === undefined || args[0] === null || args[0] === '')) {
        return // Silently ignore empty calls
      }
      ConsoleErrorFilter.originalWarn(...args)
    }

    // Override console.debug to filter empty calls
    console.debug = (...args) => {
      if (args.length === 0) {
        return // Silently ignore empty calls
      }
      if (args.length === 1 && (args[0] === undefined || args[0] === null || args[0] === '')) {
        return // Silently ignore empty calls
      }
      ConsoleErrorFilter.originalDebug(...args)
    }

    ConsoleErrorFilter.originalLog('🔍 Console error filter initialized')
  }

  static restore() {
    if (!ConsoleErrorFilter.isInitialized) {
      return
    }

    console.log = ConsoleErrorFilter.originalLog
    console.error = ConsoleErrorFilter.originalError
    console.warn = ConsoleErrorFilter.originalWarn
    console.debug = ConsoleErrorFilter.originalDebug
    ConsoleErrorFilter.isInitialized = false
  }
}
