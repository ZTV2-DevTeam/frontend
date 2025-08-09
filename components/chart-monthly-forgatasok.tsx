"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export const description = "A line chart showing monthly forgatások for class teachers"

const monthlyData = [
  { month: "Jan", forgatasok: 3 },
  { month: "Feb", forgatasok: 5 },
  { month: "Mar", forgatasok: 4 },
  { month: "Apr", forgatasok: 7 },
  { month: "May", forgatasok: 6 },
  { month: "Jun", forgatasok: 8 },
  { month: "Jul", forgatasok: 4 },
  { month: "Aug", forgatasok: 2 },
]

const chartConfig = {
  forgatasok: {
    label: "Forgatások száma",
    theme: {
      light: "hsl(197 92% 40%)",
      dark: "hsl(197 92% 50%)",
    },
  },
} satisfies ChartConfig

export function ChartMonthlyForgatasok() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Havi forgatások</CardTitle>
        <CardDescription>Forgatások száma havonta az idei évben</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={monthlyData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
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
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="forgatasok"
              stroke="var(--color-forgatasok)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-forgatasok)",
                strokeWidth: 2,
                r: 4,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
