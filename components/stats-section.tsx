"use client"

import React, { useEffect, useRef, useState } from "react"
import { SlidingNumber } from "@/components/animate-ui/text/sliding-number"
import { Users, Clock, Award } from "lucide-react"

interface StatItem {
    id: string
    label: string
    value: number
    prefix?: string
    suffix?: string
    measurement?: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    color: string
}

const stats: StatItem[] = [
    {
        id: "users",
        label: "Aktív felhasználók",
        value: 125,
        icon: Users,
        color: "text-blue-600 dark:text-blue-400"
    },
    {
        id: "hours",
        label: "Projekttel töltött aktív órák",
        value: 4,
        measurement: "óra",
        icon: Clock,
        color: "text-green-600 dark:text-green-400"
    },
    {
        id: "passive-hours",
        label: "Projekt tervezésre fordított órák",
        value: 100,
        suffix: "+",
        measurement: "óra",
        icon: Clock,
        color: "text-purple-600 dark:text-purple-400"
    },
]

export function StatsSection() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = sectionRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the component is visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before fully in view
      }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])
  
  return (
    <section ref={sectionRef} className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Statisztikáink</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Büszkék vagyunk arra, amit eddig elértünk. Itt vannak a legfrissebb számok.
            </p>
          </div>
        </div>
        
        {/* Stats in a grid */}
        <div className="grid max-w-2xl grid-cols-1 gap-8 mx-auto mt-12">
          {stats.map((stat) => (
            <div key={stat.id} className="space-y-3 text-left">
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} leading-none flex items-baseline`}>
            {stat.prefix}
            <SlidingNumber
              number={isInView ? stat.value : 0}
              className="tabular-nums"
            />
            {stat.suffix && <span className="ml-0.5">{stat.suffix}</span>}
            {stat.measurement && <span className="ml-2 text-2xl md:text-3xl">{stat.measurement}</span>}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
            {stat.label}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Utolsó frissítés: {new Date().toLocaleDateString('hu-HU')}
          </p>
        </div>
      </div>
    </section>
  )
}