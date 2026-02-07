import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getCancellationHistory,
  getBarbershopCancellationStats,
} from '../controllers/cancellationController';

const router = Router();

// Obter histórico de cancelamentos do cliente
router.get('/history', authMiddleware, getCancellationHistory);

// Obter estatísticas de cancelamentos da barbearia
router.get('/stats/:barbershopId', authMiddleware, getBarbershopCancellationStats);

export default router;
