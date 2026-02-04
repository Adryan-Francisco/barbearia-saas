import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(__dirname, '../../data/barbearia.json');

interface Payment {
  id: string;
  appointment_id: string;
  barbershop_id: string;
  client_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'stripe' | 'mercadopago' | 'cash';
  stripe_payment_intent_id?: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

async function loadDatabase() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function saveDatabase(db: any) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function createPayment(
  appointmentId: string,
  barbershopId: string,
  clientId: string,
  amount: number,
  paymentMethod: 'stripe' | 'mercadopago' | 'cash' = 'cash'
): Promise<Payment> {
  const db = await loadDatabase();

  const payment: Payment = {
    id: uuidv4(),
    appointment_id: appointmentId,
    barbershop_id: barbershopId,
    client_id: clientId,
    amount,
    status: 'pending',
    payment_method: paymentMethod,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.payments.push(payment);
  await saveDatabase(db);
  return payment;
}

export async function updatePaymentStatus(
  paymentId: string,
  status: 'completed' | 'failed' | 'refunded',
  transactionId?: string
): Promise<Payment> {
  const db = await loadDatabase();
  const payment = db.payments.find((p: Payment) => p.id === paymentId);

  if (!payment) {
    throw new Error('Pagamento não encontrado');
  }

  payment.status = status;
  if (transactionId) payment.transaction_id = transactionId;
  payment.updated_at = new Date().toISOString();

  await saveDatabase(db);
  return payment;
}

export async function getPaymentsByBarbershop(
  barbershopId: string,
  status?: string
): Promise<Payment[]> {
  const db = await loadDatabase();
  let payments = db.payments.filter((p: Payment) => p.barbershop_id === barbershopId);

  if (status) {
    payments = payments.filter((p: Payment) => p.status === status);
  }

  return payments;
}

export async function getPaymentsByAppointment(appointmentId: string): Promise<Payment | null> {
  const db = await loadDatabase();
  return db.payments.find((p: Payment) => p.appointment_id === appointmentId) || null;
}

export async function getTotalRevenue(
  barbershopId: string,
  startDate?: string,
  endDate?: string
): Promise<number> {
  const db = await loadDatabase();
  let payments = db.payments.filter(
    (p: Payment) =>
      p.barbershop_id === barbershopId && p.status === 'completed'
  );

  if (startDate) {
    payments = payments.filter((p: Payment) => p.created_at >= startDate);
  }
  if (endDate) {
    payments = payments.filter((p: Payment) => p.created_at <= endDate);
  }

  return payments.reduce((sum: number, p: Payment) => sum + p.amount, 0);
}

export async function refundPayment(paymentId: string): Promise<Payment> {
  const db = await loadDatabase();
  const payment = db.payments.find((p: Payment) => p.id === paymentId);

  if (!payment) {
    throw new Error('Pagamento não encontrado');
  }

  if (payment.status !== 'completed') {
    throw new Error('Só pagamentos completados podem ser reembolsados');
  }

  payment.status = 'refunded';
  payment.updated_at = new Date().toISOString();

  await saveDatabase(db);
  return payment;
}
