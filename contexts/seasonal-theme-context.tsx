'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  getCurrentSeasonalTheme,
  getCurrentSeasonalName,
  isInAppExperience,
  type SeasonalTheme,
} from '@/lib/seasonal-themes'

interface SeasonalThemeContextType {
  activeTheme: SeasonalTheme
  seasonalName: string | null
  isActive: boolean
  isSeasonalAvailable: boolean
  isSeasonalEnabled: boolean
  setSeasonalEnabled: (enabled: boolean) => void
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType | undefined>(undefined)

export function SeasonalThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [naturalTheme, setNaturalTheme] = useState<SeasonalTheme>('none')
  const [seasonalName, setSeasonalName] = useState<string | null>(null)

  // Update natural theme on mount and periodically
  useEffect(() => {
    const updateTheme = () => {
      setNaturalTheme(getCurrentSeasonalTheme())
      setSeasonalName(getCurrentSeasonalName())
    }

    updateTheme()
    // Check for theme changes every hour
    const interval = setInterval(updateTheme, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Determine if we're in app and if seasonal theme is available
  const isInApp = isInAppExperience(pathname || '')
  const isSeasonalAvailable = naturalTheme !== 'none'
  
  // User preference is now managed by checking if the current theme matches a seasonal theme
  // This will be set when user selects a seasonal theme in the theme selector
  
  return (
    <SeasonalThemeContext.Provider
      value={{
        activeTheme: naturalTheme,
        seasonalName,
        isActive: isInApp && isSeasonalAvailable,
        isSeasonalAvailable,
        isSeasonalEnabled: false, // This is now controlled by theme selection
        setSeasonalEnabled: () => {}, // Deprecated - use theme selector instead
      }}
    >
      {children}
    </SeasonalThemeContext.Provider>
  )
}

export function useSeasonalTheme() {
  const context = useContext(SeasonalThemeContext)
  if (context === undefined) {
    throw new Error('useSeasonalTheme must be used within a SeasonalThemeProvider')
  }
  return context
}
