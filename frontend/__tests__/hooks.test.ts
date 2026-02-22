/**
 * Testes para hooks do frontend
 * Nota: Estes são exemplos, pois testes de hooks React requerem React Testing Library
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useLoading } from '@/hooks/use-loading'
import { usePagination, useData } from '@/hooks/use-pagination'
import { PaginatedResponse } from '@/lib/cache'

describe('useLoading Hook', () => {
  it('inicia com estado padrão', () => {
    const { result } = renderHook(() => useLoading())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.success).toBeNull()
  })

  it('gerencia estados de async operation', async () => {
    const { result } = renderHook(() => useLoading())

    const mockFn = jest.fn(async () => {
      return { id: 1, name: 'Test' }
    })

    act(() => {
      result.current.handleAsync(mockFn, {
        successMessage: 'Sucesso!',
      })
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.success).toBe('Sucesso!')
    expect(mockFn).toHaveBeenCalled()
  })

  it('captura erros em async operation', async () => {
    const { result } = renderHook(() => useLoading())

    const mockError = new Error('Teste de erro')
    const mockFn = jest.fn(async () => {
      throw mockError
    })

    act(() => {
      result.current.handleAsync(mockFn, {
        errorMessage: 'Erro ao processar',
      })
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('Teste de erro')
  })

  it('reseta estado corretamente', async () => {
    const { result } = renderHook(() => useLoading())

    act(() => {
      result.current.setError('Erro teste')
      result.current.setLoading(true)
      result.current.setSuccess('Sucesso teste')
    })

    expect(result.current.error).toBe('Erro teste')
    expect(result.current.isLoading).toBe(true)
    expect(result.current.success).toBe('Sucesso teste')

    act(() => {
      result.current.reset()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.success).toBeNull()
  })
})

describe('usePagination Hook', () => {
  const mockFetch = jest.fn(async (params) => {
    const mockData: PaginatedResponse<any> = {
      data: [{ id: 1 }, { id: 2 }],
      page: params.page,
      limit: params.limit,
      total: 100,
      pages: 10,
      hasNextPage: params.page < 10,
      hasPreviousPage: params.page > 1,
    }
    return mockData
  })

  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('carrega primeira página ao montar', async () => {
    const { result } = renderHook(() =>
      usePagination('test-endpoint', mockFetch, {
        initialPage: 1,
        initialLimit: 10,
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.page).toBe(1)
    expect(result.current.limit).toBe(10)
  })

  it('navega pelas páginas', async () => {
    const { result } = renderHook(() =>
      usePagination('test-endpoint', mockFetch, {
        initialPage: 1,
        initialLimit: 10,
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.nextPage()
    })

    await waitFor(() => {
      expect(result.current.page).toBe(2)
    })
  })

  it('fornece informações de paginação corretas', async () => {
    const { result } = renderHook(() =>
      usePagination('test-endpoint', mockFetch, {
        initialPage: 1,
        initialLimit: 10,
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.total).toBe(100)
    expect(result.current.pages).toBe(10)
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.hasPreviousPage).toBe(false)
  })

  it('gera erro ao falhar fetch', async () => {
    const errorFetch = jest.fn(async () => {
      throw new Error('Erro de fetch')
    })

    const { result } = renderHook(() =>
      usePagination('test-endpoint', errorFetch)
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('Erro de fetch')
    expect(result.current.data).toHaveLength(0)
  })
})

describe('useData Hook', () => {
  const mockFetch = jest.fn(async () => {
    return { id: 1, name: 'Test Data' }
  })

  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('carrega dados ao montar', async () => {
    const { result } = renderHook(() => useData('test-key', mockFetch))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual({ id: 1, name: 'Test Data' })
    expect(mockFetch).toHaveBeenCalled()
  })

  it('pula carregamento quando skip=true', () => {
    const { result } = renderHook(() => useData('test-key', mockFetch, { skip: true }))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('refetch busca dados novamente', async () => {
    const { result } = renderHook(() => useData('test-key', mockFetch))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    mockFetch.mockClear()

    act(() => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('captura erros de fetch', async () => {
    const errorFetch = jest.fn(async () => {
      throw new Error('Erro no carregamento')
    })

    const { result } = renderHook(() => useData('test-key', errorFetch))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('Erro no carregamento')
    expect(result.current.data).toBeNull()
  })
})
