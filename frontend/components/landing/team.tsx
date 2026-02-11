import Image from "next/image"
import { Instagram } from "lucide-react"

const barbers = [
  {
    name: "Rafael Costa",
    role: "Master Barber",
    image: "/placeholder.svg",
    specialties: ["Cortes Classicos", "Barba"],
  },
  {
    name: "Lucas Almeida",
    role: "Barber & Stylist",
    image: "/placeholder.svg",
    specialties: ["Fade", "Design"],
  },
  {
    name: "Carlos Henrique",
    role: "Senior Barber",
    image: "/placeholder.svg",
    specialties: ["Pigmentacao", "Tratamentos"],
  },
]

export function LandingTeam() {
  return (
    <section id="equipe" className="py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Nossa Equipe
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3 text-balance">
            Profissionais de excelência
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Nossa equipe reúne anos de experiência e paixão pela arte da barbearia.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <div
              key={barber.name}
              className="group relative rounded-xl overflow-hidden border border-border bg-card"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={barber.image || "/placeholder.svg"}
                  alt={barber.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {barber.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mt-0.5">{barber.role}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {barber.specialties.map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-secondary/80 text-secondary-foreground px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="w-9 h-9 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                    aria-label={`Instagram de ${barber.name}`}
                  >
                    <Instagram className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
