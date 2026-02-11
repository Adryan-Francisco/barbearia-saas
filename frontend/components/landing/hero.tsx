import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Background Image - Full coverage */}
      <div className="absolute inset-0">
        <Image
          src="/barbearia.png"
          alt="Interior da barbearia BarberPro"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Gradient overlay - more transparent to show image */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-xs font-medium text-primary">+50 barbearias parceiras</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Encontre a barbearia perfeita para voce
          </h1>

          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Descubra as melhores barbearias da sua região, compare serviços e agende online 
            com praticidade. Tudo em um só lugar.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base font-semibold">
              <a href="#barbearias">Escolher Barbearia</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-border text-foreground hover:bg-secondary h-12 px-8 text-base bg-transparent">
              <Link href="/entrar/barbeiro">Sou Barbeiro</Link>
            </Button>
          </div>

          {/* Info bar */}
          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Agendamento 24h online</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Barbearias em toda ão Paulo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
