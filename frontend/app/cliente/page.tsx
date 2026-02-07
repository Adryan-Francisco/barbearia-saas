"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Scissors, Droplets, Sparkles, Paintbrush, ChevronLeft, ChevronRight, Clock, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { schedulingAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const services = [
  { id: "corte", name: "Corte Masculino", price: 55, duration: "45 min", icon: Scissors },
  { id: "barba", name: "Barba Completa", price: 40, duration: "30 min", icon: Droplets },
  { id: "combo", name: "Corte + Barba", price: 85, duration: "1h 15min", icon: Sparkles },
  { id: "pigmentacao", name: "Pigmentacao", price: 70, duration: "50 min", icon: Paintbrush },
]

const barbers = [
  { id: "rafael", name: "Rafael Costa", role: "Master Barber", image: "/placeholder.svg", initials: "RC" },
  { id: "lucas", name: "Lucas Almeida", role: "Barber & Stylist", image: "/placeholder.svg", initials: "LA" },
  { id: "carlos", name: "Carlos Henrique", role: "Senior Barber", image: "/placeholder.svg", initials: "CH" },
]
const team = [
  { id: "rafael", name: "Rafael Costa", role: "Master Barber", image: "/placeholder.svg", initials: "RC" },
  { id: "lucas", name: "Lucas Almeida", role: "Barber & Stylist", image: "/placeholder.svg", initials: "LA" },
  { id: "carlos", name: "Carlos Henrique", role: "Senior Barber", image: "/placeholder.svg", initials: "CH" },
]

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
]

function getDaysOfWeek(offset: number) {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() + offset)
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

