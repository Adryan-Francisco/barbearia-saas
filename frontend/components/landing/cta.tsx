import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function LandingCTA() {
  return (
    <section id="contato" className="py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-10 sm:p-16 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Pronto para uma experiencia premium?
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
              Agende seu horario agora mesmo e descubra por que somos referencia em barbearia. 
              Primeira visita com 10% de desconto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base font-semibold">
                <a href="#barbearias" className="flex items-center gap-2">
                  Escolher Barbearia
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border text-foreground hover:bg-secondary h-12 px-8 text-base bg-transparent">
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/5" />
        </div>
      </div>
    </section>
  )
}
