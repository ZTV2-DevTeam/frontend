"use client"

import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Clapperboard } from "lucide-react"
import { useUserRole } from "@/contexts/user-role-context"
import { useConfetti } from "@/components/confetti"

// Map of routes to page names based on the sidebar data
const routeToPageName: Record<string, string> = {
  "/iranyitopult": "Irányítópult",
  "/uzenofal": "Üzenőfal",
  "/stab": "Stáb",
  "/naptar": "Naptár",
  "/beallitasok": "Beállítások",
  "/segitseg": "Segítség",
  "/forgatasok": "Forgatások",
  "/beosztas": "Beosztás",
  "/tavollet": "Távollét",
  "/partnerek": "Partnerek",
  "/felszereles": "Felszerelés",
  "/igazolasok": "Igazolások",
}

function getCurrentPageName(pathname: string): string {
  return routeToPageName[pathname] || "FTV"
}

export function SiteHeader() {
  const pathname = usePathname()
  const { isPreviewMode, currentRole, actualUserRole } = useUserRole()
  const currentPageName = getCurrentPageName(pathname)
  const { trigger, ConfettiComponent } = useConfetti()
  
  // Easter egg state
  const [clickCount, setClickCount] = useState(0)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  // Function to get role display name in Hungarian
  const getRoleDisplayName = (role: string | null): string => {
    switch (role) {
      case 'admin':
        return 'adminisztrátor'
      case 'class-teacher':
        return 'osztályfőnök'
      case 'student':
        return 'diák'
      default:
        return 'ismeretlen'
    }
  }

  // Easter egg handler
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    const newCount = clickCount + 1
    setClickCount(newCount)

    // Clear existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }

    // Trigger confetti if 5 clicks reached
    if (newCount >= 5) {
      trigger()
      setClickCount(0)
      return
    }

    // Reset counter after 2 seconds of no clicks
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0)
    }, 2000)
  }

  return (
    <>
      <ConfettiComponent />
      <header className="flex h-16 md:h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-[width,height] ease-linear">
        <div className="flex items-center w-full gap-3 px-4 lg:gap-4 lg:px-6">
          <SidebarTrigger className="-ml-1 h-9 w-9 md:h-8 md:w-8" />
          <Separator
            orientation="vertical"
            className="mx-1 h-6 data-[orientation=vertical]:h-6"
          />
          <div className="flex items-center gap-3 min-h-[2.5rem] md:min-h-[2rem]">
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0 hover:bg-transparent focus:outline-none"
              aria-label="FTV Logo"
            >
              <Clapperboard className="h-6 w-6 md:h-5 md:w-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="sr-only">Iranyitopult</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-base font-semibold tracking-tight">{currentPageName}</h1>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded border border-orange-200 dark:border-orange-700">
                BETA
              </span>
              {isPreviewMode && (
                <span 
                  className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-700"
                  title={`Előnézeti mód: ${getRoleDisplayName(actualUserRole)} nézi meg a(z) ${getRoleDisplayName(currentRole)} nézetet`}
                >
                  ELŐNÉZET
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
