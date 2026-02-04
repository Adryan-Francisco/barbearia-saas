import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(__dirname, '../../data/barbearia.json');

interface ClientHistory {
  id: string;
  barbershop_id: string;
  client_id: string;
  client_name: string;
  client_phone: string;
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  total_spent: number;
  last_appointment_date?: string;
  created_at: string;
  updated_at: string;
}

interface Analytics {
  id: string;
  barbershop_id: string;
  date: string; // YYYY-MM-DD
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  total_revenue: number;
  created_at: string;
}

async function loadDatabase() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function saveDatabase(db: any) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

// CLIENT HISTORY
export async function updateClientHistory(
  barbershopId: string,
  clientId: string,
  clientName: string,
  clientPhone: string,
  servicePrice: number,
  status: 'completed' | 'cancelled'
): Promise<ClientHistory> {
  const db = await loadDatabase();
  let history = db.client_history.find(
    (h: ClientHistory) => h.client_id === clientId && h.barbershop_id === barbershopId
  );

  if (!history) {
    history = {
      id: uuidv4(),
      barbershop_id: barbershopId,
      client_id: clientId,
      client_name: clientName,
      client_phone: clientPhone,
      total_appointments: 0,
      completed_appointments: 0,
      cancelled_appointments: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.client_history.push(history);
  }

  history.total_appointments += 1;
  if (status === 'completed') {
    history.completed_appointments += 1;
    history.total_spent += servicePrice;
  } else {
    history.cancelled_appointments += 1;
  }
  history.last_appointment_date = new Date().toISOString();
  history.updated_at = new Date().toISOString();

  await saveDatabase(db);
  return history;
}

export async function getClientHistory(
  barbershopId: string
): Promise<ClientHistory[]> {
  const db = await loadDatabase();
  return db.client_history
    .filter((h: ClientHistory) => h.barbershop_id === barbershopId)
    .sort((a: ClientHistory, b: ClientHistory) => 
      new Date(b.last_appointment_date || 0).getTime() - 
      new Date(a.last_appointment_date || 0).getTime()
    );
}

export async function getClientDetail(
  barbershopId: string,
  clientId: string
): Promise<ClientHistory | null> {
  const db = await loadDatabase();
  return (
    db.client_history.find(
      (h: ClientHistory) =>
        h.client_id === clientId && h.barbershop_id === barbershopId
    ) || null
  );
}

// ANALYTICS
export async function recordAnalytics(
  barbershopId: string,
  date: string,
  totalAppointments: number,
  completedAppointments: number,
  cancelledAppointments: number,
  totalRevenue: number
): Promise<Analytics> {
  const db = await loadDatabase();

  const existingAnalytic = db.analytics.find(
    (a: Analytics) => a.barbershop_id === barbershopId && a.date === date
  );

  if (existingAnalytic) {
    existingAnalytic.total_appointments = totalAppointments;
    existingAnalytic.completed_appointments = completedAppointments;
    existingAnalytic.cancelled_appointments = cancelledAppointments;
    existingAnalytic.total_revenue = totalRevenue;
  } else {
    const analytic: Analytics = {
      id: uuidv4(),
      barbershop_id: barbershopId,
      date,
      total_appointments: totalAppointments,
      completed_appointments: completedAppointments,
      cancelled_appointments: cancelledAppointments,
      total_revenue: totalRevenue,
      created_at: new Date().toISOString(),
    };
    db.analytics.push(analytic);
  }

  await saveDatabase(db);
  return existingAnalytic || db.analytics[db.analytics.length - 1];
}

export async function getAnalytics(
  barbershopId: string,
  startDate?: string,
  endDate?: string
): Promise<any> {
  const db = await loadDatabase();
  let analytics = db.analytics.filter(
    (a: Analytics) => a.barbershop_id === barbershopId
  );

  if (startDate) {
    analytics = analytics.filter((a: Analytics) => a.date >= startDate);
  }
  if (endDate) {
    analytics = analytics.filter((a: Analytics) => a.date <= endDate);
  }

  const totalRevenue = analytics.reduce((sum: number, a: Analytics) => sum + a.total_revenue, 0);
  const totalAppointments = analytics.reduce(
    (sum: number, a: Analytics) => sum + a.total_appointments,
    0
  );
  const completedAppointments = analytics.reduce(
    (sum: number, a: Analytics) => sum + a.completed_appointments,
    0
  );

  return {
    analytics,
    summary: {
      totalRevenue,
      totalAppointments,
      completedAppointments,
      averageRevenuePerDay:
        analytics.length > 0 ? Math.round(totalRevenue / analytics.length) : 0,
    },
  };
}

export async function getRevenueStats(
  barbershopId: string,
  month: string // YYYY-MM
): Promise<any> {
  const db = await loadDatabase();
  const analytics = db.analytics.filter(
    (a: Analytics) =>
      a.barbershop_id === barbershopId && a.date.startsWith(month)
  );

  const byService: { [key: string]: number } = {};
  let totalRevenue = 0;

  analytics.forEach((a: Analytics) => {
    totalRevenue += a.total_revenue;
  });

  return {
    month,
    totalRevenue,
    dailyBreakdown: analytics,
  };
}
