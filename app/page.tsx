'use client'

import Link from "next/link"
import { Clapperboard, Info } from "lucide-react"
import { FeaturesSection } from "@/app/features-section"
import { CountdownTimer } from "@/components/countdown-timer"
import { DevelopersSection } from "@/components/developers-section"
import { StatsSection } from "@/components/stats-section"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const launchDate = new Date("2025-09-01T12:00:00")
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
      <header className="container flex items-center justify-between px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold">
          <Clapperboard className="w-8 h-8 text-primary" />
          <span>FTV</span>
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Bejelentkezés
        </Link>
      </header>

      <main className="flex flex-col items-center justify-center px-4 text-center h-dvh x-1">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          viszlát ztv.
          <br />
          Helló FTV!
        </h1>
        <p className="max-w-2xl mt-6 text-lg md:text-xl text-muted-foreground">
          Az új generációs platform a zökkenőmentes forgatásszervezéshez
        </p>

        <CountdownTimer targetDate={launchDate} />
      </main>

      <FeaturesSection />
      
      <DevelopersSection />

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
