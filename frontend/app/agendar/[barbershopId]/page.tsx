"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Check,
  Scissors,
  Droplets,
  Sparkles,
  Paintbrush,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  Star,
  MapPin,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { schedulingAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Barbershop data (shared with landing)
const placeholderImage = "/placeholder.svg"

const barbershopsData: Record<
  string,
  {
    name: string
    image: string
    rating: number
    reviews: number
    address: string
    hours: string
    specialties: string[]
    services: typeof defaultServices
    barbers: typeof defaultBarbers
  }
> = {
  "corte-fino": {
    name: "Corte Fino Barbearia",
    image: placeholderImage,
    rating: 4.9,
    reviews: 142,
    address: "Rua Augusta, 1200 - Consolacao, SP",
    hours: "Seg-Sab, 9h-20h",
    specialties: ["Cortes Classicos", "Barba"],
    services: [
      { id: "corte", name: "Corte Masculino", price: 55, duration: "45 min", icon: Scissors },
      { id: "barba", name: "Barba Completa", price: 40, duration: "30 min", icon: Droplets },
      { id: "combo", name: "Corte + Barba", price: 85, duration: "1h 15min", icon: Sparkles },
      { id: "pigmentacao", name: "Pigmentacao", price: 70, duration: "50 min", icon: Paintbrush },
    ],
    barbers: [
      { id: "rafael", name: "Rafael Costa", role: "Master Barber", image: placeholderImage, initials: "RC" },
      { id: "lucas", name: "Lucas Almeida", role: "Barber & Stylist", image: placeholderImage, initials: "LA" },
    ],
  },
  "vintage-barber": {
    name: "Vintage Barber Shop",
    image: placeholderImage,
    rating: 4.8,
    reviews: 98,
    address: "Rua Oscar Freire, 300 - Jardins, SP",
    hours: "Seg-Sab, 10h-21h",
    specialties: ["Retro", "Navalha"],
    services: [
      { id: "corte", name: "Corte Classico", price: 60, duration: "50 min", icon: Scissors },
      { id: "barba", name: "Barba Navalha", price: 50, duration: "40 min", icon: Droplets },
      { id: "combo", name: "Corte + Barba", price: 100, duration: "1h 20min", icon: Sparkles },
      { id: "tratamento", name: "Tratamento Capilar", price: 80, duration: "45 min", icon: Paintbrush },
    ],
    barbers: [
      { id: "marcos", name: "Marcos Vintage", role: "Master Barber", image: placeholderImage, initials: "MV" },
      { id: "pedro", name: "Pedro Retro", role: "Senior Barber", image: placeholderImage, initials: "PR" },
    ],
  },
  "studio-hair": {
    name: "Studio Hair Masculino",
    image: placeholderImage,
    rating: 4.7,
    reviews: 76,
    address: "Av. Paulista, 900 - Bela Vista, SP",
    hours: "Seg-Sab, 8h-19h",
    specialties: ["Moderno", "Design"],
    services: [
      { id: "corte", name: "Corte Moderno", price: 50, duration: "40 min", icon: Scissors },
      { id: "barba", name: "Barba Design", price: 35, duration: "25 min", icon: Droplets },
      { id: "combo", name: "Corte + Barba", price: 75, duration: "1h", icon: Sparkles },
      { id: "design", name: "Design Artistico", price: 60, duration: "35 min", icon: Paintbrush },
    ],
    barbers: [
      { id: "thiago", name: "Thiago Studio", role: "Designer", image: placeholderImage, initials: "TS" },
      { id: "felipe", name: "Felipe Moderno", role: "Barber & Stylist", image: placeholderImage, initials: "FM" },
    ],
  },
  "urban-cuts": {
    name: "Urban Cuts",
    image: placeholderImage,
    rating: 4.9,
    reviews: 210,
    address: "Rua da Consolacao, 2500 - Consolacao, SP",
    hours: "Seg-Sab, 10h-22h",
    specialties: ["Fade", "Freestyle"],
    services: [
      { id: "fade", name: "Fade Perfeito", price: 60, duration: "45 min", icon: Scissors },
      { id: "barba", name: "Barba Freestyle", price: 45, duration: "30 min", icon: Droplets },
      { id: "combo", name: "Fade + Barba", price: 95, duration: "1h 10min", icon: Sparkles },
      { id: "freestyle", name: "Desenho Freestyle", price: 80, duration: "40 min", icon: Paintbrush },
    ],
    barbers: [
      { id: "diego", name: "Diego Urban", role: "Fade Specialist", image: placeholderImage, initials: "DU" },
      { id: "bruno", name: "Bruno Cuts", role: "Freestyle Artist", image: placeholderImage, initials: "BC" },
    ],
  },
  "premium-barber": {
    name: "Premium Barber Lounge",
    image: placeholderImage,
    rating: 5.0,
    reviews: 64,
    address: "Rua Haddock Lobo, 800 - Cerqueira Cesar, SP",
    hours: "Seg-Sab, 9h-20h",
    specialties: ["VIP", "Tratamentos"],
    services: [
      { id: "corte-vip", name: "Corte VIP", price: 120, duration: "1h", icon: Scissors },
      { id: "barba-premium", name: "Barba Premium", price: 80, duration: "45 min", icon: Droplets },
      { id: "combo-vip", name: "Experience VIP", price: 180, duration: "1h 30min", icon: Sparkles },
      { id: "tratamento", name: "Tratamento Exclusivo", price: 150, duration: "1h", icon: Paintbrush },
    ],
    barbers: [
      { id: "andre", name: "Andre Premium", role: "Master VIP", image: placeholderImage, initials: "AP" },
      { id: "gabriel", name: "Gabriel Lounge", role: "Specialist", image: placeholderImage, initials: "GL" },
    ],
  },
  "barbearia-do-ze": {
    name: "Barbearia do Ze",
    image: placeholderImage,
    rating: 4.8,
    reviews: 185,
    address: "Rua Teodoro Sampaio, 400 - Pinheiros, SP",
    hours: "Seg-Sab, 8h-18h",
    specialties: ["Tradicional", "Familiar"],
    services: [
      { id: "corte", name: "Corte Tradicional", price: 35, duration: "30 min", icon: Scissors },
      { id: "barba", name: "Barba Classica", price: 25, duration: "20 min", icon: Droplets },
      { id: "combo", name: "Corte + Barba", price: 55, duration: "45 min", icon: Sparkles },
      { id: "infantil", name: "Corte Infantil", price: 30, duration: "25 min", icon: Paintbrush },
    ],
    barbers: [
      { id: "ze", name: "Seu Ze", role: "Fundador", image: placeholderImage, initials: "SZ" },
      { id: "junior", name: "Ze Junior", role: "Barbeiro", image: placeholderImage, initials: "ZJ" },
      { id: "maria", name: "Maria Helena", role: "Barbeira", image: placeholderImage, initials: "MH" },
    ],
  },
}

const defaultServices = [
  { id: "corte", name: "Corte Masculino", price: 55, duration: "45 min", icon: Scissors },
  { id: "barba", name: "Barba Completa", price: 40, duration: "30 min", icon: Droplets },
  { id: "combo", name: "Corte + Barba", price: 85, duration: "1h 15min", icon: Sparkles },
  { id: "pigmentacao", name: "Pigmentacao", price: 70, duration: "50 min", icon: Paintbrush },
]

const defaultBarbers = [
  { id: "rafael", name: "Rafael Costa", role: "Master Barber", image: placeholderImage, initials: "RC" },
  { id: "lucas", name: "Lucas Almeida", role: "Barber & Stylist", image: placeholderImage, initials: "LA" },
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

export default function BarbershopBookingPage({
  params,
}: {
  params: Promise<{ barbershopId: string }>
}) {
  const { barbershopId } = use(params)
  const router = useRouter()
  
  // Estados para dados da barbearia
  const [shop, setShop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para agendamento
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  // Buscar dados da barbearia da API
  useEffect(() => {
    async function fetchBarbershop() {
      try {
        console.log("🔄 Buscando dados da barbearia:", barbershopId)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        // Garantir que a URL tem /api
        const apiUrl = baseUrl.includes('/api') ? baseUrl : `${baseUrl}/api`
        const res = await fetch(`${apiUrl}/barbershops/${barbershopId}`)
        
        if (!res.ok) {
          console.error("❌ Erro ao buscar barbearia:", res.status)
          setError("Barbearia não encontrada")
          setLoading(false)
          return
        }

        const data = await res.json()
        console.log("✅ Dados da barbearia:", data)
        
        // Extrair a barbearia da resposta
        const barbershop = data?.barbershop || data
        
        if (!barbershop || !barbershop.id) {
          setError("Dados inválidos da barbearia")
          setLoading(false)
          return
        }

        // Preparar dados para o componente
        const shopData = {
          id: barbershop.id,
          name: barbershop.name,
          image: "/placeholder.svg",
          rating: barbershop.rating || 4.5,
          reviews: 0,
          address: barbershop.address || "Endereço não informado",
          hours: "Seg-Sab, 9h-20h",
          specialties: ["Cortes", "Barba"],
          services: barbershop.services?.map((s: any) => ({
            id: s.id,
            name: s.name,
            price: s.price || 0,
            duration: `${s.duration} min` || "30 min",
            icon: Scissors,
            description: s.description
          })) || defaultServices,
          barbers: barbershop.barbers?.map((b: any) => ({
            id: b.id,
            name: b.name,
            role: b.role || "Barbeiro",
            image: "/placeholder.svg",
            initials: b.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || "B"
          })) || [
            { id: "1", name: "Barbeiro", role: "Profissional", image: "/placeholder.svg", initials: "B" }
          ]
        }

        setShop(shopData)
        setLoading(false)
      } catch (err) {
        console.error("❌ Erro ao buscar barbearia:", err)
        setError("Erro ao carregar dados da barbearia")
        setLoading(false)
      }
    }

    fetchBarbershop()
  }, [barbershopId])

  const days = getDaysOfWeek(weekOffset)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const unavailableTimes = ["10:00", "14:00", "15:30", "17:00"]

  const services = shop?.services ?? defaultServices
  const barbers = shop?.barbers ?? defaultBarbers

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados da barbearia...</p>
        </div>
      </div>
    )
  }

  if (!shop || error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Barbearia nao encontrada</h1>
          <p className="text-muted-foreground mb-6">A barbearia que voce procura nao existe ou foi removida.</p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/agendar">Ver Barbearias</Link>
          </Button>
        </div>
      </div>
    )
  }

  function handleConfirm() {
    setIsConfirming(true)
    const appointmentDate = selectedDate ? selectedDate.toISOString().split('T')[0] : ""
    
    console.log("📋 Criando agendamento:", {
      barbershop_id: barbershopId,
      service_id: selectedService,
      appointment_date: appointmentDate,
      appointment_time: selectedTime
    });
    
    schedulingAPI.createAppointment({
      barbershop_id: barbershopId,
      service_id: selectedService || "",
      appointment_date: appointmentDate,
      appointment_time: selectedTime || "",
    }).then((result) => {
      setIsConfirming(false)
      if (result.error) {
        console.error("❌ Erro ao agendar:", result.error)
        alert(`Erro: ${result.error.message}`)
      } else {
        console.log("✅ Agendamento criado com sucesso!");
        setConfirmed(true)
      }
    }).catch((error) => {
      setIsConfirming(false)
      console.error("❌ Erro catch ao agendar:", error)
      alert(`Erro ao agendar: ${error}`)
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
    const service = services.find((s: any) => s.id === selectedService)
    const barber = barbers.find((b: any) => b.id === selectedBarber)
    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-lg flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Agendamento Confirmado!</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Seu horario na {shop.name} foi reservado com sucesso.
          </p>
          <Card className="bg-card border-border w-full max-w-sm">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Barbearia</span>
                <span className="text-sm font-medium text-card-foreground">{shop.name}</span>
              </div>
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
          <div className="flex gap-3 mt-6">
            <Button onClick={handleReset} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Novo Agendamento
            </Button>
            <Button variant="outline" asChild className="border-border text-foreground hover:bg-secondary bg-transparent">
              <Link href="/">Voltar ao Inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Barbershop header */}
      <div className="relative">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <Image
            src={shop.image || "/placeholder.svg"}
            alt={shop.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/#barbearias"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              {shop.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm font-semibold text-foreground">{shop.rating}</span>
                <span className="text-sm text-muted-foreground">({shop.reviews} avaliacoes)</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {shop.address}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {shop.hours}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking content */}
      <div className="mx-auto max-w-3xl px-6 py-8">
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
                  step >= s.n ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    step > s.n
                      ? "bg-primary text-primary-foreground"
                      : step === s.n
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
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
            {services.map((service: typeof defaultServices[number]) => (
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
                  <div
                    className={cn(
                      "w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0",
                      selectedService === service.id ? "bg-primary/20" : "bg-primary/10"
                    )}
                  >
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
            <div className={cn("grid grid-cols-1 gap-4", barbers.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
              {barbers.map((barber: typeof defaultBarbers[number]) => (
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
                    onClick={() => {
                      setSelectedDate(day)
                      setSelectedTime(null)
                    }}
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
                      <span className="text-muted-foreground">Barbearia</span>
                      <span className="text-card-foreground font-medium">{shop.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Servico</span>
                      <span className="text-card-foreground font-medium">
                        {services.find((s: typeof defaultServices[number]) => s.id === selectedService)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Barbeiro</span>
                      <span className="text-card-foreground font-medium">
                        {barbers.find((b: typeof defaultBarbers[number]) => b.id === selectedBarber)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data</span>
                      <span className="text-card-foreground font-medium">
                        {selectedDate &&
                          `${dayNames[selectedDate.getDay()]}, ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Horario</span>
                      <span className="text-card-foreground font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border mt-1">
                      <span className="font-semibold text-card-foreground">Total</span>
                      <span className="text-lg font-bold text-primary">
                        R$ {services.find((s: typeof defaultServices[number]) => s.id === selectedService)?.price}
                      </span>
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
    </div>
  )
}
