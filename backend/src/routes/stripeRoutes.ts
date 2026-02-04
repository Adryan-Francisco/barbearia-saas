import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createPaymentIntentHandler,
  confirmPaymentHandler,
  createStripeCustomerHandler,
  getPaymentStatusHandler,
  refundPaymentHandler,
  getCustomerTransactionsHandler,
  handleStripeWebhookHandler,
} from '../controllers/stripeController';

const router = Router();

// Criar Payment Intent
router.post('/create-payment-intent', authMiddleware, createPaymentIntentHandler);

// Confirmar pagamento com token
router.post('/confirm-payment', authMiddleware, confirmPaymentHandler);

// Criar/obter cliente Stripe
router.post('/customer', authMiddleware, createStripeCustomerHandler);

// Obter status de pagamento
router.get('/payment-status/:paymentIntentId', authMiddleware, getPaymentStatusHandler);

// Reembolsar pagamento
router.post('/refund', authMiddleware, refundPaymentHandler);

// Obter transações do cliente
router.get('/customer/:customerId/transactions', authMiddleware, getCustomerTransactionsHandler);

// Webhook do Stripe (sem autenticação)
router.post('/webhook', handleStripeWebhookHandler);

export default router;
