import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../utils/database';
import { AppError } from '../middleware/errorHandler';
import { sendWhatsAppMessage } from '../services/whatsappService';
import { getAvailableSlots, isSlotAvailable } from '../services/schedulingService';

export async function createAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const { barbershop_id, service_id, appointment_date, appointment_time } = req.body;

    if (!barbershop_id || !service_id || !appointment_date || !appointment_time) {
      throw new AppError('Todos os campos são obrigatórios', 400);
    }

    const available = await isSlotAvailable(barbershop_id, appointment_date, appointment_time);
    
    if (!available) {
      throw new AppError('Este horário não está disponível', 409);
    }

    const db = await getDatabase();
    const id = uuidv4();

    const client = db.users.find((u: any) => u.id === req.user!.id);
    const barbershop = db.barbershops.find((b: any) => b.id === barbershop_id);
    const service = db.services.find((s: any) => s.id === service_id);

    db.appointments.push({
      id,
      barbershop_id,
      client_id: req.user.id,
      service_id,
      appointment_date,
      appointment_time,
      status: 'confirmed',
      created_at: new Date(),
      updated_at: new Date()
    });

    await saveDatabase();

    if (barbershop && client && service) {
      const message = `Olá ${client.name}! Seu agendamento foi confirmado!\n\nServiço: ${service.name}\nData: ${appointment_date}\nHorário: ${appointment_time}\n\nObrigado!`;
      
      try {
        await sendWhatsAppMessage(client.phone, message);
      } catch (error) {
        console.error('Error sending WhatsApp message:', error);
      }
    }

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: {
        id,
        barbershop_id,
        service_id,
        appointment_date,
        appointment_time,
        status: 'confirmed'
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const { appointmentId } = req.params;

    if (!appointmentId) {
      throw new AppError('ID do agendamento é obrigatório', 400);
    }

    const db = await getDatabase();

    const appointmentIndex = db.appointments.findIndex(
      (a: any) => a.id === appointmentId && a.client_id === req.user!.id
    );

    if (appointmentIndex === -1) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    const appointment = db.appointments[appointmentIndex];

    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    const now = new Date();
    const oneHourBefore = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);

    if (now > oneHourBefore) {
      throw new AppError('Não é possível cancelar com menos de 1 hora de antecedência', 409);
    }

    db.appointments[appointmentIndex].status = 'cancelled';
    db.appointments[appointmentIndex].updated_at = new Date();

    await saveDatabase();

    const client = db.users.find((u: any) => u.id === req.user!.id);

    if (client) {
      const message = `Olá ${client.name}! Seu agendamento foi cancelado com sucesso.`;
      
      try {
        await sendWhatsAppMessage(client.phone, message);
      } catch (error) {
        console.error('Error sending WhatsApp cancellation message:', error);
      }
    }

    res.json({
      message: 'Appointment cancelled successfully',
      appointment: { id: appointmentId, status: 'cancelled' }
    });
  } catch (error) {
    next(error);
  }
}

export async function listAppointments(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const db = await getDatabase();
    const appointments = db.appointments
      .filter((a: any) => a.client_id === req.user!.id)
      .map((a: any) => {
        const service = db.services.find((s: any) => s.id === a.service_id);
        const barbershop = db.barbershops.find((b: any) => b.id === a.barbershop_id);
        return {
          ...a,
          service_name: service?.name,
          barbershop_name: barbershop?.name
        };
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(`${b.appointment_date}T${b.appointment_time}`);
        const dateB = new Date(`${a.appointment_date}T${a.appointment_time}`);
        return dateA.getTime() - dateB.getTime();
      });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
}

export async function getAvailableSlotsByBarbershop(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id, date } = req.query;

    if (!barbershop_id || !date) {
      throw new AppError('Barbershop ID and date are required', 400);
    }

    const slots = await getAvailableSlots(barbershop_id as string, date as string);

    res.json({ date, slots });
  } catch (error) {
    next(error);
  }
}
