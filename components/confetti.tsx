"use client"

import { confetti } from '@tsparticles/confetti'
import { useState, useCallback } from 'react'

// Confetti configuration for new forgatas success
const FORGATAS_SUCCESS_CONFIG = {
  count: 200,
  defaults: {
    origin: { y: 0.7 },
  }
}

function fireForgatasConfetti(particleRatio: number, opts: object) {
  const { count, defaults } = FORGATAS_SUCCESS_CONFIG
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
    zIndex: 30,
  })
}

export const confettiAnimations = {
  // Success confetti when new forgatas is added
  success: () => {
    // Fire from both bottom corners toward center
    fireForgatasConfetti(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.1, y: 0.8 }
    })
    
    fireForgatasConfetti(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.9, y: 0.8 }
    })

    fireForgatasConfetti(0.2, {
      spread: 60,
      origin: { x: 0.1, y: 0.8 }
    })
    
    fireForgatasConfetti(0.2, {
      spread: 60,
      origin: { x: 0.9, y: 0.8 }
    })

    fireForgatasConfetti(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.1, y: 0.8 }
    })
    
    fireForgatasConfetti(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.9, y: 0.8 }
    })

    fireForgatasConfetti(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { x: 0.1, y: 0.8 }
    })
    
    fireForgatasConfetti(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { x: 0.9, y: 0.8 }
    })

    fireForgatasConfetti(0.1, {
      spread: 120,
      startVelocity: 45,
      origin: { x: 0.1, y: 0.8 }
    })
    
    fireForgatasConfetti(0.1, {
      spread: 120,
      startVelocity: 45,
      origin: { x: 0.9, y: 0.8 }
    })
  },

  // Valentine's day easter egg
  valentine: () => {
    const duration = 15 * 1000,
      animationEnd = Date.now() + duration,
      defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 30 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  },

  // Generic celebration
  celebrate: () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 30,
    })
  }
}

// Hook to manage confetti animations
export function useConfetti() {
  const [isActive, setIsActive] = useState(false)

  const triggerSuccess = useCallback(() => {
    console.log('🎉 Triggering success confetti...')
    setIsActive(true)
    
    // Simple test first
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 30,
    })
    
    // Then the complex animation
    confettiAnimations.success()
    
    // Reset state after animation
    setTimeout(() => setIsActive(false), 3000)
  }, [])

  const triggerValentine = useCallback(() => {
    console.log('❤️ Triggering valentine confetti...')
    setIsActive(true)
    
    // Trigger the new easter egg animation
    confettiAnimations.valentine()
    
    // Reset state after animation (15 seconds)
    setTimeout(() => setIsActive(false), 15000)
  }, [])

  const triggerCelebrate = useCallback(() => {
    console.log('🎊 Triggering celebrate confetti...')
    setIsActive(true)
    confettiAnimations.celebrate()
    // Reset state after animation
    setTimeout(() => setIsActive(false), 3000)
  }, [])

  return {
    isActive,
    triggerSuccess,
    triggerValentine,
    triggerCelebrate,
    // Legacy support
    trigger: triggerCelebrate,
  }
}
