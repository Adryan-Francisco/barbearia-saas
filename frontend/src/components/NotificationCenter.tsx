import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Notification } from '../hooks/useWebSocket';

interface NotificationCenterProps {
  notifications: Notification[];
  onClear: (id: string) => void;
  onClearAll: () => void;
}

const NotificationCenterContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 420px;
`;

const NotificationItem = styled.div<{ type: string; read: boolean }>`
  background: white;
  border-left: 5px solid ${(props) => getColorByType(props.type)};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 18px 20px;
  margin-bottom: 14px;
  animation: slideIn 0.3s ease-in-out;
  opacity: ${(props) => (props.read ? 0.7 : 1)};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
    transform: translateY(-2px);
  }

  @keyframes slideIn {
    from {
      transform: translateX(420px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.3px;
`;

const NotificationMessage = styled.p`
  margin: 6px 0 0 0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
`;

const NotificationTime = styled.span`
  font-size: 11px;
  color: #aaa;
  margin-top: 4px;
  display: inline-block;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #999;
  }
`;

const TypeBadge = styled.div<{ type: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${(props) => getColorByType(props.type)}15;
  color: ${(props) => getColorByType(props.type)};
  font-weight: 600;
  font-size: 13px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${(props) =>
    props.variant === 'primary' ? '#007bff' : 'transparent'};
  color: ${(props) =>
    props.variant === 'primary' ? 'white' : '#007bff'};
  border: ${(props) =>
    props.variant === 'primary' ? 'none' : '1px solid #e0e0e0'};
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background: ${(props) =>
      props.variant === 'primary' ? '#0056b3' : '#f5f5f5'};
    color: ${(props) =>
      props.variant === 'primary' ? 'white' : '#0056b3'};
  }
`;

const ClearAllButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
  padding: 10px 0;
  transition: color 0.2s;
  font-weight: 500;

  &:hover {
    color: #666;
  }
`;

function getColorByType(type: string): string {
  const colors: { [key: string]: string } = {
    appointment: '#10b981',
    cancellation: '#ef4444',
    payment: '#3b82f6',
    reminder: '#f59e0b',
    alert: '#f97316',
    review: '#8b5cf6',
  };
  return colors[type] || '#6b7280';
}

function getTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    appointment: 'NEW',
    cancellation: 'CANCEL',
    payment: 'PAID',
    reminder: 'ALERT',
    alert: 'WARN',
    review: 'STAR',
  };
  return labels[type] || 'INFO';
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClear,
  onClearAll,
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, 5));
  }, [notifications]);

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <NotificationCenterContainer>
      {visibleNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          type={notification.type}
          read={notification.read || false}
        >
          <NotificationHeader>
            <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              <TypeBadge type={notification.type}>
                {getTypeLabel(notification.type)}
              </TypeBadge>
              <NotificationContent>
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationTime>
                  {formatTime(notification.timestamp)}
                </NotificationTime>
              </NotificationContent>
            </div>
            <CloseButton onClick={() => onClear(notification.id!)}>
              ✕
            </CloseButton>
          </NotificationHeader>

          <NotificationMessage>{notification.message}</NotificationMessage>

          {notification.data && Object.keys(notification.data).length > 0 && (
            <NotificationActions>
              <Button variant="primary">Ver Detalhes</Button>
            </NotificationActions>
          )}
        </NotificationItem>
      ))}

      {notifications.length > 5 && (
        <ClearAllButton onClick={onClearAll}>
          Limpar todas ({notifications.length})
        </ClearAllButton>
      )}
    </NotificationCenterContainer>
  );
};

export default NotificationCenter;
