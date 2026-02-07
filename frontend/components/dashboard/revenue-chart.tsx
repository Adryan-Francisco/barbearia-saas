"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", receita: 8200, servicos: 98 },
  { month: "Fev", receita: 9100, servicos: 112 },
  { month: "Mar", receita: 10500, servicos: 128 },
  { month: "Abr", receita: 9800, servicos: 118 },
  { month: "Mai", receita: 11200, servicos: 135 },
  { month: "Jun", receita: 10800, servicos: 130 },
  { month: "Jul", receita: 12450, servicos: 148 },
]

export function RevenueChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-heading text-foreground">Receita Mensal</CardTitle>
        <CardDescription className="text-muted-foreground">
          Faturamento dos ultimos 7 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            receita: {
              label: "Receita",
              color: "hsl(36, 80%, 50%)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(220, 15%, 18%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(220, 15%, 18%)" }}
                tickLine={false}
                tickFormatter={(value) => `R$${value / 1000}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="receita"
                fill="var(--color-receita)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
