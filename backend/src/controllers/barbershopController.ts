import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { Appointment, Service } from '@prisma/client';

export async function loginBarbershop(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id, password } = req.body;

    if (!barbershop_id || !password) {
      throw new AppError('ID da barbearia e senha são obrigatórios', 400);
    }

    // Para demo, usamos uma senha fixa
    const demoPassword = 'admin123';
    
    if (password !== demoPassword) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershop_id }
    });

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada', 404);
    }

    res.json({
      message: 'Login de barbearia realizado com sucesso',
      barbershop: {
        id: barbershop.id,
        name: barbershop.name,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getBarbershopAppointments(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id } = req.params;

    if (!barbershop_id) {
      throw new AppError('ID da barbearia é obrigatório', 400);
    }

    const appointments = await prisma.appointment.findMany({
      where: { barbershopId: barbershop_id },
      include: {
        service: true,
        client: true
      },
      orderBy: { appointmentDate: 'asc' }
    });

    const mapped = appointments.map((a: Appointment & { service: Service; client: any }) => ({
      id: a.id,
      client_name: a.client.name,
      client_phone: a.client.phone,
      service_name: a.service.name,
      service_price: a.service.price,
      appointment_date: a.appointmentDate,
      appointment_time: a.appointmentTime,
      status: a.status,
      created_at: a.createdAt,
    }));

    res.json(mapped);
  } catch (error) {
    next(error);
  }
}

export async function getBarbershopAppointmentsByDate(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id, date } = req.params;

    if (!barbershop_id || !date) {
      throw new AppError('ID da barbearia e data são obrigatórios', 400);
    }

    // Parse date string to Date object
    const dateObj = new Date(`${date}T00:00:00`);
    const nextDayObj = new Date(dateObj);
    nextDayObj.setDate(nextDayObj.getDate() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        barbershopId: barbershop_id,
        appointmentDate: {
          gte: dateObj,
          lt: nextDayObj
        }
      },
      include: {
        service: true,
        client: true
      },
      orderBy: { appointmentTime: 'asc' }
    });

    const mapped = appointments.map((a: Appointment & { service: Service; client: any }) => ({
      id: a.id,
      client_name: a.client.name,
      client_phone: a.client.phone,
      service_name: a.service.name,
      service_price: a.service.price,
      appointment_time: a.appointmentTime,
      status: a.status,
    }));

    res.json({ date, appointments: mapped });
  } catch (error) {
    next(error);
  }
}

export async function confirmAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const { appointment_id } = req.params;

    if (!appointment_id) {
      throw new AppError('ID do agendamento é obrigatório', 400);
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointment_id }
    });

    if (!appointment) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    const updated = await prisma.appointment.update({
      where: { id: appointment_id },
      data: { status: 'confirmed' }
    });

    res.json({
      message: 'Agendamento confirmado com sucesso',
      appointment: {
        id: updated.id,
        status: updated.status,
        barbershopId: updated.barbershopId,
        clientId: updated.clientId,
        serviceId: updated.serviceId,
        appointmentDate: updated.appointmentDate,
        appointmentTime: updated.appointmentTime,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getBarbershopStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id } = req.params;

    if (!barbershop_id) {
      throw new AppError('ID da barbearia é obrigatório', 400);
    }

    const appointments = await prisma.appointment.findMany({
      where: { barbershopId: barbershop_id },
      include: { service: true }
    });

    // Calculate total revenue from confirmed appointments
    const total_revenue = appointments
      .filter((a: typeof appointments[0]) => a.status === 'confirmed')
      .reduce((sum: number, a: typeof appointments[0]) => sum + a.service.price, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = appointments.filter(
      (a: typeof appointments[0]) => a.appointmentDate >= today && a.appointmentDate < tomorrow
    );

    const stats = {
      total_appointments: appointments.length,
      confirmed: appointments.filter((a: typeof appointments[0]) => a.status === 'confirmed').length,
      cancelled: appointments.filter((a: typeof appointments[0]) => a.status === 'cancelled').length,
      today: todayAppointments.length,
      total_revenue: total_revenue,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
}
