import Link from "next/link"
import { Clapperboard, Info, Code } from "lucide-react"
import { FeaturesSection } from "@/app/features-section"
import { ThemeSelector } from "@/components/theme-selector"
import { CountdownTimer } from "@/components/countdown-timer"
import { DevelopersSection } from "@/components/developers-section"

export default function LandingPage() {
  const launchDate = new Date("2025-09-08T12:00:00")

  return (
    <div className="flex flex-col transition-colors duration-500 min-h-dvh bg-background text-foreground">
      <header className="container flex items-center justify-between px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold">
          <Clapperboard className="w-8 h-8 text-primary" />
          <span>ZTV2</span>
        </Link>
        {/* Login button is hidden as requested */}
      </header>

      <main className="flex flex-col items-center justify-center flex-1 px-4 text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          viszlát ztv.
          <br />
          Helló ZTV2!
        </h1>
        <p className="max-w-2xl mt-6 text-lg md:text-xl text-muted-foreground">
          Az új generációs platform a zökkenőmentes tartalomkezeléshez és forgatásszervezéshez.
        </p>

        <CountdownTimer targetDate={launchDate} />

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
      </main>

      <FeaturesSection />
      
      <DevelopersSection />

      <footer className="py-8 text-sm text-center text-muted-foreground">
        <ThemeSelector />
        <p className="mt-4">
          Kapcsolat:{" "}
          <a href="mailto:kapcsolat@ztv2.hu" className="transition-colors hover:text-primary">
            ztv2@botond.eu
          </a>
        </p>
        <p className="mt-2">&copy; {new Date().getFullYear()} ZTV2. Minden jog fenntartva.</p>
        <div className="mt-4">
          <Link
            href="/login"
            className="flex items-center justify-center gap-1 text-xs transition-colors text-muted-foreground/50 hover:text-primary"
          >
            <Code className="w-3 h-3" />
            <span>Fejlesztői bejárat</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
