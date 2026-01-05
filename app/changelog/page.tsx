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

          {/* Migration Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-blue-900 dark:text-blue-100">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Változásnapló áthelyezve</h2>
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              A változásnapló már nem érhető el az ftv.szlg.info címen.
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              Az új helye:{" "}
              <a 
                href="https://node.szlg.info/valtozasok" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold underline hover:no-underline"
              >
                node.szlg.info/valtozasok
              </a>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
