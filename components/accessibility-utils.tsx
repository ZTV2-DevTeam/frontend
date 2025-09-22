'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilityContextType {
  highContrast: boolean
  reducedMotion: boolean
  largeText: boolean
  toggleHighContrast: () => void
  toggleLargeText: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [largeText, setLargeText] = useState(false)

  useEffect(() => {
    // Check for system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
    
    setReducedMotion(prefersReducedMotion.matches)
    setHighContrast(prefersHighContrast.matches)

    // Load saved preferences
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast') === 'true'
    const savedLargeText = localStorage.getItem('accessibility-large-text') === 'true'
    
    setHighContrast(prev => savedHighContrast || prev)
    setLargeText(savedLargeText)

    // Listen for changes
    const handleReducedMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    const handleHighContrastChange = (e: MediaQueryListEvent) => setHighContrast(prev => prev || e.matches)

    prefersReducedMotion.addEventListener('change', handleReducedMotionChange)
    prefersHighContrast.addEventListener('change', handleHighContrastChange)

    return () => {
      prefersReducedMotion.removeEventListener('change', handleReducedMotionChange)
      prefersHighContrast.removeEventListener('change', handleHighContrastChange)
    }
  }, [])

  useEffect(() => {
    // Apply classes to document
    const classes = []
    if (highContrast) classes.push('high-contrast')
    if (reducedMotion) classes.push('reduced-motion')
    if (largeText) classes.push('large-text')

    document.documentElement.className = document.documentElement.className
      .replace(/\b(high-contrast|reduced-motion|large-text)\b/g, '')
      .trim()

    if (classes.length > 0) {
      document.documentElement.classList.add(...classes)
    }
  }, [highContrast, reducedMotion, largeText])

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem('accessibility-high-contrast', String(newValue))
  }

  const toggleLargeText = () => {
    const newValue = !largeText
    setLargeText(newValue)
    localStorage.setItem('accessibility-large-text', String(newValue))
  }

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      reducedMotion,
      largeText,
      toggleHighContrast,
      toggleLargeText
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Accessibility control panel component
export function AccessibilityControls() {
  const { highContrast, largeText, toggleHighContrast, toggleLargeText } = useAccessibility()

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border border-border rounded-lg p-4 shadow-lg" role="region" aria-label="Akadálymentesítési beállítások">
      <h3 className="text-sm font-medium mb-3">Akadálymentesítés</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={highContrast}
            onChange={toggleHighContrast}
            className="sr-only"
          />
          <div className={`w-4 h-4 border-2 rounded ${highContrast ? 'bg-primary border-primary' : 'border-border'} flex items-center justify-center`}>
            {highContrast && <span className="text-primary-foreground text-xs">✓</span>}
          </div>
          <span className="text-sm">Nagy kontraszt</span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={largeText}
            onChange={toggleLargeText}
            className="sr-only"
          />
          <div className={`w-4 h-4 border-2 rounded ${largeText ? 'bg-primary border-primary' : 'border-border'} flex items-center justify-center`}>
            {largeText && <span className="text-primary-foreground text-xs">✓</span>}
          </div>
          <span className="text-sm">Nagy szöveg</span>
        </label>
      </div>
    </div>
  )
}