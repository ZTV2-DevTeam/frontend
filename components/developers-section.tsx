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
    title: "Architect",
    github: "PstasDev"
  },
  {
    name: "Kovács Ádám Lőrinc",
    class: "9.F",
    github: "lorenth-kovacs"
  },
  {
    name: "Péterfi Dénes",
    class: "9.F",
    github: "Denesz009"
  },
  {
    name: "Tóth László Barnabás",
    class: "NYF",
    github: "BuilderSnail"
  }
]

export function DevelopersSection() {
  return (
    <section className="container px-4 py-16 mx-auto sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Fejlesztőcsapat</h2>
        </div>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          A ZTV2 mögött álló fejlesztők
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {developers.map((dev) => (
          <div key={dev.github} className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={`https://github.com/${dev.github}.png`}
                alt={`${dev.name} profile picture`}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-semibold">
                {dev.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <a
                href={`https://github.com/${dev.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline transition-colors duration-200 text-primary hover:text-primary/80"
              >
                {dev.name}
              </a>
              <span className="text-muted-foreground">
                {" - " + dev.class}
                {(dev.role || dev.title) && " - "}
                {dev.role && dev.title ? `${dev.role}, ${dev.title}` : dev.role || dev.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
