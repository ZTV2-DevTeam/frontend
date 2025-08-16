"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Clapperboard } from "lucide-react"

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
  const currentPageName = getCurrentPageName(pathname)

  return (
    <header className="flex h-16 md:h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-[width,height] ease-linear">
      <div className="flex items-center w-full gap-3 px-4 lg:gap-4 lg:px-6">
        <SidebarTrigger className="-ml-1 h-9 w-9 md:h-8 md:w-8" />
        <Separator
          orientation="vertical"
          className="mx-1 h-6 data-[orientation=vertical]:h-6"
        />
        <div className="flex items-center gap-3 min-h-[2.5rem] md:min-h-[2rem]">
          <Clapperboard className="h-6 w-6 md:h-5 md:w-5 text-primary flex-shrink-0" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-base font-semibold tracking-tight">{currentPageName}</h1>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded border border-orange-200 dark:border-orange-700">
              BETA
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
