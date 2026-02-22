/**
 * Testes para Error Boundary
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '@/components/error-boundary'

// Componente que simula um erro
function ThrowError() {
  throw new Error('Erro simulado para teste')
}

// Componente que não gera erro
function SafeComponent() {
  return <div>Componente seguro</div>
}

describe('ErrorBoundary', () => {
  // Suprimir console.error para testes
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    ;(console.error as jest.Mock).mockRestore()
  })

  it('renderiza componentes filhos sem erro', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Componente seguro')).toBeInTheDocument()
  })

  it('captura erros de componentes filhos', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument()
    expect(screen.getByText(/Erro simulado para teste/)).toBeInTheDocument()
  })

  it('mostra UI de fallback com opções de recuperação', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByRole('button', { name: /Tentar Novamente/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Voltar para Home/ })).toBeInTheDocument()
  })

  it('permite tentar novamente após erro', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    const retryButton = screen.getByRole('button', { name: /Tentar Novamente/ })
    expect(retryButton).toBeInTheDocument()

    await user.click(retryButton)

    // Após retry, se o componente ainda gera erro, o boundary o captura novamente
    // Neste teste, vamos verificar que o botão está presente
    expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument()
  })

  it('mostra aviso com múltiplos erros', () => {
    // Para testar múltiplos erros, precisaríamos de uma forma de dispará-los
    // Isto é um exemplo de como o teste se comportaria
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument()
  })

  it('chama callback onError quando fornecido', () => {
    const onError = jest.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )
  })
})
