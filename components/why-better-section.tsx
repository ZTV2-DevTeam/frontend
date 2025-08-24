import {
  Shield,
  Code2,
  Zap,
  Lock,
  Globe,
  Server,
  type LucideIcon,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Improvement {
  icon: LucideIcon
  title: string
  description: string
  badges?: string[]
}

const modernFrameworkFeatures: Improvement[] = [
  {
    icon: Code2,
    title: "Stabil és Gyors",
    description: "Modern technológiák biztosítják, hogy ritkán lógjon le az oldal és gyorsan betöltsön minden eszközön.",
    badges: ["Kevesebb hiba", "Gyors betöltés"]
  },
  {
    icon: Shield,
    title: "Mindig Elérhető",
    description: "Szinte soha nem okoz problémát az elérése - megbízhatóan működik akkor is, amikor szükséged van rá.",
    badges: ["99.9% Uptime", "Stabil kapcsolat"]
  },
]

const securityFeatures: Improvement[] = [
  {
    icon: Shield,
    title: "Automatikus Védelem",
    description: "A háttérben folyamatosan védi az oldalt a rosszindulatú támadásoktól és túlterheléstől.",
    badges: ["DDoS Protection", "Automatikus szűrés"]
  },
  {
    icon: Globe,
    title: "Biztonságos Kapcsolat",
    description: "Minden adat titkosítva utazik, és automatikusan kiszűri a gyanús forgalmat és botokat.",
    badges: ["SSL titkosítás", "Bot protection", "CSRF-XSS védelem"]
  },
  {
    icon: Server,
    title: "Folyamatos Felügyelet",
    description: "A szerver állapotát 24/7 figyelik, és rendszeres karbantartással biztosítják a stabil működést.",
    badges: ["24/7 Monitoring", "Rendszeres karbantartás"]
  },
  {
    icon: Lock,
    title: "Adatbiztonság",
    description: "Minden felhasználói adat biztonságban van - senki nem férhet hozzá jogosulatlanul.",
    badges: ["Titkosított adatok", "Hozzáférés-védelem"]
  },
]

const ImprovementCard = ({ icon: Icon, title, description, badges }: Improvement) => (
  <Card className="transition-all duration-300 bg-background/50 border-white/10 hover:border-primary/50 hover:shadow-lg">
    <CardHeader>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold mb-2">{title}</CardTitle>
          <CardDescription className="text-muted-foreground mb-3">{description}</CardDescription>
          {badges && (
            <div className="flex flex-wrap gap-1">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </CardHeader>
  </Card>
)

export function WhyBetterSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/10">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Miért jobb az új rendszer?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Modern technológiák és enterprise szintű biztonság egy megbízható platformért
            </p>
          </div>
        </div>

        {/* Modern Framework Section */}
        <div className="mb-16">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl text-primary">
              Megbízhatóság
            </h3>
            <p className="max-w-[700px] text-muted-foreground">
              Ritkán okoz problémát az elérése - akkor is működik, amikor szükséged van rá
            </p>
          </div>
          <div className="grid items-start max-w-4xl gap-6 mx-auto lg:grid-cols-2">
            {modernFrameworkFeatures.map((feature) => (
              <ImprovementCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl text-primary">
              Biztonság és Védelem
            </h3>
            <p className="max-w-[700px] text-muted-foreground">
              Az adataid biztonságban vannak - láthatatlan védelem a háttérben
            </p>
          </div>
          <div className="grid items-start max-w-6xl gap-6 mx-auto lg:grid-cols-2 xl:grid-cols-2">
            {securityFeatures.map((feature) => (
              <ImprovementCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
