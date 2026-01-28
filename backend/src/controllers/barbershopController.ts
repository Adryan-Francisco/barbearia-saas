import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../utils/database';
import { AppError } from '../middleware/errorHandler';

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

    const db = await getDatabase();
    const barbershop = db.barbershops.find((b: any) => b.id === barbershop_id);

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

    const db = await getDatabase();

    const appointments = db.appointments
      .filter((a: any) => a.barbershop_id === barbershop_id)
      .map((a: any) => {
        const service = db.services.find((s: any) => s.id === a.service_id);
        const client = db.users.find((u: any) => u.id === a.client_id);
        return {
          id: a.id,
          client_name: client?.name,
          client_phone: client?.phone,
          service_name: service?.name,
          service_price: service?.price,
          appointment_date: a.appointment_date,
          appointment_time: a.appointment_time,
          status: a.status,
          created_at: a.created_at,
        };
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
        const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
        return dateA.getTime() - dateB.getTime();
      });

    res.json(appointments);
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

    const db = await getDatabase();

    const appointments = db.appointments
      .filter((a: any) => a.barbershop_id === barbershop_id && a.appointment_date === date)
      .map((a: any) => {
        const service = db.services.find((s: any) => s.id === a.service_id);
        const client = db.users.find((u: any) => u.id === a.client_id);
        return {
          id: a.id,
          client_name: client?.name,
          client_phone: client?.phone,
          service_name: service?.name,
          service_price: service?.price,
          appointment_time: a.appointment_time,
          status: a.status,
        };
      })
      .sort((a: any, b: any) => {
        const timeA = a.appointment_time.split(':').map(Number);
        const timeB = b.appointment_time.split(':').map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      });

    res.json({ date, appointments });
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

    const db = await getDatabase();

    const appointmentIndex = db.appointments.findIndex((a: any) => a.id === appointment_id);

    if (appointmentIndex === -1) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    db.appointments[appointmentIndex].status = 'confirmed';
    db.appointments[appointmentIndex].updated_at = new Date();

    const { saveDatabase } = require('../utils/database');
    await saveDatabase();

    res.json({
      message: 'Agendamento confirmado com sucesso',
      appointment: db.appointments[appointmentIndex],
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

    const db = await getDatabase();

    const appointments = db.appointments.filter((a: any) => a.barbershop_id === barbershop_id);

    // Calcular lucro total dos agendamentos confirmados
    const total_revenue = appointments
      .filter((a: any) => a.status === 'confirmed')
      .reduce((sum: number, a: any) => sum + (a.service_price || 0), 0);

    const stats = {
      total_appointments: appointments.length,
      confirmed: appointments.filter((a: any) => a.status === 'confirmed').length,
      cancelled: appointments.filter((a: any) => a.status === 'cancelled').length,
      today: appointments.filter((a: any) => a.appointment_date === new Date().toISOString().split('T')[0])
        .length,
      total_revenue: total_revenue,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
}
