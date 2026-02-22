"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Building, Phone, MapPin, Clock, Trash2, Save, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { barbershopAPI } from "@/lib/api"
import { useUserRole } from "@/hooks/use-user-role"

interface Barbershop {
  id: string
  name: string
  phone: string
  address: string
  latitude?: number
  longitude?: number
}

export default function ConfiguraçõesPage() {
  const router = useRouter()
  // Hook que verifica o rol do usuário e oferece funções auxiliares
  const { isClient, isLoading: roleLoading } = useUserRole()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
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
    fetchBarbershop()
  }, [])

  /**
   * Busca os dados da barbearia do usuário autenticado
   * Usa a API centralizada ao invés de fetch direto
   */
  async function fetchBarbershop() {
    try {
      setLoading(true)
      
      // Busca os dados da barbearia usando a API centralizada
      const result = await barbershopAPI.getMyBarbershop()
      
      if (!result.error && result.data) {
        const data = result.data as any
        if (data?.barbershop) {
          setBarbershop(data.barbershop)
          setFormData({
            name: data.barbershop.name || "",
            phone: data.barbershop.phone || "",
            address: data.barbershop.address || "",
          })
        }
      }
    } catch (error) {
      console.error("Erro ao buscar barbearia:", error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Salva as alterações da barbearia
   */
  async function handleSave() {
    try {
      setSaving(true)
      const token = localStorage.getItem("token")
      if (!token || !barbershop) return

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const apiUrl = baseUrl.includes('/api') ? baseUrl : `${baseUrl}/api`
      const res = await fetch(`${apiUrl}/barbershops/${barbershop.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Erro ao salvar alterações")

      const updated = await res.json()
      setBarbershop(updated.barbershop)
      alert("Alterações salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao salvar alterações")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      setSaving(true)
      const token = localStorage.getItem("token")
      if (!token || !barbershop) return

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const apiUrl = baseUrl.includes('/api') ? baseUrl : `${baseUrl}/api`
      const res = await fetch(`${apiUrl}/barbershops/${barbershop.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Erro ao deletar barbearia")

      alert("Barbearia deletada. Redirecionando...")
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro ao deletar barbearia")
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem("token")
    window.location.href = "/entrar"
  }

  if (loading) {
    return (
      <>
        <AppHeader title="Configurações" description="Gerencie as configurações da sua barbearia" />
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-secondary rounded" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader title="Configurações" description="Gerencie as configurações da sua barbearia" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* Informações da Barbearia */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-foreground">Informações da Barbearia</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Atualize os dados da sua barbearia
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-foreground">
                  Nome da Barbearia
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Ex: Barbearia do João"
                />
              </div>

              {/* Telefone */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
                  <Phone className="w-4 h-4" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="(11) 99999-9999"
                />
              </div>

              {/* Endereço */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4" />
                  Endereço
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Rua Exemplo, 123 - Bairro, Cidade"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border" />

          {/* Horário de Funcionamento */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-foreground">Horário de Funcionamento</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Configure os horários da sua barbearia
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((day) => (
                  <div key={day} className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">{day}</p>
                    <div className="space-y-1">
                      <Input
                        type="time"
                        defaultValue="09:00"
                        className="bg-secondary border-border text-foreground text-xs h-8"
                      />
                      <Input
                        type="time"
                        defaultValue="18:00"
                        className="bg-secondary border-border text-foreground text-xs h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Salvar Horários
              </Button>
            </CardContent>
          </Card>

          <Separator className="bg-border" />

          {/* Ações Perigosas */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Ações Perigosas</CardTitle>
              <CardDescription className="text-muted-foreground">
                Estas ações não podem ser desfeitas. Use com cuidado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Logout */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-secondary"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair da Conta
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Sair da Conta</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Você será desconectado e retornará para a página de login.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" className="border-border text-foreground">
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleLogout}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Confirmar Saída
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Barbershop */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Barbearia
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">
                      Excluir Barbearia
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      Esta ação é irreversível. Todos os dados da sua barbearia, incluindo clientes,
                      agendamentos e serviços, serão deletados permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogCancel className="border-border text-foreground hover:bg-secondary">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={saving}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {saving ? "Deletando..." : "Excluir Permanentemente"}
                  </AlertDialogAction>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
