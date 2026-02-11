import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export async function getCancellationHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const cancellations = await prisma.cancellation.findMany({
      where: {
        appointment: {
          clientId: req.user.id
        }
      },
      include: {
        appointment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const mapped = cancellations.map((c: typeof cancellations[0]) => ({
      id: c.id,
      appointmentId: c.appointmentId,
      clientId: c.appointment.clientId,
      barbershopId: c.appointment.barbershopId,
      reason: c.reason,
      cancelledAt: c.createdAt,
      originalDate: c.appointment.appointmentDate,
      originalTime: c.appointment.appointmentTime,
    }));

    res.json({
      total: mapped.length,
      cancellations: mapped,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBarbershopCancellationStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const { barbershopId } = req.params;

    const cancellations = await prisma.cancellation.findMany({
      where: {
        appointment: {
          barbershopId
        }
      },
      include: {
        appointment: true
      }
    });

    // Calculate statistics
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const cancelledThisMonth = cancellations.filter(
      (c: typeof cancellations[0]) => c.createdAt >= monthStart
    ).length;

    const cancelledThisWeek = cancellations.filter(
      (c: typeof cancellations[0]) => c.createdAt >= weekAgo
    ).length;

    const commonReasons: { [key: string]: number } = {};
    cancellations.forEach((c: typeof cancellations[0]) => {
      const reason = c.reason || 'Sem motivo informado';
      commonReasons[reason] = (commonReasons[reason] || 0) + 1;
    });

    const stats = {
      totalCancellations: cancellations.length,
      cancelledThisMonth,
      cancelledThisWeek,
      commonReasons,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
}
