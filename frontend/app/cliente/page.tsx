"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, History, ArrowRight } from "lucide-react"
import { versionAPI } from "@/lib/api"

export default function ClientPage() {
  const [version, setVersion] = useState<string>("0.1.0")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVersion()
  }, [])

  async function fetchVersion() {
    try {
      const result = await versionAPI.getVersion()
      if (result?.data && typeof result.data === 'object' && 'version' in result.data) {
        setVersion((result.data as any).version)
      }
    } catch (error) {
      console.error("Erro ao buscar versão:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
              Bem-vindo ao BarberFlow
            </h1>
            <p className="text-lg text-muted-foreground">
              Agende seu horário com os melhores barbeiros da região
            </p>
          </div>

          {/* Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Agendar Card */}
            <Link href="/agendar">
              <Card className="bg-card border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-lg mb-1">Agendar</h2>
                    <p className="text-sm text-muted-foreground">
                      Reserve seu horário de forma rápida e fácil
                    </p>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto">
                    Agendar Agora
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Meus Agendamentos Card */}
            <Link href="/cliente/agendamentos">
              <Card className="bg-card border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <History className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-lg mb-1">Meus Agendamentos</h2>
                    <p className="text-sm text-muted-foreground">
                      Veja e gerencie seus agendamentos
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Visualizar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Perfil Card */}
            <Link href="/cliente/perfil">
              <Card className="bg-card border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-lg mb-1">Perfil</h2>
                    <p className="text-sm text-muted-foreground">
                      Edite seus dados e configurações
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Configurar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Info Section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Como funciona?</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li><strong>1.</strong> Escolha a barbearia e o serviço desejado</li>
                <li><strong>2.</strong> Selecione seu barbeiro favorito</li>
                <li><strong>3.</strong> Escolha a data e horário disponível</li>
                <li><strong>4.</strong> Finalize o agendamento</li>
                <li><strong>5.</strong> Receba confirmação por WhatsApp</li>
              </ol>
            </CardContent>
          </Card>

          {/* Versão do Sistema */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              BarberFlow v{version}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
