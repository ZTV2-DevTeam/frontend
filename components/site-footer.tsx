import Link from "next/link"
import { Code } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"

export function SiteFooter() {
  return (
    <footer className="py-8 text-sm text-center text-muted-foreground">
      <div className="flex flex-col items-center max-w-4xl gap-4 mx-auto">
        <ThemeSelector />
        <div className="flex flex-row justify-between w-full mt-4">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-xs">
              Kapcsolat:{" "}
              <a href="mailto:kapcsolat@ztv2.hu" className="underline transition-colors hover:text-primary">
                ztv2@botond.eu
              </a>
            </p>
            <p className="mt-2 text-xs">&copy; {new Date().getFullYear()} ZTV2. Minden jog fenntartva.</p>
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
