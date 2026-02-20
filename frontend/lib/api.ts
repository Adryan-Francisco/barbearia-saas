/**
 * Cliente centralizado para chamadas à API
 * Todas as requisições devem passar por este arquivo para mantê-las consistentes
 */

// Garantir que a URL sempre tenha /api no final
const getApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  // Se já termina com /api, retorna como está
  if (baseUrl.endsWith('/api')) {
    return baseUrl;
  }
  
  // Se não termina com /api, adiciona
  return `${baseUrl}/api`;
};

const API_URL = getApiUrl();

interface ApiError {
  message: string;
  status: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// Auth Response Types
interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    role: string;
  };
}

interface ProfileResponse {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
}

/**
 * Faz uma requisição à API
 */
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options?.headers && typeof options.headers === 'object' && !Array.isArray(options.headers)) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers as Record<string, string>);
      }
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data: any = null;
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      try {
        // Try to get raw text first
        const responseClone = response.clone();
        const responseText = await responseClone.text();
        
        console.log(`📄 [${response.status}] Raw response text:`, responseText);
        console.log(`📄 [${response.status}] Content-Type:`, contentType);
        
        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.warn(`⚠️ Failed to parse JSON, using raw text`);
            data = { error: responseText };
          }
        } else {
          console.warn(`⚠️ Empty response body`);
          data = { error: response.statusText || 'Unknown error' };
        }
      } catch (error) {
        console.error('🔥 Error reading response:', error);
        data = { error: response.statusText || 'Unknown error' };
      }

      console.error(`🔴 API Error [${response.status}]:`, {
        status: response.status,
        statusText: response.statusText,
        contentType,
        data
      });
      
      let errorMessage = response.statusText || 'Unknown error';
      
      // Parsear diferentes formatos de erro
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data?.error) {
        errorMessage = typeof data.error === 'string' ? data.error : (data.error.message || data.error.msg || response.statusText);
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.msg) {
        errorMessage = data.msg;
      }
      
      return {
        error: {
          message: errorMessage || response.statusText || `HTTP ${response.status}`,
          status: response.status,
        },
      };
    }

    // Success response
    try {
      if (contentType?.includes('application/json')) {
        const responseClone = response.clone();
        const responseText = await responseClone.text();
        data = responseText ? JSON.parse(responseText) : {};
      } else {
        data = await response.json().catch(() => ({}));
      }
    } catch (parseError) {
      console.warn('⚠️ Error parsing success response:', parseError);
      data = {};
    }

    return {
      data: data as T,
    };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'Erro na requisição',
        status: 0,
      },
    };
  }
}

// ==================== AUTH ====================
export const authAPI = {
  login: (phone: string, password: string) =>
    apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    }),

  register: (name: string, phone: string, password: string) =>
    apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, password }),
    }),

  getProfile: () => apiCall<ProfileResponse>('/auth/profile'),

  updateProfile: (name: string, phone: string) =>
    apiCall<ProfileResponse>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, phone }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  requestPasswordReset: (phone: string) =>
    apiCall('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  barbershopLogin: (email: string, password: string) =>
    apiCall<AuthResponse>('/auth/barbershop-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  barbershopRegister: (data: { name: string; email: string; phone: string; password: string }) =>
    apiCall<AuthResponse>('/auth/barbershop-register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ==================== SCHEDULING ====================
export const schedulingAPI = {
  createAppointment: (data: {
    barbershop_id: string;
    service_id: string;
    appointment_date: string;
    appointment_time: string;
  }) =>
    apiCall('/scheduling/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelAppointment: (appointmentId: string) =>
    apiCall(`/scheduling/appointments/${appointmentId}`, {
      method: 'DELETE',
    }),

  getAppointments: () => apiCall('/scheduling/appointments'),

  getAvailableSlots: (barbershopId: string, date: string) =>
    apiCall(`/scheduling/available-slots?barbershop_id=${barbershopId}&date=${date}`),
};

// ==================== BARBERSHOP ====================
export const barbershopAPI = {
  getMyBarbershop: () =>
    apiCall(`/barbershops/me`),

  getServices: (barbershop_id: string) =>
    apiCall(`/barbershops/${barbershop_id}/services`),

  getAppointments: (barbershop_id: string) =>
    apiCall(`/barbershop/${barbershop_id}/appointments`),

  getAppointmentsByDate: (barbershop_id: string, date: string) =>
    apiCall(`/barbershop/${barbershop_id}/appointments/${date}`),

  confirmAppointment: (appointment_id: string) =>
    apiCall(`/barbershop/appointments/${appointment_id}/confirm`, {
      method: 'PUT',
    }),

  getStats: (barbershop_id: string) =>
    apiCall(`/barbershop/${barbershop_id}/stats`),

  getRealtimeMetrics: (barbershop_id: string) =>
    apiCall(`/barbershop/${barbershop_id}/realtime-metrics`),

  getHourlyMetrics: (barbershop_id: string, date?: string) =>
    apiCall(
      `/barbershop/${barbershop_id}/hourly-metrics${date ? `?date=${date}` : ''}`
    ),

  getDailyTrend: (barbershop_id: string, days: number = 7) =>
    apiCall(`/barbershop/${barbershop_id}/daily-trend?days=${days}`),
};

// ==================== REVIEWS ====================
export const reviewsAPI = {
  getReviews: (barbershop_id: string) =>
    apiCall(`/reviews/${barbershop_id}`),

  postReview: (data: {
    barbershop_id: string;
    client_id: string;
    rating: number;
    comment: string;
  }) =>
    apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteReview: (review_id: string) =>
    apiCall(`/reviews/${review_id}`, {
      method: 'DELETE',
    }),

  updateReview: (review_id: string, data: { rating: number; comment: string }) =>
    apiCall(`/reviews/${review_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ==================== ANALYTICS ====================
export const analyticsAPI = {
  getAnalytics: (barbershop_id: string) =>
    apiCall(`/analytics/${barbershop_id}/analytics`),

  getClients: (barbershop_id: string) =>
    apiCall(`/analytics/${barbershop_id}/clients`),

  getClientDetail: (barbershop_id: string, client_id: string) =>
    apiCall(`/analytics/${barbershop_id}/clients/${client_id}`),

  getRevenue: (barbershop_id: string, month: string) =>
    apiCall(`/analytics/${barbershop_id}/revenue/${month}`),
};

// ==================== PAYMENTS ====================
export const paymentsAPI = {
  getPayments: (barbershop_id: string) =>
    apiCall(`/payments/${barbershop_id}/payments`),

  getRevenue: (barbershop_id: string) =>
    apiCall(`/payments/${barbershop_id}/revenue`),
};

// ==================== STRIPE ====================
export const stripeAPI = {
  createPaymentIntent: (data: { barbershop_id: string; amount: number }) =>
    apiCall('/stripe/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ==================== VERSION ====================
export const versionAPI = {
  getVersion: () => apiCall('/version'),
  
  incrementVersion: () =>
    apiCall('/version/increment', {
      method: 'POST',
    }),
};

// ==================== HEALTH ====================
export const healthAPI = {
  check: () => apiCall('/health'),
};

export default apiCall;
