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
      <header className="container flex items-center justify-between px-4 py-6 mx-auto sm:px-6 lg:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-80 transition-opacity">
          <Clapperboard className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <span>FTV</span>
            <span className="text-xs text-muted-foreground font-normal leading-none">Hiányzás Áttekintő Platform</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Funkciók
            </a>
            <a href="#why-better" className="text-muted-foreground hover:text-foreground transition-colors">
              Előnyök
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Rólunk
            </a>
          </nav>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2"
          >
            Bejelentkezés
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-4 text-center min-h-[60vh] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 -z-10" />
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-4">
          viszlát ztv.
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Helló FTV!
          </span>
        </h1>
        <p className="max-w-3xl mt-6 text-lg md:text-xl text-muted-foreground">
          Az új generációs platform a zökkenőmentes forgatásszervezéshez és videogyártás adminisztrációjához
        </p>
        <div className="flex items-center gap-4 mt-8">
          <Link 
            href="/login"
            className="px-6 py-3 text-base font-medium transition-colors bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            Kezdés
            <Clapperboard className="w-4 h-4" />
          </Link>
          <a 
            href="#features"
            className="px-6 py-3 text-base font-medium transition-colors border border-border rounded-lg hover:bg-accent hover:text-accent-foreground"
          >
            Tudj meg többet
          </a>
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

      <div className="flex justify-center">
        <div className="max-w-2xl p-4 mt-4 border border-dashed rounded-lg bg-card border-border">
          <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4" />
        <h3 className="font-medium leading-none tracking-tight">Zártkörű alkalmazás</h3>
          </div>
          <p className="text-sm text-muted-foreground">
        A regisztráció nem lehetséges. Ez az alkalmazás kizárólag a Kőbányai Szent László Gimnázium Média Tagozata
        számára készült.
          </p>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
