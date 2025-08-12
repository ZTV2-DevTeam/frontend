import Link from "next/link"
import { Code, MessageSquare } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"
import { CONTACT_CONFIG } from "@/lib/config"

export function SiteFooter() {
  return (
    <footer className="py-8 text-sm text-center text-muted-foreground">
      <div className="flex flex-col items-center max-w-4xl gap-4 mx-auto">
        <ThemeSelector />
        <div className="flex flex-row justify-between w-full mt-4">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-xs">
              Kapcsolat:{" "}
              <a href={`mailto:${CONTACT_CONFIG.PRIMARY_EMAIL}`} className="underline transition-colors hover:text-primary">
                {CONTACT_CONFIG.PRIMARY_EMAIL}
              </a>
            </p>
            <p className="mt-2 text-xs">&copy; {new Date().getFullYear()} {CONTACT_CONFIG.ORG_NAME}. Minden jog fenntartva.</p>
          </div>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <Link
              href="/privacy-policy"
              className="text-xs underline transition-colors text-muted-foreground hover:text-primary"
            >
              Adatvédelmi szabályzat
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs underline transition-colors text-muted-foreground hover:text-primary"
            >
              Felhasználási feltételek
            </Link>
            <a
              href="https://forms.gle/ATyvgiutqNNaKT46A"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs underline transition-colors text-muted-foreground hover:text-primary"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Visszajelzés</span>
            </a>
            <Link
              href="/login"
              className="flex items-center gap-1 text-xs underline transition-colors text-muted-foreground/50 hover:text-primary"
            >
              <Code className="w-3 h-3" />
              <span>Fejlesztői bejárat</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
