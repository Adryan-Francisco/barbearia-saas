import { Router } from 'express';
import {
  createBarbershop,
  getMyBarbershop,
  getAllBarbershops,
  getBarbershopById,
  updateBarbershop,
  deleteBarbershop,
  getBarbershopAppointments,
  getBarbershopAppointmentsByDate,
  confirmAppointment,
  getBarbershopStats,
} from '../controllers/barbershopController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// CRUD Routes
// Criar nova barbearia (requer autenticação)
router.post('/', authMiddleware, createBarbershop);

// Obter minha barbearia (requer autenticação)
router.get('/me', authMiddleware, getMyBarbershop);

// Obter todas as barbearias (público)
router.get('/', getAllBarbershops);

// Obter uma barbearia específica (público)
router.get('/:barbershop_id', getBarbershopById);

// Atualizar barbearia (requer autenticação)
router.put('/:barbershop_id', authMiddleware, updateBarbershop);

// Deletar barbearia (requer autenticação)
router.delete('/:barbershop_id', authMiddleware, deleteBarbershop);

// Legacy Routes - Agendamentos e estatísticas
router.get('/:barbershop_id/appointments', getBarbershopAppointments);
router.get('/:barbershop_id/appointments/:date', getBarbershopAppointmentsByDate);
router.put('/appointments/:appointment_id/confirm', confirmAppointment);
router.get('/:barbershop_id/stats', getBarbershopStats);

export default router;
