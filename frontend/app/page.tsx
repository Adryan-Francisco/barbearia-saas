import { LandingHero } from "@/components/landing/hero"
import { LandingNavbar } from "@/components/landing/navbar"
import { LandingBarbershops } from "@/components/landing/barbershops"
import { LandingServices } from "@/components/landing/services"
import { LandingTestimonials } from "@/components/landing/testimonials"
import { LandingCTA } from "@/components/landing/cta"
import { LandingFooter } from "@/components/landing/footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <LandingHero />
      <LandingBarbershops />
      <LandingServices />
      <LandingTestimonials />
      <LandingCTA />
      <LandingFooter />
    </main>
  )
}
