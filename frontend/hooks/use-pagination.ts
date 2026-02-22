/**
 * Hook para gerenciar paginação eficientemente com cache
 */

import { useState, useCallback, useEffect } from 'react'
import { PaginatedResponse, PaginationParams, paginationCache } from '@/lib/cache'

export interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
  ttl?: number
  tag?: string
  onError?: (error: Error) => void
}

export interface UsePaginationReturn<T> {
  data: T[]
  isLoading: boolean
  error: string | null
  page: number
  limit: number
  total: number
  pages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setLimit: (limit: number) => Promise<void>
}

/**
 * Hook para paginação com cache automático
 */
export function usePagination<T = any>(
  endpoint: string,
  fetchFn: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const {
    initialPage = 1,
    initialLimit = 10,
    ttl = 5 * 60 * 1000,
    tag = endpoint,
    onError,
  } = options

  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimitState] = useState(initialLimit)
  const [pagination, setPagination] = useState<PaginatedResponse<T> | null>(null)

  // Carregar dados quando página ou limite muda
  useEffect(() => {
    loadPage()
  }, [page, limit])

  const loadPage = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params: PaginationParams = {
        page,
        limit,
      }

      const response = await paginationCache.getPaginated(
        endpoint,
        params,
        fetchFn,
        ttl,
        tag
      )

      setData(response.data as T[])
      setPagination(response as PaginatedResponse<T>)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, page, limit, fetchFn, ttl, tag, onError])

  const goToPage = useCallback(
    async (newPage: number) => {
      if (newPage >= 1 && (!pagination || newPage <= pagination.pages)) {
        setPage(newPage)
      }
    },
    [pagination]
  )

  const nextPage = useCallback(async () => {
    if (pagination?.hasNextPage) {
      await goToPage(page + 1)
    }
  }, [page, pagination, goToPage])

  const previousPage = useCallback(async () => {
    if (pagination?.hasPreviousPage) {
      await goToPage(page - 1)
    }
  }, [page, pagination, goToPage])

  const setLimit = useCallback(
    async (newLimit: number) => {
      setLimitState(newLimit)
      setPage(1) // Resetar para primeira página ao mudar limite
    },
    []
  )

  return {
    data,
    isLoading,
    error,
    page,
    limit,
    total: pagination?.total || 0,
    pages: pagination?.pages || 0,
    hasNextPage: pagination?.hasNextPage || false,
    hasPreviousPage: pagination?.hasPreviousPage || false,
    goToPage,
    nextPage,
    previousPage,
    setLimit,
  }
}

/**
 * Hook para carregar dados com cache (sem paginação)
 */
export interface UseDataOptions {
  ttl?: number
  tag?: string
  onError?: (error: Error) => void
  skip?: boolean
}

export interface UseDataReturn<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useData<T = any>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseDataOptions = {}
): UseDataReturn<T> {
  const { ttl = 5 * 60 * 1000, tag = '', onError, skip = false } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(!skip)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (skip) return

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await cacheManager.getOrSet(
          key,
          fetchFn,
          ttl,
          tag ? [tag] : undefined
        )

        setData(response)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar'
        setError(errorMessage)
        onError?.(err instanceof Error ? err : new Error(errorMessage))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [key, fetchFn, ttl, tag, skip, onError])

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchFn()
      setData(response)
      // Atualizar cache
      cacheManager.set(key, response, ttl, tag ? [tag] : undefined)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [key, fetchFn, ttl, tag, onError])

  return {
    data,
    isLoading,
    error,
    refetch,
  }
}

// Import necesário para useData
import { cacheManager } from '@/lib/cache'
