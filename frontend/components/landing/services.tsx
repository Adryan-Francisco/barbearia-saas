import { Scissors, Droplets, Sparkles, Paintbrush } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    icon: Scissors,
    name: "Corte Masculino",
    description: "Cortes modernos e classicos com acabamento perfeito. Tesoura ou maquina.",
    price: "R$ 55",
    duration: "45 min",
  },
  {
    icon: Droplets,
    name: "Barba Completa",
    description: "Modelagem de barba com toalha quente, navalha e hidratacao.",
    price: "R$ 40",
    duration: "30 min",
  },
  {
    icon: Sparkles,
    name: "Corte + Barba",
    description: "O combo completo para quem quer sair renovado. Inclui lavagem.",
    price: "R$ 85",
    duration: "1h 15min",
  },
  {
    icon: Paintbrush,
    name: "Pigmentacao",
    description: "Cobertura de fios brancos ou pigmentacao criativa na barba e cabelo.",
    price: "R$ 70",
    duration: "50 min",
  },
]

export function LandingServices() {
  return (
    <section id="servicos" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Nossos Servicos
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3 text-balance">
            Servicos pensados para voce
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Cada detalhe importa. Nossos servicos combinam tecnica, estilo e cuidado para uma experiencia unica.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => (
            <Card
              key={service.name}
              className="bg-card border-border hover:border-primary/40 transition-colors group"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-card-foreground">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                  <span className="text-lg font-bold text-primary">{service.price}</span>
                  <span className="text-xs text-muted-foreground">{service.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
