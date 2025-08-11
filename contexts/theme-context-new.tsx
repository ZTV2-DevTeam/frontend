"use client"

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'

export type ThemeColor = 'red' | 'orange' | 'yellow' | 'cyan' | 'green' | 'indigo' | 'purple' | 'pink' | 'amber' | 'blue'
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
  isDark: boolean
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
    themeColor: 'indigo',
    themeMode: 'system',
    isDark: false,
    isInitialized: false
  })

  const setThemeColor = useCallback((color: ThemeColor) => {
    dispatch({ type: 'SET_THEME_COLOR', color })
  }, [])

  const setThemeMode = useCallback((mode: ThemeMode) => {
    dispatch({ type: 'SET_THEME_MODE', mode })
  }, [])

  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme-color') as ThemeColor
      const validTheme = savedTheme && ['red', 'orange', 'yellow', 'cyan', 'green', 'indigo', 'purple', 'pink', 'amber', 'blue'].includes(savedTheme) 
        ? savedTheme 
        : 'indigo'

      const savedMode = localStorage.getItem('theme-mode') as ThemeMode
      const validMode = savedMode && ['light', 'dark', 'system'].includes(savedMode)
        ? savedMode
        : 'system'

      const isDarkMode = document.documentElement.classList.contains('dark')
      
      dispatch({ 
        type: 'INITIALIZE', 
        themeColor: validTheme, 
        themeMode: validMode,
        isDark: isDarkMode 
      })
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
      dispatch({ 
        type: 'INITIALIZE', 
        themeColor: 'indigo', 
        themeMode: 'system',
        isDark: false 
      })
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
    
    applyThemeVariables(state.themeColor, state.isDark)
  }, [state.themeColor, state.themeMode, state.isDark, state.isInitialized])

  // Apply theme mode changes
  useEffect(() => {
    if (!state.isInitialized) return

    const applyThemeMode = () => {
      const root = document.documentElement
      
      if (state.themeMode === 'system') {
        // Use system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (systemPrefersDark) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
        dispatch({ type: 'SET_DARK_MODE', isDark: systemPrefersDark })
      } else if (state.themeMode === 'dark') {
        root.classList.add('dark')
        dispatch({ type: 'SET_DARK_MODE', isDark: true })
      } else {
        root.classList.remove('dark')
        dispatch({ type: 'SET_DARK_MODE', isDark: false })
      }
    }

    applyThemeMode()

    // Listen for system theme changes when in system mode
    if (state.themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        dispatch({ type: 'SET_DARK_MODE', isDark: e.matches })
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [state.themeMode, state.isInitialized])

  // Watch for external dark mode changes with debouncing
  useEffect(() => {
    if (!state.isInitialized || state.themeMode !== 'system') return

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
  }, [state.isDark, state.themeMode, state.isInitialized])

  return (
    <ThemeContext.Provider value={{ 
      themeColor: state.themeColor, 
      themeMode: state.themeMode,
      isDark: state.isDark,
      setThemeColor,
      setThemeMode
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

function applyThemeVariables(color: ThemeColor, isDark: boolean) {
  // Prevent applying variables during SSR
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  if (!root) return
  
  const themeVariables = getThemeVariables(color, isDark)
  
  // Use requestAnimationFrame to avoid blocking the main thread
  requestAnimationFrame(() => {
    try {
      Object.entries(themeVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })
    } catch (error) {
      console.error('Error applying theme variables:', error)
    }
  })
}

function getThemeVariables(color: ThemeColor, isDark: boolean) {
  const themes = {
    red: {
      light: {
        '--primary': 'oklch(0.637 0.245 27.325)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.637 0.245 27.325)',
        '--sidebar-primary': 'oklch(0.637 0.245 27.325)',
        '--sidebar-ring': 'oklch(0.637 0.245 27.325)',
        // Mixed background colors with subtle red tint
        '--background': 'oklch(0.995 0.01 27.325)',
        '--card': 'oklch(0.99 0.015 27.325)',
        '--popover': 'oklch(0.99 0.015 27.325)',
        '--secondary': 'oklch(0.96 0.02 27.325)',
        '--muted': 'oklch(0.96 0.02 27.325)',
        '--accent': 'oklch(0.96 0.02 27.325)',
        '--border': 'oklch(0.92 0.025 27.325)',
        '--input': 'oklch(0.92 0.025 27.325)',
        '--sidebar': 'oklch(0.98 0.012 27.325)',
        '--sidebar-accent': 'oklch(0.96 0.02 27.325)',
        '--sidebar-border': 'oklch(0.92 0.025 27.325)',
      },
      dark: {
        '--primary': 'oklch(0.704 0.191 22.216)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.577 0.245 27.325)',
        '--sidebar-primary': 'oklch(0.704 0.191 22.216)',
        '--sidebar-ring': 'oklch(0.577 0.245 27.325)',
        // Mixed dark background colors with subtle red tint
        '--background': 'oklch(0.15 0.015 27.325)',
        '--card': 'oklch(0.22 0.02 27.325)',
        '--popover': 'oklch(0.22 0.02 27.325)',
        '--secondary': 'oklch(0.28 0.025 27.325)',
        '--muted': 'oklch(0.28 0.025 27.325)',
        '--accent': 'oklch(0.28 0.025 27.325)',
        '--sidebar': 'oklch(0.22 0.02 27.325)',
        '--sidebar-accent': 'oklch(0.28 0.025 27.325)',
      }
    },
    orange: {
      light: {
        '--primary': 'oklch(0.689 0.184 41.116)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.689 0.184 41.116)',
        '--sidebar-primary': 'oklch(0.689 0.184 41.116)',
        '--sidebar-ring': 'oklch(0.689 0.184 41.116)',
        '--background': 'oklch(0.995 0.01 41.116)',
        '--card': 'oklch(0.99 0.015 41.116)',
        '--popover': 'oklch(0.99 0.015 41.116)',
        '--secondary': 'oklch(0.96 0.02 41.116)',
        '--muted': 'oklch(0.96 0.02 41.116)',
        '--accent': 'oklch(0.96 0.02 41.116)',
        '--border': 'oklch(0.92 0.025 41.116)',
        '--input': 'oklch(0.92 0.025 41.116)',
        '--sidebar': 'oklch(0.98 0.012 41.116)',
        '--sidebar-accent': 'oklch(0.96 0.02 41.116)',
        '--sidebar-border': 'oklch(0.92 0.025 41.116)',
      },
      dark: {
        '--primary': 'oklch(0.689 0.184 41.116)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.646 0.222 41.116)',
        '--sidebar-primary': 'oklch(0.689 0.184 41.116)',
        '--sidebar-ring': 'oklch(0.646 0.222 41.116)',
        '--background': 'oklch(0.15 0.015 41.116)',
        '--card': 'oklch(0.22 0.02 41.116)',
        '--popover': 'oklch(0.22 0.02 41.116)',
        '--secondary': 'oklch(0.28 0.025 41.116)',
        '--muted': 'oklch(0.28 0.025 41.116)',
        '--accent': 'oklch(0.28 0.025 41.116)',
        '--sidebar': 'oklch(0.22 0.02 41.116)',
        '--sidebar-accent': 'oklch(0.28 0.025 41.116)',
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
        '--primary': 'oklch(0.645 0.246 16.439)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.645 0.246 16.439)',
        '--sidebar-primary': 'oklch(0.645 0.246 16.439)',
        '--sidebar-ring': 'oklch(0.645 0.246 16.439)',
        '--background': 'oklch(0.995 0.01 16.439)',
        '--card': 'oklch(0.99 0.015 16.439)',
        '--popover': 'oklch(0.99 0.015 16.439)',
        '--secondary': 'oklch(0.96 0.02 16.439)',
        '--muted': 'oklch(0.96 0.02 16.439)',
        '--accent': 'oklch(0.96 0.02 16.439)',
        '--border': 'oklch(0.92 0.025 16.439)',
        '--input': 'oklch(0.92 0.025 16.439)',
        '--sidebar': 'oklch(0.98 0.012 16.439)',
        '--sidebar-accent': 'oklch(0.96 0.02 16.439)',
        '--sidebar-border': 'oklch(0.92 0.025 16.439)',
      },
      dark: {
        '--primary': 'oklch(0.645 0.246 16.439)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--ring': 'oklch(0.645 0.246 16.439)',
        '--sidebar-primary': 'oklch(0.645 0.246 16.439)',
        '--sidebar-ring': 'oklch(0.645 0.246 16.439)',
        '--background': 'oklch(0.15 0.015 16.439)',
        '--card': 'oklch(0.22 0.02 16.439)',
        '--popover': 'oklch(0.22 0.02 16.439)',
        '--secondary': 'oklch(0.28 0.025 16.439)',
        '--muted': 'oklch(0.28 0.025 16.439)',
        '--accent': 'oklch(0.28 0.025 16.439)',
        '--sidebar': 'oklch(0.22 0.02 16.439)',
        '--sidebar-accent': 'oklch(0.28 0.025 16.439)',
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
        '--card': 'oklch(0.22 0.02 61.116)',
        '--popover': 'oklch(0.22 0.02 61.116)',
        '--secondary': 'oklch(0.28 0.025 61.116)',
        '--muted': 'oklch(0.28 0.025 61.116)',
        '--accent': 'oklch(0.28 0.025 61.116)',
        '--sidebar': 'oklch(0.22 0.02 61.116)',
        '--sidebar-accent': 'oklch(0.28 0.025 61.116)',
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
        '--card': 'oklch(0.22 0.02 244.376)',
        '--popover': 'oklch(0.22 0.02 244.376)',
        '--secondary': 'oklch(0.28 0.025 244.376)',
        '--muted': 'oklch(0.28 0.025 244.376)',
        '--accent': 'oklch(0.28 0.025 244.376)',
        '--sidebar': 'oklch(0.22 0.02 244.376)',
        '--sidebar-accent': 'oklch(0.28 0.025 244.376)',
      }
    }
  }

  return isDark ? themes[color].dark : themes[color].light
}
