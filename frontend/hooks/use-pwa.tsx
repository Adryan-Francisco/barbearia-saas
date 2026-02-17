'use client';

import { useEffect, useState } from 'react';

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar se o navegador suporta PWA
    const supported = 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (!supported) return;

    // Registrar o Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('✅ Service Worker registrado:', registration);

        // Verificar atualizações a cada hora
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }).catch((error) => {
        console.error('❌ Erro ao registrar Service Worker:', error);
      });
    }

    // Handler para beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const prompt = e as PWAInstallPrompt;
      setInstallPrompt(prompt);
      console.log('📱 beforeinstallprompt disparado');
    };

    // Handler para appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log('✅ App instalado');
    };

    // Handler para online
    const handleOnline = () => {
      console.log('✅ Voltou online');
    };

    // Handler para offline
    const handleOffline = () => {
      console.log('❌ Desconectado');
    };

    // Adicionar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setInstallPrompt(null);
        console.log('✅ App instalado com sucesso');
      } else {
        console.log('❌ Instalação cancelada pelo usuário');
      }
    } catch (error) {
      console.error('Erro ao instalar app:', error);
    }
  };

  return {
    installPrompt,
    isInstalled,
    isSupported,
    installApp,
  };
}
