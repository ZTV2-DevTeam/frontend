"use client"

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'

export type ThemeColor = 'red' | 'amber' | 'yellow' | 'cyan' | 'green' | 'indigo' | 'purple' | 'pink' | 'blue' | 'slate' | 'halloween' | 'valentines' | 'christmas' | 'newyear'
export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  themeColor: ThemeColor
  themeMode: ThemeMode
  isDark: boolean
  isInitialized: boolean
}

type ThemeAction =
  | { type: 'SET_THEME_COLOR'; color: ThemeColor }
  | { type: 'SET_THEME_MODE'; mode: ThemeMode }
  | { type: 'SET_DARK_MODE'; isDark: boolean }
  | { type: 'INITIALIZE'; themeColor: ThemeColor; themeMode: ThemeMode; isDark: boolean }

interface ThemeContextType {
  themeColor: ThemeColor
  themeMode: ThemeMode
  setThemeColor: (color: ThemeColor) => void
  setThemeMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_THEME_COLOR':
      return { ...state, themeColor: action.color }
    case 'SET_THEME_MODE':
      return { ...state, themeMode: action.mode }
    case 'SET_DARK_MODE':
      return { ...state, isDark: action.isDark }
    case 'INITIALIZE':
      return { 
        themeColor: action.themeColor, 
        themeMode: action.themeMode,
        isDark: action.isDark, 
        isInitialized: true 
      }
    default:
      return state
  }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [state, dispatch] = useReducer(themeReducer, {
    themeColor: 'blue',
    themeMode: 'system',
    isDark: false,
    isInitialized: false
  })

  const setThemeColor = useCallback((color: ThemeColor) => {
    dispatch({ type: 'SET_THEME_COLOR', color })
  }, [])

  const setThemeMode = useCallback((mode: ThemeMode) => {
    dispatch({ type: 'SET_THEME_MODE', mode })
    
    // Apply the theme mode immediately
    if (typeof window !== 'undefined') {
      let isDarkMode: boolean
      if (mode === 'light') {
        document.documentElement.classList.remove('dark')
        isDarkMode = false
      } else if (mode === 'dark') {
        document.documentElement.classList.add('dark')
        isDarkMode = true
      } else {
        // System mode - check system preference
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (systemDark) {
          document.documentElement.classList.add('dark')
          isDarkMode = true
        } else {
          document.documentElement.classList.remove('dark')
          isDarkMode = false
        }
      }
      
      // Apply theme variables immediately to avoid mismatch
      applyThemeVariables(state.themeColor, isDarkMode, true)
    }
  }, [state.themeColor])

  // Initialize theme from localStorage
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme-color') as ThemeColor
        const validTheme = savedTheme && ['red', 'amber', 'yellow', 'cyan', 'green', 'indigo', 'purple', 'pink', 'blue', 'slate'].includes(savedTheme) 
          ? savedTheme 
          : 'blue'

        const savedMode = localStorage.getItem('theme-mode') as ThemeMode
        const validMode = savedMode && ['light', 'dark', 'system'].includes(savedMode)
          ? savedMode
          : 'system'

        // Calculate isDark based on stored theme preference, not current DOM state
        let isDarkMode: boolean
        if (validMode === 'light') {
          isDarkMode = false
        } else if (validMode === 'dark') {
          isDarkMode = true
        } else {
          // System mode - check system preference
          isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        
        // Apply the dark class to DOM immediately based on calculated theme
        if (isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }

        // Apply theme variables immediately to avoid mismatch with dark class
        applyThemeVariables(validTheme, isDarkMode, true)

        dispatch({ 
          type: 'INITIALIZE', 
          themeColor: validTheme,
          themeMode: validMode, 
          isDark: isDarkMode 
        })
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error)
        // Remove dark class for system default (light mode)
        document.documentElement.classList.remove('dark')
        // Apply default theme variables immediately
        applyThemeVariables('blue', false, true)
        dispatch({ 
          type: 'INITIALIZE', 
          themeColor: 'blue',
          themeMode: 'system', 
          isDark: false 
        })
      }
    }

    // Initialize immediately if document is ready, otherwise wait for next tick
    if (document.readyState === 'complete') {
      initializeTheme()
    } else {
      setTimeout(initializeTheme, 0)
    }
  }, [])

  // Apply theme variables when state changes
  useEffect(() => {
    if (!state.isInitialized) return

    try {
      localStorage.setItem('theme-color', state.themeColor)
      localStorage.setItem('theme-mode', state.themeMode)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
    
    applyThemeVariables(state.themeColor, state.isDark, true)
  }, [state.themeColor, state.themeMode, state.isDark, state.isInitialized])

  // Watch for dark mode changes with debouncing
  useEffect(() => {
    if (!state.isInitialized) return

    let timeoutId: NodeJS.Timeout

    const observer = new MutationObserver((mutations) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const isDarkMode = document.documentElement.classList.contains('dark')
            if (isDarkMode !== state.isDark) {
              dispatch({ type: 'SET_DARK_MODE', isDark: isDarkMode })
            }
          }
        })
      }, 10) // Small debounce to prevent rapid updates
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [state.isDark, state.isInitialized])

  // Watch for system theme preference changes
  useEffect(() => {
    if (!state.isInitialized || state.themeMode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (state.themeMode === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark')
          applyThemeVariables(state.themeColor, true, true)
        } else {
          document.documentElement.classList.remove('dark')
          applyThemeVariables(state.themeColor, false, true)
        }
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [state.themeMode, state.isInitialized, state.themeColor])

  return (
    <ThemeContext.Provider value={{ 
      themeColor: state.themeColor,
      themeMode: state.themeMode,
      setThemeColor,
      setThemeMode 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

function applyThemeVariables(color: ThemeColor, isDark: boolean, immediate: boolean = false) {
  // Prevent applying variables during SSR
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  if (!root) return
  
  const themeVariables = getThemeVariables(color, isDark)
  
  const applyVariables = () => {
    try {
      Object.entries(themeVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value, 'important')
      })
    } catch (error) {
      console.error('Error applying theme variables:', error)
    }
  }
  
  if (immediate) {
    // Apply immediately for initialization to prevent timing issues
    applyVariables()
  } else {
    // Use requestAnimationFrame for regular updates to avoid blocking the main thread
    requestAnimationFrame(applyVariables)
  }
}

function getThemeVariables(color: ThemeColor, isDark: boolean) {
  const themes = {
    red: {
      light: {
        '--primary': 'oklch(0.62 0.28 27)', // vivid red
        '--primary-foreground': 'oklch(0.98 0.003 250)',
        '--ring': 'oklch(0.62 0.28 27)',
        '--sidebar-primary': 'oklch(0.62 0.28 27)',
        '--sidebar-ring': 'oklch(0.62 0.28 27)',
        '--background': 'oklch(0.995 0.01 27)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 27)',
        '--popover': 'oklch(0.99 0.015 27)',
        '--secondary': 'oklch(0.96 0.02 27)',
        '--muted': 'oklch(0.96 0.02 27)',
        '--accent': 'oklch(0.96 0.02 27)',
        '--border': 'oklch(0.92 0.025 27)',
        '--input': 'oklch(0.92 0.025 27)',
        '--sidebar': 'oklch(0.98 0.012 27)',
        '--sidebar-accent': 'oklch(0.96 0.02 27)',
        '--sidebar-border': 'oklch(0.92 0.025 27)',
      },
      dark: {
        '--primary': 'oklch(0.52 0.22 27)', // deep red
        '--primary-foreground': 'oklch(0.98 0.003 250)',
        '--ring': 'oklch(0.52 0.22 27)',
        '--sidebar-primary': 'oklch(0.52 0.22 27)',
        '--sidebar-ring': 'oklch(0.52 0.22 27)',
        '--background': 'oklch(0.15 0.015 27)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 27)',
        '--popover': 'oklch(0.22 0.02 27)',
        '--secondary': 'oklch(0.28 0.025 27)',
        '--muted': 'oklch(0.28 0.025 27)',
        '--accent': 'oklch(0.28 0.025 27)',
        '--sidebar': 'oklch(0.22 0.02 27)',
        '--sidebar-accent': 'oklch(0.28 0.025 27)',
      }
    },
    amber: {
      light: {
        '--primary': 'oklch(0.689 0.184 61.116)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.689 0.184 61.116)',
        '--sidebar-primary': 'oklch(0.689 0.184 61.116)',
        '--sidebar-ring': 'oklch(0.689 0.184 61.116)',
        '--background': 'oklch(0.995 0.01 61.116)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 61.116)',
        '--popover': 'oklch(0.99 0.015 61.116)',
        '--secondary': 'oklch(0.96 0.02 61.116)',
        '--muted': 'oklch(0.96 0.02 61.116)',
        '--accent': 'oklch(0.96 0.02 61.116)',
        '--border': 'oklch(0.92 0.025 61.116)',
        '--input': 'oklch(0.92 0.025 61.116)',
        '--sidebar': 'oklch(0.98 0.012 61.116)',
        '--sidebar-accent': 'oklch(0.96 0.02 61.116)',
        '--sidebar-border': 'oklch(0.92 0.025 61.116)',
      },
      dark: {
        '--primary': 'oklch(0.689 0.184 61.116)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.646 0.222 61.116)',
        '--sidebar-primary': 'oklch(0.689 0.184 61.116)',
        '--sidebar-ring': 'oklch(0.646 0.222 61.116)',
        '--background': 'oklch(0.15 0.015 61.116)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 61.116)',
        '--popover': 'oklch(0.22 0.02 61.116)',
        '--secondary': 'oklch(0.28 0.025 61.116)',
        '--muted': 'oklch(0.28 0.025 61.116)',
        '--accent': 'oklch(0.28 0.025 61.116)',
        '--sidebar': 'oklch(0.22 0.02 61.116)',
        '--sidebar-accent': 'oklch(0.28 0.025 61.116)',
      }
    },
    yellow: {
      light: {
        '--primary': 'oklch(0.795 0.184 86.047)',
        '--primary-foreground': 'oklch(0.421 0.095 57.708)',
        '--ring': 'oklch(0.795 0.184 86.047)',
        '--sidebar-primary': 'oklch(0.795 0.184 86.047)',
        '--sidebar-ring': 'oklch(0.795 0.184 86.047)',
        '--background': 'oklch(0.995 0.01 86.047)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 86.047)',
        '--popover': 'oklch(0.99 0.015 86.047)',
        '--secondary': 'oklch(0.96 0.02 86.047)',
        '--muted': 'oklch(0.96 0.02 86.047)',
        '--accent': 'oklch(0.96 0.02 86.047)',
        '--border': 'oklch(0.92 0.025 86.047)',
        '--input': 'oklch(0.92 0.025 86.047)',
        '--sidebar': 'oklch(0.98 0.012 86.047)',
        '--sidebar-accent': 'oklch(0.96 0.02 86.047)',
        '--sidebar-border': 'oklch(0.92 0.025 86.047)',
      },
      dark: {
        '--primary': 'oklch(0.795 0.184 86.047)',
        '--primary-foreground': 'oklch(0.421 0.095 57.708)',
        '--ring': 'oklch(0.554 0.135 66.442)',
        '--sidebar-primary': 'oklch(0.795 0.184 86.047)',
        '--sidebar-ring': 'oklch(0.554 0.135 66.442)',
        '--background': 'oklch(0.15 0.015 86.047)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 86.047)',
        '--popover': 'oklch(0.22 0.02 86.047)',
        '--secondary': 'oklch(0.28 0.025 86.047)',
        '--muted': 'oklch(0.28 0.025 86.047)',
        '--accent': 'oklch(0.28 0.025 86.047)',
        '--sidebar': 'oklch(0.22 0.02 86.047)',
        '--sidebar-accent': 'oklch(0.28 0.025 86.047)',
      }
    },
    cyan: {
      light: {
        '--primary': 'oklch(0.696 0.17 195.293)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.696 0.17 195.293)',
        '--sidebar-primary': 'oklch(0.696 0.17 195.293)',
        '--sidebar-ring': 'oklch(0.696 0.17 195.293)',
        '--background': 'oklch(0.995 0.01 195.293)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 195.293)',
        '--popover': 'oklch(0.99 0.015 195.293)',
        '--secondary': 'oklch(0.96 0.02 195.293)',
        '--muted': 'oklch(0.96 0.02 195.293)',
        '--accent': 'oklch(0.96 0.02 195.293)',
        '--border': 'oklch(0.92 0.025 195.293)',
        '--input': 'oklch(0.92 0.025 195.293)',
        '--sidebar': 'oklch(0.98 0.012 195.293)',
        '--sidebar-accent': 'oklch(0.96 0.02 195.293)',
        '--sidebar-border': 'oklch(0.92 0.025 195.293)',
      },
      dark: {
        '--primary': 'oklch(0.696 0.17 195.293)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.6 0.118 184.704)',
        '--sidebar-primary': 'oklch(0.696 0.17 195.293)',
        '--sidebar-ring': 'oklch(0.6 0.118 184.704)',
        '--background': 'oklch(0.15 0.015 195.293)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 195.293)',
        '--popover': 'oklch(0.22 0.02 195.293)',
        '--secondary': 'oklch(0.28 0.025 195.293)',
        '--muted': 'oklch(0.28 0.025 195.293)',
        '--accent': 'oklch(0.28 0.025 195.293)',
        '--sidebar': 'oklch(0.22 0.02 195.293)',
        '--sidebar-accent': 'oklch(0.28 0.025 195.293)',
      }
    },
    green: {
      light: {
        '--primary': 'oklch(0.696 0.17 162.48)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.696 0.17 162.48)',
        '--sidebar-primary': 'oklch(0.696 0.17 162.48)',
        '--sidebar-ring': 'oklch(0.696 0.17 162.48)',
        '--background': 'oklch(0.995 0.01 162.48)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 162.48)',
        '--popover': 'oklch(0.99 0.015 162.48)',
        '--secondary': 'oklch(0.96 0.02 162.48)',
        '--muted': 'oklch(0.96 0.02 162.48)',
        '--accent': 'oklch(0.96 0.02 162.48)',
        '--border': 'oklch(0.92 0.025 162.48)',
        '--input': 'oklch(0.92 0.025 162.48)',
        '--sidebar': 'oklch(0.98 0.012 162.48)',
        '--sidebar-accent': 'oklch(0.96 0.02 162.48)',
        '--sidebar-border': 'oklch(0.92 0.025 162.48)',
      },
      dark: {
        '--primary': 'oklch(0.696 0.17 162.48)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.6 0.118 162.48)',
        '--sidebar-primary': 'oklch(0.696 0.17 162.48)',
        '--sidebar-ring': 'oklch(0.6 0.118 162.48)',
        '--background': 'oklch(0.15 0.015 162.48)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 162.48)',
        '--popover': 'oklch(0.22 0.02 162.48)',
        '--secondary': 'oklch(0.28 0.025 162.48)',
        '--muted': 'oklch(0.28 0.025 162.48)',
        '--accent': 'oklch(0.28 0.025 162.48)',
        '--sidebar': 'oklch(0.22 0.02 162.48)',
        '--sidebar-accent': 'oklch(0.28 0.025 162.48)',
      }
    },
    indigo: {
      light: {
        '--primary': 'oklch(0.488 0.243 264.376)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.488 0.243 264.376)',
        '--sidebar-primary': 'oklch(0.488 0.243 264.376)',
        '--sidebar-ring': 'oklch(0.488 0.243 264.376)',
        '--background': 'oklch(0.995 0.01 264.376)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 264.376)',
        '--popover': 'oklch(0.99 0.015 264.376)',
        '--secondary': 'oklch(0.96 0.02 264.376)',
        '--muted': 'oklch(0.96 0.02 264.376)',
        '--accent': 'oklch(0.96 0.02 264.376)',
        '--border': 'oklch(0.92 0.025 264.376)',
        '--input': 'oklch(0.92 0.025 264.376)',
        '--sidebar': 'oklch(0.98 0.012 264.376)',
        '--sidebar-accent': 'oklch(0.96 0.02 264.376)',
        '--sidebar-border': 'oklch(0.92 0.025 264.376)',
      },
      dark: {
        '--primary': 'oklch(0.488 0.243 264.376)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.551 0.027 264.364)',
        '--sidebar-primary': 'oklch(0.488 0.243 264.376)',
        '--sidebar-ring': 'oklch(0.551 0.027 264.364)',
        '--background': 'oklch(0.15 0.015 264.376)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 264.376)',
        '--popover': 'oklch(0.22 0.02 264.376)',
        '--secondary': 'oklch(0.28 0.025 264.376)',
        '--muted': 'oklch(0.28 0.025 264.376)',
        '--accent': 'oklch(0.28 0.025 264.376)',
        '--sidebar': 'oklch(0.22 0.02 264.376)',
        '--sidebar-accent': 'oklch(0.28 0.025 264.376)',
      }
    },
    purple: {
      light: {
        '--primary': 'oklch(0.627 0.265 303.9)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.627 0.265 303.9)',
        '--sidebar-primary': 'oklch(0.627 0.265 303.9)',
        '--sidebar-ring': 'oklch(0.627 0.265 303.9)',
        '--background': 'oklch(0.995 0.01 303.9)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 303.9)',
        '--popover': 'oklch(0.99 0.015 303.9)',
        '--secondary': 'oklch(0.96 0.02 303.9)',
        '--muted': 'oklch(0.96 0.02 303.9)',
        '--accent': 'oklch(0.96 0.02 303.9)',
        '--border': 'oklch(0.92 0.025 303.9)',
        '--input': 'oklch(0.92 0.025 303.9)',
        '--sidebar': 'oklch(0.98 0.012 303.9)',
        '--sidebar-accent': 'oklch(0.96 0.02 303.9)',
        '--sidebar-border': 'oklch(0.92 0.025 303.9)',
      },
      dark: {
        '--primary': 'oklch(0.627 0.265 303.9)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.627 0.265 303.9)',
        '--sidebar-primary': 'oklch(0.627 0.265 303.9)',
        '--sidebar-ring': 'oklch(0.627 0.265 303.9)',
        '--background': 'oklch(0.15 0.015 303.9)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 303.9)',
        '--popover': 'oklch(0.22 0.02 303.9)',
        '--secondary': 'oklch(0.28 0.025 303.9)',
        '--muted': 'oklch(0.28 0.025 303.9)',
        '--accent': 'oklch(0.28 0.025 303.9)',
        '--sidebar': 'oklch(0.22 0.02 303.9)',
        '--sidebar-accent': 'oklch(0.28 0.025 303.9)',
      }
    },
    pink: {
      light: {
        '--primary': 'oklch(0.645 0.265 330)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.645 0.265 330)',
        '--sidebar-primary': 'oklch(0.645 0.265 330)',
        '--sidebar-ring': 'oklch(0.645 0.265 330)',
        '--background': 'oklch(0.995 0.01 330)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 330)',
        '--popover': 'oklch(0.99 0.015 330)',
        '--secondary': 'oklch(0.96 0.02 330)',
        '--muted': 'oklch(0.96 0.02 330)',
        '--accent': 'oklch(0.96 0.02 330)',
        '--border': 'oklch(0.92 0.025 330)',
        '--input': 'oklch(0.92 0.025 330)',
        '--sidebar': 'oklch(0.98 0.012 330)',
        '--sidebar-accent': 'oklch(0.96 0.02 330)',
        '--sidebar-border': 'oklch(0.92 0.025 330)',
      },
      dark: {
        '--primary': 'oklch(0.645 0.265 330)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.645 0.265 330)',
        '--sidebar-primary': 'oklch(0.645 0.265 330)',
        '--sidebar-ring': 'oklch(0.645 0.265 330)',
        '--background': 'oklch(0.15 0.015 330)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 330)',
        '--popover': 'oklch(0.22 0.02 330)',
        '--secondary': 'oklch(0.28 0.025 330)',
        '--muted': 'oklch(0.28 0.025 330)',
        '--accent': 'oklch(0.28 0.025 330)',
        '--sidebar': 'oklch(0.22 0.02 330)',
        '--sidebar-accent': 'oklch(0.28 0.025 330)',
      }
    },
    blue: {
      light: {
        '--primary': 'oklch(0.6 0.243 244.376)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.6 0.243 244.376)',
        '--sidebar-primary': 'oklch(0.6 0.243 244.376)',
        '--sidebar-ring': 'oklch(0.6 0.243 244.376)',
        '--background': 'oklch(0.995 0.01 244.376)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 244.376)',
        '--popover': 'oklch(0.99 0.015 244.376)',
        '--secondary': 'oklch(0.96 0.02 244.376)',
        '--muted': 'oklch(0.96 0.02 244.376)',
        '--accent': 'oklch(0.96 0.02 244.376)',
        '--border': 'oklch(0.92 0.025 244.376)',
        '--input': 'oklch(0.92 0.025 244.376)',
        '--sidebar': 'oklch(0.98 0.012 244.376)',
        '--sidebar-accent': 'oklch(0.96 0.02 244.376)',
        '--sidebar-border': 'oklch(0.92 0.025 244.376)',
      },
      dark: {
        '--primary': 'oklch(0.6 0.243 244.376)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.551 0.227 244.364)',
        '--sidebar-primary': 'oklch(0.6 0.243 244.376)',
        '--sidebar-ring': 'oklch(0.551 0.227 244.364)',
        '--background': 'oklch(0.15 0.015 244.376)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 244.376)',
        '--popover': 'oklch(0.22 0.02 244.376)',
        '--secondary': 'oklch(0.28 0.025 244.376)',
        '--muted': 'oklch(0.28 0.025 244.376)',
        '--accent': 'oklch(0.28 0.025 244.376)',
        '--sidebar': 'oklch(0.22 0.02 244.376)',
        '--sidebar-accent': 'oklch(0.28 0.025 244.376)',
      },
    },
    slate: {
      light: {
        '--primary': 'oklch(0.46 0.08 215)',
        '--primary-foreground': 'oklch(0.98 0.003 250)',
        '--ring': 'oklch(0.46 0.08 215)',
        '--sidebar-primary': 'oklch(0.46 0.08 215)',
        '--sidebar-ring': 'oklch(0.46 0.08 215)',
        '--background': 'oklch(0.995 0.01 215)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.99 0.015 215)',
        '--popover': 'oklch(0.99 0.015 215)',
        '--secondary': 'oklch(0.96 0.02 215)',
        '--muted': 'oklch(0.96 0.02 215)',
        '--accent': 'oklch(0.96 0.02 215)',
        '--border': 'oklch(0.92 0.025 215)',
        '--input': 'oklch(0.92 0.025 215)',
        '--sidebar': 'oklch(0.98 0.012 215)',
        '--sidebar-accent': 'oklch(0.96 0.02 215)',
        '--sidebar-border': 'oklch(0.92 0.025 215)',
      },
      dark: {
        '--primary': 'oklch(0.46 0.08 215)',
        '--primary-foreground': 'oklch(0.98 0.003 250)',
        '--ring': 'oklch(0.55 0.03 215)',
        '--sidebar-primary': 'oklch(0.46 0.08 215)',
        '--sidebar-ring': 'oklch(0.55 0.03 215)',
        '--background': 'oklch(0.15 0.015 215)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.22 0.02 215)',
        '--popover': 'oklch(0.22 0.02 215)',
        '--secondary': 'oklch(0.28 0.025 215)',
        '--muted': 'oklch(0.28 0.025 215)',
        '--accent': 'oklch(0.28 0.025 215)',
        '--sidebar': 'oklch(0.22 0.02 215)',
        '--sidebar-accent': 'oklch(0.28 0.025 215)',
      }
    },
    halloween: {
      light: {
        '--primary': 'oklch(0.65 0.19 45)', // Orange
        '--primary-foreground': 'oklch(0.98 0.003 247.858)',
        '--ring': 'oklch(0.65 0.19 45)',
        '--sidebar-primary': 'oklch(0.65 0.19 45)',
        '--sidebar-ring': 'oklch(0.65 0.19 45)',
        '--background': 'oklch(0.995 0.01 45)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.98 0.01 45)',
        '--popover': 'oklch(0.98 0.01 45)',
        '--secondary': 'oklch(0.96 0.02 45)',
        '--muted': 'oklch(0.96 0.02 45)',
        '--accent': 'oklch(0.55 0.15 310)', // Purple accent
        '--border': 'oklch(0.92 0.05 45)',
        '--input': 'oklch(0.92 0.05 45)',
        '--sidebar': 'oklch(0.98 0.012 45)',
        '--sidebar-accent': 'oklch(0.92 0.05 45)',
        '--sidebar-border': 'oklch(0.92 0.05 45)',
      },
      dark: {
        '--primary': 'oklch(0.70 0.20 45)', // Bright orange
        '--primary-foreground': 'oklch(0.15 0.04 310)',
        '--ring': 'oklch(0.70 0.20 45)',
        '--sidebar-primary': 'oklch(0.70 0.20 45)',
        '--sidebar-ring': 'oklch(0.70 0.20 45)',
        '--background': 'oklch(0.15 0.04 310)',
        '--foreground': 'oklch(0.98 0.003 247.858)',
        '--card': 'oklch(0.22 0.05 310)',
        '--popover': 'oklch(0.22 0.05 310)',
        '--secondary': 'oklch(0.30 0.06 310)',
        '--muted': 'oklch(0.30 0.06 310)',
        '--accent': 'oklch(0.35 0.08 310)', // Purple accent
        '--border': 'oklch(0.30 0.06 310)',
        '--input': 'oklch(0.30 0.06 310)',
        '--sidebar': 'oklch(0.18 0.04 310)',
        '--sidebar-accent': 'oklch(0.30 0.06 310)',
        '--sidebar-border': 'oklch(0.30 0.06 310)',
      }
    },
    valentines: {
      light: {
        '--primary': 'oklch(0.55 0.23 5)', // Red-Pink
        '--primary-foreground': 'oklch(0.98 0.003 247.858)',
        '--ring': 'oklch(0.55 0.23 5)',
        '--sidebar-primary': 'oklch(0.55 0.23 5)',
        '--sidebar-ring': 'oklch(0.55 0.23 5)',
        '--background': 'oklch(0.995 0.01 350)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.98 0.01 350)',
        '--popover': 'oklch(0.98 0.01 350)',
        '--secondary': 'oklch(0.96 0.02 350)',
        '--muted': 'oklch(0.96 0.02 350)',
        '--accent': 'oklch(0.75 0.15 350)', // Light pink accent
        '--border': 'oklch(0.92 0.05 350)',
        '--input': 'oklch(0.92 0.05 350)',
        '--sidebar': 'oklch(0.98 0.012 350)',
        '--sidebar-accent': 'oklch(0.95 0.05 350)',
        '--sidebar-border': 'oklch(0.92 0.05 350)',
      },
      dark: {
        '--primary': 'oklch(0.65 0.25 5)', // Bright pink-red
        '--primary-foreground': 'oklch(0.98 0.003 247.858)',
        '--ring': 'oklch(0.65 0.25 5)',
        '--sidebar-primary': 'oklch(0.65 0.25 5)',
        '--sidebar-ring': 'oklch(0.65 0.25 5)',
        '--background': 'oklch(0.15 0.04 350)',
        '--foreground': 'oklch(0.98 0.003 247.858)',
        '--card': 'oklch(0.22 0.05 5)',
        '--popover': 'oklch(0.22 0.05 5)',
        '--secondary': 'oklch(0.30 0.06 350)',
        '--muted': 'oklch(0.30 0.06 350)',
        '--accent': 'oklch(0.35 0.08 350)', // Dark pink accent
        '--border': 'oklch(0.30 0.06 350)',
        '--input': 'oklch(0.30 0.06 350)',
        '--sidebar': 'oklch(0.18 0.04 5)',
        '--sidebar-accent': 'oklch(0.30 0.06 350)',
        '--sidebar-border': 'oklch(0.30 0.06 350)',
      }
    },
    christmas: {
      light: {
        '--primary': 'oklch(0.45 0.18 140)', // Christmas Green
        '--primary-foreground': 'oklch(0.98 0.003 247.858)',
        '--ring': 'oklch(0.45 0.18 140)',
        '--sidebar-primary': 'oklch(0.45 0.18 140)',
        '--sidebar-ring': 'oklch(0.45 0.18 140)',
        '--background': 'oklch(0.995 0.01 140)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.98 0.01 140)',
        '--popover': 'oklch(0.98 0.01 140)',
        '--secondary': 'oklch(0.96 0.02 140)',
        '--muted': 'oklch(0.96 0.02 140)',
        '--accent': 'oklch(0.55 0.20 25)', // Christmas Red accent
        '--border': 'oklch(0.90 0.05 140)',
        '--input': 'oklch(0.90 0.05 140)',
        '--sidebar': 'oklch(0.98 0.012 140)',
        '--sidebar-accent': 'oklch(0.92 0.05 140)',
        '--sidebar-border': 'oklch(0.90 0.05 140)',
      },
      dark: {
        '--primary': 'oklch(0.55 0.20 140)', // Bright green
        '--primary-foreground': 'oklch(0.98 0.003 247.858)',
        '--ring': 'oklch(0.55 0.20 140)',
        '--sidebar-primary': 'oklch(0.55 0.20 140)',
        '--sidebar-ring': 'oklch(0.55 0.20 140)',
        '--background': 'oklch(0.12 0.03 140)',
        '--foreground': 'oklch(0.98 0.003 247.858)',
        '--card': 'oklch(0.18 0.04 140)',
        '--popover': 'oklch(0.18 0.04 140)',
        '--secondary': 'oklch(0.25 0.05 140)',
        '--muted': 'oklch(0.25 0.05 140)',
        '--accent': 'oklch(0.60 0.22 25)', // Bright red accent
        '--border': 'oklch(0.25 0.05 140)',
        '--input': 'oklch(0.25 0.05 140)',
        '--sidebar': 'oklch(0.15 0.03 140)',
        '--sidebar-accent': 'oklch(0.25 0.05 140)',
        '--sidebar-border': 'oklch(0.25 0.05 140)',
      }
    },
    newyear: {
      light: {
        '--primary': 'oklch(0.75 0.15 85)', // Gold
        '--primary-foreground': 'oklch(0.15 0.04 264.695)',
        '--ring': 'oklch(0.75 0.15 85)',
        '--sidebar-primary': 'oklch(0.75 0.15 85)',
        '--sidebar-ring': 'oklch(0.75 0.15 85)',
        '--background': 'oklch(0.995 0.01 85)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(0.98 0.01 85)',
        '--popover': 'oklch(0.98 0.01 85)',
        '--secondary': 'oklch(0.96 0.02 85)',
        '--muted': 'oklch(0.96 0.02 85)',
        '--accent': 'oklch(0.55 0.18 265)', // Royal Blue accent
        '--border': 'oklch(0.92 0.05 85)',
        '--input': 'oklch(0.92 0.05 85)',
        '--sidebar': 'oklch(0.98 0.012 85)',
        '--sidebar-accent': 'oklch(0.95 0.05 85)',
        '--sidebar-border': 'oklch(0.92 0.05 85)',
      },
      dark: {
        '--primary': 'oklch(0.80 0.15 85)', // Bright gold
        '--primary-foreground': 'oklch(0.12 0.03 265)',
        '--ring': 'oklch(0.80 0.15 85)',
        '--sidebar-primary': 'oklch(0.80 0.15 85)',
        '--sidebar-ring': 'oklch(0.80 0.15 85)',
        '--background': 'oklch(0.12 0.03 265)',
        '--foreground': 'oklch(0.98 0.003 247.858)',
        '--card': 'oklch(0.18 0.04 265)',
        '--popover': 'oklch(0.18 0.04 265)',
        '--secondary': 'oklch(0.25 0.05 265)',
        '--muted': 'oklch(0.25 0.05 265)',
        '--accent': 'oklch(0.65 0.20 330)', // Pink accent
        '--border': 'oklch(0.25 0.05 265)',
        '--input': 'oklch(0.25 0.05 265)',
        '--sidebar': 'oklch(0.15 0.03 265)',
        '--sidebar-accent': 'oklch(0.25 0.05 265)',
        '--sidebar-border': 'oklch(0.25 0.05 265)',
      }
    }
  }

  return isDark ? themes[color].dark : themes[color].light
}

//#285862
//oklch(0.4313 0.0543 213.13)
//oklch(0.9635 0.0291 213.13)