'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Zap, Clock, Database, Server, Gauge, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface MetricData {
  label: string
  oldValue: number
  newValue: number
  unit: string
  icon: React.ComponentType<any>
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
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${
          isOld 
            ? 'bg-destructive/80' 
            : 'bg-primary'
        }`}
        initial={{ width: 0 }}
        animate={{ width: animated ? `${percentage}%` : 0 }}
        transition={{ 
          duration: 1.2, 
          delay: delay,
          ease: "easeOut"
        }}
      />
    </div>
  )
}

const MetricCard = ({ metric, index, animated }: { metric: MetricData, index: number, animated: boolean }) => {
  const maxValues = {
    'mp': 35,
    's': 10,
    '%': 100,
    '/100': 100
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="transition-all duration-300 bg-background/50 border-white/10 hover:border-primary/50 hover:shadow-lg hover:scale-105 h-full">
        <CardHeader className="p-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="p-4 rounded-xl bg-primary/10 shrink-0">
              <metric.icon className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl font-semibold leading-tight">{metric.label}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">{metric.description}</CardDescription>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-primary">{metric.improvement}</div>
              <div className="text-sm text-muted-foreground">javulás</div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Régi rendszer */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-medium text-muted-foreground">Régi ZTV rendszer</span>
                <span className="text-xl font-bold text-destructive">
                  {metric.oldValue} {metric.unit}
                </span>
              </div>
              <ProgressBar
                value={metric.oldValue}
                maxValue={maxValues[metric.unit as keyof typeof maxValues]}
                isOld={true}
                animated={animated}
                delay={index * 0.15}
              />
            </div>

            {/* Új rendszer */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-medium text-muted-foreground">Új FTV rendszer</span>
                <span className="text-xl font-bold text-primary">
                  {metric.newValue} {metric.unit}
                </span>
              </div>
              <ProgressBar
                value={metric.newValue}
                maxValue={maxValues[metric.unit as keyof typeof maxValues]}
                isOld={false}
                animated={animated}
                delay={index * 0.15 + 0.2}
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

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), 300)
    return () => clearTimeout(timer)
  }, [])

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

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/20">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Teljesítmény</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
              Mért sebesség javulás a valós használatban
            </p>
          </div>
        </div>

        <div className="grid items-stretch max-w-4xl gap-6 mx-auto lg:grid-cols-1 lg:gap-8">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={metric.label} 
              metric={metric} 
              index={index} 
              animated={animationStarted}
            />
          ))}
        </div>

        {/* Technical Details Link */}
        <div className="flex flex-col items-center justify-center mt-20 space-y-4 text-center">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">Technikai részletek</h3>
            <p className="max-w-[700px] text-muted-foreground md:text-lg/relaxed">
              Részletes információk az FTV által használt rendszerekről és technológiákról
            </p>
          </div>
          <Link href="/technical-details" className="group inline-flex items-center gap-2 px-6 py-3 mt-4 text-sm font-medium transition-all bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:scale-105 cursor-pointer">
            <Zap className="w-4 h-4" />
            <span>Technikai részletek megtekintése</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}