"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "A themed area chart showing activity trends"

const chartData = [
  { date: "2025-01-01", forgatások: 8, beosztások: 5, felszerelések: 12 },
  { date: "2025-02-01", forgatások: 12, beosztások: 8, felszerelések: 15 },
  { date: "2025-03-01", forgatások: 15, beosztások: 12, felszerelések: 18 },
  { date: "2025-04-01", forgatások: 22, beosztások: 18, felszerelések: 25 },
  { date: "2025-05-01", forgatások: 25, beosztások: 20, felszerelések: 28 },
  { date: "2025-06-01", forgatások: 28, beosztások: 25, felszerelések: 32 },
  { date: "2025-07-01", forgatások: 32, beosztások: 28, felszerelések: 35 },
  { date: "2025-08-01", forgatások: 35, beosztások: 30, felszerelések: 38 },
]

const chartConfig = {
  forgatások: {
    label: "Forgatások",
    theme: {
      light: "hsl(221 83% 53%)",
      dark: "hsl(221 83% 63%)",
    },
  },
  beosztások: {
    label: "Beosztások", 
    theme: {
      light: "hsl(142 76% 36%)",
      dark: "hsl(142 76% 46%)",
    },
  },
  felszerelések: {
    label: "Felszerelések",
    theme: {
      light: "hsl(262 83% 58%)",
      dark: "hsl(262 83% 68%)",
    },
  },
} satisfies ChartConfig

export function ChartAreaThemed() {
  const [timeRange, setTimeRange] = React.useState("6m")

  const filteredData = React.useMemo(() => {
    const months = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12
    return chartData.slice(-months)
  }, [timeRange])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Tevékenységi trendek</CardTitle>
          <CardDescription>
            Havi aktivitás összegzés témák szerint
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Időszak kiválasztása"
          >
            <SelectValue placeholder="Utolsó 6 hónap" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="3m" className="rounded-lg">
              Utolsó 3 hónap
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Utolsó 6 hónap
            </SelectItem>
            <SelectItem value="12m" className="rounded-lg">
              Utolsó 12 hónap
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillForgatások" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-forgatások)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-forgatások)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBeosztások" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-beosztások)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-beosztások)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFelszerelések" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-felszerelések)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-felszerelések)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
                  year: "2-digit",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("hu-HU", {
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="felszerelések"
              type="natural"
              fill="url(#fillFelszerelések)"
              stroke="var(--color-felszerelések)"
              stackId="a"
            />
            <Area
              dataKey="beosztások"
              type="natural"
              fill="url(#fillBeosztások)"
              stroke="var(--color-beosztások)"
              stackId="a"
            />
            <Area
              dataKey="forgatások"
              type="natural"
              fill="url(#fillForgatások)"
              stroke="var(--color-forgatások)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
