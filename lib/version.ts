/**
 * Version and build information utilities
 */

import { APP_VERSION } from '@/lib/config'

/**
 * Get the current app version
 */
export function getAppVersion(): string {
  return APP_VERSION
}

/**
 * Get the build date (using build time)
 */
export function getBuildDate(): string {
  // Use environment variable if set during build, otherwise use current date
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE
  if (buildDate) {
    try {
      return new Date(buildDate).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      // Fall through to default
    }
  }
  
  return new Date().toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get a short build date format
 */
export function getShortBuildDate(): string {
  // Use environment variable if set during build, otherwise use current date
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE
  if (buildDate) {
    try {
      return new Date(buildDate).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      // Fall through to default
    }
  }
  
  return new Date().toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * Get formatted version info string
 */
export function getVersionInfo(): string {
  return `${getAppVersion()} • ${getBuildDate()}`
}

/**
 * Get short version info string
 */
export function getShortVersionInfo(): string {
  return `${getAppVersion()} • ${getShortBuildDate()}`
}