"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  delay: number
}

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
}

const colors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
  '#ee5a24', '#0abde3', '#10ac84', '#f368e0', '#a55eea'
]

export function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = []
      for (let i = 0; i < 500; i++) {
        pieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          delay: Math.random() * 3
        })
      }
      setConfettiPieces(pieces)

      // Auto-complete after animation duration
      const timer = setTimeout(() => {
        onComplete?.()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute"
            style={{
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            }}
            initial={{
              x: piece.x,
              y: piece.y,
              rotate: piece.rotation,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: piece.rotation + 720,
              opacity: 0,
            }}
            transition={{
              duration: 3,
              delay: piece.delay,
              ease: "easeIn",
            }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook to manage confetti state
export function useConfetti() {
  const [isActive, setIsActive] = useState(false)

  const trigger = () => {
    setIsActive(true)
  }

  const stop = () => {
    setIsActive(false)
  }

  return {
    isActive,
    trigger,
    stop,
    ConfettiComponent: ({ onComplete }: { onComplete?: () => void }) => (
      <Confetti isActive={isActive} onComplete={onComplete || stop} />
    ),
  }
}
