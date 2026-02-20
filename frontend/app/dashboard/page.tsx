"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { TopServices } from "@/components/dashboard/top-services"
import { useUserRole } from "@/hooks/use-user-role"

export default function DashboardPage() {
  const router = useRouter()
  // Hook customizado que decodifica o JWT e retorna o role do usuário
  const { role, isLoading, isClient } = useUserRole()

  useEffect(() => {
    // Se o usuário estiver carregando, não faz nada
    if (isLoading) return

    // Se for cliente, redireciona para a página de agendamentos
    // Clientes não têm acesso ao dashboard de donos
    if (isClient) {
      router.push('/agendar')
      return
    }

    // Se não houver role (usuário não autenticado), redireciona para login
    if (!role) {
      router.push('/entrar')
      return
    }
  }, [role, isLoading, isClient, router])

  // Enquanto está carregando as informações do usuário, mostra loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground/60">Carregando...</p>
      </div>
    )
  }

  // Se for cliente, não renderiza o dashboard (já redirecionou)
  if (isClient) {
    return null
  }

  // Se não houver role válido, não renderiza (já redirecionou)
  if (!role) {
    return null
  }

  // Se chegou aqui, é um dono de barbearia - renderiza o dashboard
  return (
    <>
      <AppHeader title="Dashboard" description="Visao geral da sua barbearia" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Cartões com estatísticas (total de agendamentos, receita, etc) */}
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de receita */}
            <RevenueChart />
            {/* Lista de próximos agendamentos */}
            <UpcomingAppointments />
          </div>
          {/* Top 5 serviços mais vendidos */}
          <TopServices />
        </div>
      </div>
    </>
  )
}

