/**
 * EXEMPLO PRÁTICO: Componente de Login Melhorado
 * Demonstra o uso de todos os novos sistemas de validação, cache e error handling
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useLoading } from '@/hooks/use-loading'
import { validateForm, formatPhone, SCHEMAS, validateField } from '@/lib/validators'
import { usePagination } from '@/hooks/use-pagination'
import { useData } from '@/hooks/use-data'
import { authAPI } from '@/lib/api'
import type { ValidationErrors } from '@/lib/validators'

export default function ImprovedLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isLoading, error, success, handleAsync } = useLoading()

  // Form state
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  /**
   * Atualizar campo com formatação automática
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // Formatar telefone ao digitar
    if (value && !value.startsWith('(')) {
      value = formatPhone(value)
    }
    setFormData({ ...formData, phone: value })
    // Limpar erro ao começar a corrigir
    if (validationErrors.phone) {
      setValidationErrors({ ...validationErrors, phone: '' })
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value })
    // Limpar erro ao começar a corrigir
    if (validationErrors.password) {
      setValidationErrors({ ...validationErrors, password: '' })
    }
  }

  /**
   * Validar e fazer login
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validar formulário
    const errors = validateForm(formData, SCHEMAS.clientLogin)

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast({
        variant: 'destructive',
        title: 'Validação falhou',
        description: 'Por favor, corrija os erros no formulário',
      })
      return
    }

    // Limpar erros de validação
    setValidationErrors({})

    // Executar login com tratamento automático de loading/erro
    const result = await handleAsync(
      async () => {
        const { data, error } = await authAPI.login(
          formData.phone,
          formData.password
        )

        if (error) {
          throw new Error(error.message)
        }

        return data
      },
      {
        successMessage: 'Login realizado com sucesso!',
        onSuccess: () => {
          // Redirecionar após sucesso
          setTimeout(() => {
            router.push('/cliente')
          }, 1500)
        },
        onError: (error) => {
          // Log for debugging
          console.error('Login error:', error)
        },
      }
    )

    if (!result) {
      // Error já foi tratado pelo handleAsync
      return
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Entrar como Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Exibir mensagens globais */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">
                ✅ {success}
              </div>
            )}

            {/* Campo de Telefone */}
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Input
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handlePhoneChange}
                disabled={isLoading}
                className={validationErrors.phone ? 'border-red-500' : ''}
              />
              {/* Exibir erro de validação */}
              {validationErrors.phone && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>
              )}
            </div>

            {/* Campo de Senha */}
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  className={validationErrors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Exibir erro de validação */}
              {validationErrors.password && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Botão de Submit */}
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Link para recuperar senha */}
            <div className="text-center">
              <a href="/recuperar-senha" className="text-sm text-blue-600 hover:underline">
                Esqueceu sua senha?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * EXEMPLOS DE USO ADICIONAIS
 */

// ===== EXEMPLO 1: Usando usePagination para listar barbearias =====
interface Barbershop {
  id: string
  name: string
}

export function ListBarbershopsExample() {
  const { data, isLoading, error, nextPage, previousPage, page, pages } = usePagination<Barbershop>(
    'barbershops',
    async (params: { page: number; limit: number }) => {
      const response = await fetch(
        `/api/barbershops?page=${params.page}&limit=${params.limit}`
      )
      return response.json()
    },
    { initialLimit: 10, ttl: 5 * 60 * 1000 }
  )

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      {data.map((shop: Barbershop) => (
        <div key={shop.id}>{shop.name}</div>
      ))}
      <button onClick={previousPage} disabled={page === 1}>
        Anterior
      </button>
      <span>
        Página {page} de {pages}
      </span>
      <button onClick={nextPage}>Próxima</button>
    </div>
  )
}

// ===== EXEMPLO 2: Usando useData para carregar informações do usuário =====
interface User {
  name: string
  email: string
}

export function UserProfileExample() {
  const { data: user, isLoading, error, refetch } = useData<User>(
    'user:profile',
    async () => {
      const response = await fetch('/api/user/profile')
      return response.json()
    },
    { ttl: 10 * 60 * 1000, tag: 'user' }
  )

  if (isLoading) return <div>Carregando perfil...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      <button onClick={refetch}>Atualizar</button>
    </div>
  )
}

// ===== EXEMPLO 3: Validação em tempo real =====
export function RealTimeValidationExample() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    // Validar em tempo real
    const error = validateField(value, 'email', {
      required: true,
      type: 'email',
    })

    setEmailError(error || '')
  }

  return (
    <div>
      <input value={email} onChange={handleEmailChange} />
      {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
    </div>
  )
}
