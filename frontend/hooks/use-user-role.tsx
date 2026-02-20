"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

/**
 * Hook para gerenciar o role do usuário
 * Decodifica o token JWT para extrair o role e tipo de usuário
 * 
 * @returns {Object} { role, isLoading, isBarbershopOwner, isClient }
 */
export function useUserRole() {
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkRole = () => {
      try {
        // Busca o token do localStorage
        const token = localStorage.getItem('token')
        
        if (!token) {
          setRole(null)
          setIsLoading(false)
          return
        }

        // Decodifica o JWT para extrair as informações do usuário
        const decoded: any = jwtDecode(token)
        const userRole = decoded.role || null
        
        setRole(userRole)
      } catch (error) {
        console.error('Erro ao decodificar token:', error)
        // Se houver erro, limpa o token inválido
        localStorage.removeItem('token')
        setRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkRole()
  }, [])

  // Retorna o role e funções auxiliares para verificar tipo de usuário
  return {
    role,
    isLoading,
    isBarbershopOwner: role === 'barbershop_owner',
    isClient: role === 'client',
  }
}
