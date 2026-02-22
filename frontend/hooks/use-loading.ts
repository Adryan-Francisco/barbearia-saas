/**
 * Hook para gerenciar estados de loading globais
 * Útil para mostrar skeleton loaders, spinners, etc.
 */

import { useState, useCallback, useRef } from 'react'

export interface LoadingState {
  isLoading: boolean
  error: string | null
  success: string | null
}

export interface UseLoadingReturn extends LoadingState {
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setSuccess: (success: string | null) => void
  reset: () => void
  handleAsync: <T = any>(
    fn: () => Promise<T>,
    options?: {
      successMessage?: string
      errorMessage?: string
      onSuccess?: (data: T) => void
      onError?: (error: Error) => void
    }
  ) => Promise<T | null>
}

/**
 * Hook personalizado para gerenciar estados de async operations
 */
export function useLoading(): UseLoadingReturn {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setSuccess(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleAsync = useCallback(
    async <T = any,>(
      fn: () => Promise<T>,
      options?: {
        successMessage?: string
        errorMessage?: string
        onSuccess?: (data: T) => void
        onError?: (error: Error) => void
      }
    ): Promise<T | null> => {
      try {
        setLoading(true)
        setError(null)
        setSuccess(null)

        const data = await fn()

        if (options?.successMessage) {
          setSuccess(options.successMessage)
          // Limpar mensagem após 5 segundos
          timeoutRef.current = setTimeout(() => {
            setSuccess(null)
          }, 5000)
        }

        options?.onSuccess?.(data)
        return data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : (options?.errorMessage || 'Erro desconhecido')
        setError(errorMessage)

        options?.onError?.(err instanceof Error ? err : new Error(errorMessage))
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    isLoading,
    error,
    success,
    setLoading,
    setError,
    setSuccess,
    reset,
    handleAsync,
  }
}

/**
 * Hook para múltiplas operações assíncronas
 */
export interface UseAsyncStateReturn<T> extends LoadingState {
  data: T | null
  execute: (fn: () => Promise<T>) => Promise<void>
  retry: () => Promise<void>
}

export function useAsyncState<T = any>(
  initialFn?: () => Promise<T>,
  options?: {
    onError?: (error: Error) => void
  }
): UseAsyncStateReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const { isLoading, error, success, setLoading, setError, setSuccess } = useLoading()
  const lastFnRef = useRef<() => Promise<T>>(initialFn)

  const execute = useCallback(
    async (fn: () => Promise<T>) => {
      lastFnRef.current = fn
      try {
        setLoading(true)
        setError(null)
        const result = await fn()
        setData(result)
        setSuccess('Carregado com sucesso')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar'
        setError(errorMessage)
        options?.onError?.(err instanceof Error ? err : new Error(errorMessage))
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setSuccess, options]
  )

  const retry = useCallback(async () => {
    if (lastFnRef.current) {
      await execute(lastFnRef.current)
    }
  }, [execute])

  return {
    data,
    isLoading,
    error,
    success,
    execute,
    retry,
  }
}
