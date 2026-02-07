"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Phone, Mail, Calendar } from "lucide-react"
import { useState } from "react"

const clients = [
  {
    id: 1,
    name: "Rafael Santos",
    initials: "RS",
    email: "rafael@email.com",
    phone: "(11) 99123-4567",
    visits: 24,
    lastVisit: "02/02/2026",
    totalSpent: "R$ 2.016",
    status: "ativo" as const,
  },
  {
    id: 2,
    name: "Lucas Oliveira",
    initials: "LO",
    email: "lucas@email.com",
    phone: "(11) 98765-4321",
    visits: 18,
    lastVisit: "01/28/2026",
    totalSpent: "R$ 1.512",
    status: "ativo" as const,
  },
  {
    id: 3,
    name: "Marcos Silva",
    initials: "MS",
    email: "marcos@email.com",
    phone: "(11) 91234-5678",
    visits: 12,
    lastVisit: "01/15/2026",
    totalSpent: "R$ 1.008",
    status: "ativo" as const,
  },
  {
    id: 4,
    name: "Andre Costa",
    initials: "AC",
    email: "andre@email.com",
    phone: "(11) 93456-7890",
    visits: 8,
    lastVisit: "12/20/2025",
    totalSpent: "R$ 672",
    status: "inativo" as const,
  },
  {
    id: 5,
    name: "Bruno Ferreira",
    initials: "BF",
    email: "bruno@email.com",
    phone: "(11) 97890-1234",
    visits: 31,
    lastVisit: "02/05/2026",
    totalSpent: "R$ 2.604",
    status: "ativo" as const,
  },
  {
    id: 6,
    name: "Diego Mendes",
    initials: "DM",
    email: "diego@email.com",
    phone: "(11) 95678-9012",
    visits: 5,
    lastVisit: "11/10/2025",
    totalSpent: "R$ 420",
    status: "inativo" as const,
  },
  {
    id: 7,
    name: "Felipe Rocha",
    initials: "FR",
    email: "felipe@email.com",
    phone: "(11) 92345-6789",
    visits: 15,
    lastVisit: "02/01/2026",
    totalSpent: "R$ 1.260",
    status: "ativo" as const,
  },
  {
    id: 8,
    name: "Gabriel Lima",
    initials: "GL",
    email: "gabriel@email.com",
    phone: "(11) 96789-0123",
    visits: 9,
    lastVisit: "01/22/2026",
    totalSpent: "R$ 756",
    status: "ativo" as const,
  },
]

export default function ClientesPage() {
  const [search, setSearch] = useState("")

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <>
      <AppHeader title="Clientes" description="Gerencie seus clientes e historico" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-heading font-bold text-foreground mt-1">326</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-heading font-bold text-emerald-400 mt-1">289</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Novos este Mes</p>
                <p className="text-2xl font-heading font-bold text-primary mt-1">14</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-heading text-foreground">Novo Cliente</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Cadastre um novo cliente na barbearia.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-foreground">Nome completo</Label>
                    <Input id="name" placeholder="Nome do cliente" className="bg-secondary border-border text-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input id="email" type="email" placeholder="email@exemplo.com" className="bg-secondary border-border text-foreground" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone" className="text-foreground">Telefone</Label>
                      <Input id="phone" placeholder="(11) 99999-9999" className="bg-secondary border-border text-foreground" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary" className="bg-secondary text-secondary-foreground">Cancelar</Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Cadastrar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Clients table */}
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Contato</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Visitas</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Ultima Visita</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Total Gasto</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="border-border hover:bg-secondary/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {client.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {client.email}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {client.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-foreground">{client.visits}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {client.lastVisit}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm font-medium text-foreground">{client.totalSpent}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            client.status === "ativo"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
                              : "bg-secondary text-muted-foreground border-border text-xs"
                          }
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8" aria-label="Opcoes">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem className="text-foreground">Ver perfil</DropdownMenuItem>
                            <DropdownMenuItem className="text-foreground">Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-foreground">Agendar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
