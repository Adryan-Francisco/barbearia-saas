import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Adicionar token ao header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: { name: string; phone: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { phone: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const schedulingAPI = {
  createAppointment: (data: {
    barbershop_id: string;
    service_id: string;
    appointment_date: string;
    appointment_time: string;
  }) => api.post('/scheduling/appointments', data),
  cancelAppointment: (appointmentId: string) =>
    api.delete(`/scheduling/appointments/${appointmentId}`),
  listAppointments: () => api.get('/scheduling/appointments'),
  getAvailableSlots: (barbershop_id: string, date: string) =>
    api.get('/scheduling/available-slots', {
      params: { barbershop_id, date },
    }),
};

export default api;
