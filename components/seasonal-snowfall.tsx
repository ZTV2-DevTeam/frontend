'use client'

import { useEffect } from 'react'
import { useTheme } from '@/contexts/theme-context'
import { usePathname } from 'next/navigation'
import { isInAppExperience } from '@/lib/seasonal-themes'

export function SeasonalSnowfall() {
  const { themeColor } = useTheme()
  const pathname = usePathname()
  const isInApp = isInAppExperience(pathname || '')

  useEffect(() => {
    // Only show snowfall for Christmas theme and in-app
    if (themeColor !== 'christmas' || !isInApp) {
      return
    }

    // Create snowfall effect using CSS
    const style = document.createElement('style')
    style.id = 'seasonal-snowfall-style'
    style.innerHTML = `
      @keyframes snowfall {
        0% {
          transform: translateY(-10vh) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(110vh) translateX(100px);
          opacity: 0;
        }
      }

      .snowflake {
        position: fixed;
        top: -10vh;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1em;
        font-family: Arial, sans-serif;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        pointer-events: none;
        opacity: 0.6;
        z-index: 9999;
        user-select: none;
        animation: snowfall linear infinite;
      }
    `
    document.head.appendChild(style)

    // Create snowflakes
    const snowflakes: HTMLDivElement[] = []
    const numberOfSnowflakes = 50 // Moderate amount for subtle effect

    for (let i = 0; i < numberOfSnowflakes; i++) {
      const snowflake = document.createElement('div')
      snowflake.className = 'snowflake'
      snowflake.innerHTML = '❄'
      snowflake.style.left = `${Math.random() * 100}vw`
      snowflake.style.animationDuration = `${Math.random() * 10 + 15}s` // 15-25s
      snowflake.style.animationDelay = `${Math.random() * 10}s`
      snowflake.style.fontSize = `${Math.random() * 0.3 + 0.5}em` // 0.5-1em
      snowflake.style.opacity = `${Math.random() * 0.4 + 0.3}` // 0.3-0.7
      
      document.body.appendChild(snowflake)
      snowflakes.push(snowflake)
    }

    // Cleanup
    return () => {
      snowflakes.forEach(snowflake => snowflake.remove())
      style.remove()
    }
  }, [themeColor, isInApp])

  return null
}
