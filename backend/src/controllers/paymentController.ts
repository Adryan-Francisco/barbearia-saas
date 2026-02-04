import { Request, Response } from 'express';
import {
  createPayment,
  updatePaymentStatus,
  getPaymentsByBarbershop,
  getPaymentsByAppointment,
  getTotalRevenue,
  refundPayment,
} from '../services/paymentService';
import { websocketService } from '../services/websocketService';

export async function createPaymentHandler(req: Request, res: Response) {
  try {
    const { appointmentId, barbershopId, clientId, amount, paymentMethod } =
      req.body;

    if (!appointmentId || !barbershopId || !clientId || !amount) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const payment = await createPayment(
      appointmentId,
      barbershopId,
      clientId,
      amount,
      paymentMethod || 'cash'
    );

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updatePaymentStatusHandler(req: Request, res: Response) {
  try {
    const { paymentId } = req.params;
    const { status, transactionId } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório' });
    }

    const payment = await updatePaymentStatus(paymentId, status, transactionId);
    
    // Emitir notificação via WebSocket
    if (status === 'completed') {
      websocketService.notifyPaymentProcessed(payment.barbershop_id, {
        amount: payment.amount,
        paymentId: paymentId,
        transactionId: transactionId
      });
    }
    
    res.json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPaymentsHandler(req: Request, res: Response) {
  try {
    const { barbershopId } = req.params;
    const { status } = req.query;

    const payments = await getPaymentsByBarbershop(
      barbershopId,
      status as string
    );

    res.json({
      total: payments.length,
      payments,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPaymentDetailHandler(req: Request, res: Response) {
  try {
    const { appointmentId } = req.params;

    const payment = await getPaymentsByAppointment(appointmentId);
    if (!payment) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    res.json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getRevenueHandler(req: Request, res: Response) {
  try {
    const { barbershopId } = req.params;
    const { startDate, endDate } = req.query;

    const revenue = await getTotalRevenue(
      barbershopId,
      startDate as string,
      endDate as string
    );

    res.json({ revenue });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function refundPaymentHandler(req: Request, res: Response) {
  try {
    const { paymentId } = req.params;

    const payment = await refundPayment(paymentId);
    res.json({
      message: 'Reembolso processado',
      payment,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
