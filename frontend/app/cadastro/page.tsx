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
import { validatePasswordStrength } from "@/lib/passwordValidator"
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator"

interface RegisterResponse {
  token: string
  user: {
    id: string
    name: string
    phone: string
  }
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"client" | "barbershop">("client")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(validatePasswordStrength(""))
  const router = useRouter()
  const { toast } = useToast()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrength(validatePasswordStrength(newPassword))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    console.log("📝 Tentativa de registro:", { name, phone, userType });
    console.log("🔐 Validação de senha:", passwordStrength);

    // Validar força da senha antes de enviar
    if (!passwordStrength.isValid) {
      console.warn("⚠️ Senha rejeitada no frontend:", passwordStrength.errors);
      toast({
        title: "Senha fraca",
        description: passwordStrength.errors.join(", "),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    let result

    if (userType === "barbershop") {
      console.log("📋 Enviando registro de barbearia...");
      result = await authAPI.barbershopRegister({
        name,
        phone,
        password,
        email: ""
      })
    } else {
      console.log("📋 Enviando registro de cliente...");
      result = await authAPI.register(name, phone, password)
    }
    
    console.log("📤 Resposta da API:", result);
    
    if (result.error) {
      console.error("❌ Erro no cadastro:", result.error);
      toast({
        title: "Erro no cadastro",
        description: result.error.message,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (result.data) {
      const data = result.data as RegisterResponse
      console.log("✅ Token recebido:", data.token?.substring(0, 20) + "...");
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      toast({
        title: "Bem-vindo!",
        description: "Cadastro realizado com sucesso",
      })
      
      const redirectPath = userType === "barbershop" ? "/dashboard" : "/cliente"
      console.log("🔄 Redirecionando para:", redirectPath);
      router.push(redirectPath)
    }
    
    setIsLoading(false)
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
                Criar conta
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Cadastre-se para agendar servicos e acompanhar seu historico
              </p>
            </div>

            {/* Seletor de tipo de usuário */}
            <div className="mb-6 p-4 bg-secondary rounded-lg border border-border">
              <Label className="text-sm font-medium text-card-foreground mb-3 block">
                Você é um:
              </Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("client")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    userType === "client"
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  👤 Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("barbershop")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    userType === "barbershop"
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  ✂️ Barbeiro
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-sm text-card-foreground">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    placeholder="Digite sua senha"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-10"
                    value={password}
                    onChange={handlePasswordChange}
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
                {password && <PasswordStrengthIndicator result={passwordStrength} />}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-semibold mt-2"
                disabled={isLoading || !passwordStrength.isValid || !name || !phone}
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">ou continue com</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary h-11 text-sm bg-transparent"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Ja tem conta?{" "}
              <Link href="/entrar/cliente" className="text-primary font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
