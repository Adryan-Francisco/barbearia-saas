'use client'

import React, { ReactNode, useState } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  errorCount: number
}

/**
 * Error Boundary para capturar erros em componentes React
 * Fornece fallback UI limpa e opções de recuperação
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))

    // Log para desenvolvimento
    console.error('❌ Error caught by ErrorBoundary:', error)
    console.error('ComponentStack:', errorInfo.componentStack)

    // Callback customizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Reportar erro para serviço de análise (opcional)
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: reportErrorToService(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Oops! Algo deu errado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="bg-slate-100 rounded p-3 text-sm font-mono text-slate-700 max-h-[120px] overflow-y-auto break-words">
                  {this.state.error.toString()}
                </div>
              )}

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="text-xs text-slate-600 cursor-pointer">
                  <summary className="font-semibold hover:text-slate-900">
                    Stack Trace (Dev only)
                  </summary>
                  <pre className="mt-2 bg-slate-100 p-2 rounded overflow-y-auto max-h-[150px] text-slate-700">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <p className="text-sm text-slate-600">
                Tentamos carregar esta página, mas encontramos um erro. Por favor,
                tente novamente.
              </p>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={this.resetError}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="default" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Voltar para Home
                  </Button>
                </Link>
              </div>

              {this.state.errorCount > 3 && (
                <div className="mt-4 p-3 bg-amber-100 border border-amber-300 rounded text-sm text-amber-900">
                  ⚠️ Múltiplos erros detectados. Tente limpar o cache do navegador.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
