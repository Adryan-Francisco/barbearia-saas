import { useEffect, useRef, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

export interface Notification {
  id?: string;
  type: 'appointment' | 'cancellation' | 'payment' | 'reminder' | 'alert' | 'review';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read?: boolean;
}

export interface UseWebSocketOptions {
  url?: string;
  enabled?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = import.meta.env.VITE_API_URL || 'http://localhost:3001',
    enabled = true,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  // Conectar ao WebSocket
  useEffect(() => {
    if (!enabled) return;

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const barbershopId = localStorage.getItem('barbershopId');
    const role = localStorage.getItem('role');

    if (!token || !userId || !barbershopId) {
      console.warn('Dados de autenticação ausentes para WebSocket');
      return;
    }

    // Criar conexão Socket.IO
    socketRef.current = io(url, {
      auth: {
        userId,
        barbershopId,
        role: role || 'client',
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Evento de conexão
    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket conectado:', socketRef.current?.id);
      setIsConnected(true);
    });

    // Evento de desconexão
    socketRef.current.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
      setIsConnected(false);
    });

    // Evento de notificação
    socketRef.current.on('notification', (notification: Notification) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(notification.timestamp || Date.now()),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      console.log('🔔 Notificação recebida:', newNotification);
    });

    // Evento de atualização de métricas
    socketRef.current.on('metrics:update', (updatedMetrics: any) => {
      setMetrics(updatedMetrics);
      console.log('📊 Métricas atualizadas:', updatedMetrics);
    });

    // Evento de erro
    socketRef.current.on('connect_error', (error: any) => {
      console.error('❌ Erro na conexão WebSocket:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [enabled, url]);

  // Marcar notificação como lida
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // Limpar notificação
  const clearNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
  }, []);

  // Limpar todas as notificações
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Emitir evento personalizado
  const emitEvent = useCallback((eventName: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('client:event', eventName, data);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    notifications,
    metrics,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    emitEvent,
  };
};
