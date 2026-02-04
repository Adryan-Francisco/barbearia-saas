import axios from 'axios';

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.instagram.com/v18.0';
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || '';
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || '';

export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
  try {
    // Remover formatação do número de telefone
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: {
        preview_url: false,
        body: message
      }
    };

    if (WHATSAPP_API_TOKEN && WHATSAPP_BUSINESS_ACCOUNT_ID) {
      await axios.post(
        `https://graph.instagram.com/v18.0/${WHATSAPP_BUSINESS_ACCOUNT_ID}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`WhatsApp message sent to ${cleanPhone}`);
    } else {
      console.warn('WhatsApp API credentials not configured. Message not sent.');
      console.log('Would send to:', cleanPhone, 'Message:', message);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

export function generateSchedulingLink(barbershopId: string, clientPhone: string): string {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const params = new URLSearchParams({
    barbershop: barbershopId,
    phone: clientPhone,
  });
  return `${baseUrl}/new-appointment?${params.toString()}`;
}

export async function sendSchedulingInvite(
  clientPhone: string,
  barbershopName: string,
  barbershopId: string,
  clientName: string
): Promise<void> {
  try {
    const schedulingLink = generateSchedulingLink(barbershopId, clientPhone);
    const message = `Olá ${clientName}! 👋\n\nA ${barbershopName} convida você para agendar seu atendimento!\n\n🔗 ${schedulingLink}\n\nEsperamos por você! 💈`;
    await sendWhatsAppMessage(clientPhone, message);
  } catch (error) {
    console.error('Erro ao enviar convite de agendamento:', error);
  }
}

export async function sendAppointmentConfirmation(
  clientPhone: string,
  clientName: string,
  barbershopName: string,
  serviceName: string,
  appointmentDate: string,
  appointmentTime: string
): Promise<void> {
  try {
    const dateFormatted = new Date(appointmentDate).toLocaleDateString('pt-BR');
    const message = `✅ Agendamento Confirmado!\n\nOlá ${clientName},\n\n📋 Detalhes:\n• Barbearia: ${barbershopName}\n• Serviço: ${serviceName}\n• Data: ${dateFormatted}\n• Horário: ${appointmentTime}\n\nObrigado! 💈`;
    await sendWhatsAppMessage(clientPhone, message);
  } catch (error) {
    console.error('Erro ao enviar confirmação:', error);
  }
}

export async function sendAppointmentReminder(
  clientPhone: string,
  clientName: string,
  barbershopName: string,
  appointmentDate: string,
  appointmentTime: string
): Promise<void> {
  try {
    const message = `⏰ Lembrete de Agendamento\n\nOlá ${clientName},\n\n📋 Detalhes:\n• Barbearia: ${barbershopName}\n• Horário: ${appointmentTime}\n\nNos vemos em breve! 💈`;
    await sendWhatsAppMessage(clientPhone, message);
  } catch (error) {
    console.error('Erro ao enviar lembrete:', error);
  }
}

export async function sendCancellationNotice(
  clientPhone: string,
  clientName: string,
  barbershopName: string,
  appointmentDate: string,
  appointmentTime: string
): Promise<void> {
  try {
    const dateFormatted = new Date(appointmentDate).toLocaleDateString('pt-BR');
    const message = `❌ Agendamento Cancelado\n\nOlá ${clientName},\n\n📋 Detalhes:\n• Barbearia: ${barbershopName}\n• Data: ${dateFormatted}\n• Horário: ${appointmentTime}\n\nSe deseja remarcar, nos procure novamente! 💈`;
    await sendWhatsAppMessage(clientPhone, message);
  } catch (error) {
    console.error('Erro ao enviar notificação de cancelamento:', error);
  }
}

export async function sendPromotionalOffer(
  clientPhone: string,
  clientName: string,
  barbershopName: string,
  offer: string,
  discount: number
): Promise<void> {
  try {
    const message = `🎁 Promoção Especial!\n\nOlá ${clientName},\n\n${offer}\n💰 Desconto: ${discount}%\n\nAproveite! 💈`;
    await sendWhatsAppMessage(clientPhone, message);
  } catch (error) {
    console.error('Erro ao enviar promoção:', error);
  }
}
