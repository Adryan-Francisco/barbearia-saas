"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { barbershopAPI } from "@/lib/api"

interface Service {
  id: string
  name: string
  price: number
  duration: number
  count?: number
}

export function TopServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Primeiro obtém a barbearia do usuário
        const barbershopResult = await barbershopAPI.getMyBarbershop()

        if (barbershopResult.error) return

        const barbershopData = barbershopResult.data as any
        const barbershop = barbershopData?.barbershop || barbershopData

        if (!barbershop?.id) return

        // Depois obtém os serviços
        const servicesResult = await barbershopAPI.getServices(barbershop.id)

        if (!servicesResult.error) {
          const data = servicesResult.data as any
          // Ordena por nome e adiciona contagem simulada
          const sortedServices = (data?.services || [])
            .sort((a: Service, b: Service) => b.price - a.price)
            .slice(0, 5)
            .map((service: Service, index: number) => ({
              ...service,
              count: (5 - index) * 10
            }))
          setServices(sortedServices)
        }
      } catch (error) {
        console.error('Erro ao buscar serviços:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-foreground">Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (services.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-foreground">Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum serviço cadastrado</p>
        </CardContent>
      </Card>
    )
  }

  const maxCount = Math.max(...services.map(s => s.count || 0))

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-heading text-foreground">Serviços Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{service.name}</span>
                <span className="text-muted-foreground">R$ {service.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{service.duration} min</span>
              </div>
              <Progress
                value={((service.count || 0) / maxCount) * 100}
                className="h-2 bg-secondary [&>div]:bg-primary"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
