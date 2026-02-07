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
import { useState } from "react"
import { cn } from "@/lib/utils"

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
  "17:30", "18:00",
]

const barbers = ["Carlos", "Pedro", "Ricardo"]

const weekDays = [
  { day: "Seg", date: "03", full: "Segunda-feira" },
  { day: "Ter", date: "04", full: "Terca-feira" },
  { day: "Qua", date: "05", full: "Quarta-feira" },
  { day: "Qui", date: "06", full: "Quinta-feira" },
  { day: "Sex", date: "07", full: "Sexta-feira" },
  { day: "Sab", date: "08", full: "Sabado" },
]

interface Appointment {
  id: number
  client: string
  initials: string
  service: string
  time: string
  duration: number
  barber: string
  status: "confirmado" | "pendente" | "cancelado"
  dayIndex: number
}

const appointments: Appointment[] = [
  { id: 1, client: "Rafael Santos", initials: "RS", service: "Corte + Barba", time: "09:00", duration: 60, barber: "Carlos", status: "confirmado", dayIndex: 0 },
  { id: 2, client: "Lucas Oliveira", initials: "LO", service: "Corte Degrade", time: "10:00", duration: 45, barber: "Carlos", status: "confirmado", dayIndex: 0 },
  { id: 3, client: "Marcos Silva", initials: "MS", service: "Barba", time: "09:30", duration: 30, barber: "Pedro", status: "pendente", dayIndex: 0 },
  { id: 4, client: "Andre Costa", initials: "AC", service: "Corte Social", time: "11:00", duration: 45, barber: "Carlos", status: "confirmado", dayIndex: 1 },
  { id: 5, client: "Bruno Ferreira", initials: "BF", service: "Corte + Sobrancelha", time: "14:00", duration: 45, barber: "Pedro", status: "pendente", dayIndex: 1 },
  { id: 6, client: "Diego Mendes", initials: "DM", service: "Corte Degrade", time: "15:00", duration: 45, barber: "Ricardo", status: "confirmado", dayIndex: 2 },
  { id: 7, client: "Felipe Rocha", initials: "FR", service: "Corte + Barba", time: "10:00", duration: 60, barber: "Ricardo", status: "confirmado", dayIndex: 3 },
  { id: 8, client: "Gabriel Lima", initials: "GL", service: "Barba", time: "16:00", duration: 30, barber: "Pedro", status: "pendente", dayIndex: 4 },
  { id: 9, client: "Henrique Alves", initials: "HA", service: "Corte Social", time: "08:00", duration: 45, barber: "Carlos", status: "confirmado", dayIndex: 5 },
]

function getStatusColor(status: string) {
  switch (status) {
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

export default function AgendamentosPage() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedBarber, setSelectedBarber] = useState<string>("todos")

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDay = apt.dayIndex === selectedDay
    const matchesBarber = selectedBarber === "todos" || apt.barber === selectedBarber
    return matchesDay && matchesBarber
  })

  return (
    <>
      <AppHeader title="Agendamentos" description="Gerencie os agendamentos da barbearia" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Actions bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Semana anterior">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-foreground">Fev 03 - 08, 2026</span>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Proxima semana">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                <SelectTrigger className="w-40 bg-secondary border-border text-foreground">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Barbeiro" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="todos">Todos</SelectItem>
                  {barbers.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                      <Label htmlFor="client" className="text-foreground">Cliente</Label>
                      <Input id="client" placeholder="Nome do cliente" className="bg-secondary border-border text-foreground" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="service" className="text-foreground">Servico</Label>
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
                        <Label htmlFor="barber" className="text-foreground">Barbeiro</Label>
                        <Select>
                          <SelectTrigger className="bg-secondary border-border text-foreground">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {barbers.map((b) => (
                              <SelectItem key={b} value={b.toLowerCase()}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="date" className="text-foreground">Data</Label>
                        <Input id="date" type="date" className="bg-secondary border-border text-foreground" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="time" className="text-foreground">Horario</Label>
                        <Select>
                          <SelectTrigger className="bg-secondary border-border text-foreground">
                            <SelectValue placeholder="Horario" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border max-h-60">
                            {timeSlots.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" className="bg-secondary text-secondary-foreground">Cancelar</Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Agendar</Button>
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
                {weekDays[selectedDay].full}, {weekDays[selectedDay].date} de Fevereiro
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
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center justify-center w-14 text-center">
                        <span className="text-sm font-bold text-foreground">{apt.time}</span>
                      </div>
                      <div className="w-0.5 h-10 bg-primary rounded-full" />
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {apt.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{apt.client}</p>
                        <p className="text-xs text-muted-foreground">{apt.service}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2">
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                          {apt.barber}
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
