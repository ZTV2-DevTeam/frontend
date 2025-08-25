/**
 * Platform detection utilities for cross-platform date/time picker support
 */

export interface PlatformInfo {
  isMobile: boolean
  isIOS: boolean
  isAndroid: boolean
  isMac: boolean
  isWindows: boolean
  isLinux: boolean
  supportsNativePickers: boolean
  preferNativePickers: boolean
}

export function getPlatformInfo(): PlatformInfo {
  // Server-side rendering fallback
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      isMac: false,
      isWindows: false,
      isLinux: false,
      supportsNativePickers: false,
      preferNativePickers: false,
    }
  }

  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  
  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  // Platform-specific detection
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /Android/i.test(userAgent)
  const isMac = /Mac|MacIntel/.test(platform) && !isIOS
  const isWindows = /Win/.test(platform)
  const isLinux = /Linux/.test(platform) && !isAndroid

  // Native picker support detection
  const supportsNativePickers = checkNativePickerSupport()
  
  // Preference for native pickers (mobile devices generally prefer native UX)
  const preferNativePickers = isMobile || supportsNativePickers

  return {
    isMobile,
    isIOS,
    isAndroid,
    isMac,
    isWindows,
    isLinux,
    supportsNativePickers,
    preferNativePickers,
  }
}

function checkNativePickerSupport(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    // Create a test input element to check for native support
    const testInput = document.createElement('input')
    testInput.type = 'date'
    
    // Check if the browser supports the date input type
    const supportsDate = testInput.type === 'date'
    
    testInput.type = 'time'
    const supportsTime = testInput.type === 'time'
    
    testInput.type = 'datetime-local'
    const supportsDateTime = testInput.type === 'datetime-local'
    
    return supportsDate && supportsTime && supportsDateTime
  } catch {
    return false
  }
}

/**
 * Get platform-specific date format preferences
 */
export function getDateFormatPreferences(): {
  dateFormat: string
  timeFormat: string
  dateTimeFormat: string
  locale: string
} {
  const platform = getPlatformInfo()
  
  // Base format is Hungarian (24-hour)
  const formats = {
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'yyyy-MM-dd HH:mm',
    locale: 'hu-HU'
  }

  // Platform-specific adjustments
  if (platform.isIOS || platform.isMac) {
    // macOS/iOS users might prefer system format
    try {
      const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale
      formats.locale = systemLocale
    } catch {
      // Fallback to Hungarian
    }
  }

  return formats
}

/**
 * Check if we should use native inputs for better UX
 */
export function shouldUseNativeInput(forceNative?: boolean): boolean {
  if (forceNative !== undefined) return forceNative
  
  const platform = getPlatformInfo()
  return platform.preferNativePickers
}

/**
 * Get appropriate input attributes for cross-platform compatibility
 */
export function getInputAttributes(type: 'date' | 'time' | 'datetime-local'): Record<string, unknown> {
  const platform = getPlatformInfo()
  
  const attributes: Record<string, unknown> = {
    type,
    // Ensure 24-hour format on all platforms
    ...(type === 'time' || type === 'datetime-local' ? { 
      step: '60',
      'data-format': '24',
      style: { 
        WebkitAppearance: 'none',
        MozAppearance: 'textfield'
      }
    } : {}),
  }

  // Platform-specific optimizations
  if (platform.isMobile) {
    // Mobile optimizations
    attributes.inputMode = 'numeric'
    
    // Force 24-hour format on mobile devices
    if (type === 'time' || type === 'datetime-local') {
      attributes.lang = 'hu-HU' // Forces 24-hour format
    }
  }

  if (platform.isIOS) {
    // iOS-specific optimizations for 24-hour format
    attributes.pattern = type === 'time' ? '[0-9]{2}:[0-9]{2}' : undefined
    if (type === 'time' || type === 'datetime-local') {
      // Ensure 24-hour format on iOS
      attributes.lang = 'hu-HU'
      attributes['data-format'] = '24'
    }
  }

  if (platform.isAndroid) {
    // Android-specific optimizations
    if (type === 'time' || type === 'datetime-local') {
      attributes.lang = 'hu-HU' // Force 24-hour format on Android
    }
  }

  return attributes
}
