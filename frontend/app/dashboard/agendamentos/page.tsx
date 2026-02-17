"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Clock, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
  "17:30", "18:00",
]

interface Appointment {
  id: string
  client_name: string
  client_phone: string
  service_name: string
  service_price: number
  appointment_date: string
  appointment_time: string
  status: string
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "confirmado":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    case "pendente":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20"
    case "cancelado":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    default:
      return ""
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getWeekDays(startDate: Date) {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]
    const fullNames = [
      "Segunda-feira",
      "Terca-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sabado",
      "Domingo",
    ]
    days.push({
      day: dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1],
      date: String(date.getDate()).padStart(2, "0"),
      full: fullNames[date.getDay() === 0 ? 6 : date.getDay() - 1],
      dateObj: new Date(date),
    })
  }
  return days
}

export default function AgendamentosPage() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [weekDays, setWeekDays] = useState<any[]>([])
  const [startDate, setStartDate] = useState(new Date())

  useEffect(() => {
    setWeekDays(getWeekDays(startDate))
  }, [startDate])

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("Token não encontrado")
        setLoading(false)
        return
      }

      // Get barbershop
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
      const barbershopRes = await fetch(`${apiUrl}/barbershops/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!barbershopRes.ok) {
        throw new Error("Erro ao buscar barbearia")
      }
      
      const barbershopData = await barbershopRes.json()
      const barbershop = barbershopData?.barbershop

      if (!barbershop?.id) {
        console.warn("Barbearia não encontrada")
        setLoading(false)
        return
      }

      // Get appointments
      const appointmentsRes = await fetch(
        `/api/barbershops/${barbershop.id}/appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (!appointmentsRes.ok) {
        throw new Error("Erro ao buscar agendamentos")
      }
      
      const data = await appointmentsRes.json()
      setAppointments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointment_date)
    const selectedDate = weekDays[selectedDay]?.dateObj
    return selectedDate && aptDate.toDateString() === selectedDate.toDateString()
  })

  if (loading) {
    return (
      <>
        <AppHeader title="Agendamentos" description="Gerencie os agendamentos da barbearia" />
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-secondary rounded" />
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-24 bg-secondary rounded" />
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader title="Agendamentos" description="Gerencie os agendamentos da barbearia" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Navigation bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setStartDate(new Date(startDate.setDate(startDate.getDate() - 7)))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-foreground min-w-fit">
                {startDate.toLocaleDateString("pt-BR")} - {new Date(new Date(startDate).setDate(startDate.getDate() + 6)).toLocaleDateString("pt-BR")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setStartDate(new Date(startDate.setDate(startDate.getDate() + 7)))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border text-foreground">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-foreground">Novo Agendamento</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Preencha os dados para criar um novo agendamento.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="client" className="text-foreground">
                        Cliente
                      </Label>
                      <Input
                        id="client"
                        placeholder="Nome do cliente"
                        className="bg-secondary border-border text-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="service" className="text-foreground">
                          Servico
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-secondary border-border text-foreground">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="corte-degrade">Corte Degrade</SelectItem>
                            <SelectItem value="corte-barba">Corte + Barba</SelectItem>
                            <SelectItem value="barba">Barba</SelectItem>
                            <SelectItem value="corte-social">Corte Social</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="date" className="text-foreground">
                          Data
                        </Label>
                        <Input id="date" type="date" className="bg-secondary border-border text-foreground" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="time" className="text-foreground">
                        Horario
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-secondary border-border text-foreground">
                          <SelectValue placeholder="Horario" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border max-h-60">
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" className="bg-secondary text-secondary-foreground">
                      Cancelar
                    </Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Agendar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Week day tabs */}
          <div className="flex gap-2">
            {weekDays.map((wd, idx) => (
              <button
                key={wd.day}
                onClick={() => setSelectedDay(idx)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1",
                  selectedDay === idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                <span className="text-xs">{wd.day}</span>
                <span className="text-lg font-bold">{wd.date}</span>
              </button>
            ))}
          </div>

          {/* Appointments list */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-foreground">
                {weekDays[selectedDay]?.full}, {weekDays[selectedDay]?.date}
              </CardTitle>
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                {filteredAppointments.length} agendamentos
              </Badge>
            </CardHeader>
            <CardContent>
              {filteredAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Clock className="w-10 h-10 mb-3 opacity-50" />
                  <p className="text-sm">Nenhum agendamento para este dia</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredAppointments
                    .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center justify-center w-14 text-center">
                          <span className="text-sm font-bold text-foreground">{apt.appointment_time}</span>
                        </div>
                        <div className="w-0.5 h-10 bg-primary rounded-full" />
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {getInitials(apt.client_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{apt.client_name}</p>
                          <p className="text-xs text-muted-foreground">{apt.service_name}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                            R$ {apt.service_price}
                          </Badge>
                        </div>
                        <Badge className={cn("text-[10px] px-2", getStatusColor(apt.status))}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
