"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { barbershopAPI } from "@/lib/api"

interface Appointment {
  id: string
  client_name: string
  client_phone: string
  service_name: string
  appointment_time: string
  status: string
}

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [barbershopName, setBarbershopName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Primeiro obtém a barbearia do usuário
        const barbershopResult = await barbershopAPI.getMyBarbershop()

        if (barbershopResult.error) return

        const barbershopData = barbershopResult.data as any
        const barbershop = barbershopData?.barbershop || barbershopData
        setBarbershopName(barbershop?.name || '')

        if (!barbershop?.id) return

        // Depois obtém os agendamentos
        const today = new Date().toISOString().split('T')[0]
        const appointmentsResult = await barbershopAPI.getAppointmentsByDate(barbershop.id, today)

        if (!appointmentsResult.error) {
          const data = appointmentsResult.data as any
          setAppointments(data?.appointments || [])
        }
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          {barbershopName && <p className="text-xs text-muted-foreground mb-1">{barbershopName}</p>}
          <CardTitle className="font-heading text-foreground">Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-secondary/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          {barbershopName && <p className="text-xs text-muted-foreground mb-1">{barbershopName}</p>}
          <CardTitle className="font-heading text-foreground">Próximos Agendamentos</CardTitle>
        </div>
        <span className="text-sm text-muted-foreground">Hoje</span>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum agendamento para hoje</p>
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((apt) => {
              const initials = apt.client_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()

              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {apt.client_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{apt.service_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {apt.appointment_time}
                    </div>
                    <Badge
                      variant={apt.status === 'confirmed' ? 'default' : 'secondary'}
                      className={
                        apt.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-1.5'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] px-1.5'
                      }
                    >
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
