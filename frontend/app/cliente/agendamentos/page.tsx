"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar, Clock, Scissors, User, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { schedulingAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: string
  service: string
  barber: string
  date: string
  time: string
  price: number
  status: "confirmado" | "concluido" | "cancelado"
}

const appointments: Appointment[] = [
  { id: "1", service: "Corte + Barba", barber: "Rafael Costa", date: "12 Fev 2026", time: "10:00", price: 85, status: "confirmado" },
  { id: "2", service: "Corte Masculino", barber: "Lucas Almeida", date: "15 Fev 2026", time: "14:30", price: 55, status: "confirmado" },
  { id: "3", service: "Barba Completa", barber: "Rafael Costa", date: "28 Jan 2026", time: "16:00", price: 40, status: "concluido" },
  { id: "4", service: "Corte Masculino", barber: "Carlos Henrique", date: "15 Jan 2026", time: "11:00", price: 55, status: "concluido" },
  { id: "5", service: "Pigmentacao", barber: "Carlos Henrique", date: "02 Jan 2026", time: "09:30", price: 70, status: "concluido" },
  { id: "6", service: "Corte + Barba", barber: "Lucas Almeida", date: "20 Dez 2025", time: "15:00", price: 85, status: "cancelado" },
]

const statusConfig = {
  confirmado: { label: "Confirmado", className: "bg-primary/10 text-primary border-primary/20" },
  concluido: { label: "Concluido", className: "bg-secondary text-secondary-foreground border-border" },
  cancelado: { label: "Cancelado", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

function AppointmentCard({ appointment, onCancel }: { appointment: Appointment; onCancel?: (id: string) => void }) {
  const status = statusConfig[appointment.status]

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-card-foreground">{appointment.service}</h3>
              <Badge variant="outline" className={cn("text-xs", status.className)}>
                {status.label}
              </Badge>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-3.5 h-3.5 text-primary" />
                {appointment.barber}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {appointment.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {appointment.time}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <span className="text-lg font-bold text-primary">R$ {appointment.price}</span>
            {appointment.status === "confirmado" && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-7"
                onClick={() => onCancel(appointment.id)}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClientAppointmentsPage() {
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadAppointments()
  }, [])

  async function loadAppointments() {
    setIsLoading(true)
    const result = await schedulingAPI.getAppointments()
    
    if (result.error) {
      toast({
        title: "Erro ao carregar agendamentos",
        description: result.error.message,
        variant: "destructive",
      })
    } else if (result.data) {
      setLocalAppointments(result.data)
    }
    
    setIsLoading(false)
  }

  const upcoming = localAppointments.filter(a => a.status === "confirmado")
  const past = localAppointments.filter(a => a.status === "concluido")
  const cancelled = localAppointments.filter(a => a.status === "cancelado")

  function handleCancel() {
    if (cancelId) {
      const appointmentToCancel = localAppointments.find(a => a.id === cancelId)
      
      schedulingAPI.cancelAppointment(cancelId).then((result) => {
        if (result.error) {
          toast({
            title: "Erro ao cancelar",
            description: result.error.message,
            variant: "destructive",
          })
        } else {
          setLocalAppointments(prev =>
            prev.map(a => a.id === cancelId ? { ...a, status: "cancelado" as const } : a)
          )
          
          toast({
            title: "Cancelado com sucesso",
            description: `Agendamento de ${appointmentToCancel?.service} foi cancelado`,
          })
        }
        setCancelId(null)
      })
    }
  }

  const cancelAppointment = cancelId ? localAppointments.find(a => a.id === cancelId) : null

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Meus Agendamentos</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe seus agendamentos futuros e historico</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{upcoming.length}</p>
              <p className="text-xs text-muted-foreground">Proximos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Scissors className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{past.length}</p>
              <p className="text-xs text-muted-foreground">Concluidos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                R$ {localAppointments.filter(a => a.status === "concluido").reduce((sum, a) => sum + a.price, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total gasto</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proximos">
        <TabsList className="bg-secondary border border-border mb-6">
          <TabsTrigger value="proximos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Proximos ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="historico" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Historico ({past.length})
          </TabsTrigger>
          <TabsTrigger value="cancelados" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Cancelados ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proximos" className="flex flex-col gap-3">
          {upcoming.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum agendamento futuro</p>
                <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href="/cliente">Agendar agora</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcoming.map(a => <AppointmentCard key={a.id} appointment={a} onCancel={setCancelId} />)
          )}
        </TabsContent>

        <TabsContent value="historico" className="flex flex-col gap-3">
          {past.map(a => <AppointmentCard key={a.id} appointment={a} />)}
        </TabsContent>

        <TabsContent value="cancelados" className="flex flex-col gap-3">
          {cancelled.map(a => <AppointmentCard key={a.id} appointment={a} />)}
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <DialogContent className="bg-card border-border text-card-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-card-foreground">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Cancelar agendamento
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Tem certeza que deseja cancelar o agendamento de{" "}
              <strong className="text-card-foreground">{cancelAppointment?.service}</strong> no dia{" "}
              <strong className="text-card-foreground">{cancelAppointment?.date}</strong> as{" "}
              <strong className="text-card-foreground">{cancelAppointment?.time}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setCancelId(null)} className="text-muted-foreground">
              Manter
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
