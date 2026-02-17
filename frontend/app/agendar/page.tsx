"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Check,
  Scissors,
  Droplets,
  Sparkles,
  Paintbrush,
  Clock,
  Star,
  MapPin,
  ArrowLeft,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { schedulingAPI } from "@/lib/api"
import { io } from "socket.io-client"

const placeholderImage = "/placeholder.svg"

// Mapa de ícones para serviços
const serviceIconMap: Record<string, any> = {
  "corte": Scissors,
  "Corte": Scissors,
  "barba": Droplets,
  "Barba": Droplets,
  "combo": Sparkles,
  "Combo": Sparkles,
  "pigmentacao": Paintbrush,
  "pigmentação": Paintbrush,
  "Pigmentacao": Paintbrush,
  "Pigmentação": Paintbrush,
}

// Função para atribuir ícone baseado no nome do serviço
function getServiceIcon(serviceName: string): any {
  const lowerName = serviceName.toLowerCase()
  for (const [key, icon] of Object.entries(serviceIconMap)) {
    if (lowerName.includes(key.toLowerCase())) {
      return icon
    }
  }
  return Scissors // ícone padrão
}

interface Service {
  id: string
  name: string
  price: number
  duration: string
  icon?: any
}

interface Barber {
  id: string
  name: string
  role: string
}

interface Barbershop {
  id: string
  name: string
  address?: string
  phone?: string
  services?: Service[]
  barbers?: Barber[]
}

interface SlotsUpdatePayload {
  barbershopId: string
  date: string
  slots: string[]
}

const defaultServices = [
  { id: "corte", name: "Corte Masculino", price: 55, duration: "45 min", icon: Scissors },
  { id: "barba", name: "Barba Completa", price: 40, duration: "30 min", icon: Droplets },
  { id: "combo", name: "Corte + Barba", price: 85, duration: "1h 15min", icon: Sparkles },
  { id: "pigmentacao", name: "Pigmentacao", price: 70, duration: "50 min", icon: Paintbrush },
]

