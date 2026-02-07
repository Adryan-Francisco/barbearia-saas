"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const services = [
  { name: "Corte Degrade", count: 52, percentage: 100 },
  { name: "Corte + Barba", count: 38, percentage: 73 },
  { name: "Barba", count: 28, percentage: 54 },
  { name: "Corte Social", count: 18, percentage: 35 },
  { name: "Sobrancelha", count: 12, percentage: 23 },
]

export function TopServices() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-heading text-foreground">Servicos Mais Populares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {services.map((service) => (
            <div key={service.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{service.name}</span>
                <span className="text-muted-foreground">{service.count} atendimentos</span>
              </div>
              <Progress
                value={service.percentage}
                className="h-2 bg-secondary [&>div]:bg-primary"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
