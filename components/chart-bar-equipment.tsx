"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import { useApiQuery } from "@/lib/api-helpers"

export const description = "A bar chart showing equipment usage from real data"

const chartConfig = {
  usage: {
    label: "Használat (nap)",
    theme: {
      light: "hsl(262 83% 58%)", // Purple for equipment tracking
      dark: "hsl(262 83% 68%)",   // Lighter purple for dark mode
    },
  },
} satisfies ChartConfig

interface EquipmentChartData {
  equipment: string
  equipment_id: number
  usage: number
  upcoming_bookings: number
  forgatasok: string[]
}

export function ChartBarEquipment() {
  const [chartData, setChartData] = useState<EquipmentChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch equipment és usage adatok
  const { data: equipmentData } = useApiQuery(
    () => apiClient.getEquipment(true) // functional equipment only
  )

  useEffect(() => {
    const fetchEquipmentUsageData = async () => {
      if (!equipmentData || !Array.isArray(equipmentData)) return

      setLoading(true)
      setError(null)

      try {
        const usagePromises = equipmentData.map(async (equipment: any) => {
          try {
            // Get usage statistics
            const usageData = await apiClient.getEquipmentUsage(equipment.id, 30)
            
            // Get schedule for forgatas information
            const today = new Date().toISOString().split('T')[0]
            const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            const scheduleData = await apiClient.getEquipmentSchedule(equipment.id, today, endDate)
            
            // Extract unique forgatas names
            const forgatasok = [...new Set(scheduleData.schedule.map(s => s.forgatas_name))]

            return {
              equipment: equipment.nickname || equipment.display_name || `Equipment ${equipment.id}`,
              equipment_id: equipment.id,
              usage: usageData.total_bookings || 0,
              upcoming_bookings: usageData.upcoming_bookings || 0,
              forgatasok: forgatasok
            }
          } catch (err) {
            console.warn(`Failed to fetch data for equipment ${equipment.id}:`, err)
            return {
              equipment: equipment.nickname || equipment.display_name || `Equipment ${equipment.id}`,
              equipment_id: equipment.id,
              usage: 0,
              upcoming_bookings: 0,
              forgatasok: []
            }
          }
        })

        const results = await Promise.all(usagePromises)
        
        // Filter out equipment with no usage and sort by usage
        const filteredResults = results
          .filter(item => item.usage > 0)
          .sort((a, b) => b.usage - a.usage)
          .slice(0, 10) // Show top 10

        setChartData(filteredResults)
      } catch (err) {
        console.error('Error fetching equipment usage data:', err)
        setError('Nem sikerült betölteni a felszerelés adatokat')
      } finally {
        setLoading(false)
      }
    }

    fetchEquipmentUsageData()
  }, [equipmentData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Felszerelés használata</CardTitle>
          <CardDescription>Betöltés...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
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
          <CardTitle>Felszerelés használata</CardTitle>
          <CardDescription>Hiba történt az adatok betöltése során</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Felszerelés használata</CardTitle>
        <CardDescription>
          Valós felszerelés foglalások és forgatásokra kiírt eszközök (utolsó 30 nap)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="equipment"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 8) + (value.length > 8 ? '...' : '')}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as EquipmentChartData
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        Foglalások: {data.usage}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Jövőbeli: {data.upcoming_bookings}
                      </p>
                      {data.forgatasok.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Forgatások:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {data.forgatasok.slice(0, 3).map((forgatas, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {forgatas.length > 15 ? forgatas.slice(0, 15) + '...' : forgatas}
                              </Badge>
                            ))}
                            {data.forgatasok.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{data.forgatasok.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
          </BarChart>
        </ChartContainer>
        
        {chartData.length === 0 && (
          <div className="mt-4 text-center text-muted-foreground">
            <p>Nincs használati adat az utolsó 30 napban</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
