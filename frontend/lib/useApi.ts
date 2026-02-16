/**
 * Hook personalizado para fazer requisições à API
 * Uso: const { data, loading, error } = useApi('/endpoint')
 */

import { useState, useEffect, useCallback } from 'react';
import apiCall, { 
  authAPI, 
  schedulingAPI, 
  barbershopAPI, 
  reviewsAPI, 
  analyticsAPI, 
  paymentsAPI,
  stripeAPI,
  healthAPI 
} from './api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para requisições GET simples
 */
export function useApi<T>(
  endpoint: string,
  options?: { skip?: boolean }
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await apiCall<T>(endpoint);
    if (result.error) {
      setError(result.error.message);
    } else {
      setData(result.data || null);
    }
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    if (options?.skip) return;
    refetch();
  }, [endpoint, options?.skip, refetch]);

  return { data, loading, error, refetch };
}

// Exporte APIs para uso direto
export {
  apiCall,
  authAPI,
  schedulingAPI,
  barbershopAPI,
  reviewsAPI,
  analyticsAPI,
  paymentsAPI,
  stripeAPI,
  healthAPI,
};

