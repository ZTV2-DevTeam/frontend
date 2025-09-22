'use client'

import { useEffect } from 'react'

/**
 * Keyboard navigation enhancements for better accessibility
 */
export function KeyboardNavigationEnhancer() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Escape key to close modals, dropdowns, etc.
      if (event.key === 'Escape') {
        // Close any open modals or overlays
        const openOverlays = document.querySelectorAll('[data-modal="true"], [data-dropdown="true"]')
        openOverlays.forEach(overlay => {
          const closeButton = overlay.querySelector('[data-close]') as HTMLElement
          if (closeButton) {
            closeButton.click()
          }
        })
      }

      // Handle Tab key for focus management
      if (event.key === 'Tab') {
        // Add visible focus indicator when navigating with keyboard
        document.body.classList.add('keyboard-navigation')
        
        // Remove mouse navigation class
        document.body.classList.remove('mouse-navigation')
      }

      // Handle Enter and Space for custom interactive elements
      if (event.key === 'Enter' || event.key === ' ') {
        const target = event.target as HTMLElement
        
        // Handle custom buttons that might not be proper button elements
        if (target.getAttribute('role') === 'button' && !target.matches('button, input[type="button"], input[type="submit"]')) {
          event.preventDefault()
          target.click()
        }
      }

      // Handle Arrow keys for custom navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        const target = event.target as HTMLElement
        
        // Handle menu navigation
        if (target.closest('[role="menu"], [role="listbox"], [role="tablist"]')) {
          handleArrowNavigation(event, target)
        }
      }
    }

    const handleMouseDown = () => {
      // Add mouse navigation class when using mouse
      document.body.classList.add('mouse-navigation')
      document.body.classList.remove('keyboard-navigation')
    }

    const handleArrowNavigation = (event: KeyboardEvent, target: HTMLElement) => {
      const container = target.closest('[role="menu"], [role="listbox"], [role="tablist"]')
      if (!container) return

      const focusableElements = container.querySelectorAll(
        '[role="menuitem"], [role="option"], [role="tab"], button, [tabindex="0"]'
      ) as NodeListOf<HTMLElement>

      const currentIndex = Array.from(focusableElements).indexOf(target)
      if (currentIndex === -1) return

      let nextIndex = currentIndex

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % focusableElements.length
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1
          break
      }

      if (nextIndex !== currentIndex) {
        event.preventDefault()
        focusableElements[nextIndex].focus()
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    // Initial setup
    document.body.classList.add('mouse-navigation')

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return null
}

/**
 * Focus trap for modals and dialogs
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    // Focus the first element when trap becomes active
    firstElement?.focus()

    container.addEventListener('keydown', handleTabKey)

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive, containerRef])
}

/**
 * Announce changes to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove the announcement after a short delay
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Enhanced skip links component
 */
export function SkipLinks() {
  const skipLinks = [
    { href: '#main-content', label: 'Ugrás a fő tartalomhoz' },
    { href: '#navigation', label: 'Ugrás a navigációhoz' },
    { href: '#footer', label: 'Ugrás a lábléchez' }
  ]

  return (
    <nav aria-label="Gyors navigációs linkek" className="sr-only">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}