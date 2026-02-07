"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AppHeaderProps {
  title: string
  description?: string
}

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border">
      <div>
        <h1 className="font-heading text-xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-9 w-64 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" aria-label="Notificacoes">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
            2
          </span>
        </Button>
      </div>
    </header>
  )
}
