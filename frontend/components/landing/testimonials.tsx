import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Mateus Oliveira",
    initials: "MO",
    text: "Melhor barbearia que já frequentei. Profissionalismo e resultado impecável toda vez. Agendamento online facilita muito a vida.",
    rating: 5,
  },
  {
    name: "Bruno Ferreira",
    initials: "BF",
    text: "O ambiente é incrível e os barbeiros realmente sabem o que estão fazendo. Recomendo o combo corte + barba, você sai outra pessoa.",
    rating: 5,
  },
  {
    name: "Diego Santos",
    initials: "DS",
    text: "Atendimento nota 10. Sempre saio satisfeito e o sistema de agendamento é muito prático. Não troco por nada.",
    rating: 5,
  },
  {
    name: "Pedro Henrique",
    initials: "PH",
    text: "A pigmentação ficou perfeita, muito natural. E o cuidado com cada detalhe mostra a qualidade do serviço. Top demais!",
    rating: 5,
  },
]

export function LandingTestimonials() {
  return (
    <section id="depoimentos" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Depoimentos
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3 text-balance">
            O que nossos clientes dizem
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A satisfação dos nossos clientes é o nosso maior orgulho.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((item) => (
            <Card key={item.name} className="bg-card border-border">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-card-foreground leading-relaxed">
                  {item.text}
                </p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
