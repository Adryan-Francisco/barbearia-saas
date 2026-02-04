import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/barbearia.json');

interface RealtimeMetrics {
  activeAppointments: number;
  totalRevenueToday: number;
  clientsToday: number;
  appointmentsToday: number;
  completedToday: number;
  cancelledToday: number;
  averageWaitTime: number;
}

async function loadDatabase() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export async function getRealtimeMetrics(barbershopId: string): Promise<RealtimeMetrics> {
  const db = await loadDatabase();
  const today = getTodayDate();

  // Filtrar agendamentos de hoje
  const appointmentsToday = db.appointments.filter(
    (a: any) =>
      a.barbershop_id === barbershopId &&
      a.appointment_date === today
  );

  // Agendamentos ativos (confirmados)
  const activeAppointments = appointmentsToday.filter(
    (a: any) => a.status === 'confirmed'
  ).length;

  // Agendamentos concluídos
  const completedToday = appointmentsToday.filter(
    (a: any) => a.status === 'completed'
  ).length;

  // Agendamentos cancelados
  const cancelledToday = appointmentsToday.filter(
    (a: any) => a.status === 'cancelled'
  ).length;

  // Receita de hoje
  const paymentsToday = db.payments.filter(
    (p: any) =>
      p.barbershop_id === barbershopId &&
      p.created_at.startsWith(today) &&
      p.status === 'completed'
  );

  const totalRevenueToday = paymentsToday.reduce((sum: number, p: any) => sum + p.amount, 0);

  // Clientes únicos de hoje
  const clientsSet = new Set(appointmentsToday.map((a: any) => a.client_id));
  const clientsToday = clientsSet.size;

  // Tempo médio de espera (simulado baseado em duração dos serviços)
  let totalDuration = 0;
  let serviceCount = 0;

  appointmentsToday.forEach((a: any) => {
    const service = db.services.find((s: any) => s.id === a.service_id);
    if (service) {
      totalDuration += service.duration;
      serviceCount++;
    }
  });

  const averageWaitTime = serviceCount > 0 ? Math.round(totalDuration / serviceCount) : 0;

  return {
    activeAppointments,
    totalRevenueToday,
    clientsToday,
    appointmentsToday: appointmentsToday.length,
    completedToday,
    cancelledToday,
    averageWaitTime,
  };
}

export async function getHourlyMetrics(
  barbershopId: string,
  date?: string
): Promise<any[]> {
  const db = await loadDatabase();
  const targetDate = date || getTodayDate();

  const hourlyData: { [hour: string]: any } = {};

  // Inicializar 24 horas
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    hourlyData[hour] = {
      hour: `${hour}:00`,
      appointments: 0,
      revenue: 0,
      completed: 0,
    };
  }

  // Preencher com dados de agendamentos
  db.appointments
    .filter(
      (a: any) =>
        a.barbershop_id === barbershopId &&
        a.appointment_date === targetDate
    )
    .forEach((a: any) => {
      const [hour] = a.appointment_time.split(':');
      if (hourlyData[hour]) {
        hourlyData[hour].appointments++;
        if (a.status === 'completed') {
          hourlyData[hour].completed++;
        }
      }
    });

  // Preencher com dados de pagamentos
  db.payments
    .filter(
      (p: any) =>
        p.barbershop_id === barbershopId &&
        p.created_at.startsWith(targetDate) &&
        p.status === 'completed'
    )
    .forEach((p: any) => {
      const [hour] = p.created_at.split('T')[1].split(':');
      if (hourlyData[hour]) {
        hourlyData[hour].revenue += p.amount;
      }
    });

  return Object.values(hourlyData);
}

export async function getDailyTrend(
  barbershopId: string,
  days: number = 7
): Promise<any[]> {
  const db = await loadDatabase();
  const trend: { [date: string]: any } = {};
  const today = new Date();

  // Criar entradas para cada dia
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    trend[dateStr] = {
      date: dateStr,
      appointments: 0,
      revenue: 0,
      completed: 0,
      cancelled: 0,
    };
  }

  // Preencher com dados de agendamentos
  db.appointments
    .filter((a: any) => a.barbershop_id === barbershopId)
    .forEach((a: any) => {
      if (trend[a.appointment_date]) {
        trend[a.appointment_date].appointments++;
        if (a.status === 'completed') {
          trend[a.appointment_date].completed++;
        } else if (a.status === 'cancelled') {
          trend[a.appointment_date].cancelled++;
        }
      }
    });

  // Preencher com dados de pagamentos
  db.payments
    .filter(
      (p: any) =>
        p.barbershop_id === barbershopId && p.status === 'completed'
    )
    .forEach((p: any) => {
      const dateStr = p.created_at.split('T')[0];
      if (trend[dateStr]) {
        trend[dateStr].revenue += p.amount;
      }
    });

  return Object.values(trend);
}
