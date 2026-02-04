import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getClientHistoryHandler,
  getClientDetailHandler,
  getAnalyticsHandler,
  getRevenueStatsHandler,
} from '../controllers/analyticsController';

const router = Router();

// Histórico de clientes
router.get('/:barbershopId/clients', authMiddleware, getClientHistoryHandler);

// Detalhe de um cliente
router.get('/:barbershopId/clients/:clientId', authMiddleware, getClientDetailHandler);

// Analytics geral
router.get('/:barbershopId/analytics', authMiddleware, getAnalyticsHandler);

// Estatísticas de receita por mês
router.get('/:barbershopId/revenue/:month', authMiddleware, getRevenueStatsHandler);

export default router;
