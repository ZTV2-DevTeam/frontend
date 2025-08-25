"use client"

import { StandardizedLayout } from "@/components/standardized-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Search, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useUserRole } from "@/contexts/user-role-context"
import { TeacherAbsencesPage } from "@/components/teacher-absences-page"

function StudentAbsencesPageReal() {
  const { user } = useAuth()

  return (
    <StandardizedLayout>
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Automatikus Igazoláskezelés</h1>
              <p className="text-muted-foreground">
                A hiányzásaid automatikusan kezelve vannak a forgatási információid alapján
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              {user?.first_name} {user?.last_name}
            </Badge>
          </div>
        </div>

        {/* Main Information Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
              Automatikus Rendszer
            </CardTitle>
            <CardDescription>
              Minden forgatásod automatikusan generál hiányzásokat, amelyeket az osztályfőnököd kezel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* How it works */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hogyan működik?</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium mb-1">Forgatásra beosztás</h4>
                    <p className="text-sm text-muted-foreground">
                      Amikor forgatásra vagy beosztva, automatikusan létrejön a hiányzási bejegyzés
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium mb-1">Tanórák kiszámítása</h4>
                    <p className="text-sm text-muted-foreground">
                      A rendszer automatikusan kiszámolja, mely tanórákba lóg bele a forgatás ideje
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium mb-1">Osztályfőnöki döntés</h4>
                    <p className="text-sm text-muted-foreground">
                      Az osztályfőnököd eldönti, hogy a hiányzás igazolt vagy igazolatlan lesz-e
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium mb-1">Végleges státusz</h4>
                    <p className="text-sm text-muted-foreground">
                      A döntés után a hiányzás végleges státuszt kap az elektronikus naplóban
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hiányzási státuszok</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <span className="font-medium text-green-400">Igazolt</span>
                    <p className="text-sm text-muted-foreground">A hiányzás hivatalosan elfogadott, nem számít be a hiányzási limitetbe</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <div>
                    <span className="font-medium text-red-400">Igazolatlan</span>
                    <p className="text-sm text-muted-foreground">A hiányzás nem elfogadott, beszámít a hiányzási limitetbe</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div>
                    <span className="font-medium text-yellow-400">Elbírálás alatt</span>
                    <p className="text-sm text-muted-foreground">Az osztályfőnök még nem döntött a hiányzás státuszáról</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Features */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-400" />
              Jövőbeli Funkciók
            </CardTitle>
            <CardDescription>
              A következő fejlesztések várhatók a rendszerben
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Saját hiányzások megtekintése</h4>
                  <p className="text-sm text-muted-foreground">
                    Látni fogod az összes hiányzásodat és azok státuszát
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                <Calendar className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Osztályfőnöki válaszok</h4>
                  <p className="text-sm text-muted-foreground">
                    Látni fogod, hogy az osztályfőnököd hogyan döntött egyes hiányzásaidról
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                <Clock className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Extra idő bejelentése</h4>
                  <p className="text-sm text-muted-foreground">
                    Bejelentheted, ha a forgatás hosszabb volt, vagy előkészület kellett hozzá
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                <Search className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Részletes nyomon követés</h4>
                  <p className="text-sm text-muted-foreground">
                    Szűrési és keresési lehetőségek a hiányzásaid között
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Kérdések vagy problémák?</h4>
                <p className="text-sm text-muted-foreground">
                  Ha kérdésed van a hiányzásaiddal kapcsolatban, vagy úgy érzed, hogy valami hiba történt, 
                  fordulj bizalommal az osztályfőnöködhöz vagy a médiatanáraidhoz. 
                  Ők tudják módosítani és igazolni a hiányzásaidat a rendszerben.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardizedLayout>
  )
}

export default function JustifyPage() {
  const { currentRole } = useUserRole()

  // Render different components based on user role
  if (currentRole === 'class-teacher') {
    return <TeacherAbsencesPage />
  } else if (currentRole === 'student') {
    return <StudentAbsencesPageReal />
  } else {
    // Admin role - default to teacher view for demo
    return <TeacherAbsencesPage />
  }
}