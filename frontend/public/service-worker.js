const CACHE_NAME = 'barberflow-v1';
const URLS_TO_CACHE = [
  '/',
  '/offline.html',
];

// Instalar o Service Worker e fazer cache dos recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativar o Service Worker e limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de cache: Network First with Cache Fallback
// Tenta primeiro a rede, se falhar usa o cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests (deixe a aplicação gerenciar isso)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache bem-sucedidas respostas
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tente o cache
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Se não estiver no cache, retorne uma página offline
          if (request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Sincronização em background (opcional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments());
  }
});

async function syncAppointments() {
  try {
    // Aqui você pode sincronizar dados de agendamentos
    console.log('Sincronizando agendamentos...');
  } catch (error) {
    console.error('Erro ao sincronizar:', error);
  }
}

// Receber mensagens da aplicação
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
