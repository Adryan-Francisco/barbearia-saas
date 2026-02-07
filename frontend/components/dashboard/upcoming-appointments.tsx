"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const appointments = [
  {
    id: 1,
    client: "Rafael Santos",
    initials: "RS",
    service: "Corte + Barba",
    time: "09:00",
    barber: "Carlos",
    status: "confirmado" as const,
  },
  {
    id: 2,
    client: "Lucas Oliveira",
    initials: "LO",
    service: "Corte Degrade",
    time: "09:45",
    barber: "Carlos",
    status: "confirmado" as const,
  },
  {
    id: 3,
    client: "Marcos Silva",
    initials: "MS",
    service: "Barba",
    time: "10:30",
    barber: "Pedro",
    status: "pendente" as const,
  },
  {
    id: 4,
    client: "Andre Costa",
    initials: "AC",
    service: "Corte Social",
    time: "11:00",
    barber: "Carlos",
    status: "confirmado" as const,
  },
  {
    id: 5,
    client: "Bruno Ferreira",
    initials: "BF",
    service: "Corte + Sobrancelha",
    time: "11:30",
    barber: "Pedro",
    status: "pendente" as const,
  },
]

export function UpcomingAppointments() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-foreground">Proximos Agendamentos</CardTitle>
        <span className="text-sm text-muted-foreground">Hoje</span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {apt.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{apt.client}</p>
                <p className="text-xs text-muted-foreground">{apt.service} - {apt.barber}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {apt.time}
                </div>
                <Badge
                  variant={apt.status === "confirmado" ? "default" : "secondary"}
                  className={
                    apt.status === "confirmado"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-1.5"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] px-1.5"
                  }
                >
                  {apt.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
