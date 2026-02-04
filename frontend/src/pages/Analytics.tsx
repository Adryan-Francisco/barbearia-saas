import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  containerStyle,
  buttonStyle,
  buttonHoverStyle,
  buttonSecondaryStyle,
  buttonSecondaryHoverStyle,
  cardStyle,
  colors,
} from '../styles';

interface AnalyticsData {
  totalRevenue: number;
  totalAppointments: number;
  completedAppointments: number;
  averageRevenuePerDay: number;
}

export function Analytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [barbershopId, setBarbershopId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const id = localStorage.getItem('barbershop_id');
    if (id) {
      setBarbershopId(id);
      fetchAnalytics(id);
    }
  }, []);

  const fetchAnalytics = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/analytics/${id}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.summary);
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string | number;
    icon: string;
  }) => (
    <div
      style={{
        ...cardStyle,
        flex: 1,
        minWidth: '200px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ margin: '10px 0' }}>{title}</h3>
      <p
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: colors.primary,
          margin: 0,
        }}
      >
        {value}
      </p>
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

      <h1>Relatórios e Analytics</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Mês: </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${colors.border}`,
            marginLeft: '10px',
          }}
        />
      </div>

      {isLoading ? (
        <div>Carregando dados...</div>
      ) : analytics ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <StatCard
              title="Receita Total"
              value={`R$ ${analytics.totalRevenue.toFixed(2)}`}
              icon=""
            />
            <StatCard
              title="Total de Agendamentos"
              value={analytics.totalAppointments}
              icon=""
            />
            <StatCard
              title="Agendamentos Concluídos"
              value={analytics.completedAppointments}
              icon="✅"
            />
            <StatCard
              title="Receita Média/Dia"
              value={`R$ ${analytics.averageRevenuePerDay.toFixed(2)}`}
              icon="📊"
            />
          </div>

          <div style={cardStyle}>
            <h2>Resumo do Período</h2>
            <div style={{ marginTop: '20px' }}>
              <p>
                <strong>Mês selecionado:</strong> {selectedMonth}
              </p>
              <p>
                <strong>Taxa de conclusão:</strong>{' '}
                {analytics.totalAppointments > 0
                  ? (
                      (analytics.completedAppointments /
                        analytics.totalAppointments) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/client-history')}
            style={buttonStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          >
            Ver Histórico de Clientes
          </button>
        </>
      ) : (
        <div>Erro ao carregar dados</div>
      )}
    </div>
  );
}
