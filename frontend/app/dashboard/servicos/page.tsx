"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Clock, DollarSign, Scissors, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Corte":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "Barba":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20"
    case "Combo":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    case "Acabamento":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
    case "Tratamento":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20"
    default:
      return "bg-secondary text-muted-foreground"
  }
}

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("Token não encontrado")
        setLoading(false)
        return
      }

      // Get barbershop
      const barbershopRes = await fetch("/api/barbershops/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!barbershopRes.ok) {
        throw new Error("Erro ao buscar barbearia")
      }
      
      const barbershop = await barbershopRes.json()

      if (!barbershop?.id) {
        console.warn("Barbearia não encontrada")
        setLoading(false)
        return
      }

      // Get services
      const servicesRes = await fetch(`/api/barbershops/${barbershop.id}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!servicesRes.ok) {
        throw new Error("Erro ao buscar serviços")
      }
      
      const data = await servicesRes.json()
      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao buscar serviços:", error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <AppHeader title="Servicos" description="Gerencie os servicos oferecidos" />
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-pulse">
            <div className="h-12 bg-secondary rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-secondary rounded" />
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <AppHeader title="Servicos" description="Gerencie os servicos oferecidos" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                {services.length} serviços
              </Badge>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Servico
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-heading text-foreground">Novo Servico</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Adicione um novo servico ao catalogo da barbearia.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Nome do servico</Label>
                    <Input
                      placeholder="Ex: Corte Degrade"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Descricao</Label>
                    <Input
                      placeholder="Descricao breve do servico"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground">Preco</Label>
                      <Input placeholder="R$ 0,00" className="bg-secondary border-border text-foreground" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground">Duracao (min)</Label>
                      <Input type="number" placeholder="45" className="bg-secondary border-border text-foreground" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary" className="bg-secondary text-secondary-foreground">
                    Cancelar
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Services grid */}
          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Scissors className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm">Nenhum serviço cadastrado</p>
              <p className="text-xs">Crie seu primeiro serviço para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.id} className="bg-card border-border transition-colors hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          <Scissors className="w-3 h-3 mr-1" />
                          Servico
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                            aria-label="Opcoes do servico"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem className="text-foreground">Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground">Duplicar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="text-base font-heading font-semibold text-foreground mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-sm font-bold text-primary">
                          <DollarSign className="w-4 h-4" />
                          R$ {service.price.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {service.duration} min
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
