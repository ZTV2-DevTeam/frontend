'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSeasonalTheme } from '@/contexts/seasonal-theme-context'
import { SEASONAL_PERIODS, getCurrentSeasonalTheme, getSeasonalThemeConfig } from '@/lib/seasonal-themes'
import { Sparkles, Calendar, Palette, Info } from 'lucide-react'

interface SeasonalDebugModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SeasonalDebugModal({ isOpen, onClose }: SeasonalDebugModalProps) {
  const { activeTheme, seasonalName, isActive } = useSeasonalTheme()

  // Note: Override functionality removed - use theme selector to change seasonal themes
  // This modal is now for viewing information only

  const naturalTheme = getCurrentSeasonalTheme()
  const currentConfig = getSeasonalThemeConfig(activeTheme)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Szezonális Témák Debug
          </DialogTitle>
          <DialogDescription>
            Tesztelje és tekintse meg a különböző ünnepi témákat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Aktuális Állapot</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Természetes téma:</span>
                <Badge variant={naturalTheme === 'none' ? 'secondary' : 'default'}>
                  {naturalTheme === 'none' ? 'Nincs' : seasonalName || naturalTheme}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Aktív téma:</span>
                <Badge variant={isActive ? 'default' : 'secondary'}>
                  {isActive ? (seasonalName || activeTheme) : 'Nincs aktív'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dátum alapján:</span>
                <Badge variant="outline">
                  {new Date().toLocaleDateString('hu-HU')}
                </Badge>
              </div>
              {currentConfig && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Üdvözlés:</span>
                  <span className="font-medium">{currentConfig.emoji} {currentConfig.greeting}</span>
                </div>
              )}
            </div>
          </div>

          {/* Theme Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Elérhető Szezonális Témák</h3>
            </div>
            <div className="grid gap-3">
              {/* Halloween */}
              <div className={`w-full p-4 border rounded-lg ${activeTheme === 'halloween' ? 'border-primary bg-primary/5' : ''}`}>
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-purple-900 flex items-center justify-center text-2xl">
                    🎃
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold">Halloween</div>
                    <div className="text-xs text-muted-foreground">
                      Október 25 - November 5 • Narancssárga & Lila
                    </div>
                  </div>
                  {activeTheme === 'halloween' && (
                    <Badge variant="default" className="ml-auto">Aktív</Badge>
                  )}
                </div>
              </div>

              {/* Valentine's Day */}
              <div className={`w-full p-4 border rounded-lg ${activeTheme === 'valentines' ? 'border-primary bg-primary/5' : ''}`}>
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-red-600 flex items-center justify-center text-2xl">
                    💝
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold">Valentin-nap</div>
                    <div className="text-xs text-muted-foreground">
                      Február 10-16 • Rózsaszín & Piros
                    </div>
                  </div>
                  {activeTheme === 'valentines' && (
                    <Badge variant="default" className="ml-auto">Aktív</Badge>
                  )}
                </div>
              </div>

              {/* Christmas */}
              <div className={`w-full p-4 border rounded-lg ${activeTheme === 'christmas' ? 'border-primary bg-primary/5' : ''}`}>
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-red-700 flex items-center justify-center text-2xl">
                    🎄
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold">Karácsony</div>
                    <div className="text-xs text-muted-foreground">
                      December 18-26 • Zöld & Piros & Arany
                    </div>
                  </div>
                  {activeTheme === 'christmas' && (
                    <Badge variant="default" className="ml-auto">Aktív</Badge>
                  )}
                </div>
              </div>

              {/* New Year */}
              <div className={`w-full p-4 border rounded-lg ${activeTheme === 'newyear' ? 'border-primary bg-primary/5' : ''}`}>
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 via-blue-500 to-pink-600 flex items-center justify-center text-2xl">
                    🎆
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold">Boldog Új Évet</div>
                    <div className="text-xs text-muted-foreground">
                      December 27 - Január 10 • Arany & Kék & Rózsaszín
                    </div>
                  </div>
                  {activeTheme === 'newyear' && (
                    <Badge variant="default" className="ml-auto">Aktív</Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              A szezonális témák automatikusan aktiválódnak a megadott időszakokban.
              Használd a Beállítások → Téma menüt a színek módosításához.
            </p>
          </div>

          {/* Schedule Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Ütemezés</h3>
            </div>
            <div className="space-y-2">
              {SEASONAL_PERIODS.map((period) => (
                <div
                  key={period.theme}
                  className="p-3 border rounded-lg bg-card text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{period.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {period.theme}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {period.startMonth}. {period.startDay}. - {period.endMonth}. {period.endDay}.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debug Info */}
          <div className="p-3 border rounded-lg bg-muted/30 text-xs font-mono space-y-1">
            <div>Date: {new Date().toLocaleDateString('hu-HU')}</div>
            <div>Active: {isActive ? 'true' : 'false'}</div>
            <div>Theme: {activeTheme}</div>
            <div>Natural: {naturalTheme}</div>
            <div>Season Name: {seasonalName || 'none'}</div>
          </div>

          {/* Info Note */}
          <div className="text-xs text-muted-foreground p-3 border rounded-lg bg-muted/20">
            <strong>Megjegyzés:</strong> A szezonális témák csak az alkalmazás belső felületein jelennek meg. 
            A nyilvános oldalak (főoldal, bejelentkezés, stb.) változatlanok maradnak.
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Bezárás
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
