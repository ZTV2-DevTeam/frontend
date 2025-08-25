import Link from "next/link"
import { Clapperboard, FileText, Users, Shield, AlertTriangle, Settings, Scale } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteFooter } from "@/components/site-footer"

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col transition-colors duration-500 min-h-dvh bg-background text-foreground">
      <header className="container flex items-center justify-between px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold cursor-pointer">
          <Clapperboard className="w-8 h-8 text-primary" />
          <span>FTV</span>
        </Link>
      </header>

      <main className="flex-1">
        <div className="container max-w-6xl px-4 py-8 mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">Felhasználási feltételek</h1>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              A FTV platform használatának feltételei és szabályai - 
              Kőbányai Szent László Gimnázium Emelt Digitális Kultúra Tagozata - Aktuális FTV Fejlesztői Csapata.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Service Provider Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Szolgáltató
                </CardTitle>
                <CardDescription>Alapvető információk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    <strong>Szolgáltató:</strong> Kőbányai Szent László Gimnázium Emelt Digitális Kultúra Tagozata - Aktuális FTV Fejlesztői Csapata
                  </p>
                  <p className="text-sm">
                    <strong>Kapcsolat:</strong> balla.botond.23f@szlgbp.hu
                  </p>
                  <p className="text-sm">
                    Jelen felhasználási feltételek szabályozzák a FTV platform használatát. 
                    A platform használatával Ön elfogadja ezeket a feltételeket.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Authorized Users Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Jogosult felhasználók
                </CardTitle>
                <CardDescription>Ki használhatja a platformot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    A FTV platform kizárólag a Kőbányai Szent László Gimnázium Média Tagozatának 
                    tagjai számára elérhető.
                  </p>
                  <p className="text-sm">
                    A regisztráció nem nyilvános és csak a tagozat tanulói számára biztosított.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Obligations Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Felhasználói kötelességek
                </CardTitle>
                <CardDescription>Elvárások és szabályok</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    <li>• A felhasználók kötelesek a platformot a rendeltetése szerint használni</li>
                    <li>• Tilos jogellenes, mások jogait sértő vagy obszcén tartalmat közzétenni, minden tartalmat abban a tudatban kell közzétenni, hogy azokat szaktanárok, osztályfőnökök és más diákok is láthatják.</li>
                    <li>• Minden felhasználó köteles a saját hozzáférési adatait bizalmasan kezelni.</li>
                    <li>• Informatikai rendszerek hibáit és hiányosságait kihasználni szigorúan tilos. Amennyiben a felhasználó tudomására jut ilyen módszer, azt haladéktalanul jelenteni kell a rendszergazdának.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Szellemi tulajdon
                </CardTitle>
                <CardDescription>Szerzői jogok és védelem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    A platformon található minden tartalom szerzői jogi védelem alatt áll.
                  </p>
                  <p className="text-sm">
                    A tartalmak engedély nélküli felhasználása tilos és jogi következményekkel járhat.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Liability Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Felelősség kizárása
                </CardTitle>
                <CardDescription>Jogi felelősség és korlátok</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    A szolgáltató nem vállal felelősséget a platform használatából eredő esetleges károkért.
                  </p>
                  <p className="text-sm">
                    Kivétel: szándékos károkozás.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Modifications Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Módosítások
                </CardTitle>
                <CardDescription>Feltételek változtatása</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    A szolgáltató fenntartja magának a jogot ezen feltételek módosítására.
                  </p>
                  <p className="text-sm">
                    A módosításokról a felhasználók előzetes értesítést kapnak.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 mt-8 text-center rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              Ezek a felhasználási feltételek 2025. augusztus 1-jén léptek hatályba.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}