import { getDatabase } from '../utils/database';

export async function getAvailableSlots(barbershopId: string, date: string): Promise<string[]> {
  const db = await getDatabase();

  // Horários padrão da barbearia (9:00 - 18:00)
  const startHour = 9;
  const endHour = 18;

  const availableSlots: string[] = [];

  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${String(hour).padStart(2, '0')}:00`;
    
    const isAvailable = await isSlotAvailable(barbershopId, date, time);
    
    if (isAvailable) {
      availableSlots.push(time);
    }
  }

  return availableSlots;
}

export async function isSlotAvailable(barbershopId: string, date: string, time: string): Promise<boolean> {
  const db = await getDatabase();

  // Verificar se já existe agendamento nesse horário
  const existingAppointment = db.appointments.find((a: any) => 
    a.barbershop_id === barbershopId &&
    a.appointment_date === date &&
    a.appointment_time === time &&
    a.status !== 'cancelled'
  );

  return !existingAppointment;
}
