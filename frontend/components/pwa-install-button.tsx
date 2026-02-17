'use client';

import { usePWA } from '@/hooks/use-pwa';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export function PWAInstallButton() {
  const { installPrompt, isInstalled, installApp } = usePWA();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Não mostra se não estiver montado ou se já está instalado
  if (!mounted || isInstalled || !installPrompt) {
    return null;
  }

  return (
    <Button
      onClick={installApp}
      variant="outline"
      size="sm"
      className="gap-2"
      title="Instalar BarberFlow como aplicativo"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Instalar App</span>
      <span className="sm:hidden">App</span>
    </Button>
  );
}
