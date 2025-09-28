'use client'

import Link from "next/link"
import { Clapperboard, Home, Search, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container flex items-center justify-between px-4 py-4 mx-auto sm:px-6 lg:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer" aria-label="FTV főoldal">
          <Clapperboard className="w-8 h-8 text-primary" aria-hidden="true" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span>FTV</span>
            </div>
            <span className="text-xs text-muted-foreground font-normal leading-none">Hiányzás Áttekintő Platform</span>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">
              Bejelentkezés
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Large 404 Icon */}
          <div className="relative">
            <div className="mx-auto w-48 h-48 bg-muted/50 rounded-full flex items-center justify-center">
              <FileQuestion className="w-24 h-24 text-muted-foreground/50" aria-hidden="true" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl font-bold text-primary/20" aria-hidden="true">404</span>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Oldal nem található
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Sajnos a keresett oldal nem létezik vagy átköltözött. 
              Ellenőrizd az URL-t vagy térj vissza a főoldalra.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Főoldal
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.back()} className="w-full sm:w-auto">
              Vissza
            </Button>
          </div>

          {/* Help Card */}
          <Card className="mt-12 max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Segítségre van szükséged?
              </CardTitle>
              <CardDescription>
                Próbáld meg ezeket a hasznos linkeket:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Link 
                  href="/app/iranyitopult" 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <span>Irányítópult</span>
                  <span className="text-xs text-muted-foreground">Ha be vagy jelentkezve</span>
                </Link>
                <Link 
                  href="/login" 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <span>Bejelentkezés</span>
                  <span className="text-xs text-muted-foreground">Hozzáférés az alkalmazáshoz</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} FTV - Kőbányai Szent László Gimnázium</p>
          </div>
        </div>
      </footer>
    </div>
  )
}