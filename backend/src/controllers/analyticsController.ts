import { Request, Response } from 'express';
import {
  getClientHistory,
  getClientDetail,
  getAnalytics,
  getRevenueStats,
} from '../services/analyticsService';

export async function getClientHistoryHandler(req: Request, res: Response) {
  try {
    const { barbershopId } = req.params;

    const history = await getClientHistory(barbershopId);
    res.json({
      totalClients: history.length,
      clients: history,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getClientDetailHandler(req: Request, res: Response) {
  try {
    const { barbershopId, clientId } = req.params;

    const detail = await getClientDetail(barbershopId, clientId);
    if (!detail) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(detail);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAnalyticsHandler(req: Request, res: Response) {
  try {
    const { barbershopId } = req.params;
    const { startDate, endDate } = req.query;

    const data = await getAnalytics(
      barbershopId,
      startDate as string,
      endDate as string
    );
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getRevenueStatsHandler(req: Request, res: Response) {
  try {
    const { barbershopId, month } = req.params;

    const stats = await getRevenueStats(barbershopId, month);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
