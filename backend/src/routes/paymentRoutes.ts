import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createPaymentHandler,
  updatePaymentStatusHandler,
  getPaymentsHandler,
  getPaymentDetailHandler,
  getRevenueHandler,
  refundPaymentHandler,
} from '../controllers/paymentController';

const router = Router();

// Criar pagamento
router.post('/payments', authMiddleware, createPaymentHandler);

// Obter pagamentos de uma barbearia
router.get('/:barbershopId/payments', authMiddleware, getPaymentsHandler);

// Atualizar status do pagamento
router.put('/payments/:paymentId', authMiddleware, updatePaymentStatusHandler);

// Obter detalhes de um pagamento
router.get('/payment/:appointmentId', authMiddleware, getPaymentDetailHandler);

// Obter receita total
router.get('/:barbershopId/revenue', authMiddleware, getRevenueHandler);

// Reembolsar pagamento
router.post('/payments/:paymentId/refund', authMiddleware, refundPaymentHandler);

export default router;
