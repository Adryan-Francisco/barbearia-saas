import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface NotificationPayload {
  type: 'appointment' | 'cancellation' | 'payment' | 'reminder' | 'alert' | 'review';
  title: string;
  message: string;
  data?: any;
  timestamp?: Date;
}

interface ConnectedUser {
  userId: string;
  barbershopId: string;
  socketId: string;
  role: 'client' | 'barbershop' | 'public';
}

class WebSocketService {
  private io: SocketIOServer | null = null;
  private connectedUsers = new Map<string, ConnectedUser>();

  /**
   * Inicializa o servidor Socket.IO
   */
  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupConnectionHandlers();

    console.log('✅ WebSocket Server inicializado');
  }

  /**
   * Configura middleware para validação de conexão
   */
  private setupMiddleware() {
    if (!this.io) return;

    this.io.use((socket, next) => {
      const userId = socket.handshake.auth.userId;
      const barbershopId = socket.handshake.auth.barbershopId;
      const role = socket.handshake.auth.role;

      if (!barbershopId) {
        next(new Error('Autenticação inválida'));
        return;
      }

      const resolvedUserId = userId || 'public';
      const resolvedRole = role || 'public';

      // Armazenar dados do usuário no socket
      socket.data = { userId: resolvedUserId, barbershopId, role: resolvedRole };
      next();
    });
  }

  /**
   * Configura handlers de conexão/desconexão
   */
  private setupConnectionHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      const { userId, barbershopId, role } = socket.data;

      // Registrar usuário conectado
      this.connectedUsers.set(socket.id, {
        userId,
        barbershopId,
        socketId: socket.id,
        role,
      });

      // Juntar sala da barbearia
      socket.join(`barbershop:${barbershopId}`);

      console.log(`👤 Usuário ${userId} conectado (${socket.id})`);

      // Handler de desconexão
      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.id);
        console.log(`👤 Usuário ${userId} desconectado`);
      });

      // Handler customizado para eventos do cliente
      socket.on('client:event', (eventName: string, data: any) => {
        console.log(`📨 Evento do cliente: ${eventName}`, data);
      });
    });
  }

  /**
   * Envia notificação para um usuário específico
   */
  sendToUser(userId: string, notification: NotificationPayload) {
    if (!this.io) return;

    const userSocket = Array.from(this.connectedUsers.values()).find(
      (user) => user.userId === userId
    );

    if (userSocket) {
      this.io.to(userSocket.socketId).emit('notification', {
        ...notification,
        timestamp: new Date(),
      });
      console.log(`✉️ Notificação enviada para usuário ${userId}`);
    }
  }

  /**
   * Envia notificação para todos os usuários de uma barbearia
   */
  sendToBarbershop(barbershopId: string, notification: NotificationPayload) {
    if (!this.io) return;

    this.io.to(`barbershop:${barbershopId}`).emit('notification', {
      ...notification,
      timestamp: new Date(),
    });
    console.log(`✉️ Notificação enviada para barbearia ${barbershopId}`);
  }

  /**
   * Envia notificação de agendamento confirmado
   */
  notifyAppointmentConfirmed(barbershopId: string, appointmentData: any) {
    this.sendToBarbershop(barbershopId, {
      type: 'appointment',
      title: '📅 Novo Agendamento',
      message: `Novo agendamento confirmado para ${appointmentData.clientName} às ${appointmentData.time}`,
      data: appointmentData,
    });
  }

  /**
   * Envia notificação de agendamento cancelado
   */
  notifyAppointmentCancelled(barbershopId: string, appointmentData: any) {
    this.sendToBarbershop(barbershopId, {
      type: 'cancellation',
      title: '❌ Agendamento Cancelado',
      message: `Agendamento de ${appointmentData.clientName} foi cancelado`,
      data: appointmentData,
    });
  }

  /**
   * Envia notificação de pagamento processado
   */
  notifyPaymentProcessed(barbershopId: string, paymentData: any) {
    this.sendToBarbershop(barbershopId, {
      type: 'payment',
      title: '💳 Pagamento Processado',
      message: `Pagamento de R$ ${paymentData.amount.toFixed(2)} recebido`,
      data: paymentData,
    });
  }

  /**
   * Envia notificação de lembrete de agendamento
   */
  notifyAppointmentReminder(userId: string, appointmentData: any) {
    this.sendToUser(userId, {
      type: 'reminder',
      title: '🔔 Lembrete de Agendamento',
      message: `Seu agendamento é em 1 hora! ${appointmentData.time}`,
      data: appointmentData,
    });
  }

  /**
   * Envia alerta de performance (muitos agendamentos, cancelamentos, etc)
   */
  notifyAlert(barbershopId: string, alertData: any) {
    this.sendToBarbershop(barbershopId, {
      type: 'alert',
      title: '⚠️ Alerta de Performance',
      message: alertData.message,
      data: alertData,
    });
  }

  /**
   * Envia notificação de nova avaliação
   */
  notifyNewReview(barbershopId: string, reviewData: any) {
    this.sendToBarbershop(barbershopId, {
      type: 'review',
      title: '⭐ Nova Avaliação',
      message: `${reviewData.clientName} deixou uma avaliação de ${reviewData.rating} estrelas`,
      data: reviewData,
    });
  }

  /**
   * Emite atualização de horários disponíveis
   */
  emitAvailableSlots(barbershopId: string, payload: { date: string; slots: string[] }) {
    if (!this.io) return;

    this.io.to(`barbershop:${barbershopId}`).emit('slots:update', {
      barbershopId,
      ...payload,
      timestamp: new Date(),
    });
  }

  /**
   * Emite evento de métrica atualizada em tempo real
   */
  emitRealtimeMetrics(barbershopId: string, metrics: any) {
    if (!this.io) return;

    this.io.to(`barbershop:${barbershopId}`).emit('metrics:update', {
      ...metrics,
      timestamp: new Date(),
    });
  }

  /**
   * Obtém número de usuários conectados de uma barbearia
   */
  getConnectedUsersCount(barbershopId: string): number {
    return Array.from(this.connectedUsers.values()).filter(
      (user) => user.barbershopId === barbershopId
    ).length;
  }

  /**
   * Obtém lista de usuários conectados de uma barbearia
   */
  getConnectedUsers(barbershopId: string): ConnectedUser[] {
    return Array.from(this.connectedUsers.values()).filter(
      (user) => user.barbershopId === barbershopId
    );
  }

  /**
   * Obtém a instância do Socket.IO
   */
  getIO(): SocketIOServer | null {
    return this.io;
  }
}

// Exportar instância singleton
export const websocketService: WebSocketService = new WebSocketService();
