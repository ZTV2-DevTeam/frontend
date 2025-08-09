"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Map of routes to page names based on the sidebar data
const routeToPageName: Record<string, string> = {
  "/iranyitopult": "Irányítópult",
  "/uzenofal": "Üzenőfal",
  "/analitika": "Analitika",
  "/stab": "Stáb",
  "/naptar": "Naptár",
  "/beallitasok": "Beállítások",
  "/segitseg": "Segítség",
  "/forgatasok": "Forgatások",
  "/beosztas": "Beosztás",
  "/vakacio": "Vakáció",
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
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center w-full gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{currentPageName}</h1>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/FTV-DevTeam/FTV-frontend"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
