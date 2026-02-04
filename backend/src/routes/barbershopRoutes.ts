import { Router } from 'express';
import {
  loginBarbershop,
  getBarbershopAppointments,
  getBarbershopAppointmentsByDate,
  confirmAppointment,
  getBarbershopStats,
} from '../controllers/barbershopController';
import {
  getRealtimeMetricsHandler,
  getHourlyMetricsHandler,
  getDailyTrendHandler,
} from '../controllers/realtimeController';

const router = Router();

// Login da barbearia
router.post('/login', loginBarbershop);

// Obter todos os agendamentos da barbearia
router.get('/:barbershop_id/appointments', getBarbershopAppointments);

// Obter agendamentos por data
router.get('/:barbershop_id/appointments/:date', getBarbershopAppointmentsByDate);

// Confirmar agendamento
router.put('/appointments/:appointment_id/confirm', confirmAppointment);

// Obter estatísticas da barbearia
router.get('/:barbershop_id/stats', getBarbershopStats);

// Métricas em tempo real
router.get('/:barbershop_id/realtime-metrics', getRealtimeMetricsHandler);

// Métricas por hora
router.get('/:barbershop_id/hourly-metrics', getHourlyMetricsHandler);

// Tendência diária
router.get('/:barbershop_id/daily-trend', getDailyTrendHandler);

export default router;
