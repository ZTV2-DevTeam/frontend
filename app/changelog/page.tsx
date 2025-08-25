'use client'

import Link from "next/link"
import { ArrowLeft, Calendar, Clapperboard, Plus, Bug, Zap, Shield, AlertTriangle, Minus } from "lucide-react"
import { changelogData } from "@/config/changelog"
import { ChangelogType } from "@/types/changelog"
import { SiteFooter } from "@/components/site-footer"

const getChangeTypeIcon = (type: ChangelogType) => {
  switch (type) {
    case 'feature':
      return <Plus className="w-4 h-4" />
    case 'improvement':
      return <Zap className="w-4 h-4" />
    case 'bugfix':
      return <Bug className="w-4 h-4" />
    case 'security':
      return <Shield className="w-4 h-4" />
    case 'breaking':
      return <AlertTriangle className="w-4 h-4" />
    case 'removed':
      return <Minus className="w-4 h-4" />
    default:
      return <Plus className="w-4 h-4" />
  }
}

const getChangeTypeColor = (type: ChangelogType) => {
  switch (type) {
    case 'feature':
      return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800'
    case 'improvement':
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800'
    case 'bugfix':
      return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800'
    case 'security':
      return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800'
    case 'breaking':
      return 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-950 dark:border-purple-800'
    case 'removed':
      return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950 dark:border-gray-800'
  }
}

const getChangeTypeLabel = (type: ChangelogType) => {
  switch (type) {
    case 'feature':
      return 'Új funkció'
    case 'improvement':
      return 'Javítás'
    case 'bugfix':
      return 'Hibák javítása'
    case 'security':
      return 'Biztonság'
    case 'breaking':
      return 'Áttörés'
    case 'removed':
      return 'Eltávolítva'
    default:
      return 'Változás'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function ChangelogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container flex items-center justify-between px-4 py-4 mx-auto sm:px-6 lg:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-80 transition-opacity">
          <Clapperboard className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span>FTV</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full border border-orange-200 dark:border-orange-700">
                BETA
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-normal leading-none">Hiányzás Áttekintő Platform</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-muted hover:bg-muted/80 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Vissza a főoldalra
          </Link>
        </div>
      </header>

      <main className="flex-1 container px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Változások</h1>
            <p className="text-xl text-muted-foreground">
              Az FTV platform fejlesztéseinek és változásainak története
            </p>
          </div>

          <div className="space-y-8">
            {changelogData.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Timeline line */}
                {index < changelogData.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-border -ml-px" />
                )}
                
                <div className="flex gap-6">
                  {/* Date badge */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full border-4 border-background shadow-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-8">
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">{entry.title}</h2>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(entry.date)}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {entry.changes.map((change) => (
                          <div key={change.id} className="border border-border rounded-lg p-4 bg-muted/20">
                            <div className="space-y-3">
                              <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border w-fit ${getChangeTypeColor(change.type)}`}>
                                {getChangeTypeIcon(change.type)}
                                <span>{getChangeTypeLabel(change.type)}</span>
                              </div>
                              <div>
                                <h3 className="font-medium text-foreground mb-1">
                                  {change.description}
                                </h3>
                                {change.details && (
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {change.details}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {changelogData.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Még nincsenek bejegyzések
              </h3>
              <p className="text-muted-foreground">
                A változások itt fognak megjelenni, amint frissítések érkeznek.
              </p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
