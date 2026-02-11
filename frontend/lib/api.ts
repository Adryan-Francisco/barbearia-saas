/**
 * Cliente centralizado para chamadas à API
 * Todas as requisições devem passar por este arquivo para mantê-las consistentes
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiError {
  message: string;
  status: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
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

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        error: {
          message: data?.error || response.statusText,
          status: response.status,
        },
      };
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
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    }),

  register: (name: string, phone: string, password: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, password }),
    }),

  getProfile: () => apiCall('/auth/profile'),

  barbershopLogin: (email: string, password: string) =>
    apiCall('/auth/barbershop-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  barbershopRegister: (data: { name: string; email: string; phone: string; password: string }) =>
    apiCall('/auth/barbershop-register', {
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
    apiCall(`/scheduling/available-slots?barbershopId=${barbershopId}&date=${date}`),
};

// ==================== BARBERSHOP ====================
export const barbershopAPI = {
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

// ==================== HEALTH ====================
export const healthAPI = {
  check: () => apiCall('/health'),
};

export default apiCall;
