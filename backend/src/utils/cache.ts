// Cache simples em memória para reduzir consultas ao banco de dados
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
    } else {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    }
  }

  getStats() {
    return {
      entries: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const cacheManager = new CacheManager();

// Função para gerar chaves de cache padronizadas
export function generateCacheKey(...parts: string[]): string {
  return parts.join(':');
}

// Middleware para cache automático de requisições GET
export function cacheMiddleware(ttl: number = 5 * 60 * 1000) {
  return (req: any, res: any, next: any) => {
    // Apenas cachear GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = generateCacheKey(req.path, JSON.stringify(req.query));
    const cachedData = cacheManager.get(cacheKey);

    if (cachedData) {
      res.set('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    // Guardar resposta original
    const originalJson = res.json.bind(res);

    res.json = (data: any) => {
      // Cachear dados
      cacheManager.set(cacheKey, data, ttl);
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}
