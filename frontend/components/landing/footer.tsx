import Link from "next/link"
import { Scissors, Instagram, Phone, Mail, MapPin } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Scissors className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">BarberFlow</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Barbearia premium com foco em estilo, técnica e experiência.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Navegação</h4>
            <ul className="flex flex-col gap-2.5">
              <li><a href="#barbearias" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Barbearias</a></li>
              <li><a href="#servicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Serviços</a></li>
              <li><a href="#depoimentos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Depoimentos</a></li>
            </ul>
          </div>

          {/* Customer & Barber */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Acesso</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/entrar/cliente" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entrar como Cliente</Link></li>
              <li><Link href="/entrar/barbeiro" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entrar como Barbeiro</Link></li>
              <li><Link href="/cadastro" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Criar Conta</Link></li>
              <li><Link href="/cliente" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Meus Agendamentos</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contato</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                Rua Augusta, 1200 - SP
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                (17) 99623-1865
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                contato@barberflow.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Instagram className="w-4 h-4 text-primary flex-shrink-0" />
                @barberflow
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            2026 BarberFlow. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Politica de Privacidade
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
