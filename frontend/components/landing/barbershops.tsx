'use client'

import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Clock, ChevronRight, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApi } from "@/lib/useApi"

const placeholderImage = "/placeholder.svg"

interface Barbershop {
  id: string
  name: string
  address: string
  rating?: number
  phone?: string
  createdAt?: string
  updatedAt?: string
}

interface BarbershopsResponse {
  total: number
  barbershops: Barbershop[]
}

export function LandingBarbershops() {
  const { data: response, loading, error } = useApi<BarbershopsResponse>('/barbershops')
  
  const barbershops = response?.barbershops || []

  // Transformar dados da API para o formato do componente
  const transformedShops = barbershops.map(shop => ({
    id: shop.id,
    name: shop.name,
    image: placeholderImage,
    rating: shop.rating || 4.5,
    reviews: 0,
    address: shop.address || "Endereço não informado",
    hours: "Seg-Sab, 9h-20h",
    specialties: ["Corte", "Barba"],
    priceRange: "A partir de R$ 50",
  }))

  return (
    <section id="barbearias" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Barbearias
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3 text-balance">
            Escolha onde cortar
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Encontre a barbearia perfeita para você. Selecione uma para ver serviços e agendar seu horário.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-center">
            <p className="text-destructive font-medium">Erro ao carregar barbearias</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && transformedShops.length === 0 && (
          <div className="rounded-lg bg-muted/50 border border-border p-8 text-center">
            <p className="text-muted-foreground font-medium">Nenhuma barbearia cadastrada</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && transformedShops.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedShops.map((shop) => (
              <Link key={shop.id} href={`/agendar/${shop.id}`}>
              <Card className="bg-card border-border hover:border-primary/40 transition-all group overflow-hidden h-full">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={shop.image || "/placeholder.svg"}
                    alt={shop.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-bold">{shop.rating}</span>
                      <span className="text-xs text-muted-foreground">({shop.reviews})</span>
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {shop.name}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{shop.hours}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1.5">
                      {shop.specialties.map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{shop.priceRange}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          </div>
        )}
      </div>
    </section>
  )
}
