import { Request, Response } from 'express';
import {
  getRealtimeMetrics,
  getHourlyMetrics,
  getDailyTrend,
} from '../services/realtimeService';

export async function getRealtimeMetricsHandler(req: Request, res: Response) {
  try {
    const { barbershop_id } = req.params;

    const metrics = await getRealtimeMetrics(barbershop_id);
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getHourlyMetricsHandler(req: Request, res: Response) {
  try {
    const { barbershop_id } = req.params;
    const { date } = req.query;

    const metrics = await getHourlyMetrics(barbershop_id, date as string);
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getDailyTrendHandler(req: Request, res: Response) {
  try {
    const { barbershop_id } = req.params;
    const { days } = req.query;

    const trend = await getDailyTrend(
      barbershop_id,
      days ? parseInt(days as string) : 7
    );
    res.json(trend);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
