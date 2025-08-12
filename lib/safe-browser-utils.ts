'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Safe browser utilities that handle SSR/CSR differences
 */
export const safeConsole = {
  log: (...args: any[]) => {
    if (args.length === 0) {
      console.warn('🚨 Empty console.log call detected')
      return
    }
    console.log(...args)
  },
  
  error: (...args: any[]) => {
    if (args.length === 0) {
      console.warn('🚨 Empty console.error call detected')
      return
    }
    console.error(...args)
  },
  
  warn: (...args: any[]) => {
    if (args.length === 0) {
      console.warn('🚨 Empty console.warn call detected')
      return
    }
    console.warn(...args)
  },
  
  debug: (...args: any[]) => {
    if (args.length === 0) {
      console.warn('🚨 Empty console.debug call detected')
      return
    }
    console.debug(...args)
  }
}

// Safe document access
export const safeDocument = {
  get cookie() {
    if (typeof document === 'undefined') return ''
    return document.cookie || ''
  },
  
  setCookie(name: string, value: string, options?: string) {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=${value}${options ? `; ${options}` : ''}`
  }
}

// Safe window access
export const safeWindow = {
  get location() {
    if (typeof window === 'undefined') return null
    return window.location
  },
  
  addEventListener(event: string, handler: EventListener) {
    if (typeof window === 'undefined') return
    window.addEventListener(event, handler)
  },
  
  removeEventListener(event: string, handler: EventListener) {
    if (typeof window === 'undefined') return
    window.removeEventListener(event, handler)
  },
  
  get innerWidth() {
    if (typeof window === 'undefined') return 0
    return window.innerWidth
  },
  
  matchMedia(query: string) {
    if (typeof window === 'undefined') {
      // Return a mock MediaQueryList for SSR
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false
      } as unknown as MediaQueryList
    }
    return window.matchMedia(query)
  }
}

// Prevent empty promise rejections
export const safePromise = {
  resolve: <T>(value: T) => Promise.resolve(value),
  
  reject: (reason?: any) => {
    if (reason === undefined || reason === null) {
      return Promise.reject(new Error('Empty promise rejection prevented'))
    }
    return Promise.reject(reason)
  },
  
  // Wrapper for promises that might reject with empty values
  wrap: <T>(promise: Promise<T>) => {
    return promise.catch(error => {
      if (error === undefined || error === null || error === '') {
        throw new Error('Empty promise rejection caught and wrapped')
      }
      throw error
    })
  }
}
