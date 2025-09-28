'use client'

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clapperboard, Plus, Bug, Zap, Shield, AlertTriangle, Minus, Share2, Check, Puzzle } from "lucide-react"
import { changelogData } from "@/config/changelog"
import { ChangelogType } from "@/types/changelog"
import { SiteFooter } from "@/components/site-footer"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useTheme } from "@/contexts/theme-context"

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
    case 'integration':
      return <Puzzle className="w-4 h-4" />
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
    case 'integration':
      return 'text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 dark:text-indigo-400 dark:bg-gradient-to-r dark:from-indigo-950/30 dark:to-purple-950/30 dark:border-indigo-800'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950 dark:border-gray-800'
  }
}

const getChangeTypeLabel = (type: ChangelogType) => {
  switch (type) {
    case 'feature':
      return 'Újdonság'
    case 'improvement':
      return 'Fejlesztés'
    case 'bugfix':
      return 'Hibajavítás'
    case 'security':
      return 'Biztonság'
    case 'breaking':
      return 'Áttörés'
    case 'removed':
      return 'Eltávolítva'
    case 'integration':
      return 'Integráció'
    default:
      return 'Változás'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

export default function ChangelogPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Initialize theme context to ensure proper hydration
  useTheme()

  // Handle URL hash scrolling on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const elementId = window.location.hash.slice(1)
      const element = document.getElementById(elementId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }
  }, [])

  const handleShare = async (entryId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${entryId}`
    
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(entryId)
      toast.success("Link másolva a vágólapra!")
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast.error("Hiba történt a link másolása során")
    }
  }
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container flex items-center justify-between px-4 py-4 mx-auto sm:px-6 lg:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer">
          <Clapperboard className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1 sm:gap-2">
              <span>FTV</span>
            </div>
            <span className="text-xs text-muted-foreground font-normal leading-none hidden sm:block">Hiányzás Áttekintő Platform</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors bg-muted hover:bg-muted/80 rounded-md"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Vissza a főoldalra</span>
            <span className="sm:hidden">Vissza</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-4xl overflow-hidden">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Változások</h1>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">
              Az FTV platform fejlesztéseinek és változásainak története
            </p>
          </div>

          {/* Current and Future Developments Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-900 dark:text-blue-100 break-words">
                  Jelenlegi és jövőbeli fejlesztések
                </h2>
                <p className="text-blue-700 dark:text-blue-300 text-sm break-words">
                  Miken dolgozunk jelenleg és mit tervezünk a jövőben
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Current Development */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Folyamatban
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Plus className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm break-words">Rádiózás</p>
                      <p className="text-xs text-muted-foreground break-words">
                        Rádiós Stábok kezelése, rádiós összejátszások követése és kezelése
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Future Development */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                    Tervezett funkciók
                  </h3>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Zap className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs break-words">Google Fiók authentikáció</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs break-words">Dinamikus e-mail értesítések</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs break-words">Partner-, eszköz- és felhasználókezelés</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs break-words">Forgatástörténet és statisztikák</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-blue-600 dark:text-blue-400 break-words">
                💡 További részletekért látogasd meg a <span className="font-medium">Segítség &gt; Erőforrások</span> oldalt
              </p>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {changelogData.map((entry, index) => (
              <div key={entry.id} id={entry.id} className="relative scroll-mt-24">
                {/* Timeline line */}
                {index < changelogData.length - 1 && (
                  <div className="absolute left-4 sm:left-6 top-12 sm:top-16 w-0.5 h-full bg-border -ml-px" />
                )}
                
                <div className="flex gap-3 sm:gap-6">
                  {/* Date badge */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full border-2 sm:border-4 border-background shadow-lg">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-6 sm:pb-8">
                    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-sm overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0 sm:gap-4 mb-4">
                        <h2 className="text-lg sm:text-2xl font-semibold break-words">{entry.title}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {formatDate(entry.date)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(entry.id)}
                            className="flex items-center gap-1 sm:gap-2 h-7 sm:h-8 px-2 sm:px-3 text-xs"
                            title="Bejegyzés megosztása"
                          >
                            {copiedId === entry.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span className="inline sm:inline">Másolva</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3 h-3" />
                                <span className="inline sm:inline">Megosztás</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        {entry.changes.map((change) => (
                          <div key={change.id} className={`border border-border rounded-lg p-3 sm:p-4 overflow-hidden ${
                            change.type === 'integration' 
                              ? 'bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800' 
                              : 'bg-muted/20'
                          }`}>
                            <div className="space-y-2 sm:space-y-3">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-1 rounded-full text-xs font-medium border w-fit ${getChangeTypeColor(change.type)}`}>
                                  {getChangeTypeIcon(change.type)}
                                  <span className="whitespace-nowrap">{getChangeTypeLabel(change.type)}</span>
                                </div>
                                {change.type === 'integration' && change.integrationLogo && (
                                  <div className="flex items-center gap-2 ml-auto">
                                    <span className="text-xs text-muted-foreground hidden sm:inline">Szolgáltató:</span>
                                    <Image 
                                      src={change.integrationLogo} 
                                      alt="Integration logo" 
                                      width={32}
                                      height={32}
                                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded border border-border shadow-sm bg-white/50 dark:bg-gray-900/50 p-1"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className={`font-medium mb-1 break-words text-sm sm:text-base ${
                                  change.type === 'integration' 
                                    ? 'text-indigo-900 dark:text-indigo-100' 
                                    : 'text-foreground'
                                }`}>
                                  {change.description}
                                </h3>
                                {change.details && (
                                  <p className={`text-xs sm:text-sm leading-relaxed break-words ${
                                    change.type === 'integration' 
                                      ? 'text-indigo-700 dark:text-indigo-300' 
                                      : 'text-muted-foreground'
                                  }`}>
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
            <div className="text-center py-8 sm:py-12">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-2">
                Még nincsenek bejegyzések
              </h3>
              <p className="text-sm text-muted-foreground px-4">
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
