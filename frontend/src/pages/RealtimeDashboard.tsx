import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  containerStyle,
  buttonSecondaryStyle,
  buttonSecondaryHoverStyle,
  cardStyle,
  colors,
} from '../styles';

interface RealtimeMetrics {
  activeAppointments: number;
  totalRevenueToday: number;
  clientsToday: number;
  appointmentsToday: number;
  completedToday: number;
  cancelledToday: number;
  averageWaitTime: number;
}

interface TimeSeriesData {
  time: string;
  revenue: number;
  appointments: number;
}

export function RealtimeDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [barbershopId, setBarbershopId] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchMetrics = useCallback(async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/barbershop/${id}/realtime-metrics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    }
  }, []);

  useEffect(() => {
    const id = localStorage.getItem('barbershop_id');
    if (id) {
      setBarbershopId(id);
      fetchMetrics(id);
      setIsLoading(false);

      // Atualizar a cada 5 segundos
      const interval = setInterval(() => {
        fetchMetrics(id);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [fetchMetrics]);

  const MetricCard = ({
    title,
    value,
    icon,
    color,
    subtext,
  }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtext?: string;
  }) => (
    <div
      style={{
        ...cardStyle,
        borderLeft: `4px solid ${color}`,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999' }}>
            {title}
          </p>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color }}>
            {value}
          </p>
          {subtext && (
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              {subtext}
            </p>
          )}
        </div>
        <div style={{ fontSize: '32px', opacity: 0.6 }}>{icon}</div>
      </div>
    </div>
  );

  const StatusIndicator = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#e8f5e9',
        borderRadius: '4px',
        fontSize: '12px',
        color: colors.success,
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: colors.success,
          animation: 'pulse 2s infinite',
        }}
      />
      ●  Em tempo real - Atualizado em {lastUpdate.toLocaleTimeString('pt-BR')}
    </div>
  );

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate('/barbershop-dashboard')}
        style={buttonSecondaryStyle}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonSecondaryHoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonSecondaryStyle)}
      >
        Voltar ao Dashboard
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard de Performance em Tempo Real</h1>
        <StatusIndicator />
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>

      {isLoading ? (
        <div>Carregando...</div>
      ) : metrics ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '30px',
            }}
          >
            <MetricCard
              title="Agendamentos Ativos"
              value={metrics.activeAppointments}
              icon=""
              color={colors.info}
              subtext="Hoje"
            />
            <MetricCard
              title="Receita Hoje"
              value={`R$ ${metrics.totalRevenueToday.toFixed(2)}`}
              icon=""
              color={colors.success}
            />
            <MetricCard
              title="Clientes Hoje"
              value={metrics.clientsToday}
              icon="👥"
              color={colors.warning}
            />
            <MetricCard
              title="Total de Agendamentos"
              value={metrics.appointmentsToday}
              icon="📊"
              color={colors.primary}
              subtext={`${metrics.completedToday} concluídos`}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={cardStyle}>
              <h3>Status do Dia</h3>
              <div style={{ marginTop: '15px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Taxa de Conclusão</span>
                    <strong>
                      {metrics.appointmentsToday > 0
                        ? ((metrics.completedToday / metrics.appointmentsToday) * 100).toFixed(0)
                        : 0}
                      %
                    </strong>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${metrics.appointmentsToday > 0 ? (metrics.completedToday / metrics.appointmentsToday) * 100 : 0}%`,
                        height: '100%',
                        backgroundColor: colors.success,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '20px', fontSize: '14px' }}>
                  <p>
                    ✅ Concluídos:{' '}
                    <strong style={{ color: colors.success }}>
                      {metrics.completedToday}
                    </strong>
                  </p>
                  <p>
                    ❌ Cancelados:{' '}
                    <strong style={{ color: colors.danger }}>
                      {metrics.cancelledToday}
                    </strong>
                  </p>
                  <p>
                    Tempo Médio de Espera:{' '}
                    <strong>{metrics.averageWaitTime} min</strong>
                  </p>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h3>Alertas e Notificações</h3>
              <div style={{ marginTop: '15px' }}>
                {metrics.activeAppointments > 3 && (
                  <div
                    style={{
                      padding: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#fff3cd',
                      borderLeft: `3px solid #ffc107`,
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    <strong>Muitos agendamentos hoje!</strong> Fique atento aos horários.
                  </div>
                )}
                {metrics.cancelledToday > 2 && (
                  <div
                    style={{
                      padding: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#f8d7da',
                      borderLeft: `3px solid #dc3545`,
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    <strong>Muitos cancelamentos!</strong> Considere revisar políticas.
                  </div>
                )}
                {metrics.totalRevenueToday > 500 && (
                  <div
                    style={{
                      padding: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#d4edda',
                      borderLeft: `3px solid #28a745`,
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    <strong>Ótimo desempenho!</strong> Receita acima da média.
                  </div>
                )}
                {metrics.activeAppointments === 0 &&
                  metrics.appointmentsToday === 0 && (
                    <div
                      style={{
                        padding: '10px',
                        backgroundColor: '#e2e3e5',
                        borderLeft: `3px solid #6c757d`,
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      <strong>Nenhum agendamento</strong> marcado para hoje.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Erro ao carregar métricas</div>
      )}
    </div>
  );
}
