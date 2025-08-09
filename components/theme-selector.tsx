"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useTheme } from "@/contexts/theme-context"
import { Sun, Moon, Monitor, Palette } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSelector() {
  const { theme, setTheme } = useNextTheme()
  const { themeColor, setThemeColor } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-2 text-xs">
          <Palette className="w-3 h-3" />
          <span>Téma beállítások</span>
        </div>
      </div>
    )
  }

  const themeColors = [
    { name: "Piros", value: "red" as const, color: "oklch(0.637 0.245 27.325)" },
    { name: "Borostyán", value: "amber" as const, color: "oklch(0.689 0.184 61.116)" },
    { name: "Sárga", value: "yellow" as const, color: "oklch(0.795 0.184 86.047)" },
    { name: "Zöld", value: "green" as const, color: "oklch(0.696 0.17 162.48)" },
    { name: "Türkiz", value: "cyan" as const, color: "oklch(0.696 0.17 195.293)" },
    { name: "Kék", value: "blue" as const, color: "oklch(0.6 0.243 244.376)" },
    { name: "Indigó", value: "indigo" as const, color: "oklch(0.488 0.243 264.376)" },
    { name: "Lila", value: "purple" as const, color: "oklch(0.627 0.265 303.9)" },
    { name: "Rózsaszín", value: "pink" as const, color: "oklch(0.645 0.246 16.439)" },
    { name: "Pala", value: "slate" as const, color: "oklch(0.4313 0.0543 213.13)" },
  ]

  return (
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      {/* Theme header */}
      <div className="flex items-center gap-1 text-xs">
        <Palette className="w-3 h-3" />
        <span>Téma beállítások</span>
      </div>

      {/* Theme mode selector */}
      <div className="flex items-center gap-1">
        <span className="text-xs">Mód:</span>
        <div className="flex p-0.5 border rounded-md border-border/50 bg-background/50">
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded transition-all ${
              theme === "light"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted-foreground/10"
            }`}
            title="Világos téma"
          >
            <Sun className="w-3 h-3" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded transition-all ${
              theme === "dark"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted-foreground/10"
            }`}
            title="Sötét téma"
          >
            <Moon className="w-3 h-3" />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded transition-all ${
              theme === "system"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted-foreground/10"
            }`}
            title="Rendszer téma"
          >
            <Monitor className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Color selector */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs">Szín:</span>
        <div className="flex flex-wrap justify-center max-w-md gap-1">
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setThemeColor(color.value)}
              className={`relative w-6 h-6 rounded-full border transition-all hover:scale-105 hover:shadow-md ${
                themeColor === color.value
                  ? "border-foreground shadow-md scale-105"
                  : "border-border/30 hover:border-border"
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name}
            >
              {themeColor === color.value && (
                <div className="absolute border rounded-full inset-0.5 border-white/40 dark:border-black/40" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
