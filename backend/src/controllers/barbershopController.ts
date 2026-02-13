import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { Appointment, Service } from '@prisma/client';

// CREATE - Criar nova barbearia
export async function createBarbershop(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, phone, address, latitude, longitude } = req.body;
    const userId = (req as any).userId; // Vem do middleware de autenticação

    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!name || !phone || !address) {
      throw new AppError('Nome, telefone e endereço são obrigatórios', 400);
    }

    // Verificar se o usuário é um dono de barbearia
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.role !== 'barbershop_owner') {
      throw new AppError('Você não tem permissão para criar uma barbearia', 403);
    }

    // Verificar se o usuário já tem uma barbearia
    const existingBarbershop = await prisma.barbershop.findFirst({
      where: { ownerId: userId }
    });

    if (existingBarbershop) {
      throw new AppError('Você já possui uma barbearia registrada', 400);
    }

    const barbershop = await prisma.barbershop.create({
      data: {
        name,
        phone,
        address,
        latitude: latitude || null,
        longitude: longitude || null,
        ownerId: userId
      },
      include: {
        services: true
      }
    });

    res.status(201).json({
      message: 'Barbearia criada com sucesso',
      barbershop: {
        id: barbershop.id,
        name: barbershop.name,
        phone: barbershop.phone,
        address: barbershop.address,
        latitude: barbershop.latitude,
        longitude: barbershop.longitude,
        services: barbershop.services,
        createdAt: barbershop.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

// READ - Obter barbearia do usuário logado
export async function getMyBarbershop(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const barbershop = await prisma.barbershop.findFirst({
      where: { ownerId: userId },
      include: {
        services: true,
        appointments: {
          include: {
            client: true,
            service: true
          },
          orderBy: { appointmentDate: 'desc' }
        },
        reviews: {
          include: {
            user: true
          }
        }
      }
    });

    if (!barbershop) {
      throw new AppError('Você não possui uma barbearia registrada', 404);
    }

    res.json({
      barbershop: {
        id: barbershop.id,
        name: barbershop.name,
        phone: barbershop.phone,
        address: barbershop.address,
        latitude: barbershop.latitude,
        longitude: barbershop.longitude,
        rating: barbershop.rating,
        services: barbershop.services,
        appointments: barbershop.appointments,
        reviews: barbershop.reviews,
        createdAt: barbershop.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

// READ - Obter todas as barbearias (para clientes)
export async function getAllBarbershops(req: Request, res: Response, next: NextFunction) {
  try {
    const barbershops = await prisma.barbershop.findMany({
      include: {
        services: true,
        reviews: true,
        _count: {
          select: { appointments: true, reviews: true }
        }
      },
      orderBy: { rating: 'desc' }
    });

    const result = barbershops.map(b => ({
      id: b.id,
      name: b.name,
      phone: b.phone,
      address: b.address,
      latitude: b.latitude,
      longitude: b.longitude,
      rating: b.rating || 0,
      servicesCount: b.services.length,
      appointmentsCount: b._count.appointments,
      reviewsCount: b._count.reviews,
      services: b.services,
      createdAt: b.createdAt
    }));

    res.json({
      total: result.length,
      barbershops: result
    });
  } catch (error) {
    next(error);
  }
}

// READ - Obter uma barbearia específica
export async function getBarbershopById(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id } = req.params;

    if (!barbershop_id) {
      throw new AppError('ID da barbearia é obrigatório', 400);
    }

    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershop_id },
      include: {
        services: true,
        reviews: {
          include: {
            user: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada', 404);
    }

    res.json({
      barbershop: {
        id: barbershop.id,
        name: barbershop.name,
        phone: barbershop.phone,
        address: barbershop.address,
        latitude: barbershop.latitude,
        longitude: barbershop.longitude,
        rating: barbershop.rating || 0,
        services: barbershop.services,
        reviews: barbershop.reviews,
        createdAt: barbershop.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE - Atualizar barbearia (apenas o proprietário)
export async function updateBarbershop(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id } = req.params;
    const { name, phone, address, latitude, longitude } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!barbershop_id) {
      throw new AppError('ID da barbearia é obrigatório', 400);
    }

    // Verificar se a barbearia existe e se o usuário é o proprietário
    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershop_id }
    });

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada', 404);
    }

    if (barbershop.ownerId !== userId) {
      throw new AppError('Você não tem permissão para atualizar esta barbearia', 403);
    }

    // Atualizar apenas os campos fornecidos
    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (latitude) updateData.latitude = latitude;
    if (longitude) updateData.longitude = longitude;

    const updated = await prisma.barbershop.update({
      where: { id: barbershop_id },
      data: updateData,
      include: {
        services: true
      }
    });

    res.json({
      message: 'Barbearia atualizada com sucesso',
      barbershop: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        address: updated.address,
        latitude: updated.latitude,
        longitude: updated.longitude,
        rating: updated.rating,
        services: updated.services,
        createdAt: updated.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

// DELETE - Deletar barbearia (apenas o proprietário)
export async function deleteBarbershop(req: Request, res: Response, next: NextFunction) {
  try {
    const { barbershop_id } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!barbershop_id) {
      throw new AppError('ID da barbearia é obrigatório', 400);
    }

    // Verificar se a barbearia existe e se o usuário é o proprietário
    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershop_id }
    });

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada', 404);
    }

    if (barbershop.ownerId !== userId) {
      throw new AppError('Você não tem permissão para deletar esta barbearia', 403);
    }

    // Deletar agendamentos, serviços e reviews (cascade está configurado no schema)
    await prisma.barbershop.delete({
      where: { id: barbershop_id }
    });

    res.json({
      message: 'Barbearia deletada com sucesso'
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