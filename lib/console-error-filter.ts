'use client'

// Console error filter to prevent empty/undefined console logs
// This will help identify and filter out empty console errors

export class ConsoleErrorFilter {
  private static originalLog = console.log
  private static originalError = console.error
  private static originalWarn = console.warn
  private static originalDebug = console.debug

  static init() {
    // Only filter in development to avoid interfering with production
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // Override console.log to filter empty calls
    console.log = (...args) => {
      if (args.length === 0 || (args.length === 1 && (args[0] === undefined || args[0] === null || args[0] === ''))) {
        ConsoleErrorFilter.originalWarn('🚨 Empty console.log call detected:', new Error().stack)
        return
      }
      ConsoleErrorFilter.originalLog(...args)
    }

    // Override console.error to filter empty calls
    console.error = (...args) => {
      if (args.length === 0 || (args.length === 1 && (args[0] === undefined || args[0] === null || args[0] === ''))) {
        ConsoleErrorFilter.originalWarn('🚨 Empty console.error call detected:', new Error().stack)
        return
      }
      ConsoleErrorFilter.originalError(...args)
    }

    // Override console.warn to filter empty calls
    console.warn = (...args) => {
      if (args.length === 0 || (args.length === 1 && (args[0] === undefined || args[0] === null || args[0] === ''))) {
        ConsoleErrorFilter.originalWarn('🚨 Empty console.warn call detected:', new Error().stack)
        return
      }
      ConsoleErrorFilter.originalWarn(...args)
    }

    // Override console.debug to filter empty calls
    console.debug = (...args) => {
      if (args.length === 0 || (args.length === 1 && (args[0] === undefined || args[0] === null || args[0] === ''))) {
        ConsoleErrorFilter.originalWarn('🚨 Empty console.debug call detected:', new Error().stack)
        return
      }
      ConsoleErrorFilter.originalDebug(...args)
    }

    ConsoleErrorFilter.originalLog('🔍 Console error filter initialized')
  }

  static restore() {
    console.log = ConsoleErrorFilter.originalLog
    console.error = ConsoleErrorFilter.originalError
    console.warn = ConsoleErrorFilter.originalWarn
    console.debug = ConsoleErrorFilter.originalDebug
  }
}
