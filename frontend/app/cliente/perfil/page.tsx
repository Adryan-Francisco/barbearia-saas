"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { User, Mail, Phone, Lock, Bell, Calendar, Scissors } from "lucide-react"

interface UserData {
  id: string
  name: string
  phone: string
  role: string
}

export default function ClientProfilePage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erro ao parsear usuário:', error)
      }
    }
  }, [])

  const userName = user?.name || "Usuário"
  const userPhone = user?.phone || ""
  const userInitials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || "U"

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie suas informacoes pessoais e preferencias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-heading text-lg font-bold text-card-foreground">{userName}</h2>
              <p className="text-sm text-muted-foreground">{userPhone}</p>

              <div className="w-full mt-6 pt-5 border-t border-border flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    Cliente desde
                  </div>
                  <span className="text-sm font-medium text-card-foreground">Mar 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Scissors className="w-4 h-4 text-primary" />
                    Total de visitas
                  </div>
                  <span className="text-sm font-medium text-card-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4 text-primary" />
                    Barbeiro favorito
                  </div>
                  <span className="text-sm font-medium text-card-foreground">Rafael Costa</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Personal data */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold text-card-foreground mb-5">
                Dados Pessoais
              </h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-sm text-card-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" /> Nome completo
                    </Label>
                    <Input
                      id="name"
                      defaultValue={userName}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-sm text-card-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" /> E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="joao.silva@email.com"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone" className="text-sm text-card-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Telefone
                  </Label>
                  <Input
                    id="phone"
                    defaultValue={userPhone}
                    className="bg-secondary border-border text-foreground max-w-sm"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={saving}
                  >
                    {saving ? "Salvando..." : "Salvar Alteracoes"}
                  </Button>
                  {saved && (
                    <span className="text-sm text-primary font-medium">Salvo com sucesso!</span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold text-card-foreground mb-5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Alterar Senha
              </h3>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="current" className="text-sm text-card-foreground">Senha atual</Label>
                  <Input
                    id="current"
                    type="password"
                    placeholder="Sua senha atual"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground max-w-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="newPass" className="text-sm text-card-foreground">Nova senha</Label>
                    <Input
                      id="newPass"
                      type="password"
                      placeholder="Minimo 8 caracteres"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPass" className="text-sm text-card-foreground">Confirmar nova senha</Label>
                    <Input
                      id="confirmPass"
                      type="password"
                      placeholder="Repita a nova senha"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <Button type="button" variant="outline" className="w-fit border-border text-foreground hover:bg-secondary bg-transparent">
                  Atualizar Senha
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold text-card-foreground mb-5 flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                Notificacoes
              </h3>
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Lembretes de agendamento</p>
                    <p className="text-xs text-muted-foreground">Receba um lembrete 1 hora antes do horario</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Promocoes e novidades</p>
                    <p className="text-xs text-muted-foreground">Fique por dentro de ofertas exclusivas</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Notificacoes por WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Receba confirmacoes e lembretes via WhatsApp</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
