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
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { barbershopAPI } from "@/lib/api"
import { useUserRole } from "@/hooks/use-user-role"

interface Client {
  id: string
  client_name: string
  client_phone: string
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  total_spent: number
  last_appointment_date: string
}

/**
 * Extrai as iniciais do nome do cliente para exibir no avatar
 * Exemplo: "João Silva" -> "JS"
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function ClientesPage() {
  const router = useRouter()
  // Hook que verifica o rol do usuário e oferece funções auxiliares
  const { isClient, isLoading: roleLoading } = useUserRole()
  
  const [search, setSearch] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
  })

  // Redireciona clientes para página de agendamentos
  useEffect(() => {
    if (roleLoading) return

    if (isClient) {
      router.push('/agendar')
      return
    }
  }, [isClient, roleLoading, router])

  useEffect(() => {
    fetchClients()
  }, [])

  /**
   * Busca os clientes da barbearia
   * 1. Obtém dados da barbearia do usuário autenticado
   * 2. Usa o ID da barbearia para buscar clientes
   */
  async function fetchClients() {
    try {
      setLoading(true)
      
      // Busca dados da barbearia do usuário autenticado
      const barbershopResult = await barbershopAPI.getMyBarbershop()
      
      if (barbershopResult.error) {
        console.warn("Erro ao buscar barbearia")
        setLoading(false)
        return
      }
      
      const barbershopData = barbershopResult.data as any
      const barbershop = barbershopData?.barbershop

      if (!barbershop?.id) {
        console.warn("Barbearia não encontrada")
        setLoading(false)
        return
      }

      // Get clients - ao invés de fetch direto, precisamos fazer requisição customizada
      // pois a API não tem função específica em barbershopAPI
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const clientsRes = await fetch(`${apiUrl}/analytics/${barbershop.id}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!clientsRes.ok) {
        throw new Error("Erro ao buscar clientes")
      }
      
      const data = await clientsRes.json()

      const clientsArray = data.clients || []
      setClients(clientsArray)

      // Calculate stats
      const now = new Date()
      const thisMonth = clientsArray.filter((c: Client) => {
        if (!c.last_appointment_date) return false
        const lastVisit = new Date(c.last_appointment_date)
        return !isNaN(lastVisit.getTime()) && lastVisit.getMonth() === now.getMonth() && lastVisit.getFullYear() === now.getFullYear()
      }).length

      setStats({
        total: clientsArray.length,
        active: clientsArray.filter((c: Client) => c.total_appointments > 0).length,
        newThisMonth: thisMonth,
      })
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter((c) =>
    c.client_name.toLowerCase().includes(search.toLowerCase()) ||
    c.client_phone.includes(search)
  )

  if (loading) {
    return (
      <>
        <AppHeader title="Clientes" description="Gerencie seus clientes e historico" />
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-secondary rounded" />
              ))}
            </div>
            <div className="h-64 bg-secondary rounded" />
          </div>
        </div>
      </>
    )
  }

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
                <p className="text-2xl font-heading font-bold text-foreground mt-1">{stats.total}</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-heading font-bold text-emerald-400 mt-1">{stats.active}</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Novos este Mes</p>
                <p className="text-2xl font-heading font-bold text-primary mt-1">{stats.newThisMonth}</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou telefone..."
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
                    <Label htmlFor="name" className="text-foreground">
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nome do cliente"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        className="bg-secondary border-border text-foreground"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone" className="text-foreground">
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        className="bg-secondary border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary" className="bg-secondary text-secondary-foreground">
                    Cancelar
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Cadastrar
                  </Button>
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
                    <TableHead className="text-muted-foreground hidden md:table-cell">Telefone</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Visitas</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Ultima Visita</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Total Gasto</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum cliente encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow key={client.id} className="border-border hover:bg-secondary/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                {getInitials(client.client_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-foreground">{client.client_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {client.client_phone}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm text-foreground">{client.completed_appointments}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {client.last_appointment_date
                              ? new Date(client.last_appointment_date).toLocaleDateString("pt-BR")
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm font-medium text-foreground">
                            R$ {client.total_spent.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              client.total_appointments > 0
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
                                : "bg-secondary text-muted-foreground border-border text-xs"
                            }
                          >
                            {client.total_appointments > 0 ? "ativo" : "inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground h-8 w-8"
                                aria-label="Opcoes"
                              >
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
