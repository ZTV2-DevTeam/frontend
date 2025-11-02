"use client"

import { useTheme } from "@/contexts/theme-context"
import { useSeasonalTheme } from "@/contexts/seasonal-theme-context"
import { Sun, Moon, Monitor, Palette, Check, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSelector() {
  const { themeColor, themeMode, setThemeColor, setThemeMode } = useTheme()
  const { isSeasonalAvailable, activeTheme, seasonalName } = useSeasonalTheme()
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
    { name: "Tűzpiros", value: "red" as const, color: "oklch(0.62 0.28 27)", seasonal: false },
    { name: "Borostyán", value: "amber" as const, color: "oklch(0.689 0.184 61.116)", seasonal: false },
    { name: "Banán", value: "yellow" as const, color: "oklch(0.795 0.184 86.047)", seasonal: false },
    { name: "Friss Fű", value: "green" as const, color: "oklch(0.696 0.17 162.48)", seasonal: false },
    { name: "Óceán", value: "cyan" as const, color: "oklch(0.696 0.17 195.293)", seasonal: false },
    { name: "Égbolt", value: "blue" as const, color: "oklch(0.6 0.243 244.376)", seasonal: false },
    { name: "Éjfél", value: "indigo" as const, color: "oklch(0.488 0.243 264.376)", seasonal: false },
    { name: "Levendula", value: "purple" as const, color: "oklch(0.627 0.265 303.9)", seasonal: false },
    { name: "Rózsaköd", value: "pink" as const, color: "oklch(0.645 0.265 330)", seasonal: false },
    { name: "Palahegy", value: "slate" as const, color: "oklch(0.4313 0.0543 213.13)", seasonal: false },
  ]

  // Add seasonal theme if available
  const seasonalThemes = [
    { name: "🎃 Halloween", value: "halloween" as const, color: "oklch(0.65 0.19 45)", seasonal: true },
    { name: "💝 Valentin-nap", value: "valentines" as const, color: "oklch(0.55 0.23 5)", seasonal: true },
    { name: "🎄 Karácsony", value: "christmas" as const, color: "oklch(0.45 0.18 140)", seasonal: true },
    { name: "🎆 Boldog Új Évet", value: "newyear" as const, color: "oklch(0.75 0.15 85)", seasonal: true },
  ]

  // Only show the currently active seasonal theme
  const availableSeasonalTheme = isSeasonalAvailable 
    ? seasonalThemes.find(t => t.value === activeTheme)
    : null

  const allThemeColors = availableSeasonalTheme 
    ? [availableSeasonalTheme, ...themeColors]
    : themeColors

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
            style={{ backgroundColor: allThemeColors.find(c => c.value === themeColor)?.color }}
          />
          <span>Témaszín</span>
          {availableSeasonalTheme && (
            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          )}
        </div>
        <div className="grid grid-cols-5 gap-3">
          {allThemeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setThemeColor(color.value)}
              className={`relative w-12 h-12 rounded-full border-2 transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                themeColor === color.value
                  ? "border-foreground shadow-lg scale-105"
                  : "border-border/30 hover:border-border"
              } ${color.seasonal ? "ring-2 ring-primary/30" : ""}`}
              style={{ backgroundColor: color.color }}
              title={color.name}
            >
              {themeColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              )}
              {color.seasonal && themeColor !== color.value && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {availableSeasonalTheme 
            ? `🎉 ${availableSeasonalTheme.name} téma elérhető!`
            : "Válassz egy színt a téma személyre szabásához"
          }
        </p>
      </div>
    </div>
  )
}
