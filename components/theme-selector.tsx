"use client"

import { useTheme } from "@/contexts/theme-context"
import { Sun, Moon, Monitor, Palette, Check } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSelector() {
  const { themeColor, themeMode, setThemeColor, setThemeMode } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-2 text-xs">
          <Palette className="w-4 h-4" />
          <span>Téma beállítások betöltése...</span>
        </div>
      </div>
    )
  }

  const themeColors = [
    { name: "Piros", value: "red" as const, color: "oklch(0.637 0.245 27.325)" },
    { name: "Narancs", value: "orange" as const, color: "oklch(0.689 0.184 41.116)" },
    { name: "Sárga", value: "yellow" as const, color: "oklch(0.795 0.184 86.047)" },
    { name: "Zöld", value: "green" as const, color: "oklch(0.696 0.17 162.48)" },
    { name: "Türkiz", value: "cyan" as const, color: "oklch(0.696 0.17 195.293)" },
    { name: "Kék", value: "blue" as const, color: "oklch(0.6 0.243 244.376)" },
    { name: "Indigó", value: "indigo" as const, color: "oklch(0.488 0.243 264.376)" },
    { name: "Lila", value: "purple" as const, color: "oklch(0.627 0.265 303.9)" },
    { name: "Rózsaszín", value: "pink" as const, color: "oklch(0.645 0.246 16.439)" },
    { name: "Borostyán", value: "amber" as const, color: "oklch(0.689 0.184 61.116)" },
  ]

  return (
    <div className="space-y-6">
      {/* Theme mode selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Palette className="w-4 h-4" />
          <span>Téma mód</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setThemeMode("light")}
            className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all hover:bg-accent ${
              themeMode === "light"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-border/80"
            }`}
            title="Világos téma"
          >
            <Sun className="w-4 h-4" />
            <span className="text-xs font-medium">Világos</span>
            {themeMode === "light" && (
              <Check className="w-3 h-3 text-primary" />
            )}
          </button>
          <button
            onClick={() => setThemeMode("dark")}
            className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all hover:bg-accent ${
              themeMode === "dark"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-border/80"
            }`}
            title="Sötét téma"
          >
            <Moon className="w-4 h-4" />
            <span className="text-xs font-medium">Sötét</span>
            {themeMode === "dark" && (
              <Check className="w-3 h-3 text-primary" />
            )}
          </button>
          <button
            onClick={() => setThemeMode("system")}
            className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all hover:bg-accent ${
              themeMode === "system"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-border/80"
            }`}
            title="Automatikus (rendszer beállítás szerint)"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-xs font-medium">Auto</span>
            {themeMode === "system" && (
              <Check className="w-3 h-3 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Color selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div 
            className="w-4 h-4 rounded-full border-2 border-primary"
            style={{ backgroundColor: themeColors.find(c => c.value === themeColor)?.color }}
          />
          <span>Szín téma</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setThemeColor(color.value)}
              className={`relative w-12 h-12 rounded-full border-2 transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                themeColor === color.value
                  ? "border-foreground shadow-lg scale-105"
                  : "border-border/30 hover:border-border"
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name}
            >
              {themeColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Válassz egy színt a téma személyre szabásához
        </p>
      </div>
    </div>
  )
}
