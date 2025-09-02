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

function fireForgatasConfetti(particleRatio: number, opts: any) {
  const { count, defaults } = FORGATAS_SUCCESS_CONFIG
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  })
}

// Valentine's day easter egg configuration
const VALENTINE_CONFIG = {
  spread: 360,
  ticks: 100,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  shapes: ["heart"],
  colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
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
    confetti({
      ...VALENTINE_CONFIG,
      particleCount: 50,
      scalar: 2,
    })

    confetti({
      ...VALENTINE_CONFIG,
      particleCount: 25,
      scalar: 3,
    })

    confetti({
      ...VALENTINE_CONFIG,
      particleCount: 10,
      scalar: 4,
    })
  },

  // Generic celebration
  celebrate: () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
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
      origin: { y: 0.6 }
    })
    
    // Then the complex animation
    confettiAnimations.success()
    
    // Reset state after animation
    setTimeout(() => setIsActive(false), 3000)
  }, [])

  const triggerValentine = useCallback(() => {
    console.log('❤️ Triggering valentine confetti...')
    setIsActive(true)
    
    // Simple test first
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    })
    
    // Then the valentine animation
    confettiAnimations.valentine()
    
    // Reset state after animation
    setTimeout(() => setIsActive(false), 3000)
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
