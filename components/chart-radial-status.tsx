"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

export const description = "A radial chart with project status"

const chartData = [
  { status: "completed", count: 45, fill: "var(--color-completed)" },
  { status: "active", count: 30, fill: "var(--color-active)" },
  { status: "pending", count: 25, fill: "var(--color-pending)" },
]

const chartConfig = {
  count: {
    label: "Projektek",
  },
  completed: {
    label: "Befejezett",
    theme: {
      light: "hsl(142 76% 36%)", // Green for light mode
      dark: "hsl(142 76% 46%)",   // Lighter green for dark mode
    },
  },
  active: {
    label: "Aktív",
    theme: {
      light: "hsl(221 83% 53%)", // Blue for light mode
      dark: "hsl(221 83% 63%)",   // Lighter blue for dark mode
    },
  },
  pending: {
    label: "Várakozó",
    theme: {
      light: "hsl(38 92% 50%)",  // Orange for light mode  
      dark: "hsl(38 92% 60%)",    // Lighter orange for dark mode
    },
  },
} satisfies ChartConfig

export function ChartRadialStatus() {
  const totalProjects = chartData.reduce((acc, curr) => acc + curr.count, 0)
  const completedPercentage = Math.round((chartData[0].count / totalProjects) * 100)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Projekt státuszok</CardTitle>
        <CardDescription>2025. augusztus</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="count" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalProjects}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Projektek
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {completedPercentage}% befejezett projektek <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Az elmúlt havi projektek összesítése
        </div>
      </CardFooter>
    </Card>
  )
}
