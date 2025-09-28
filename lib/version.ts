/**
 * Version and build information utilities
 */

import { changelogData } from '@/config/changelog'

/**
 * Get the latest version from the changelog (sorted by date)
 */
export function getAppVersion(): string {
  // Get the first entry from the sorted changelog (newest first)
  const latestEntry = changelogData[0]
  return latestEntry?.id || "v1.0.0"
}

/**
 * Get the latest release date from the changelog
 */
export function getBuildDate(): string {
  const latestEntry = changelogData[0]
  if (!latestEntry?.date) {
    return new Date().toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  try {
    const releaseDate = new Date(latestEntry.date)
    return releaseDate.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return latestEntry.title || new Date().toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

/**
 * Get a short build date format
 */
export function getShortBuildDate(): string {
  const latestEntry = changelogData[0]
  if (!latestEntry?.date) {
    return new Date().toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  try {
    const releaseDate = new Date(latestEntry.date)
    return releaseDate.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return new Date().toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
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