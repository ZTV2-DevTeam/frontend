"use client"

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

export const description = "A bar chart showing equipment usage"

const chartData = [
  { equipment: "Kamera 1", usage: 15 },
  { equipment: "Kamera 2", usage: 12 },
  { equipment: "Kamera 3", usage: 8 },
  { equipment: "Drón", usage: 6 },
  { equipment: "Mikrofon", usage: 20 },
  { equipment: "Állvány", usage: 14 },
  { equipment: "LED világítás", usage: 9 },
]

const chartConfig = {
  usage: {
    label: "Használat (nap)",
    theme: {
      light: "hsl(262 83% 58%)", // Purple for equipment tracking
      dark: "hsl(262 83% 68%)",   // Lighter purple for dark mode
    },
  },
} satisfies ChartConfig

export function ChartBarEquipment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Felszerelés használata</CardTitle>
        <CardDescription>Augusztusi felszerelés kölcsönzések</CardDescription>
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
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
