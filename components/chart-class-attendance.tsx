"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export const description = "A bar chart showing class attendance data"

const attendanceData = [
  { week: "1. hét", present: 26, absent: 2, late: 1 },
  { week: "2. hét", present: 25, absent: 3, late: 0 },
  { week: "3. hét", present: 28, absent: 0, late: 2 },
  { week: "4. hét", present: 24, absent: 4, late: 1 },
  { week: "5. hét", present: 27, absent: 1, late: 0 },
  { week: "6. hét", present: 26, absent: 2, late: 3 },
]

const chartConfig = {
  present: {
    label: "Jelen",
    theme: {
      light: "hsl(142 76% 36%)", // Green for present
      dark: "hsl(142 76% 46%)",
    },
  },
  absent: {
    label: "Hiányzó", 
    theme: {
      light: "hsl(0 84% 60%)",   // Red for absent
      dark: "hsl(0 84% 70%)",
    },
  },
  late: {
    label: "Késő",
    theme: {
      light: "hsl(38 92% 50%)",  // Orange for late
      dark: "hsl(38 92% 60%)",
    },
  },
} satisfies ChartConfig

export function ChartClassAttendance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Osztály látogatottság</CardTitle>
        <CardDescription>Heti látogatottsági statisztikák az elmúlt 6 hétből</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={attendanceData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="present"
              fill="var(--color-present)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="absent"
              fill="var(--color-absent)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="late"
              fill="var(--color-late)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
