"use client"

import React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Scissors, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { authAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function BarberSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [barbershopName, setBarbershopName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    
    authAPI.barbershopRegister({
      name: barbershopName,
      email,
      phone,
      password,
    }).then((result: any) => {
      if (result.error) {
        toast({
          title: "Erro no cadastro",
          description: result.error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (result.data?.token) {
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))
        
        toast({
          title: "Bem-vindo!",
          description: "Cadastro realizado com sucesso",
        })
        
        router.push("/dashboard")
      }
      
      setIsLoading(false)
    }).catch((error) => {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao processar o cadastro",
        variant: "destructive",
      })
      setIsLoading(false)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao inicio
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <Scissors className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">BarberFlow</span>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="font-heading text-2xl font-bold text-card-foreground">
                Cadastre sua barbearia
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Comece a gerenciar seus agendamentos e clientes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="barbershop" className="text-sm text-card-foreground">Nome da Barbearia</Label>
                <Input
                  id="barbershop"
                  placeholder="Corte Fino Barbearia"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  value={barbershopName}
                  onChange={(e) => setBarbershopName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm text-card-foreground">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-sm text-card-foreground">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm text-card-foreground">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimo 8 caracteres"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-semibold mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Ja tem conta?{" "}
              <Link href="/entrar/barbeiro" className="text-primary font-medium hover:underline">
                Entrar
              </Link>
            </p>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <Link href="/entrar/cliente" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                E cliente? <span className="text-primary font-medium">Acesse aqui</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
