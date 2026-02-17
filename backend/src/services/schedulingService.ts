import { prisma } from '../utils/prisma';

function getDateRange(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);
  return { start, end };
}

export async function getAvailableSlots(barbershopId: string, date: string): Promise<string[]> {
  const { start, end } = getDateRange(date);

  const appointments = await prisma.appointment.findMany({
    where: {
      barbershopId,
      appointmentDate: {
        gte: start,
        lte: end,
      },
      status: {
        not: 'cancelled',
      },
    },
    select: {
      appointmentTime: true,
    },
  });

  const bookedTimes = new Set(appointments.map((appointment) => appointment.appointmentTime));

  // Horários padrão da barbearia (9:00 - 18:30), em intervalos de 30 min
  const startMinutes = 9 * 60;
  const endMinutes = 18 * 60 + 30;
  const slotStepMinutes = 30;

  const availableSlots: string[] = [];

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += slotStepMinutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    if (!bookedTimes.has(time)) {
      availableSlots.push(time);
    }
  }

  return availableSlots;
}

export async function isSlotAvailable(barbershopId: string, date: string, time: string): Promise<boolean> {
  const { start, end } = getDateRange(date);

  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      barbershopId,
      appointmentDate: {
        gte: start,
        lte: end,
      },
      appointmentTime: time,
      status: {
        not: 'cancelled',
      },
    },
    select: {
      id: true,
    },
  });

  return !existingAppointment;
}
