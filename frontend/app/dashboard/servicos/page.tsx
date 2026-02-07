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

interface Service {
  id: number
  name: string
  description: string
  price: string
  duration: string
  category: string
  active: boolean
  popular: boolean
}

const services: Service[] = [
  {
    id: 1,
    name: "Corte Degrade",
    description: "Corte masculino com degrade nas laterais e nuca",
    price: "R$ 45,00",
    duration: "45 min",
    category: "Corte",
    active: true,
    popular: true,
  },
  {
    id: 2,
    name: "Corte + Barba",
    description: "Combo de corte de cabelo com aparacao e design de barba",
    price: "R$ 70,00",
    duration: "60 min",
    category: "Combo",
    active: true,
    popular: true,
  },
  {
    id: 3,
    name: "Barba",
    description: "Aparacao e design de barba com toalha quente",
    price: "R$ 35,00",
    duration: "30 min",
    category: "Barba",
    active: true,
    popular: false,
  },
  {
    id: 4,
    name: "Corte Social",
    description: "Corte classico social masculino com tesoura",
    price: "R$ 50,00",
    duration: "45 min",
    category: "Corte",
    active: true,
    popular: false,
  },
  {
    id: 5,
    name: "Sobrancelha",
    description: "Design e aparacao de sobrancelha masculina",
    price: "R$ 15,00",
    duration: "15 min",
    category: "Acabamento",
    active: true,
    popular: false,
  },
  {
    id: 6,
    name: "Corte Infantil",
    description: "Corte de cabelo para criancas ate 12 anos",
    price: "R$ 35,00",
    duration: "30 min",
    category: "Corte",
    active: true,
    popular: false,
  },
  {
    id: 7,
    name: "Pigmentacao de Barba",
    description: "Pigmentacao temporaria para preencher falhas na barba",
    price: "R$ 80,00",
    duration: "45 min",
    category: "Tratamento",
    active: true,
    popular: false,
  },
  {
    id: 8,
    name: "Relaxamento Capilar",
    description: "Tratamento para alisar e relaxar os fios",
    price: "R$ 120,00",
    duration: "90 min",
    category: "Tratamento",
    active: false,
    popular: false,
  },
]

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
  return (
    <>
      <AppHeader title="Servicos" description="Gerencie os servicos oferecidos" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                {services.filter((s) => s.active).length} ativos
              </Badge>
              <Badge variant="secondary" className="bg-secondary text-muted-foreground">
                {services.filter((s) => !s.active).length} inativos
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
                    <Input placeholder="Ex: Corte Degrade" className="bg-secondary border-border text-foreground" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Descricao</Label>
                    <Input placeholder="Descricao breve do servico" className="bg-secondary border-border text-foreground" />
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
                  <Button variant="secondary" className="bg-secondary text-secondary-foreground">Cancelar</Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className={cn(
                  "bg-card border-border transition-colors hover:border-primary/30",
                  !service.active && "opacity-60"
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getCategoryColor(service.category))}>
                        {service.category}
                      </Badge>
                      {service.popular && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8" aria-label="Opcoes do servico">
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
                        {service.price}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {service.duration}
                      </span>
                    </div>
                    <Switch
                      checked={service.active}
                      className="data-[state=checked]:bg-primary"
                      aria-label={`${service.active ? "Desativar" : "Ativar"} ${service.name}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
