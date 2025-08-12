// Utility functions for performance optimization

/**
 * Check if an element is in the viewport
 */
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Create an intersection observer for lazy loading
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

/**
 * Debounce function for performance-critical operations
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function for performance-critical operations
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastExec = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastExec > delay) {
      func(...args)
      lastExec = now
    }
  }
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if the connection is slow (effectiveType is 'slow-2g' or '2g')
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) return false
  
  const connection = (navigator as any).connection
  return connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
}

/**
 * Get device memory if available (helpful for deciding lazy loading strategy)
 */
export function getDeviceMemory(): number | null {
  if (typeof navigator === 'undefined' || !('deviceMemory' in navigator)) return null
  return (navigator as any).deviceMemory
}

/**
 * Check if device has low memory (< 4GB)
 */
export function isLowMemoryDevice(): boolean {
  const memory = getDeviceMemory()
  return memory !== null && memory < 4
}

/**
 * Get network information for adaptive loading
 */
export function getNetworkInfo() {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return {
      effectiveType: '4g',
      downlink: 10,
      rtt: 50,
      saveData: false
    }
  }

  const connection = (navigator as any).connection
  return {
    effectiveType: connection.effectiveType || '4g',
    downlink: connection.downlink || 10,
    rtt: connection.rtt || 50,
    saveData: connection.saveData || false
  }
}

/**
 * Determine if we should use aggressive lazy loading based on device/network conditions
 */
export function shouldUseAggressiveLazyLoading(): boolean {
  return isSlowConnection() || isLowMemoryDevice() || getNetworkInfo().saveData
}

/**
 * Create a promise that resolves after a specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let attempt = 0
  
  while (attempt <= maxRetries) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      
      const retryDelay = baseDelay * Math.pow(2, attempt)
      await delay(retryDelay)
      attempt++
    }
  }
  
  throw new Error('Max retries exceeded')
}
