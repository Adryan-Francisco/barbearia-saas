import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key';
let stripe: Stripe;

// Initialize Stripe only when needed
function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(stripeSecretKey, {});
  }
  return stripe;
}

export interface StripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export interface StripeCustomer {
  customerId: string;
  email: string;
}

/**
 * Criar um Payment Intent para processar pagamentos
 */
export async function createPaymentIntent(
  amount: number, // em centavos
  currency: string = 'brl',
  description: string,
  metadata?: { [key: string]: string }
): Promise<StripePaymentIntent> {
  try {
    const paymentIntent = await getStripe().paymentIntents.create({
      amount,
      currency,
      description,
      metadata,
    });

    return {
      clientSecret: paymentIntent.client_secret || '',
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Erro ao criar Payment Intent:', error);
    throw error;
  }
}

/**
 * Processar pagamento com Stripe
 */
export async function processStripePayment(
  amount: number,
  token: string,
  description: string,
  customerEmail: string
): Promise<any> {
  try {
    const charge = await getStripe().charges.create({
      amount,
      currency: 'brl',
      source: token,
      description,
      receipt_email: customerEmail,
    });

    return {
      success: true,
      chargeId: charge.id,
      amount: charge.amount,
      status: charge.status,
    };
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    throw error;
  }
}

/**
 * Criar ou recuperar um cliente Stripe
 */
export async function createOrGetStripeCustomer(
  email: string,
  name: string
): Promise<StripeCustomer> {
  try {
    // Buscar cliente existente
    const customers = await getStripe().customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return {
        customerId: customers.data[0].id,
        email: customers.data[0].email || email,
      };
    }

    // Criar novo cliente
    const customer = await getStripe().customers.create({
      email,
      name,
    });

    return {
      customerId: customer.id,
      email: customer.email || email,
    };
  } catch (error) {
    console.error('Erro ao criar/obter cliente Stripe:', error);
    throw error;
  }
}

/**
 * Obter informações de um Payment Intent
 */
export async function getPaymentIntentStatus(paymentIntentId: string): Promise<any> {
  try {
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Erro ao obter status do Payment Intent:', error);
    throw error;
  }
}

/**
 * Criar um Refund
 */
export async function createRefund(
  chargeId: string,
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' = 'requested_by_customer'
): Promise<any> {
  try {
    const refund = await getStripe().refunds.create({
      charge: chargeId,
      reason,
    });

    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
    };
  } catch (error) {
    console.error('Erro ao processar reembolso:', error);
    throw error;
  }
}

/**
 * Listar transações de um cliente
 */
export async function getCustomerCharges(customerId: string, limit: number = 10): Promise<any[]> {
  try {
    const charges = await getStripe().charges.list({
      customer: customerId,
      limit,
    });

    return charges.data.map((charge) => ({
      id: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      status: charge.status,
      created: charge.created,
      description: charge.description,
    }));
  } catch (error) {
    console.error('Erro ao obter transações do cliente:', error);
    throw error;
  }
}

/**
 * Validar webhook do Stripe
 */
export function validateStripeWebhook(
  body: string,
  signature: string,
  webhookSecret: string
): any {
  try {
    const event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    return event;
  } catch (error) {
    console.error('Erro ao validar webhook:', error);
    throw error;
  }
}

/**
 * Criar uma assinatura (para futuros pagamentos recorrentes)
 */
export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata?: { [key: string]: string }
): Promise<any> {
  try {
    const subscription = await getStripe().subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
    });

    return {
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end,
    };
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    throw error;
  }
}
