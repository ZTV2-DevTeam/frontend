import { errorUtils } from './api-helpers'

/**
 * Utility functions for handling API responses in React components
 */
export const responseUtils = {
  /**
   * Check if a loading/error/data state represents an empty but valid result
   */
  isEmptyButValid: <T>(data: T | null, loading: boolean, error: string | null): boolean => {
    return !loading && !error && (
      data === null || 
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === 'object' && data !== null && Object.keys(data).length === 0)
    )
  },

  /**
   * Check if an error should trigger authentication flow
   */
  shouldRedirectToLogin: (error: string | null): boolean => {
    return error !== null && errorUtils.isAuthError(error)
  },

  /**
   * Get appropriate empty state message based on data type
   */
  getEmptyStateMessage: (dataType: string): string => {
    const messages: Record<string, string> = {
      announcements: 'Nincsenek közlemények.',
      users: 'Nincsenek felhasználók.',
      partners: 'Nincsenek partnerek.',
      equipment: 'Nincsenek eszközök.',
      sessions: 'Nincsenek munkamenetek.',
      classes: 'Nincsenek osztályok.',
      absences: 'Nincsenek hiányzások.',
      assignments: 'Nincsenek beosztások.',
      default: 'Nincsenek adatok.'
    }
    return messages[dataType] || messages.default
  },

  /**
   * Format error message for display
   */
  formatErrorMessage: (error: string | null): string => {
    if (!error) return ''
    
    // Translate common error messages to Hungarian
    const translations: Record<string, string> = {
      'Network error': 'Hálózati hiba',
      'Server error': 'Szerverhiba',
      'Not found': 'Nem található',
      'Unauthorized': 'Nincs jogosultság',
      'Forbidden': 'Tiltott művelet'
    }
    
    for (const [english, hungarian] of Object.entries(translations)) {
      if (error.includes(english)) {
        return error.replace(english, hungarian)
      }
    }
    
    return error
  }
}

export default responseUtils
