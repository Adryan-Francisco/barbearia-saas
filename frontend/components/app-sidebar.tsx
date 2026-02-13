"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Agendamentos", href: "/dashboard/agendamentos", icon: Calendar, badge: 3 },
  { label: "Clientes", href: "/dashboard/clientes", icon: Users },
  { label: "Servicos", href: "/dashboard/servicos", icon: Scissors },
  { label: "Relatorios", href: "/dashboard/relatorios", icon: BarChart3 },
]

const bottomItems = [
  { label: "Configuracoes", href: "/dashboard/configuracoes", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [barbershopName, setBarbershopName] = useState("BarberFlow")

  useEffect(() => {
    fetchBarbershopName()
  }, [])

  async function fetchBarbershopName() {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch("/api/barbershops/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) return

      const barbershop = await res.json()
      if (barbershop?.name) {
        setBarbershopName(barbershop.name)
      }
    } catch (error) {
      console.error("Erro ao buscar barbearia:", error)
    }
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 sticky top-0",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
          <Scissors className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-heading text-sm font-bold text-sidebar-foreground tracking-tight line-clamp-2 max-w-[180px]">
            {barbershopName}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 h-5 min-w-5 flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col gap-1 px-3 pb-3 border-t border-sidebar-border pt-3">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              JP
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{barbershopName}</p>
              <p className="text-xs text-muted-foreground truncate">Barbearia</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-muted-foreground hover:text-sidebar-foreground transition-colors" aria-label="Sair">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-secondary border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  )
}
