import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { sendWhatsAppMessage } from '../services/whatsappService';
import { websocketService } from '../services/websocketService';
import { getAvailableSlots, isSlotAvailable } from '../services/schedulingService';

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
}

export async function createAppointment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    console.log("📋 Criar agendamento - req.user:", req.user);
    console.log("📋 Criar agendamento - req.body:", req.body);
    
    if (!req.user) {
      throw new AppError('Não autorizado - usuário não encontrado', 401);
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

    const updatedSlots = await getAvailableSlots(barbershop_id, appointment_date);
    websocketService.emitAvailableSlots(barbershop_id, {
      date: appointment_date,
      slots: updatedSlots,
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

export async function cancelAppointment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    console.log("🗑️ [CANCEL] Iniciando cancelamento, appointmentId:", req.params.appointmentId);
    console.log("📦 [CANCEL] req.user:", req.user);
    
    if (!req.user) {
      console.log("❌ [CANCEL] Usuário não autenticado");
      throw new AppError('Não autorizado', 401);
    }

    const { appointmentId } = req.params;
    console.log("🔍 [CANCEL] Procurando appointmentId:", appointmentId);

    if (!appointmentId) {
      throw new AppError('ID do agendamento é obrigatório', 400);
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true }
    });

    console.log("📋 [CANCEL] Agendamento encontrado:", appointment?.id, "Status:", appointment?.status);

    if (!appointment || appointment.clientId !== req.user.id) {
      console.log("❌ [CANCEL] Agendamento não encontrado ou não pertence ao usuário");
      throw new AppError('Agendamento não encontrado', 404);
    }

    // Verificar se já foi cancelado
    if (appointment.status === 'cancelled') {
      console.log("⚠️ [CANCEL] Agendamento já estava cancelado");
      throw new AppError('Este agendamento já foi cancelado', 409);
    }

    // Verificar se já foi concluído
    if (appointment.status === 'completed') {
      console.log("⚠️ [CANCEL] Agendamento já foi concluído");
      throw new AppError('Não é possível cancelar um agendamento concluído', 409);
    }

    // Permitir cancelamento apenas se o agendamento ainda não começou
    // Combina data + hora para comparação correta
    const [hours, minutes] = appointment.appointmentTime.split(':').map(Number);
    const appointmentDateTime = new Date(appointment.appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();

    console.log("� [CANCEL] Comparação de datas:");
    console.log("  📅 Agendamento:", appointmentDateTime.toISOString());
    console.log("  🕐 Agora:", now.toISOString());
    console.log("  ✅ Pode cancelar?", now <= appointmentDateTime);

    // Verificar se o agendamento já passou (começou)
    if (now > appointmentDateTime) {
      console.log("❌ [CANCEL] Agendamento já começou, não pode cancelar");
      throw new AppError('Não é possível cancelar um agendamento que já começou', 409);
    }

    console.log("✅ [CANCEL] Validações passadas, procedendo com cancelamento");

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'cancelled' }
    });

    console.log("✅ Agendamento cancelado:", updatedAppointment.id);

    const appointmentDate = appointment.appointmentDate.toISOString().split('T')[0];
    const updatedSlots = await getAvailableSlots(appointment.barbershopId, appointmentDate);
    websocketService.emitAvailableSlots(appointment.barbershopId, {
      date: appointmentDate,
      slots: updatedSlots,
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

    const responsePayload = {
      message: 'Agendamento cancelado com sucesso',
      appointment: { id: appointmentId, status: 'cancelled' }
    };
    
    console.log("📤 Enviando resposta de cancelamento:", responsePayload);
    res.status(200).json(responsePayload);
  } catch (error) {
    console.error('🔥 Erro em cancelAppointment:', error);
    next(error);
  }
}

export async function listAppointments(req: AuthRequest, res: Response, next: NextFunction) {
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
      service: {
        id: a.service.id,
        name: a.service.name,
        price: a.service.price
      },
      barbershop: {
        id: a.barbershop.id,
        name: a.barbershop.name
      },
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

export async function getAvailableSlotsByBarbershop(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { barbershop_id, barbershopId, date } = req.query;
    const resolvedBarbershopId = (barbershop_id || barbershopId) as string | undefined;

    if (!resolvedBarbershopId || !date) {
      throw new AppError('Barbearia e data são obrigatórias', 400);
    }

    const slots = await getAvailableSlots(resolvedBarbershopId, date as string);

    res.json({ date, slots });
  } catch (error) {
    next(error);
  }
}
