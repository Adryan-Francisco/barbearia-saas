import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const placeholderImage = "/placeholder.svg"

const barbershops = [
  {
    id: "corte-fino",
    name: "Corte Fino Barbearia",
    image: placeholderImage,
    rating: 4.9,
    reviews: 142,
    address: "Rua Augusta, 1200 - Consolacao, SP",
    hours: "Seg-Sab, 9h-20h",
    specialties: ["Cortes Classicos", "Barba"],
    priceRange: "R$ 45 - R$ 120",
  },
  {
    id: "vintage-barber",
    name: "Vintage Barber Shop",
    image: placeholderImage,
    rating: 4.8,
    reviews: 98,
    address: "Rua Oscar Freire, 300 - Jardins, SP",
    hours: "Seg-Sab, 10h-21h",
    specialties: ["Retro", "Navalha"],
    priceRange: "R$ 50 - R$ 130",
  },
  {
    id: "studio-hair",
    name: "Studio Hair Masculino",
    image: placeholderImage,
    rating: 4.7,
    reviews: 76,
    address: "Av. Paulista, 900 - Bela Vista, SP",
    hours: "Seg-Sab, 8h-19h",
    specialties: ["Moderno", "Design"],
    priceRange: "R$ 40 - R$ 100",
  },
  {
    id: "urban-cuts",
    name: "Urban Cuts",
    image: placeholderImage,
    rating: 4.9,
    reviews: 210,
    address: "Rua da Consolacao, 2500 - Consolacao, SP",
    hours: "Seg-Sab, 10h-22h",
    specialties: ["Fade", "Freestyle"],
    priceRange: "R$ 55 - R$ 140",
  },
  {
    id: "premium-barber",
    name: "Premium Barber Lounge",
    image: placeholderImage,
    rating: 5.0,
    reviews: 64,
    address: "Rua Haddock Lobo, 800 - Cerqueira Cesar, SP",
    hours: "Seg-Sab, 9h-20h",
    specialties: ["VIP", "Tratamentos"],
    priceRange: "R$ 80 - R$ 200",
  },
  {
    id: "barbearia-do-ze",
    name: "Barbearia do Ze",
    image: placeholderImage,
    rating: 4.8,
    reviews: 185,
    address: "Rua Teodoro Sampaio, 400 - Pinheiros, SP",
    hours: "Seg-Sab, 8h-18h",
    specialties: ["Tradicional", "Familiar"],
    priceRange: "R$ 35 - R$ 85",
  },
]

export function LandingBarbershops() {
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
            Encontre a barbearia perfeita para voce. Selecione uma para ver servicos e agendar seu horario.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbershops.map((shop) => (
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
      </div>
    </section>
  )
}
