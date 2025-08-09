"use client"

import { Pie, PieChart } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export const description = "A pie chart showing grade distribution in class"

const gradeData = [
  { grade: "5", count: 8, fill: "var(--color-grade5)" },
  { grade: "4", count: 12, fill: "var(--color-grade4)" },
  { grade: "3", count: 6, fill: "var(--color-grade3)" },
  { grade: "2", count: 2, fill: "var(--color-grade2)" },
  { grade: "1", count: 1, fill: "var(--color-grade1)" },
]

const chartConfig = {
  count: {
    label: "Diákok száma",
  },
  grade5: {
    label: "Jeles (5)",
    theme: {
      light: "hsl(142 76% 36%)", // Green for excellent
      dark: "hsl(142 76% 46%)",
    },
  },
  grade4: {
    label: "Jó (4)",
    theme: {
      light: "hsl(197 92% 40%)", // Blue for good  
      dark: "hsl(197 92% 50%)",
    },
  },
  grade3: {
    label: "Közepes (3)",
    theme: {
      light: "hsl(38 92% 50%)", // Orange for average
      dark: "hsl(38 92% 60%)",
    },
  },
  grade2: {
    label: "Elégséges (2)",
    theme: {
      light: "hsl(25 95% 53%)", // Orange-red for sufficient
      dark: "hsl(25 95% 63%)",
    },
  },
  grade1: {
    label: "Elégtelen (1)",
    theme: {
      light: "hsl(0 84% 60%)", // Red for failing
      dark: "hsl(0 84% 70%)",
    },
  },
} satisfies ChartConfig

export function ChartGradeDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jegy eloszlás</CardTitle>
        <CardDescription>Az osztály jegyeinek megoszlása az aktuális félévben</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="grade" hideLabel />}
            />
            <Pie
              data={gradeData}
              dataKey="count"
              nameKey="grade"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="grade" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
