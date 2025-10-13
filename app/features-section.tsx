'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  LayoutDashboard,
  Plane,
  FileCheck,
  Box,
  ClipboardList,
  CalendarIcon as CalendarCog,
  CheckCircle,
  type LucideIcon,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
  improvement?: string
}

const generalFeatures: Feature[] = [
  {
    icon: LayoutDashboard,
    title: "Megújult felület",
    description: "A forgatások adatai egy vadiúj, modern és reszponzív felületen.",
  },
  {
    icon: Plane,
    title: "Távollét kezelés",
    description: "Jelezd előre, ha nem leszel elérhető egy ideig.",
  },
  {
    icon: FileCheck,
    title: "Automatikus igazolások",
    description: "Nem kell leadnod az igazolásaidat, a rendszer automatikusan kezeli őket.",
    badge: "Automatizált",
    improvement: "Nem szükséges külön leadni"
  },
]

const teacherFeatures: Feature[] = [
  {
    icon: Box,
    title: "Felszerelés- és partnerkezelés",
    description: "A rendszer kezeli a felszerelések kiírásait, valamint a partnerek elérhetőségeit és helyszíneit.",
    badge: "Professzonális"
  },
  {
    icon: ClipboardList,
    title: "Osztályfőnöki áttekintő",
    description: "Osztályfőnökként láthatja osztályának összes igazolt médiás hiányzását rendszerezve.",
    badge: "Adminisztráció"
  },
  {
    icon: CalendarCog,
    title: "Intelligens beosztáskezelő",
    description: "Fejlett felszerelés és stáb kezelés a forgatások beosztásánál.",
  },
]

const EnhancedFeatureCard = ({ 
  feature, 
  index, 
  animated 
}: { 
  feature: Feature
  index: number
  animated: boolean 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Card className="transition-all duration-300 bg-background/50 border-white/10 hover:border-primary/50 hover:shadow-lg hover:scale-105 h-full group">
      <CardHeader className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 shrink-0 group-hover:bg-primary/20 transition-colors">
            <feature.icon className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg font-semibold leading-tight">{feature.title}</CardTitle>
              {feature.badge && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {feature.badge}
                </Badge>
              )}
            </div>
            <CardDescription className="text-muted-foreground leading-relaxed">
              {feature.description}
            </CardDescription>
            {feature.improvement && (
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  {feature.improvement}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  </motion.div>
)

export function FeaturesSection() {
  const [animationStarted, setAnimationStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/20">
      <div className="container px-4 mx-auto md:px-6">
        {/* General Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Funkciók</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
              Modern funkciók és megoldások minden felhasználó számára
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Diákoknak és tanároknak egyaránt</span>
            </div>
          </div>
        </motion.div>

        <div className="grid items-stretch max-w-6xl gap-6 mx-auto lg:grid-cols-3 lg:gap-8 mb-20">
          {generalFeatures.map((feature, index) => (
            <EnhancedFeatureCard 
              key={feature.title} 
              feature={feature} 
              index={index}
              animated={animationStarted}
            />
          ))}
        </div>

        {/* Teacher Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tanároknak</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
              Professzionális eszközök az adminisztráció és szervezés megkönnyítésére
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Fejlett adminisztrációs funkciók</span>
            </div>
          </div>
        </motion.div>

        <div className="grid items-stretch max-w-6xl gap-6 mx-auto lg:grid-cols-3 lg:gap-8">
          {teacherFeatures.map((feature, index) => (
            <EnhancedFeatureCard 
              key={feature.title} 
              feature={feature} 
              index={index + 3}
              animated={animationStarted}
            />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Minden funkció elérhető azonnal bejelentkezés után
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
