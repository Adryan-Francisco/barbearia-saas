import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { sendWhatsAppMessage } from '../services/whatsappService';
import { websocketService } from '../services/websocketService';
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

    // Verify barbershop and service exist
    const [barbershop, service] = await Promise.all([
      prisma.barbershop.findUnique({ where: { id: barbershop_id } }),
      prisma.service.findUnique({ where: { id: service_id } })
    ]);

    if (!barbershop || !service) {
      throw new AppError('Barbearia ou serviço não encontrados', 404);
    }

    const appointment = await prisma.appointment.create({
      data: {
        barbershopId: barbershop_id,
        clientId: req.user.id,
        serviceId: service_id,
        appointmentDate: new Date(appointment_date),
        appointmentTime: appointment_time,
        status: 'confirmed'
      },
      include: {
        client: true,
        barbershop: true,
        service: true
      }
    });

    // Notify via WebSocket
    websocketService.notifyAppointmentConfirmed(barbershop_id, {
      clientName: appointment.client.name,
      serviceName: service.name,
      date: appointment_date,
      time: appointment_time,
      appointmentId: appointment.id
    });

    // Send WhatsApp notification
    try {
      const message = `Olá ${appointment.client.name}! Seu agendamento foi confirmado!\n\nServiço: ${service.name}\nData: ${appointment_date}\nHorário: ${appointment_time}\n\nObrigado!`;
      await sendWhatsAppMessage(appointment.client.phone, message);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      appointment: {
        id: appointment.id,
        barbershop_id: appointment.barbershopId,
        service_id: appointment.serviceId,
        appointment_date: appointment.appointmentDate,
        appointment_time: appointment.appointmentTime,
        status: appointment.status
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

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true }
    });

    if (!appointment || appointment.clientId !== req.user.id) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    const appointmentDateTime = appointment.appointmentDate;
    const now = new Date();
    const oneHourBefore = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);

    if (now > oneHourBefore) {
      throw new AppError('Não é possível cancelar com menos de 1 hora de antecedência', 409);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'cancelled' }
    });

    // Notify via WebSocket
    websocketService.notifyAppointmentCancelled(appointment.barbershopId, {
      clientName: appointment.client.name,
      date: appointment.appointmentDate.toISOString().split('T')[0],
      time: appointment.appointmentTime,
      appointmentId: appointmentId
    });

    // Send WhatsApp notification
    try {
      const message = `Olá ${appointment.client.name}! Seu agendamento foi cancelado com sucesso.`;
      await sendWhatsAppMessage(appointment.client.phone, message);
    } catch (error) {
      console.error('Error sending WhatsApp cancellation message:', error);
    }

    res.json({
      message: 'Agendamento cancelado com sucesso',
      appointment: { id: appointmentId, status: 'cancelled' }
    });
  } catch (error) {
    next(error);
  }
}

export async function listAppointments(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const appointments = await prisma.appointment.findMany({
      where: { clientId: req.user.id },
      include: {
        service: true,
        barbershop: true
      },
      orderBy: { appointmentDate: 'desc' }
    });

    const mappedAppointments = appointments.map((a: typeof appointments[number]) => ({
      id: a.id,
      barbershop_id: a.barbershopId,
      client_id: a.clientId,
      service_id: a.serviceId,
      appointment_date: a.appointmentDate,
      appointment_time: a.appointmentTime,
      status: a.status,
      service_name: a.service.name,
      barbershop_name: a.barbershop.name,
      created_at: a.createdAt,
      updated_at: a.updatedAt
    }));

    res.json(mappedAppointments);
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