export default function ClientBookingPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const { toast } = useToast()

  const days = getDaysOfWeek(weekOffset)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Simulate some unavailable times
  const unavailableTimes = ["10:00", "14:00", "15:30", "17:00"]

  function handleConfirm() {
    setIsConfirming(true)
    const appointmentDate = selectedDate ? selectedDate.toISOString().split('T')[0] : ""
    
    schedulingAPI.createAppointment({
      barbershopId: "default",
      serviceId: selectedService || "",
      barberId: selectedBarber || "",
      date: appointmentDate,
      time: selectedTime || "",
    }).then((result) => {
      setIsConfirming(false)
      if (result.error) {
        toast({
          title: "Erro ao agendar",
          description: result.error.message,
          variant: "destructive",
        })
      } else {
        setConfirmed(true)
      }
    }).catch((error) => {
      setIsConfirming(false)
      toast({
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao processar seu agendamento",
        variant: "destructive",
      })
    })
  }

  function handleReset() {
    setStep(1)
    setSelectedService(null)
    setSelectedBarber(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setConfirmed(false)
  }

  if (confirmed) {
    const service = services.find(s => s.id === selectedService)
    const barber = barbers.find(b => b.id === selectedBarber)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Agendamento Confirmado!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Seu horario foi reservado com sucesso. Voce recebera um lembrete por e-mail.
        </p>
        <Card className="bg-card border-border w-full max-w-sm">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Servico</span>
              <span className="text-sm font-medium text-card-foreground">{service?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Barbeiro</span>
              <span className="text-sm font-medium text-card-foreground">{barber?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data</span>
              <span className="text-sm font-medium text-card-foreground">
                {selectedDate && `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Horario</span>
              <span className="text-sm font-medium text-card-foreground">{selectedTime}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-semibold text-card-foreground">Total</span>
              <span className="text-lg font-bold text-primary">R$ {service?.price}</span>
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleReset} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
          Novo Agendamento
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Agendar Horario</h1>
        <p className="text-sm text-muted-foreground mt-1">Escolha o servico, barbeiro e horario desejado</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: "Servico" },
          { n: 2, label: "Barbeiro" },
          { n: 3, label: "Horario" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (s.n < step) setStep(s.n)
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                step >= s.n
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              <span className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                step > s.n ? "bg-primary text-primary-foreground" : step === s.n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {step > s.n ? <Check className="w-3.5 h-3.5" /> : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < 2 && <div className={cn("w-8 h-px", step > s.n ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      {/* Step 1: Service */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className={cn(
                "cursor-pointer transition-all border",
                selectedService === service.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40"
              )}
              onClick={() => setSelectedService(service.id)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className={cn(
                  "w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0",
                  selectedService === service.id ? "bg-primary/20" : "bg-primary/10"
                )}>
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-card-foreground">{service.name}</h3>
                    {selectedService === service.id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-lg font-bold text-primary">R$ {service.price}</span>
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.duration}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="col-span-full flex justify-end mt-4">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              disabled={!selectedService}
              onClick={() => setStep(2)}
            >
              Proximo
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Barber */}
      {step === 2 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {barbers.map((barber) => (
              <Card
                key={barber.id}
                className={cn(
                  "cursor-pointer transition-all border text-center",
                  selectedBarber === barber.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                )}
                onClick={() => setSelectedBarber(barber.id)}
              >
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={barber.image || "/placeholder.svg"} alt={barber.name} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-lg">
                        {barber.initials}
                      </AvatarFallback>
                    </Avatar>
                    {selectedBarber === barber.id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{barber.name}</h3>
                    <p className="text-xs text-primary mt-0.5">{barber.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              disabled={!selectedBarber}
              onClick={() => setStep(3)}
            >
              Proximo
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <div>
          {/* Week selector */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 7))}
              disabled={weekOffset === 0}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <CalendarDays className="w-4 h-4 text-primary" />
              {monthNames[days[0].getMonth()]} {days[0].getFullYear()}
            </div>
            <button
              onClick={() => setWeekOffset(weekOffset + 7)}
              disabled={weekOffset >= 21}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              aria-label="Proxima semana"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {days.map((day) => {
              const isPast = day < today
              const isSelected = selectedDate?.toDateString() === day.toDateString()
              const isSunday = day.getDay() === 0
              const disabled = isPast || isSunday

              return (
                <button
                  key={day.toISOString()}
                  disabled={disabled}
                  onClick={() => { setSelectedDate(day); setSelectedTime(null) }}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 rounded-lg text-sm transition-colors",
                    disabled
                      ? "opacity-30 cursor-not-allowed"
                      : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border hover:border-primary/40 text-card-foreground"
                  )}
                >
                  <span className="text-xs font-medium">{dayNames[day.getDay()]}</span>
                  <span className="text-lg font-bold">{day.getDate()}</span>
                </button>
              )
            })}
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Horarios disponiveis</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {timeSlots.map((time) => {
                  const isUnavailable = unavailableTimes.includes(time)
                  const isSelected = selectedTime === time

                  return (
                    <button
                      key={time}
                      disabled={isUnavailable}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isUnavailable
                          ? "bg-secondary/50 text-muted-foreground/40 cursor-not-allowed line-through"
                          : isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border text-card-foreground hover:border-primary/40"
                      )}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Summary & Confirm */}
          {selectedTime && (
            <Card className="bg-card border-primary/20 mt-6">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-card-foreground mb-3">Resumo do agendamento</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Servico</span>
                    <span className="text-card-foreground font-medium">{services.find(s => s.id === selectedService)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Barbeiro</span>
                    <span className="text-card-foreground font-medium">{barbers.find(b => b.id === selectedBarber)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data</span>
                    <span className="text-card-foreground font-medium">{selectedDate && `${dayNames[selectedDate.getDay()]}, ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horario</span>
                    <span className="text-card-foreground font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border mt-1">
                    <span className="font-semibold text-card-foreground">Total</span>
                    <span className="text-lg font-bold text-primary">R$ {services.find(s => s.id === selectedService)?.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              disabled={!selectedTime || isConfirming}
              onClick={handleConfirm}
            >
              {isConfirming ? "Confirmando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
