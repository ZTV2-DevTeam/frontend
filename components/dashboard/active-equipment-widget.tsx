"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Loader2, Camera, Video, MonitorPlay, Mic, CircleSlash, RadioReceiver, Cast, Aperture } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import type { EquipmentOverviewSchema } from "@/lib/api"
import { ScrollArea } from "@/components/ui/scroll-area"

function getEquipmentIcon(type: string) {
  const typeLower = type.toLowerCase()
  if (typeLower.includes('kamera') || typeLower.includes('objektív')) return <Camera className="h-4 w-4" />
  if (typeLower.includes('mikrofon') || typeLower.includes('hang')) return <Mic className="h-4 w-4" />
  if (typeLower.includes('fény') || typeLower.includes('lámpa')) return <Aperture className="h-4 w-4" />
  if (typeLower.includes('állvány')) return <CircleSlash className="h-4 w-4" />
  if (typeLower.includes('közvetítő') || typeLower.includes('stream')) return <Cast className="h-4 w-4" />
  if (typeLower.includes('monitor') || typeLower.includes('kijelző')) return <MonitorPlay className="h-4 w-4" />
  if (typeLower.includes('adó') || typeLower.includes('vevő')) return <RadioReceiver className="h-4 w-4" />
  return <Package className="h-4 w-4" />
}

export function ActiveEquipmentWidget() {
  const { isAuthenticated } = useAuth()
  const [equipment, setEquipment] = useState<EquipmentOverviewSchema[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchEquipment() {
      if (!isAuthenticated) return

      try {
        setIsLoading(true)
        setError(null)
        const today = format(new Date(), 'yyyy-MM-dd')
        const overview = await apiClient.getEquipmentOverview(today)
        
        if (isMounted) {
          // Csak azokat tartjuk meg, amik ma használatban vannak
          const activeOnly = overview.filter(item => item.booking_count > 0)
          setEquipment(activeOnly)
        }
      } catch (err: any) {
        console.error("Hiba a napi felszerelések lekérdezésekor:", err)
        if (isMounted) {
          setError("Nem sikerült lekérdezni a felszereléseket.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchEquipment()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <Card className="h-full border-l-4 border-l-purple-500 min-h-[160px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-500" />
            Ma Használatban Lévő Felszerelések
          </CardTitle>
          <CardDescription>
            Betöltés...
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full flex items-center justify-center min-h-[80px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-500" />
            Ma Használatban Lévő Felszerelések
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-l-4 border-l-purple-500 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              Ma Használatban Lévő Felszerelések
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {format(new Date(), "yyyy. MMMM d.", { locale: hu })}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            {equipment.length} eszköz
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {equipment.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Package className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">Ma nincsenek kiadott felszerelések.</p>
          </div>
        ) : (
          <ScrollArea className="h-[220px] w-full pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {equipment.map((item) => (
                <div 
                  key={item.equipment_id} 
                  className="flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground shadow-sm max-h-[140px] overflow-y-auto"
                >
                  <div className="flex items-center gap-2 border-b pb-2 shrink-0">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-950/50 rounded-md text-purple-700 dark:text-purple-400 shrink-0">
                      {getEquipmentIcon(item.equipment_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" title={item.equipment_name}>
                        {item.equipment_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" title={item.equipment_type}>
                        {item.equipment_type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 flex-1">
                    {item.bookings.map((booking) => (
                      <div key={booking.forgatas_id} className="flex flex-col text-xs bg-muted/40 p-1.5 rounded">
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-medium truncate pr-1" title={booking.forgatas_name}>
                            {booking.forgatas_name}
                          </span>
                          <span className="text-muted-foreground whitespace-nowrap shrink-0 ml-1">
                            {booking.time_from.substring(0, 5)} - {booking.time_to.substring(0, 5)}
                          </span>
                        </div>
                        {booking.location && (
                          <span className="text-muted-foreground truncate" title={booking.location}>
                            📍 {booking.location}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
