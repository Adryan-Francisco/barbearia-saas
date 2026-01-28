import axios from 'axios';

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
  try {
    // Remover formatação do número de telefone
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Este é um exemplo de integração com WhatsApp Business API
    // Você precisará adaptar conforme sua integração específica
    
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
    } else {
      console.warn('WhatsApp API credentials not configured. Message not sent.');
      console.log('Would send to:', cleanPhone, 'Message:', message);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}