const defaultBarbers = [
  { id: "rafael", name: "Rafael Costa", role: "Master Barber" },
  { id: "lucas", name: "Lucas Almeida", role: "Barber & Stylist" },
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

function formatDateForApi(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function AgendarPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [barbershopsData, setBarbershopsData] = useState<Barbershop[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [selectedBarbershop, setSelectedBarbershop] = useState<Barbershop | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit" | "pix" | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[] | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const selectedDateRef = useRef<Date | null>(null)
  const selectedBarbershopIdRef = useRef<string | null>(null)

  interface AvailableSlotsResponse {
    slots: string[]
  }

  useEffect(() => {
    fetchBarbershops()
  }, [])

  useEffect(() => {
    selectedDateRef.current = selectedDate
  }, [selectedDate])

  useEffect(() => {
    selectedBarbershopIdRef.current = selectedBarbershop?.id ?? null
  }, [selectedBarbershop])

  useEffect(() => {
    if (!selectedBarbershop) return

    const socketUrl = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
      : "http://localhost:3001"

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: {
        barbershopId: selectedBarbershop.id,
        role: "public",
      },
    })

    socket.on("slots:update", (payload: SlotsUpdatePayload) => {
      const currentDate = selectedDateRef.current
      const currentBarbershopId = selectedBarbershopIdRef.current

      if (!currentDate || !currentBarbershopId) return
      if (payload.barbershopId !== currentBarbershopId) return
      if (payload.date !== formatDateForApi(currentDate)) return

      setAvailableSlots(payload.slots ?? [])
      setSlotsLoading(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [selectedBarbershop])

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedBarbershop || !selectedDate) {
        setAvailableSlots(null)
        setSlotsError(null)
        return
      }

      setSlotsLoading(true)
      setSlotsError(null)

      const result = await schedulingAPI.getAvailableSlots(
        selectedBarbershop.id,
        formatDateForApi(selectedDate)
      )

      if (result.error) {
        setAvailableSlots(null)
        setSlotsError(result.error.message)
        toast({
          variant: "destructive",
          title: "Erro ao carregar horários",
          description: result.error.message,
        })
      } else {
        const slotsData = result.data as AvailableSlotsResponse | undefined
        setAvailableSlots(slotsData?.slots ?? [])
      }

      setSlotsLoading(false)
    }

    fetchSlots()
  }, [selectedBarbershop, selectedDate, toast])

  useEffect(() => {
    if (availableSlots && selectedTime && !availableSlots.includes(selectedTime)) {
      setSelectedTime(null)
    }
  }, [availableSlots, selectedTime])

  async function fetchBarbershops() {
    try {
      console.log("🔄 Iniciando fetch de barbearias...")
      const res = await fetch("http://localhost:3001/api/barbershops")
      console.log("📊 Status da resposta:", res.status, res.ok)
      
      if (res.ok) {
        const data = await res.json()
        console.log("✅ Resposta da API completa:", data)
        console.log("📦 Total:", data?.total)
        console.log("🏪 Barbershops array:", data?.barbershops)
        
        // O backend retorna { total, barbershops } ou só um array
        let shops = []
        if (Array.isArray(data)) {
          console.log("📋 Tipo: Array direto")
          shops = data
        } else if (data?.barbershops && Array.isArray(data.barbershops)) {
          console.log("📋 Tipo: Object com barbershops array")
          shops = data.barbershops
        } else if (data?.total && data?.barbershops) {
          console.log("📋 Tipo: Object com total e barbershops")
          shops = data.barbershops
        } else {
          console.warn("⚠️ Estrutura inesperada:", data)
        }
        
        console.log("✅ Barbearias processadas:", shops)
        console.log("🔢 Total de barbearias:", shops.length)
        setBarbershopsData(shops)
        
        if (shops.length === 0) {
          console.warn("⚠️ Nenhuma barbearia encontrada na resposta")
        }
      } else {
        console.error("❌ Erro ao buscar barbearias:", res.status, res.statusText)
        const errorText = await res.text()
        console.error("Detalhes do erro:", errorText)
        setBarbershopsData([])
      }
    } catch (error) {
      console.error("❌ Erro ao conectar à API:", error)
      setBarbershopsData([])
    } finally {
      setLoading(false)
    }
  }

  const days = getDaysOfWeek(weekOffset)
  const isSlotUnavailable = (time: string) =>
    availableSlots ? !availableSlots.includes(time) : false

  const handleSelectBarbershop = (shop: Barbershop) => {
    setSelectedBarbershop(shop)
    setStep(2)
  }

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId)
    setStep(3)
  }

  const handleSelectBarber = (barberId: string) => {
    setSelectedBarber(barberId)
    setStep(4)
  }

  const handleSelectDateTime = () => {
    if (selectedDate && selectedTime) {
      setStep(5)
    }
  }

  const handleConfirm = async () => {
    if (!selectedBarbershop || !selectedService || !selectedBarber || !selectedDate || !selectedTime || !paymentMethod) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Selecione todos os campos antes de confirmar o agendamento.",
      })
      return
    }

    if (submitting) return

    console.log("🔑 Token verificado:", localStorage.getItem('token') ? "✅ Existe" : "❌ Não existe")
    console.log("📋 Dados do agendamento:", {
      barbershop_id: selectedBarbershop.id,
      service_id: selectedService,
      appointment_date: formatDateForApi(selectedDate),
      appointment_time: selectedTime,
    })

    setSubmitting(true)

    const result = await schedulingAPI.createAppointment({
      barbershop_id: selectedBarbershop.id,
      service_id: selectedService,
      appointment_date: formatDateForApi(selectedDate),
      appointment_time: selectedTime,
    })

    setSubmitting(false)

    if (result.error) {
      console.error("❌ Erro na API:", result.error)
      
      if (result.error.status === 401) {
        console.warn("⚠️ Não autenticado - token pode estar inválido")
        toast({
          variant: "destructive",
          title: "Faça login para agendar",
          description: "Entre com sua conta para confirmar o agendamento.",
        })
        return
      }

      if (result.error.status === 409) {
        toast({
          variant: "destructive",
          title: "Horário indisponível",
          description: result.error.message,
        })
        return
      }

      toast({
        variant: "destructive",
        title: "Não foi possível agendar",
        description: result.error.message,
      })
      return
    }

    console.log("✅ Agendamento criado com sucesso!")
    toast({
      title: "Agendamento confirmado",
      description: "Você receberá uma confirmação por WhatsApp em breve.",
    })
    setConfirmed(true)
  }

  const handleReset = () => {
    setStep(1)
    setSelectedBarbershop(null)
    setSelectedService(null)
    setSelectedBarber(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setPaymentMethod(null)
    setConfirmed(false)
    setAvailableSlots(null)
    setSlotsError(null)
    setSlotsLoading(false)
    setSubmitting(false)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  // Step 1: Selecionar Barbearia
  if (step === 1) {
    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Agendar Horário</h1>
            <p className="text-muted-foreground">Passo 1 de 5: Escolha a barbearia</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-secondary/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : barbershopsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhuma barbearia cadastrada no sistema</p>
              <p className="text-xs text-muted-foreground bg-secondary p-4 rounded mb-4 text-left">
                DEBUG - Dados recebidos: {JSON.stringify(barbershopsData, null, 2)}
              </p>
              <Button asChild variant="outline">
                <Link href="/">Voltar para Home</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {barbershopsData.map((shop) => (
                <Card
                  key={shop.id}
                  className="bg-card border-border cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectBarbershop(shop)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{shop.name}</h3>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {shop.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{shop.address}</span>
                        </div>
                      )}
                      {shop.phone && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{shop.phone}</span>
                        </div>
                      )}
                    </div>
                    {shop.services && shop.services.length > 0 && (
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {shop.services.slice(0, 3).map((service) => (
                          <Badge key={service.id} variant="secondary" className="text-xs">
                            {service.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Step 2: Selecionar Serviço
  if (step === 2 && selectedBarbershop) {
    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Selecione o Serviço</h1>
            <p className="text-muted-foreground">Passo 2 de 5 • {selectedBarbershop.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedBarbershop.services || defaultServices).map((service) => {
              const IconComponent = getServiceIcon(service.name)
              return (
                <Card
                  key={service.id}
                  className={cn(
                    "bg-card border-border cursor-pointer hover:border-primary transition-colors",
                    selectedService === service.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleSelectService(service.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{service.name}</h3>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="font-semibold text-primary">R$ {service.price}</span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {service.duration || service.name}
                          </span>
                        </div>
                      </div>
                      {selectedService === service.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Selecionar Barbeiro
  if (step === 3 && selectedBarbershop) {
    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Selecione o Barbeiro</h1>
            <p className="text-muted-foreground">Passo 3 de 5 • {selectedBarbershop.name}</p>
          </div>

          <div className="space-y-3">
            {(selectedBarbershop.barbers || []).map((barber) => (
              <Card
                key={barber.id}
                className={cn(
                  "bg-card border-border cursor-pointer hover:border-primary transition-colors",
                  selectedBarber === barber.id && "border-primary bg-primary/5"
                )}
                onClick={() => handleSelectBarber(barber.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {barber.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{barber.name}</h3>
                      <p className="text-sm text-muted-foreground">{barber.role}</p>
                    </div>
                    {selectedBarber === barber.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Selecionar Data e Horário
  if (step === 4 && selectedBarbershop) {
    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Escolha Data e Horário</h1>
            <p className="text-muted-foreground">Passo 4 de 5 • {selectedBarbershop.name}</p>
          </div>

          <div className="space-y-6">
            {/* Data */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Selecione a Data</h3>
              <div className="flex items-center justify-between gap-2 mb-3">
                <button
                  onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  ←
                </button>
                <span className="text-sm text-muted-foreground">{`${days[0].getDate()} - ${days[6].getDate()} ${monthNames[days[0].getMonth()]}`}</span>
                <button
                  onClick={() => setWeekOffset(weekOffset + 1)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  →
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "p-3 rounded-lg text-center text-sm font-medium transition-colors",
                      selectedDate?.toDateString() === day.toDateString()
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    <div>{dayNames[day.getDay()]}</div>
                    <div>{day.getDate()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Horário */}
            {selectedDate && (
              <div>
                <h3 className="font-medium text-foreground mb-3">Selecione o Horário</h3>
                {slotsLoading && (
                  <p className="text-sm text-muted-foreground mb-2">Carregando horários disponíveis...</p>
                )}
                {!slotsLoading && slotsError && (
                  <p className="text-sm text-destructive mb-2">{slotsError}</p>
                )}
                {!slotsLoading && availableSlots && availableSlots.length === 0 && !slotsError && (
                  <p className="text-sm text-muted-foreground mb-2">Nenhum horário disponível para esta data.</p>
                )}
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => {
                    const disabled = slotsLoading || isSlotUnavailable(time)
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        disabled={disabled}
                        className={cn(
                          "p-2 rounded-lg text-sm font-medium transition-colors",
                          selectedTime === time
                            ? "bg-primary text-primary-foreground"
                            : disabled
                            ? "bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <Button
                onClick={handleSelectDateTime}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continuar para Pagamento
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Step 5: Pagamento
  if (step === 5 && selectedBarbershop && selectedService && selectedBarber && selectedDate && selectedTime) {
    const service = (selectedBarbershop.services || []).find(s => s.id === selectedService)
    const barber = (selectedBarbershop.barbers || []).find(b => b.id === selectedBarber)

    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Confirme seu Agendamento</h1>
            <p className="text-muted-foreground">Passo 5 de 5 • Revisão e Pagamento</p>
          </div>

          <div className="space-y-6">
            {/* Resumo */}
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-3">Resumo do Agendamento</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Barbearia</span>
                      <span className="font-medium text-foreground">{selectedBarbershop.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serviço</span>
                      <span className="font-medium text-foreground">{service?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Barbeiro</span>
                      <span className="font-medium text-foreground">{barber?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data</span>
                      <span className="font-medium text-foreground">
                        {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Horário</span>
                      <span className="font-medium text-foreground">{selectedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">Total</span>
                    <span className="text-2xl font-bold text-primary">R$ {service?.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método de Pagamento */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Método de Pagamento</h3>
              <div className="space-y-2">
                {[
                  { id: "credit", label: "Cartão de Crédito" },
                  { id: "debit", label: "Cartão de Débito" },
                  { id: "pix", label: "PIX" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as "credit" | "debit" | "pix")}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 transition-colors flex items-center gap-3",
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium text-foreground">{method.label}</span>
                    {paymentMethod === method.id && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!paymentMethod || submitting}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? "Confirmando..." : "Confirmar Agendamento"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Confirmação Final
  if (confirmed && selectedBarbershop && selectedService && selectedDate && selectedTime) {
    const service = (selectedBarbershop.services || []).find(s => s.id === selectedService)
    const barber = selectedBarber ? (selectedBarbershop.barbers || []).find(b => b.id === selectedBarber) : null
    
    console.log("🎉 Renderizando tela de confirmação:", {
      confirmed,
      selectedBarbershop: !!selectedBarbershop,
      selectedService,
      selectedBarber,
      selectedDate,
      selectedTime
    });
    
    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-lg flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Agendamento Confirmado!</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Seu agendamento foi realizado com sucesso. Você receberá uma confirmação por WhatsApp em breve.
          </p>

          <Card className="bg-card border-border w-full max-w-sm mb-6">
            <CardContent className="p-6 space-y-3">
              <div className="text-center pb-3 border-b border-border">
                <p className="text-sm text-muted-foreground">{selectedBarbershop.name}</p>
                <p className="font-semibold text-foreground text-lg">{service?.name}</p>
              </div>
              <div className="space-y-2 text-sm">
                {barber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Barbeiro</span>
                    <span className="font-medium">{barber?.name || selectedBarber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-medium">{selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horário</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2 w-full">
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              Novo Agendamento
            </Button>
            <Button
              asChild
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/">Voltar para Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
