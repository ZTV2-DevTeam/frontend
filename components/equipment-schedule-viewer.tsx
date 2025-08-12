"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Users, Wrench } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api"
import { useApiQuery } from "@/lib/api-helpers"

interface EquipmentScheduleViewerProps {
  equipmentId?: number
  showAllEquipment?: boolean
}

export function EquipmentScheduleViewer({ 
  equipmentId, 
  showAllEquipment = false 
}: EquipmentScheduleViewerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [scheduleData, setScheduleData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch equipment list if showing all equipment
  const { data: equipmentData } = useApiQuery(
    () => showAllEquipment ? apiClient.getEquipment(true) : Promise.resolve([]),
    [showAllEquipment]
  )

  useEffect(() => {
    const fetchScheduleData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (equipmentId) {
          // Single equipment schedule
          const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          const schedule = await apiClient.getEquipmentSchedule(equipmentId, selectedDate, endDate)
          setScheduleData([schedule])
        } else if (showAllEquipment) {
          // Overview for all equipment
          const overview = await apiClient.getEquipmentOverview(selectedDate)
          setScheduleData(overview)
        }
      } catch (err) {
        console.error('Error fetching schedule data:', err)
        setError('Nem sikerült betölteni az ütemterv adatokat')
      } finally {
        setLoading(false)
      }
    }

    fetchScheduleData()
  }, [equipmentId, showAllEquipment, selectedDate])

  const formatTime = (timeStr: string) => {
    return timeStr.length === 5 ? timeStr : timeStr.substring(0, 5)
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'rendes':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'kacsa':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'esemény':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Felszerelés ütemterv</CardTitle>
          <CardDescription>Betöltés...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Felszerelés ütemterv</CardTitle>
          <CardDescription>Hiba történt</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {equipmentId ? 'Eszköz ütemterv' : 'Felszerelés áttekintő'}
        </CardTitle>
        <CardDescription>
          {equipmentId 
            ? 'Részletes ütemterv egy eszközhöz és a kapcsolódó forgatások'
            : 'Összes felszerelés állapota és foglaltsága'
          }
        </CardDescription>
        
        <div className="flex gap-2 mt-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {equipmentId ? (
          // Single equipment view
          <div className="space-y-4">
            {scheduleData[0]?.schedule?.length > 0 ? (
              scheduleData[0].schedule.map((booking: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{booking.forgatas_name}</h4>
                        <Badge className={getTypeColor(booking.forgatas_type)}>
                          {booking.forgatas_type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(booking.time_from)} - {formatTime(booking.time_to)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {booking.date}
                        </div>
                        {booking.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.location}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Badge variant={booking.available ? "secondary" : "destructive"}>
                      {booking.available ? "Elérhető" : "Foglalt"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nincs foglalás ezen a napon</p>
              </div>
            )}
          </div>
        ) : (
          // All equipment overview
          <div className="space-y-4">
            {scheduleData.length > 0 ? (
              scheduleData.map((equipment: any) => (
                <div key={equipment.equipment_id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{equipment.equipment_name}</h4>
                        <Badge variant="outline">{equipment.equipment_type}</Badge>
                        <Badge variant={equipment.functional ? "secondary" : "destructive"}>
                          {equipment.functional ? "Működik" : "Nem működik"}
                        </Badge>
                      </div>
                      
                      {equipment.bookings && equipment.bookings.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Foglalások ({equipment.booking_count}):
                          </p>
                          <div className="space-y-1">
                            {equipment.bookings.slice(0, 3).map((booking: any, idx: number) => (
                              <div key={idx} className="text-sm p-2 bg-accent/50 rounded">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{booking.forgatas_name}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getTypeColor(booking.type)} variant="outline">
                                      {booking.type}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                      {formatTime(booking.time_from)} - {formatTime(booking.time_to)}
                                    </span>
                                  </div>
                                </div>
                                {booking.location && (
                                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {booking.location}
                                  </div>
                                )}
                              </div>
                            ))}
                            {equipment.booking_count > 3 && (
                              <p className="text-sm text-muted-foreground">
                                ... és még {equipment.booking_count - 3} foglalás
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Nincs foglalás ezen a napon
                        </p>
                      )}
                    </div>
                    
                    <Badge variant={equipment.available_periods ? "secondary" : "destructive"}>
                      {equipment.available_periods ? "Van szabad idő" : "Teljesen foglalt"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nincs felszerelés adat</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
