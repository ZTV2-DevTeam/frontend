"use client"

import { Code } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Developer {
  name: string
  class: string
  role?: string
  title?: string
  github: string
}

const developers: Developer[] = [
  {
    name: "Balla Botond",
    class: "10.F",
    role: "Vezetőfejlesztő",
    title: "Architect, UI/UX Design, API Integráció, Backend logika és Adatbázisbiztonság",
    github: "PstasDev"
  },
  {
    name: "Kovács Ádám Lőrinc",
    class: "9.F",
    role: "Fejlesztő",
    title: "Backend logika és Adatbázismodellek",
    github: "lorenth-kovacs"
  },
  {
    name: "Péterfi Dénes",
    class: "9.F",
    role: "Fejlesztő",
    title: "Frontend Implementáció",
    github: "Denesz009"
  },
  {
    name: "Tóth László Barnabás",
    class: "NYF",
    role: "Fejlesztő",
    title: "UI/UX Design (logók, ikonok, felületek, színpaletták)",
    github: "BuilderSnail"
  }
]

export function DevelopersSection() {
  const [leadDeveloper, ...otherDevelopers] = developers

  return (
    <section className="container px-4 py-16 mx-auto sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Fejlesztőcsapat</h2>
        </div>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Az FTV mögött álló fejlesztők
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Lead Developer - Bigger */}
        <div className="mb-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-start gap-6">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage
                src={`https://github.com/${leadDeveloper.github}.png`}
                alt={`${leadDeveloper.name} profile picture`}
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-bold text-primary">
                {leadDeveloper.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <a
                  href={`https://github.com/${leadDeveloper.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-bold underline transition-colors duration-200 text-primary hover:text-primary/80"
                >
                  {leadDeveloper.name}
                </a>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">- {leadDeveloper.class}</span>
                  {leadDeveloper.role && (
                    <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                      {leadDeveloper.role}
                    </span>
                  )}
                </div>
              </div>
              {leadDeveloper.title && (
                <p className="text-muted-foreground leading-relaxed">
                  {leadDeveloper.title}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Other Developers - Regular Size */}
        <div className="space-y-4">
          {otherDevelopers.map((dev) => (
            <div key={dev.github} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/20 transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={`https://github.com/${dev.github}.png`}
                  alt={`${dev.name} profile picture`}
                  className="object-cover"
                />
                <AvatarFallback className="text-sm font-semibold">
                  {dev.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <a
                    href={`https://github.com/${dev.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline transition-colors duration-200 text-primary hover:text-primary/80"
                  >
                    {dev.name}
                  </a>
                  <span className="text-muted-foreground text-sm">
                    - {dev.class}
                    {dev.role && ` - ${dev.role}`}
                    {dev.title && ` - ${dev.title}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
