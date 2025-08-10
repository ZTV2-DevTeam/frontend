import {
  LayoutDashboard,
  Plane,
  FileCheck,
  Box,
  ClipboardList,
  CalendarIcon as CalendarCog,
  type LucideIcon,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const generalFeatures: Feature[] = [
  {
    icon: LayoutDashboard,
    title: "Megújult felület",
    description: "A forgatások adatai egy vadiúj, modern és reszponzív felületen.",
  },
  {
    icon: Plane,
    title: "Távollét",
    description: "Jelezd előre, ha nem leszel elérhető egy ideig (korábban Trello → Google Forms).",
  },
  {
    icon: FileCheck,
    title: "Igazolások",
    description: "Nem kell leadnod az igazolásaidat, a rendszer automatikusan kezeli őket.",
  },
]

const teacherFeatures: Feature[] = [
  {
    icon: Box,
    title: "Felszerelés- és partnerkezelés",
    description: "A rendszer kezeli a felszerelések kiírásait, valamint a partnerek elérhetőségeit és helyszíneit.",
  },
  {
    icon: ClipboardList,
    title: "Igazolások",
    description: "Osztályfőnökként láthatja osztályának összes igazolt médiás hiányzását rendszerezve.",
  },
  {
    icon: CalendarCog,
    title: "Beosztáskezelő",
    description: "Intelligens felszerelés és stáb ajánlás a forgatások beosztásánál.",
  },
]

const FeatureCard = ({ icon: Icon, title, description }: Feature) => (
  <Card className="transition-colors duration-300 bg-background/50 border-white/10 hover:border-primary/50">
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="mt-1 text-muted-foreground">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
  </Card>
)

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Újdonságok</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Mit takar az új rendszer?
            </p>
          </div>
        </div>
        <div className="grid items-start max-w-5xl gap-6 py-12 mx-auto lg:grid-cols-3 lg:gap-8">
          {generalFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center mt-16 space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tanároknak</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Extra funkciók
            </p>
          </div>
        </div>
        <div className="grid items-start max-w-5xl gap-6 py-12 mx-auto lg:grid-cols-3 lg:gap-8">
          {teacherFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
