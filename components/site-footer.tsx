import Link from "next/link"
import { Code, MessageSquare } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"
import { CONTACT_CONFIG } from "@/lib/config"

export function SiteFooter() {
  return (
    <footer className="py-6 px-4 text-sm text-center text-muted-foreground">
      <div className="flex flex-col items-center max-w-4xl gap-6 mx-auto">
        <ThemeSelector />
        
        {/* Mobile-first layout - stacked vertically */}
        <div className="flex flex-col items-center gap-6 w-full md:flex-row md:justify-between">
          
          {/* Contact and Copyright Section */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="text-xs break-words">
              Kapcsolat:{" "}
              <a 
                href={`mailto:${CONTACT_CONFIG.PRIMARY_EMAIL}`} 
                className="underline transition-colors hover:text-primary cursor-pointer break-all"
              >
                {CONTACT_CONFIG.PRIMARY_EMAIL}
              </a>
            </p>
            <p className="text-xs text-center md:text-left">
              &copy; {new Date().getFullYear()} {CONTACT_CONFIG.ORG_NAME}.{" "}
              <span className="whitespace-nowrap">Minden jog fenntartva.</span>
            </p>
          </div>
          
          {/* Links Section */}
          <div className="flex flex-col items-center gap-3 md:items-end">
            {/* Primary Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
              <Link
                href="/changelog"
                className="text-xs underline transition-colors text-muted-foreground hover:text-primary whitespace-nowrap"
              >
                Változások
              </Link>
              <Link
                href="/privacy-policy"
                className="text-xs underline transition-colors text-muted-foreground hover:text-primary whitespace-nowrap"
              >
                Adatvédelmi szabályzat
              </Link>
              <Link
                href="/terms-of-service"
                className="text-xs underline transition-colors text-muted-foreground hover:text-primary whitespace-nowrap"
              >
                Felhasználási feltételek
              </Link>
            </div>
            
            {/* Secondary Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-end">
              <a
                href="https://forms.gle/ATyvgiutqNNaKT46A"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs underline transition-colors text-muted-foreground hover:text-primary whitespace-nowrap"
              >
                <MessageSquare className="w-3 h-3 shrink-0" />
                <span>Visszajelzés</span>
              </a>
              <Link
                href="/login"
                className="flex items-center gap-1 text-xs underline transition-colors text-muted-foreground/50 hover:text-primary whitespace-nowrap"
              >
                <Code className="w-3 h-3 shrink-0" />
                <span>Fejlesztői bejárat</span>
              </Link>
            </div>
            
            {/* Development Link - Hidden on mobile for cleaner look */}
            <div className="hidden sm:block">
              <Link
                href="https://vercel.com/pstasdevs-projects/ftv-frontend/deployments"
                className="text-xs underline transition-colors text-muted-foreground/50 hover:text-primary whitespace-nowrap"
              >
                Élesítés ellenőrzése
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
