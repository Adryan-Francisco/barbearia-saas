"use client"

import React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, ClockIcon, User, LogOut, Menu, X, Scissors } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const clientNav = [
  { label: "Agendar", href: "/cliente", icon: Calendar },
  { label: "Meus Agendamentos", href: "/cliente/agendamentos", icon: ClockIcon },
  { label: "Meu Perfil", href: "/cliente/perfil", icon: User },
]

interface User {
  id: string
  name: string
  phone: string
  role: string
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erro ao parsear usuário:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/entrar/cliente")
  }
  const userName = user?.name || "Usuário"
  const userInitials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-background">
      {/* Top navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold text-foreground">BarberFlow</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {clientNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User + mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{userName}</span>
              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground transition-colors ml-2"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 bg-background border-b border-border",
            mobileOpen ? "max-h-64" : "max-h-0 border-b-0"
          )}
        >
          <nav className="flex flex-col gap-1 px-6 py-3">
            {clientNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
            <div className="flex items-center gap-3 px-3 py-2.5 mt-2 border-t border-border pt-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground flex-1">{userName}</span>
              <button 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground" 
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  )
}
