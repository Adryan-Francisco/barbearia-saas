"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Calendar, Users, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { barbershopAPI } from "@/lib/api"

interface StatsData {
  total_appointments: number
  confirmed: number
  cancelled: number
  today: number
  total_revenue: number
  clients_count?: number
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Primeiro obtém a barbearia do usuário
        const barbershopResult = await barbershopAPI.getMyBarbershop()

        if (barbershopResult.error) return

        const barbershop = barbershopResult.data as any

        // Depois obtém as estatísticas
        const statsResult = await barbershopAPI.getStats(barbershop.id)

        if (!statsResult.error) {
          const data = statsResult.data as any
          setStats(data)
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="h-20 bg-secondary/50 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cardStats = [
    {
      title: "Receita Total",
      value: `R$ ${stats.total_revenue.toFixed(2)}`,
      change: "+0%",
      trend: "up" as const,
      icon: DollarSign,
      description: "de agendamentos confirmados",
    },
    {
      title: "Total Agendamentos",
      value: stats.total_appointments.toString(),
      change: `${stats.confirmed} confirmados`,
      trend: "up" as const,
      icon: Calendar,
      description: "",
    },
    {
      title: "Agendamentos Hoje",
      value: stats.today.toString(),
      change: "+0%",
      trend: "up" as const,
      icon: Users,
      description: "para hoje",
    },
    {
      title: "Cancelados",
      value: stats.cancelled.toString(),
      change: "-0%",
      trend: "down" as const,
      icon: TrendingUp,
      description: "agendamentos",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardStats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                )}
              >
                {stat.trend === "up" ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {stat.change}
              </span>
              {stat.description && (
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
