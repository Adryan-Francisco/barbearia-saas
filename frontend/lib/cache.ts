/**
 * Sistema de Cache com suporte a paginação e invalidação inteligente
 */

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  tags: string[]
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  pages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private tags: Map<string, Set<string>> = new Map()
  private defaultTTL = 5 * 60 * 1000 // 5 minutos

  /**
   * Define um valor no cache com TTL opcional
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL, tags: string[] = []): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags,
    }

    this.cache.set(key, entry)

    // Registrar tags para invalidação em massa
    tags.forEach((tag) => {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set())
      }
      this.tags.get(tag)!.add(key)
    })

    // Limpar após TTL
    setTimeout(() => {
      this.delete(key)
    }, ttl)
  }

  /**
   * Obtém um valor do cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Deleta uma chave do cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    this.cache.delete(key)

    // Remover das tags
    entry.tags.forEach((tag) => {
      const keys = this.tags.get(tag)
      if (keys) {
        keys.delete(key)
      }
    })

    return true
  }

  /**
   * Limpa todo o cache ou cache com padrão específico
   */
  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      this.tags.clear()
      return
    }

    // Limpar por padrão (ex: "user:*")
    const regex = new RegExp(`^${pattern.replace('*', '.*')}`)
    const keysToDelete: string[] = []

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach((key) => this.delete(key))
  }

  /**
   * Invalida cache por tags
   */
  invalidateByTag(tag: string): number {
    const keys = this.tags.get(tag)
    if (!keys) return 0

    let count = 0
    keys.forEach((key) => {
      if (this.delete(key)) {
        count++
      }
    })

    return count
  }

  /**
   * Obtém ou calcula um valor usando função
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
    tags?: string[]
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fn()
    this.set(key, data, ttl, tags)
    return data
  }

  /**
   * Retorna tamanho do cache
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Retorna informações de debug
   */
  debug(): object {
    const entries: Record<string, any> = {}
    this.cache.forEach((entry, key) => {
      const age = Date.now() - entry.timestamp
      entries[key] = {
        age: `${age}ms`,
        ttl: `${entry.ttl}ms`,
        expires: `${entry.ttl - age}ms`,
        tags: entry.tags,
      }
    })
    return entries
  }
}

/**
 * Classe para gerenciar cache com paginação eficiente
 */
class PaginationCacheManager {
  private cacheManager: CacheManager

  constructor() {
    this.cacheManager = new CacheManager()
  }

  /**
   * Chave para armazenar dados paginado
   */
  private getPaginationKey(endpoint: string, params: PaginationParams): string {
    const { page, limit, sortBy, sortOrder } = params
    return `pagination:${endpoint}:${page}:${limit}:${sortBy || 'default'}:${sortOrder || 'asc'}`
  }

  /**
   * Obtém dados paginados com cache
   */
  async getPaginated<T>(
    endpoint: string,
    params: PaginationParams,
    fetchFn: (params: PaginationParams) => Promise<any>,
    ttl?: number,
    tag?: string
  ): Promise<PaginatedResponse<T>> {
    const key = this.getPaginationKey(endpoint, params)
    const tags = tag ? [tag, `${endpoint}:pagination`] : [`${endpoint}:pagination`]

    const cached = this.cacheManager.get<PaginatedResponse<T>>(key)
    if (cached) {
      return cached
    }

    const data = await fetchFn(params)
    this.cacheManager.set(key, data, ttl, tags)
    return data
  }

  /**
   * Invalida cache de um endpoint específico
   */
  invalidateEndpoint(endpoint: string): number {
    return this.cacheManager.invalidateByTag(`${endpoint}:pagination`)
  }

  /**
   * Limpa todas as paginações
   */
  clearAll(): void {
    this.cacheManager.clear()
  }

  /**
   * Debug
   */
  debug(): object {
    return this.cacheManager.debug()
  }
}

// Instâncias singleton
export const cacheManager = new CacheManager()
export const paginationCache = new PaginationCacheManager()

/**
 * Middleware para cache no lado do cliente
 */
export function cacheMiddleware<T = any>(
  key: string,
  ttl?: number,
  tags?: string[]
) {
  return async (fn: () => Promise<T>): Promise<T> => {
    return cacheManager.getOrSet(key, fn, ttl, tags)
  }
}
