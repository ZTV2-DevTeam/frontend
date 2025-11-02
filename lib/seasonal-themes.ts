/**
 * Seasonal Theme System
 * Manages holiday-themed UI changes throughout the application
 */

export type SeasonalTheme = 'none' | 'halloween' | 'valentines' | 'christmas' | 'newyear'

export interface SeasonalPeriod {
  theme: SeasonalTheme
  name: string
  startMonth: number // 1-12
  startDay: number
  endMonth: number
  endDay: number
}

/**
 * Define seasonal periods
 * Note: These are checked in order, so more specific periods should come first
 */
export const SEASONAL_PERIODS: SeasonalPeriod[] = [
  {
    theme: 'halloween',
    name: 'Halloween',
    startMonth: 10,
    startDay: 25,
    endMonth: 11,
    endDay: 5,
  },
  {
    theme: 'valentines',
    name: 'Valentin-nap',
    startMonth: 2,
    startDay: 10,
    endMonth: 2,
    endDay: 16,
  },
  {
    theme: 'christmas',
    name: 'Karácsony',
    startMonth: 12,
    startDay: 18,
    endMonth: 12,
    endDay: 26,
  },
  {
    theme: 'newyear',
    name: 'Újév',
    startMonth: 12,
    startDay: 27,
    endMonth: 1,
    endDay: 10,
  },
]

/**
 * Check if a date falls within a seasonal period
 */
function isDateInPeriod(date: Date, period: SeasonalPeriod): boolean {
  const month = date.getMonth() + 1 // JS months are 0-indexed
  const day = date.getDate()

  // Handle single-month periods
  if (period.startMonth === period.endMonth) {
    return month === period.startMonth && day >= period.startDay && day <= period.endDay
  }

  // Handle cross-month periods (e.g., Dec 25 - Jan 2)
  if (period.startMonth > period.endMonth) {
    return (
      (month === period.startMonth && day >= period.startDay) ||
      (month === period.endMonth && day <= period.endDay)
    )
  }

  // Handle multi-month periods
  if (month === period.startMonth && day >= period.startDay) {
    return true
  }
  if (month === period.endMonth && day <= period.endDay) {
    return true
  }
  if (month > period.startMonth && month < period.endMonth) {
    return true
  }

  return false
}

/**
 * Get the current active seasonal theme
 */
export function getCurrentSeasonalTheme(date: Date = new Date()): SeasonalTheme {
  for (const period of SEASONAL_PERIODS) {
    if (isDateInPeriod(date, period)) {
      return period.theme
    }
  }
  return 'none'
}

/**
 * Get the name of the current seasonal period
 */
export function getCurrentSeasonalName(date: Date = new Date()): string | null {
  for (const period of SEASONAL_PERIODS) {
    if (isDateInPeriod(date, period)) {
      return period.name
    }
  }
  return null
}

/**
 * Get theme-specific CSS class names
 */
export function getSeasonalThemeClasses(theme: SeasonalTheme): string {
  switch (theme) {
    case 'halloween':
      return 'seasonal-halloween'
    case 'valentines':
      return 'seasonal-valentines'
    case 'christmas':
      return 'seasonal-christmas'
    case 'newyear':
      return 'seasonal-newyear'
    default:
      return ''
  }
}

/**
 * Get theme-specific colors and decorations
 */
export function getSeasonalThemeConfig(theme: SeasonalTheme) {
  switch (theme) {
    case 'halloween':
      return {
        primaryColor: '#ff6b35',
        secondaryColor: '#4a0e4e',
        accentColor: '#f4a261',
        emoji: '🎃',
        particles: ['🦇', '👻', '🕷️', '🕸️', '🎃'],
        greeting: 'Boldog Halloweent!',
      }
    case 'valentines':
      return {
        primaryColor: '#ff1744',
        secondaryColor: '#ff6090',
        accentColor: '#ff80ab',
        emoji: '💝',
        particles: ['💕', '💖', '💗', '💘', '💝', '❤️'],
        greeting: 'Boldog Valentin-napot!',
      }
    case 'christmas':
      return {
        primaryColor: '#c41e3a',
        secondaryColor: '#165b33',
        accentColor: '#ffd700',
        emoji: '🎄',
        particles: ['❄️', '⛄', '🎁', '🔔', '⭐', '🎄'],
        greeting: 'Kellemes Karácsonyi Ünnepeket!',
      }
    case 'newyear':
      return {
        primaryColor: '#ffd700',
        secondaryColor: '#4169e1',
        accentColor: '#ff1493',
        emoji: '🎆',
        particles: ['🎆', '🎇', '✨', '🥂', '🍾', '🎉', '🎊'],
        greeting: 'Boldog Új Évet!',
      }
    default:
      return null
  }
}

/**
 * Check if we're in the in-app experience (not public pages)
 */
export function isInAppExperience(pathname: string): boolean {
  // Exclude public routes
  const publicRoutes = ['/', '/login', '/elfelejtett_jelszo', '/privacy-policy', '/terms-of-service', '/changelog', '/technical-details']
  
  // Check if exact match with public routes
  if (publicRoutes.includes(pathname)) {
    return false
  }
  
  // Check if starts with any public route
  if (publicRoutes.some(route => pathname.startsWith(route + '/'))) {
    return false
  }
  
  // If in /app route, it's in-app
  return pathname.startsWith('/app')
}
