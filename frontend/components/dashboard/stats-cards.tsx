"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Calendar, Users, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Receita Mensal",
    value: "R$ 12.450",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
    description: "vs. mes anterior",
  },
  {
    title: "Agendamentos",
    value: "148",
    change: "+8.2%",
    trend: "up" as const,
    icon: Calendar,
    description: "este mes",
  },
  {
    title: "Clientes Ativos",
    value: "326",
    change: "+4.1%",
    trend: "up" as const,
    icon: Users,
    description: "total cadastrados",
  },
  {
    title: "Ticket Medio",
    value: "R$ 84,12",
    change: "-2.3%",
    trend: "down" as const,
    icon: TrendingUp,
    description: "vs. mes anterior",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
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
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
