'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  Package,
  Clock,
} from 'lucide-react';

interface PWAStatus {
  serviceWorkerSupported: boolean;
  serviceWorkerRegistered: boolean;
  isOnline: boolean;
  cacheSize: string;
  lastUpdate: Date | null;
}

export function PWADiagnostics() {
  const [status, setStatus] = useState<PWAStatus>({
    serviceWorkerSupported: false,
    serviceWorkerRegistered: false,
    isOnline: navigator.onLine,
    cacheSize: '0 bytes',
    lastUpdate: null,
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const check = async () => {
      const supported = 'serviceWorker' in navigator;
      let registered = false;

      if (supported) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          registered = registrations.length > 0;
        } catch (error) {
          console.error('Error checking service worker:', error);
        }
      }

      // Calcular tamanho do cache
      let cacheSize = '0 bytes';
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          const usage = estimate.usage || 0;
          cacheSize = formatBytes(usage);
        }
      } catch (error) {
        console.error('Error estimating cache:', error);
      }

      setStatus({
        serviceWorkerSupported: supported,
        serviceWorkerRegistered: registered,
        isOnline: navigator.onLine,
        cacheSize,
        lastUpdate: new Date(),
      });
    };

    check();

    // Atualizar status de conectividade
    const handleOnline = () =>
      setStatus((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setStatus((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Atualizar a cada 30 segundos
    const interval = setInterval(check, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const allGood =
    status.serviceWorkerSupported &&
    status.serviceWorkerRegistered &&
    status.isOnline;

  if (!showDetails && allGood) {
    return null; // Não mostrar se tudo está bem
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm p-4 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2">
          {allGood ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
          <span className="font-semibold">PWA Status</span>
        </div>
        <span className="text-xs text-slate-500">
          {showDetails ? '−' : '+'}
        </span>
      </div>

      {/* Detalhes */}
      {showDetails && (
        <div className="space-y-2 text-xs">
          {/* Service Worker */}
          <div className="flex items-start gap-2">
            {status.serviceWorkerSupported ? (
              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-medium">Service Worker</div>
              <div className="text-slate-600 dark:text-slate-400">
                {status.serviceWorkerSupported ? 'Suportado' : 'Não suportado'}
              </div>
            </div>
          </div>

          {/* Service Worker Registrado */}
          {status.serviceWorkerSupported && (
            <div className="flex items-start gap-2">
              {status.serviceWorkerRegistered ? (
                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <div className="font-medium">Ativado</div>
                <div className="text-slate-600 dark:text-slate-400">
                  {status.serviceWorkerRegistered
                    ? 'Service Worker ativo'
                    : 'Aguardando ativação...'}
                </div>
              </div>
            </div>
          )}

          {/* Conectividade */}
          <div className="flex items-start gap-2">
            {status.isOnline ? (
              <Wifi className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-medium">Conectividade</div>
              <div className="text-slate-600 dark:text-slate-400">
                {status.isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>

          {/* Cache */}
          <div className="flex items-start gap-2">
            <Package className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Cache</div>
              <div className="text-slate-600 dark:text-slate-400">
                {status.cacheSize}
              </div>
            </div>
          </div>

          {/* Última atualização */}
          {status.lastUpdate && (
            <div className="flex items-start gap-2">
              <Clock className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Verificado</div>
                <div className="text-slate-600 dark:text-slate-400">
                  {status.lastUpdate.toLocaleTimeString('pt-BR')}
                </div>
              </div>
            </div>
          )}

          {/* Botão de limpeza */}
          {status.serviceWorkerRegistered && (
            <button
              onClick={async () => {
                const registrations =
                  await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                  await registration.unregister();
                }
                // Limpar caches
                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                  await caches.delete(cacheName);
                }
                window.location.reload();
              }}
              className="mt-3 w-full px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              🗑️ Limpar Cache & Service Worker
            </button>
          )}
        </div>
      )}

      {/* Status Badge */}
      {!showDetails && (
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {!status.serviceWorkerRegistered &&
            status.serviceWorkerSupported && 'Aguardando Service Worker...'}
          {!status.serviceWorkerSupported && 'Service Worker não suportado'}
          {!status.isOnline && 'Modo offline'}
          {allGood && 'PWA pronto!'}
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 bytes';
  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
