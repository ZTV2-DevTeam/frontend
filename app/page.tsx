'use client'

import Link from "next/link"
import { Clapperboard, Info } from "lucide-react"
import { FeaturesSection } from "@/app/features-section"
import { SpeedComparisonSection } from "@/components/speed-comparison-section"
import { DevelopersSection } from "@/components/developers-section"
import { SiteFooter } from "@/components/site-footer"
import { SecurityBadges } from "@/components/security-badges"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
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
      <header role="banner" className="container flex items-center justify-between px-4 py-4 mx-auto sm:px-6 lg:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer" aria-label="FTV főoldal">
          <Clapperboard className="w-8 h-8 text-primary" aria-hidden="true" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span>FTV</span>
            </div>
            <span className="text-xs text-muted-foreground font-normal leading-none">Hiányzás Áttekintő Platform</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <nav role="navigation" aria-label="Főnavigáció" className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Funkciók
            </a>
            <a href="#why-better" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Teljesítmény
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
            aria-label="Bejelentkezés az alkalmazásba"
          >
            Bejelentkezés
          </Link>
        </div>
      </header>

      <main role="main" className="flex flex-col items-center justify-center px-4 text-center py-16 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-muted/30 -z-10" aria-hidden="true" />
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
              aria-label="Kezdés - bejelentkezés az alkalmazásba"
            >
              Kezdés
              <Clapperboard className="w-5 h-5" aria-hidden="true" />
            </Link>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 text-lg font-medium transition-all border-2 border-border rounded-xl hover:bg-accent hover:text-accent-foreground hover:scale-105 cursor-pointer"
              aria-label="Tudj meg többet a platform funkciókról"
            >
              Tudj meg többet
            </a>
          </div>
        </div>
      </main>

      <section id="features" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Platform funkciók</h2>
        <FeaturesSection />
      </section>
      
      <section id="why-better" aria-labelledby="performance-heading">
        <h2 id="performance-heading" className="sr-only">Teljesítmény összehasonlítás</h2>
        <SpeedComparisonSection />
      </section>
      
      <section id="about" aria-labelledby="about-heading">
        <h2 id="about-heading" className="sr-only">Fejlesztőkről</h2>
        <DevelopersSection />
      </section>

      <aside role="complementary" aria-labelledby="access-info-heading" className="flex justify-center py-12">
        <div className="max-w-3xl mx-4">
          <div className="bg-background/50 border border-primary/20 rounded-xl p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 shrink-0" aria-hidden="true">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 id="access-info-heading" className="text-xl font-semibold tracking-tight">Zártkörű alkalmazás</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A regisztráció nem lehetséges. Ez az alkalmazás kizárólag a 
                  <span className="font-medium text-foreground"> Kőbányai Szent László Gimnázium Média Tagozata </span>
                  számára készült.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <SecurityBadges />

      <SiteFooter />
    </div>
  )
}
