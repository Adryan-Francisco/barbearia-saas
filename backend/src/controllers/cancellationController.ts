import { Request, Response, NextFunction } from 'express';
import { getDatabase, saveDatabase } from '../utils/database';
import { AppError } from '../middleware/errorHandler';

export interface CancellationHistory {
  id: string;
  appointmentId: string;
  clientId: string;
  barbershopId: string;
  reason?: string;
  cancelledAt: string;
  originalDate: string;
  originalTime: string;
}

export async function getCancellationHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError('Não autorizado', 401);
    }

    const db = await getDatabase();
    const cancellationHistory = db.cancellationHistory || [];

    // Filtrar histórico do cliente
    const clientCancellations = cancellationHistory.filter(
      (h: CancellationHistory) => h.clientId === req.user?.id
    );

    res.json({
      total: clientCancellations.length,
      cancellations: clientCancellations.sort(
        (a: any, b: any) =>
          new Date(b.cancelledAt).getTime() - new Date(a.cancelledAt).getTime()
      ),
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
    const db = await getDatabase();
    const cancellationHistory = db.cancellationHistory || [];

    // Filtrar cancelamentos da barbearia
    const barbershopCancellations = cancellationHistory.filter(
      (h: CancellationHistory) => h.barbershopId === barbershopId
    );

    // Calcular estatísticas
    const stats = {
      totalCancellations: barbershopCancellations.length,
      cancelledThisMonth: barbershopCancellations.filter((h: CancellationHistory) => {
        const cancelDate = new Date(h.cancelledAt);
        const now = new Date();
        return (
          cancelDate.getMonth() === now.getMonth() &&
          cancelDate.getFullYear() === now.getFullYear()
        );
      }).length,
      cancelledThisWeek: barbershopCancellations.filter((h: CancellationHistory) => {
        const cancelDate = new Date(h.cancelledAt);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return cancelDate >= weekAgo;
      }).length,
      commonReasons: getCommonReasons(barbershopCancellations),
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
}

function getCommonReasons(cancellations: CancellationHistory[]): { [key: string]: number } {
  const reasons: { [key: string]: number } = {};

  cancellations.forEach((c: CancellationHistory) => {
    const reason = c.reason || 'Sem motivo informado';
    reasons[reason] = (reasons[reason] || 0) + 1;
  });

  return reasons;
}
