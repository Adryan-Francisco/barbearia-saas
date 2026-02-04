import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  containerStyle,
  buttonStyle,
  buttonHoverStyle,
  buttonSecondaryStyle,
  buttonSecondaryHoverStyle,
  cardStyle,
  cardHoverStyle,
  errorMessageStyle,
  successMessageStyle,
  badgeSuccessStyle,
  badgePrimaryStyle,
  colors,
  emptyStateStyle,
  emptyStateTitleStyle,
} from '../styles';

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

interface Stats {
  total_appointments: number;
  confirmed: number;
  cancelled: number;
  today: number;
  total_revenue: number;
}

export default function BarbershopDashboard() {
  const navigate = useNavigate();
  const barbershop_id = localStorage.getItem('barbershop_id');
  const barbershop_name = localStorage.getItem('barbershop_name');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    if (!barbershop_id) {
      navigate('/barbershop/login');
      return;
    }
    loadData();
  }, [barbershop_id, selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Loading data for barbershop:', barbershop_id, 'date:', selectedDate);

      // Carregar estatísticas
      const statsResponse = await fetch(`http://localhost:3001/api/barbershop/${barbershop_id}/stats`);
      console.log('Stats response:', statsResponse.status, statsResponse.ok);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('Stats data:', statsData);
        setStats(statsData);
      } else {
        console.error('Stats error:', await statsResponse.text());
      }

      // Carregar agendamentos do dia selecionado
      const appointmentsResponse = await fetch(
        `http://localhost:3001/api/barbershop/${barbershop_id}/appointments/${selectedDate}`
      );
      console.log('Appointments response:', appointmentsResponse.status, appointmentsResponse.ok);
      if (appointmentsResponse.ok) {
        const data = await appointmentsResponse.json();
        console.log('Appointments data:', data);
        setAppointments(data.appointments);
      } else {
        console.error('Appointments error:', await appointmentsResponse.text());
      }
    } catch (err: any) {
      console.error('Load error:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (!barbershop_id) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`,
      }}
    >
      <div style={{ padding: '20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: '#1e293b' }}>
          Dashboard de Agendamentos
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b', margin: 0, marginBottom: '30px' }}>
          Gerencie seus agendamentos em tempo real
        </p>
      </div>

      <div style={containerStyle}>
        {/* Estatísticas */}
        {stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            <div style={{ ...cardStyle, borderLeft: `4px solid ${colors.primary}` }}>
              <p style={{ color: colors.gray, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                Total de Agendamentos
              </p>
              <h3 style={{ fontSize: '32px', fontWeight: '800', color: colors.primary, margin: 0 }}>
                {stats.total_appointments}
              </h3>
            </div>

            <div style={{ ...cardStyle, borderLeft: `4px solid ${colors.success}` }}>
              <p style={{ color: colors.gray, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                Confirmados
              </p>
              <h3 style={{ fontSize: '32px', fontWeight: '800', color: colors.success, margin: 0 }}>
                {stats.confirmed}
              </h3>
            </div>

            <div style={{ ...cardStyle, borderLeft: `4px solid ${colors.danger}` }}>
              <p style={{ color: colors.gray, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                Cancelados
              </p>
              <h3 style={{ fontSize: '32px', fontWeight: '800', color: colors.danger, margin: 0 }}>
                {stats.cancelled}
              </h3>
            </div>

            <div style={{ ...cardStyle, borderLeft: `4px solid ${colors.info}` }}>
              <p style={{ color: colors.gray, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                Hoje
              </p>
              <h3 style={{ fontSize: '32px', fontWeight: '800', color: colors.info, margin: 0 }}>
                {stats.today}
              </h3>
            </div>

            <div style={{ ...cardStyle, borderLeft: `4px solid #52C41A` }}>
              <p style={{ color: colors.gray, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                Lucro Total
              </p>
              <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#52C41A', margin: 0 }}>
                R$ {(stats.total_revenue || 0).toFixed(2)}
              </h3>
            </div>
          </div>
        )}

        {/* Filtro de Data */}
        <div
          style={{
            ...cardStyle,
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: colors.dark, marginBottom: '8px' }}>
              Selecione uma data
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '10px 14px',
                border: `1.5px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ fontSize: '12px', color: colors.gray, fontWeight: '600' }}>
            Mostrando agendamentos para: <strong>{new Date(selectedDate).toLocaleDateString('pt-BR')}</strong>
          </div>
        </div>

        {error && <div style={errorMessageStyle}>Erro: {error}</div>}

        {/* Agendamentos */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: `4px solid ${colors.grayLight}`,
                borderTop: `4px solid ${colors.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ marginTop: '20px', color: colors.gray }}>Carregando agendamentos...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div style={emptyStateStyle} className="fade-in">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
            <h3 style={emptyStateTitleStyle}>Nenhum agendamento para este dia</h3>
            <p style={{ color: colors.gray, marginBottom: '24px' }}>
              Selecione outra data para visualizar os agendamentos
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
            }}
          >
            {appointments.map((apt, index) => (
              <div
                key={apt.id}
                style={{
                  ...cardStyle,
                  background: apt.status === 'cancelled' ? `${colors.gray}10` : colors.white,
                  opacity: apt.status === 'cancelled' ? 0.75 : 1,
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...cardHoverStyle,
                    background: apt.status === 'cancelled' ? `${colors.gray}10` : colors.white,
                  });
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...cardStyle,
                    background: apt.status === 'cancelled' ? `${colors.gray}10` : colors.white,
                  });
                }}
                className="fade-in"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', color: colors.dark, fontSize: '18px', fontWeight: '700' }}>
                      {apt.appointment_time}
                    </h3>
                    <p style={{ margin: 0, color: colors.gray, fontSize: '13px' }}>
                      {apt.service_name}
                    </p>
                  </div>
                  <div
                    style={
                      apt.status === 'confirmed' ? badgeSuccessStyle : badgePrimaryStyle
                    }
                  >
                    {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </div>
                </div>

                <div
                  style={{
                    background: `${colors.primary}05`,
                    padding: '14px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: `1px solid ${colors.primary}15`,
                  }}
                >
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: colors.dark, fontWeight: '700' }}>
                    {apt.client_name}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: colors.gray }}>
                    {apt.client_phone}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: colors.primary, fontWeight: '700' }}>
                    R$ {apt.service_price?.toFixed(2)}
                  </p>
                </div>

                {apt.status !== 'confirmed' && (
                  <button
                    style={buttonSuccessStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.success;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.success;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Confirmar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const buttonSuccessStyle = {
  width: '100%',
  padding: '12px 24px',
  backgroundColor: colors.success,
  color: colors.white,
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: `0 4px 12px ${colors.success}40`,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
} as React.CSSProperties;
