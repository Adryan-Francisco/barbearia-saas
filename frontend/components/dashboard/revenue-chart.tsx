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
import { useEffect, useState } from "react"
import { barbershopAPI } from "@/lib/api"

interface RevenueData {
  total_revenue: number
  confirmed: number
}

export function RevenueChart() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Primeiro obtém a barbearia do usuário
        const barbershopResult = await barbershopAPI.getMyBarbershop()

        if (barbershopResult.error) return

        const barbershopData = barbershopResult.data as any
        const barbershop = barbershopData?.barbershop || barbershopData

        if (!barbershop?.id) return

        // Depois obtém as estatísticas
        const statsResult = await barbershopAPI.getStats(barbershop.id)

        if (!statsResult.error) {
          const data = statsResult.data as any
          setRevenue(data)
        }
      } catch (error) {
        console.error('Erro ao buscar receita:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRevenue()
  }, [])

  const revenueData = [
    { month: "Receita Atual", receita: revenue?.total_revenue || 0, servicos: revenue?.confirmed || 0 },
  ]

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-foreground">Receita</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-secondary/50 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-heading text-foreground">Receita</CardTitle>
        <CardDescription className="text-muted-foreground">
          {revenue?.confirmed || 0} agendamentos confirmados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">
            R$ {(revenue?.total_revenue || 0).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            Receita total de agendamentos confirmados
          </p>
        </div>
        <ChartContainer
          config={{
            receita: {
              label: "Receita",
              color: "hsl(36, 80%, 50%)",
            },
          }}
          className="h-[300px] mt-6"
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
