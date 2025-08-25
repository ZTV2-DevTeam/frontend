/**
 * 24-hour format enforcement utilities for time inputs
 * This handles browsers that don't respect CSS locale settings
 */

import { useEffect } from 'react'

export function enforce24HourFormat() {
  if (typeof window === 'undefined') return

  // Function to force 24-hour format on time inputs
  const force24Hour = (input: HTMLInputElement) => {
    if (!input || (input.type !== 'time' && input.type !== 'datetime-local')) return

    // Set multiple attributes to enforce 24-hour format
    input.setAttribute('lang', 'en-GB')
    input.setAttribute('data-format', '24')
    input.setAttribute('data-hour-format', '24')
    input.style.setProperty('-webkit-locale', '"en-GB"', 'important')
    
    // Force immediate re-render with 24-hour format
    const currentValue = input.value
    input.value = ''
    setTimeout(() => {
      input.value = currentValue
      input.setAttribute('lang', 'en-GB')
      input.style.setProperty('-webkit-locale', '"en-GB"', 'important')
    }, 0)
    
    // Aggressive AM/PM hiding for stubborn browsers
    const hideAmPm = () => {
      try {
        // Try to access shadow DOM if available
        const shadowRoot = input.shadowRoot || (input as any).attachedShadow
        if (shadowRoot) {
          const ampmField = shadowRoot.querySelector('[part*="ampm"], [class*="ampm"], [data*="ampm"]')
          if (ampmField) {
            (ampmField as HTMLElement).style.cssText = 'display: none !important; width: 0 !important; opacity: 0 !important; visibility: hidden !important;'
          }
        }
        
        // Alternative approach: hide via CSS class
        input.classList.add('force-24hour')
        
        // Try direct style manipulation
        const computedStyle = window.getComputedStyle(input)
        if (computedStyle.getPropertyValue('-webkit-appearance') !== 'none') {
          input.style.webkitAppearance = 'none'
        }
      } catch (e) {
        // Silently handle any access errors
      }
    }
    
    // Apply immediately and on various events
    hideAmPm()
    input.addEventListener('focus', hideAmPm)
    input.addEventListener('click', hideAmPm)
    input.addEventListener('input', hideAmPm)
    
    // Periodic check for stubborn browsers
    const intervalId = setInterval(hideAmPm, 100)
    setTimeout(() => clearInterval(intervalId), 2000) // Stop after 2 seconds
    
    // Observer to watch for changes and ensure format compliance
    const observer = new MutationObserver(hideAmPm)
    
    if (input.shadowRoot) {
      observer.observe(input.shadowRoot, { childList: true, subtree: true, attributes: true })
    }
    observer.observe(input, { attributes: true })

    // Force focus event to trigger native picker with correct format
    input.addEventListener('focus', () => {
      // Additional enforcement on focus
      input.setAttribute('lang', 'en-GB')
      input.style.setProperty('-webkit-locale', '"en-GB"', 'important')
      hideAmPm()
    })

    // Store cleanup function
    ;(input as any)._cleanup24Hour = () => {
      observer.disconnect()
      clearInterval(intervalId)
    }
  }

  // Apply to existing time inputs
  const timeInputs = document.querySelectorAll('input[type="time"], input[type="datetime-local"]')
  timeInputs.forEach((input) => force24Hour(input as HTMLInputElement))

  // Watch for new time inputs being added to the DOM
  const domObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element
          
          // Check if the added node is a time input
          if (element.matches && element.matches('input[type="time"], input[type="datetime-local"]')) {
            force24Hour(element as HTMLInputElement)
          }
          
          // Check for time inputs within the added node
          const childTimeInputs = element.querySelectorAll?.('input[type="time"], input[type="datetime-local"]')
          childTimeInputs?.forEach((input) => force24Hour(input as HTMLInputElement))
        }
      })
    })
  })

  domObserver.observe(document.body, { childList: true, subtree: true })

  // Cleanup function
  return () => {
    domObserver.disconnect()
    timeInputs.forEach((input) => {
      if ((input as any)._cleanup24Hour) {
        (input as any)._cleanup24Hour()
      }
    })
  }
}

/**
 * React hook to enforce 24-hour format on mount
 */
export function use24HourFormat() {
  if (typeof window === 'undefined') return

  useEffect(() => {
    const cleanup = enforce24HourFormat()
    return cleanup
  }, [])
}

// Auto-initialize if not in a React environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforce24HourFormat)
  } else {
    enforce24HourFormat()
  }
}
