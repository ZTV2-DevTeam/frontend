import Link from "next/link"
import { Shield, Lock, Eye, CheckCircle } from "lucide-react"

export function SecurityBadges() {
  return (
    <section 
      role="contentinfo" 
      aria-label="Biztonsági tanúsítványok és megfelelőség"
      className="py-8 px-4 bg-muted/30 border-t"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-lg font-semibold text-center mb-6 text-muted-foreground">
          Biztonsági tanúsítványok és megfelelőség
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* WCAG 2.2 AAA Badge */}
          <a 
            href="https://www.w3.org/TR/WCAG22/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 bg-background rounded-lg border border-border shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer group"
            aria-label="WCAG 2.2 AAA akadálymentességi irányelvek"
          >
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">WCAG 2.2 AAA</h3>
              <p className="text-xs text-muted-foreground mb-2">Akadálymentesség</p>
              <p className="text-xs text-muted-foreground">W3C/WAI</p>
            </div>
          </a>

          {/* SSL Secured Badge */}
          <div className="flex flex-col items-center p-4 bg-background rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
              <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-1">SSL Secured</h3>
              <p className="text-xs text-muted-foreground mb-2">Adatbiztonság, titkosítás</p>
              <a 
                href="https://crt.sh/?q=ftv.szlg.info" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
                aria-label="SSL tanúsítvány ellenőrzése"
              >
                ZeroSSL
              </a>
            </div>
          </div>

          {/* Privacy Compliance Badge */}
          <Link
            href="/privacy-policy"
            className="flex flex-col items-center p-4 bg-background rounded-lg border border-border shadow-sm hover:shadow-md transition-all hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer group"
            aria-label="Adatvédelmi szabályzat megtekintése"
          >
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Privacy</h3>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Jogviszony-compliant intézményi belső használatra készült zárt rendszer
              </p>
            </div>
          </Link>

          {/* Security Monitoring Badge */}
          <div className="flex flex-col items-center p-4 bg-background rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3">
              <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-1">Security</h3>
              <p className="text-xs text-muted-foreground mb-2">Biztonsági monitoring</p>
              <div className="flex flex-col gap-1">
                <a 
                  href="https://github.com/dependabot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline transition-colors"
                  aria-label="Dependabot biztonsági monitoring"
                >
                  Dependabot
                </a>
                <a 
                  href="https://snyk.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline transition-colors"
                  aria-label="Snyk biztonsági monitoring"
                >
                  Snyk
                </a>
              </div>
            </div>
          </div>

        </div>
        
        {/* Additional info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Minden biztonsági intézkedés és megfelelőségi követelmény teljesítése folyamatosan monitorozott.
          </p>
        </div>
      </div>
    </section>
  )
}