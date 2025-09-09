'use client'

import Link from "next/link"
import { Clapperboard, Info } from "lucide-react"
import { FeaturesSection } from "@/app/features-section"
import { WhyBetterSection } from "@/components/why-better-section"
import { CountdownTimer } from "@/components/countdown-timer"
import { DevelopersSection } from "@/components/developers-section"
import { StatsSection } from "@/components/stats-section"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const launchDate = new Date("2025-08-11T12:00:00")
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect to app if user is actually authenticated (not just has a token)
    if (!isLoading && isAuthenticated) {
      router.push('/app/iranyitopult')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col transition-colors duration-500 min-h-dvh bg-background text-foreground">
      <header className="container flex items-center justify-between px-4 py-4 mx-auto sm:px-6 lg:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer">
          <Clapperboard className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span>FTV</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full border border-orange-200 dark:border-orange-700">
                BETA
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-normal leading-none">Hiányzás Áttekintő Platform</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Funkciók
            </a>
            <a href="#why-better" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Előnyök
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Rólunk
            </a>
            <Link href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Változások
            </Link>
          </nav>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2 cursor-pointer"
          >
            Bejelentkezés
          </Link>
        </div>
      </header>

      {/* Beta Disclaimer Banner */}
      <div className="w-full bg-orange-50/80 dark:bg-orange-950/80 border-b border-orange-200 dark:border-orange-800">
        <div className="container px-4 py-3 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 text-center">
            <div className="px-2 py-1 text-xs font-semibold bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100 rounded-full border border-orange-300 dark:border-orange-700">
              EARLY ACCESS BETA
            </div>
            <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
              Ez a platform jelenleg Early Access BETA verzióban érhető el. Előfordulhatnak hibák és hiányos funkciók.
            </p>
          </div>
        </div>
      </div>

      <main className="flex flex-col items-center justify-center px-4 text-center py-16 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-muted/30 -z-10" />
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            viszlát ztv.
            <br />
            <span className="text-primary">
              Helló FTV!
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
            Az új generációs platform a zökkenőmentes forgatásszervezéshez
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-lg font-medium transition-all bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Kezdés
              <Clapperboard className="w-5 h-5" />
            </Link>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 text-lg font-medium transition-all border-2 border-border rounded-xl hover:bg-accent hover:text-accent-foreground hover:scale-105 cursor-pointer"
            >
              Tudj meg többet
            </a>
          </div>
        </div>
      </main>

      <section id="features">
        <FeaturesSection />
      </section>
      
      <section id="why-better">
        <WhyBetterSection />
      </section>
      
      <section id="about">
        <DevelopersSection />
      </section>

      <div className="flex justify-center py-8">
        <div className="max-w-2xl p-6 mx-4 border border-dashed rounded-xl bg-card/50 border-border">
          <div className="flex items-start gap-3 mb-3">
            <Info className="w-5 h-5 mt-0.5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold leading-none tracking-tight text-lg mb-2">Zártkörű alkalmazás</h3>
              <p className="text-muted-foreground leading-relaxed">
                A regisztráció nem lehetséges. Ez az alkalmazás kizárólag a Kőbányai Szent László Gimnázium Média Tagozata
                számára készült.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
