import Link from "next/link"
import { Clapperboard, Settings, Database, AlertCircle, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col transition-colors duration-500 min-h-dvh bg-background text-foreground">
      <header className="container flex items-center justify-between px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold">
          <Clapperboard className="w-8 h-8 text-primary" />
          <span>ZTV2</span>
        </Link>
      </header>

      <main className="flex-1">
        <div className="container max-w-4xl px-4 py-8 mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">Adatvédelmi szabályzat</h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Információ az analitikai szolgáltatásokról, amelyeket a ZTV2 platformon használunk.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* CloudFlare Analytics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  CloudFlare Analytics
                </CardTitle>
                <CardDescription>Weboldalforgalom és teljesítmény elemzése</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    A ZTV2 platform CloudFlare Analytics szolgáltatást használ a weboldalforgalom 
                    és teljesítmény elemzésére. Ez segít megérteni, hogyan használják a szolgáltatásainkat 
                    és javítani a felhasználói élményt.
                  </p>
                  <p className="text-sm">
                    A CloudFlare Analytics adatvédelmi fókuszú és nem használ cookie-kat, 
                    valamint nem követi a felhasználókat különböző weboldalakon keresztül. 
                    Összesített mérőszámokat gyűjt, mint például oldalmegtekintések, hivatkozók 
                    és böngésző információk anélkül, hogy egyedi felhasználókat azonosítana.
                  </p>
                  <div className="p-2 mt-3 text-xs text-green-800 rounded bg-green-50 dark:bg-green-950/20 dark:text-green-200">
                    <AlertCircle className="inline w-4 h-4 mr-1" />
                    Teljesen anonim, cookie-mentes követés
                  </div>
                  <div className="mt-3">
                    <a 
                      href="https://www.cloudflare.com/privacy/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      CloudFlare adatvédelmi szabályzat →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vercel Analytics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Vercel Analytics & Speed Insights
                </CardTitle>
                <CardDescription>Látogatói statisztikák és teljesítménymutatók</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    A platform Vercel Analytics és Speed Insights szolgáltatásokat is használ 
                    az anonim használati adatok gyűjtésére. Ez segít a teljesítmény monitorozásában 
                    és a szolgáltatások javításában.
                  </p>
                  <p className="text-sm">
                    A Vercel Analytics adatvédelemre tervezték és olyan információkat gyűjt, 
                    mint az oldalmegtekintések, látogatás időtartama és általános 
                    helyadatok anélkül, hogy személyesen azonosítaná a felhasználókat.
                  </p>
                  <div className="p-2 mt-3 text-xs text-blue-800 rounded bg-blue-50 dark:bg-blue-950/20 dark:text-blue-200">
                    <AlertCircle className="inline w-4 h-4 mr-1" />
                    Anonim adatgyűjtés, felhasználóbarát
                  </div>
                  <div className="mt-3">
                    <a 
                      href="https://vercel.com/legal/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Vercel adatvédelmi szabályzat →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GDPR Exemption Card */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  GDPR alkalmazhatóság
                </CardTitle>
                <CardDescription>Információ az adatvédelmi szabályozás alkalmazásáról</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    Ez az alkalmazás nem a GDPR (Általános Adatvédelmi Rendelet) hatálya alá tartozik, mivel közfeladatot ellátó intézmény belső működéséhez elengedhetetlen szoftver. Az alkalmazás kizárólag a szervezet belső folyamatait támogatja, nem kezel külső felhasználók személyes adatait.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Jogalap: A Gimnáziummal kapcsolatos jogviszony 
                  </p>
                  <div className="p-2 mt-3 text-xs rounded text-amber-800 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-200">
                    <AlertCircle className="inline w-4 h-4 mr-1" />
                    További kérdések esetén forduljon a fejlesztői kapcsolattartóhoz
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 mt-8 text-center rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              Ez az adatvédelmi szabályzat 2025. augusztus 1-jén lépett hatályba.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
