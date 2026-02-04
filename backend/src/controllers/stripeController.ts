import { Request, Response } from 'express';
import {
  createPaymentIntent,
  processStripePayment,
  createOrGetStripeCustomer,
  getPaymentIntentStatus,
  createRefund,
  getCustomerCharges,
} from '../services/stripeService';

/**
 * Criar Payment Intent para o cliente finalizar o pagamento
 */
export async function createPaymentIntentHandler(req: Request, res: Response) {
  try {
    const { amount, description, metadata } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: 'Amount and description are required' });
    }

    // Converter para centavos
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await createPaymentIntent(
      amountInCents,
      'brl',
      description,
      metadata
    );

    res.json(paymentIntent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Confirmar pagamento com token de cartão
 */
export async function confirmPaymentHandler(req: Request, res: Response) {
  try {
    const { amount, token, description, email } = req.body;

    if (!amount || !token || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Converter para centavos
    const amountInCents = Math.round(amount * 100);

    const result = await processStripePayment(
      amountInCents,
      token,
      description,
      email
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Obter ou criar cliente Stripe
 */
export async function createStripeCustomerHandler(req: Request, res: Response) {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const customer = await createOrGetStripeCustomer(email, name);
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Verificar status do Payment Intent
 */
export async function getPaymentStatusHandler(req: Request, res: Response) {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment Intent ID is required' });
    }

    const status = await getPaymentIntentStatus(paymentIntentId);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Processar reembolso
 */
export async function refundPaymentHandler(req: Request, res: Response) {
  try {
    const { chargeId, reason } = req.body;

    if (!chargeId) {
      return res.status(400).json({ error: 'Charge ID is required' });
    }

    const result = await createRefund(chargeId, reason || 'requested_by_customer');
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Obter histórico de transações do cliente
 */
export async function getCustomerTransactionsHandler(req: Request, res: Response) {
  try {
    const { customerId } = req.params;
    const { limit } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const charges = await getCustomerCharges(
      customerId,
      limit ? parseInt(limit as string) : 10
    );

    res.json({
      customerId,
      transactions: charges,
      total: charges.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Webhook do Stripe para processar eventos
 */
export async function handleStripeWebhookHandler(req: Request, res: Response) {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    if (!webhookSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET not configured');
      return res.status(400).json({ error: 'Webhook secret not configured' });
    }

    // Importar a função de validação do serviço
    const { validateStripeWebhook } = await import('../services/stripeService');
    const event = validateStripeWebhook(
      typeof (req as any).rawBody === 'string' ? (req as any).rawBody : JSON.stringify(req.body),
      signature,
      webhookSecret
    );

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('✅ Pagamento bem-sucedido:', event.data.object.id);
        // Aqui você pode atualizar seu banco de dados
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Pagamento falhou:', event.data.object.id);
        // Aqui você pode notificar o cliente
        break;

      case 'charge.refunded':
        console.log('💸 Reembolso processado:', event.data.object.id);
        // Atualizar status do pagamento
        break;

      default:
        console.log('Evento Stripe recebido:', event.type);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    res.status(400).json({ error: error.message });
  }
}
