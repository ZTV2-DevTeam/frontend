"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

export const description = "An interactive line chart for monthly activities"

const chartData = [
  { date: "2025-03-01", forgatások: 12, beosztások: 8 },
  { date: "2025-04-01", forgatások: 15, beosztások: 12 },
  { date: "2025-05-01", forgatások: 18, beosztások: 15 },
  { date: "2025-06-01", forgatások: 22, beosztások: 18 },
  { date: "2025-07-01", forgatások: 25, beosztások: 20 },
  { date: "2025-08-01", forgatások: 28, beosztások: 25 },
  { date: "2025-08-15", forgatások: 32, beosztások: 28 },
]

const chartConfig = {
  views: {
    label: "Aktivitások",
  },
  forgatások: {
    label: "Forgatások",
    theme: {
      light: "hsl(221 83% 53%)", // Professional blue
      dark: "hsl(221 83% 63%)",   // Lighter for dark mode visibility
    },
  },
  beosztások: {
    label: "Beosztások",
    theme: {
      light: "hsl(142 76% 36%)", // Professional green
      dark: "hsl(142 76% 46%)",   // Lighter for dark mode visibility
    },
  },
} satisfies ChartConfig

export function ChartLineActivities() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("forgatások")

  const total = React.useMemo(
    () => ({
      forgatások: chartData.reduce((acc, curr) => acc + curr.forgatások, 0),
      beosztások: chartData.reduce((acc, curr) => acc + curr.beosztások, 0),
    }),
    []
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Havi aktivitás - Interaktív</CardTitle>
          <CardDescription>
            Az elmúlt 6 hónap aktivitásainak összesítése
          </CardDescription>
        </div>
        <div className="flex">
          {["forgatások", "beosztások"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("hu-HU", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("hu-HU", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
