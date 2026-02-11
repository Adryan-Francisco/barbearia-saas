import { prisma } from '../utils/prisma';

// CLIENT HISTORY
export async function updateClientHistory(
  barbershopId: string,
  clientId: string,
  clientName: string,
  clientPhone: string
) {
  // This is now computed on-the-fly from appointments
  // The function is kept for compatibility but doesn't persist anything
  return {
    barbershop_id: barbershopId,
    client_id: clientId,
    client_name: clientName,
    client_phone: clientPhone,
  };
}

export async function getClientHistory(barbershopId: string) {
  const appointments = await prisma.appointment.findMany({
    where: { barbershopId },
    include: {
      client: true,
      service: true
    }
  });

  // Group by client and compute stats
  const clientMap: { [key: string]: any } = {};

  appointments.forEach((apt: any) => {
    if (!clientMap[apt.clientId]) {
      clientMap[apt.clientId] = {
        id: apt.clientId,
        barbershop_id: barbershopId,
        client_id: apt.clientId,
        client_name: apt.client.name,
        client_phone: apt.client.phone,
        total_appointments: 0,
        completed_appointments: 0,
        cancelled_appointments: 0,
        total_spent: 0,
        last_appointment_date: null,
      };
    }

    clientMap[apt.clientId].total_appointments += 1;
    if (apt.status === 'confirmed' || apt.status === 'completed') {
      clientMap[apt.clientId].completed_appointments += 1;
      clientMap[apt.clientId].total_spent += apt.service.price;
    } else if (apt.status === 'cancelled') {
      clientMap[apt.clientId].cancelled_appointments += 1;
    }
    clientMap[apt.clientId].last_appointment_date = apt.appointmentDate;
  });

  const result = Object.values(clientMap);
  
  return result.sort((a: any, b: any) =>
    (b.last_appointment_date?.getTime() || 0) - (a.last_appointment_date?.getTime() || 0)
  );
}

export async function getClientDetail(
  barbershopId: string,
  clientId: string
) {
  const appointments = await prisma.appointment.findMany({
    where: {
      barbershopId,
      clientId
    },
    include: {
      client: true,
      service: true
    }
  });

  if (appointments.length === 0) {
    return null;
  }

  const client = appointments[0].client;
  let completedCount = 0;
  let cancelledCount = 0;
  let totalSpent = 0;

  appointments.forEach((apt: any) => {
    if (apt.status === 'confirmed' || apt.status === 'completed') {
      completedCount += 1;
      totalSpent += apt.service.price;
    } else if (apt.status === 'cancelled') {
      cancelledCount += 1;
    }
  });

  return {
    id: clientId,
    barbershop_id: barbershopId,
    client_id: clientId,
    client_name: client.name,
    client_phone: client.phone,
    total_appointments: appointments.length,
    completed_appointments: completedCount,
    cancelled_appointments: cancelledCount,
    total_spent: totalSpent,
    last_appointment_date: appointments[appointments.length - 1].appointmentDate,
  };
}

// ANALYTICS
export async function recordAnalytics(
  barbershopId: string,
  date: string,
  totalAppointments: number,
  completedAppointments: number,
  cancelledAppointments: number,
  totalRevenue: number
) {
  // Analytics are now computed on-the-fly
  return {
    barbershop_id: barbershopId,
    date,
    total_appointments: totalAppointments,
    completed_appointments: completedAppointments,
    cancelled_appointments: cancelledAppointments,
    total_revenue: totalRevenue,
  };
}

export async function getAnalytics(
  barbershopId: string,
  startDate?: string,
  endDate?: string
) {
  const start = startDate ? new Date(startDate) : new Date(0);
  const end = endDate ? new Date(endDate) : new Date();
  end.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: {
      barbershopId,
      appointmentDate: {
        gte: start,
        lte: end
      }
    },
    include: { service: true }
  });

  // Group by date
  const analyticsByDate: { [key: string]: any } = {};

  appointments.forEach((apt: any) => {
    const dateStr = apt.appointmentDate.toISOString().split('T')[0];
    
    if (!analyticsByDate[dateStr]) {
      analyticsByDate[dateStr] = {
        date: dateStr,
        total_appointments: 0,
        completed_appointments: 0,
        cancelled_appointments: 0,
        total_revenue: 0,
      };
    }

    analyticsByDate[dateStr].total_appointments += 1;
    if (apt.status === 'confirmed' || apt.status === 'completed') {
      analyticsByDate[dateStr].completed_appointments += 1;
      analyticsByDate[dateStr].total_revenue += apt.service.price;
    } else if (apt.status === 'cancelled') {
      analyticsByDate[dateStr].cancelled_appointments += 1;
    }
  });

  const analytics = Object.values(analyticsByDate);
  const totalRevenue = analytics.reduce((sum: number, a: any) => sum + a.total_revenue, 0);
  const totalAppointments = analytics.reduce((sum: number, a: any) => sum + a.total_appointments, 0);
  const completedAppointments = analytics.reduce((sum: number, a: any) => sum + a.completed_appointments, 0);

  return {
    analytics,
    summary: {
      totalRevenue,
      totalAppointments,
      completedAppointments,
      averageRevenuePerDay: analytics.length > 0 ? Math.round(totalRevenue / analytics.length) : 0,
    },
  };
}

export async function getRevenueStats(
  barbershopId: string,
  month: string // YYYY-MM
) {
  const [year, monthNum] = month.split('-').map(Number);
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0);
  endDate.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: {
      barbershopId,
      appointmentDate: {
        gte: startDate,
        lte: endDate
      }
    },
    include: { service: true }
  });

  // Group by date
  const dailyBreakdown: { [key: string]: any } = {};
  let totalRevenue = 0;

  appointments.forEach((apt: any) => {
    const dateStr = apt.appointmentDate.toISOString().split('T')[0];

    if (!dailyBreakdown[dateStr]) {
      dailyBreakdown[dateStr] = {
        date: dateStr,
        total_appointments: 0,
        completed_appointments: 0,
        cancelled_appointments: 0,
        total_revenue: 0,
      };
    }

    dailyBreakdown[dateStr].total_appointments += 1;
    if (apt.status === 'confirmed' || apt.status === 'completed') {
      dailyBreakdown[dateStr].completed_appointments += 1;
      dailyBreakdown[dateStr].total_revenue += apt.service.price;
      totalRevenue += apt.service.price;
    } else if (apt.status === 'cancelled') {
      dailyBreakdown[dateStr].cancelled_appointments += 1;
    }
  });

  return {
    month,
    totalRevenue,
    dailyBreakdown: Object.values(dailyBreakdown),
  };
}
