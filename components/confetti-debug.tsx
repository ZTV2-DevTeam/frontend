"use client"

import { useEffect } from 'react'

export function ConfettiDebug() {
  useEffect(() => {
    const testConfetti = async () => {
      try {
        console.log('Testing confetti import...')
        
        // Test direct import
        const { confetti } = await import('@tsparticles/confetti')
        console.log('Confetti function:', confetti)
        
        // Test basic confetti call
        const result = confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        
        console.log('Confetti result:', result)
        
      } catch (error) {
        console.error('Confetti test error:', error)
      }
    }
    
    testConfetti()
  }, [])

  const handleTestClick = async () => {
    try {
      const { confetti } = await import('@tsparticles/confetti')
      
      console.log('Manual confetti test...')
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
    } catch (error) {
      console.error('Manual confetti error:', error)
    }
  }

  return (
    <div className="p-4">
      <h3>Confetti Debug</h3>
      <button onClick={handleTestClick} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Test Confetti
      </button>
      <p className="mt-2 text-sm text-gray-600">Check console for debug info</p>
    </div>
  )
}
