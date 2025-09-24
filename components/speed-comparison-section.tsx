'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'
import { prefersReducedMotion, isSlowConnection, isLowMemoryDevice } from '@/lib/performance'

interface MetricData {
  label: string
  oldValue: number
  newValue: number
  unit: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description: string
  improvement: string
}

const ProgressBar = ({ 
  value, 
  maxValue, 
  isOld, 
  animated, 
  delay = 0 
}: { 
  value: number
  maxValue: number
  isOld: boolean
  animated: boolean
  delay?: number
}) => {
  const percentage = (value / maxValue) * 100

  return (
    <div className="w-full bg-muted rounded-full h-2 sm:h-3 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${
          isOld 
            ? 'bg-destructive/80' 
            : 'bg-primary'
        }`}
        initial={{ width: animated ? 0 : `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={animated ? { 
          duration: 0.8, // Shorter duration for mobile
          delay: delay,
          ease: "easeOut"
        } : { duration: 0 }}
      />
    </div>
  )
}

const MetricCard = ({ metric, index, animated }: { metric: MetricData, index: number, animated: boolean }) => {
  const isMobile = useIsMobile()
  const shouldReduceMotion = prefersReducedMotion()
  const isLowPerformanceDevice = isSlowConnection() || isLowMemoryDevice()
  
  const maxValues = {
    'mp': 35,
    's': 10,
    '%': 100,
    '/100': 100
  }

  // Disable complex animations on mobile or low-performance devices
  const enableAnimations = !shouldReduceMotion && !isLowPerformanceDevice
  const enableHoverEffects = !isMobile

  return (
    <motion.div
      initial={enableAnimations ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={enableAnimations ? { duration: 0.5, delay: index * 0.1 } : { duration: 0 }}
    >
      <Card className={`transition-all duration-300 bg-background/50 border-white/10 h-full ${
        enableHoverEffects ? 'hover:border-primary/50 hover:shadow-lg hover:scale-105' : 'active:scale-95'
      }`}>
        <CardHeader className="p-4 sm:p-6 md:p-8">
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 rounded-xl bg-primary/10 shrink-0">
              <metric.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <div className="space-y-1 sm:space-y-2 flex-1">
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">{metric.label}</CardTitle>
              <CardDescription className="text-sm sm:text-base md:text-lg text-muted-foreground">{metric.description}</CardDescription>
            </div>
            <div className="text-left sm:text-right shrink-0 w-full sm:w-auto">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{metric.improvement}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">javulás</div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Régi rendszer */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
                <span className="text-sm sm:text-base font-medium text-muted-foreground">Régi ZTV rendszer</span>
                <span className="text-lg sm:text-xl font-bold text-destructive">
                  {metric.oldValue} {metric.unit}
                </span>
              </div>
              <ProgressBar
                value={metric.oldValue}
                maxValue={maxValues[metric.unit as keyof typeof maxValues]}
                isOld={true}
                animated={animated && enableAnimations}
                delay={enableAnimations ? index * 0.15 : 0}
              />
            </div>

            {/* Új rendszer */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
                <span className="text-sm sm:text-base font-medium text-muted-foreground">Új FTV rendszer</span>
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {metric.newValue} {metric.unit}
                </span>
              </div>
              <ProgressBar
                value={metric.newValue}
                maxValue={maxValues[metric.unit as keyof typeof maxValues]}
                isOld={false}
                animated={animated && enableAnimations}
                delay={enableAnimations ? index * 0.15 + 0.2 : 0}
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  )
}

export function SpeedComparisonSection() {
  const [animationStarted, setAnimationStarted] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const isMobile = useIsMobile()
  const isLowPerformanceDevice = isSlowConnection() || isLowMemoryDevice()

  useEffect(() => {
    // Intersection observer for performance - only animate when in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    const sectionElement = document.getElementById('speed-comparison-section')
    if (sectionElement) {
      observer.observe(sectionElement)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return

    // Reduce delay on mobile devices for faster perceived performance
    const delay = isMobile || isLowPerformanceDevice ? 100 : 300
    const timer = setTimeout(() => setAnimationStarted(true), delay)
    return () => clearTimeout(timer)
  }, [isMobile, isLowPerformanceDevice, isInView])

  const metrics: MetricData[] = [
    {
      label: 'Alkalmazás betöltési idő',
      oldValue: 30.52,
      newValue: 7.18,
      unit: 'mp',
      icon: Zap,
      description: 'Bejelentkezéstől az alkalmazás eléréséig',
      improvement: '76% gyorsabb'
    }
  ]

  // Show loading state on mobile devices for better UX
  if (isMobile && !isInView) {
    return (
      <section id="speed-comparison-section" className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-muted/20">
        <div className="container px-4 mx-auto md:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-4"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="speed-comparison-section" className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-muted/20">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-12">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">Teljesítmény</h2>
            <p className="max-w-[600px] sm:max-w-[900px] text-sm sm:text-base text-muted-foreground md:text-lg lg:text-xl px-4">
              Mért sebesség javulás a valós használatban
            </p>
          </div>
        </div>

        <div className="grid items-stretch max-w-4xl gap-4 sm:gap-6 mx-auto lg:gap-8">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={metric.label} 
              metric={metric} 
              index={index} 
              animated={animationStarted}
            />
          ))}
        </div>

        {/* End of comparison section */}
      </div>
    </section>
  )
}