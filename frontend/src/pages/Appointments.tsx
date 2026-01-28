import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { schedulingAPI } from '../api';
import {
  containerStyle,
  buttonStyle,
  buttonHoverStyle,
  buttonDangerStyle,
  buttonDangerHoverStyle,
  cardStyle,
  cardHoverStyle,
  errorMessageStyle,
  badgeSuccessStyle,
  badgeDangerStyle,
  colors,
  emptyStateStyle,
  emptyStateTitleStyle,
} from '../styles';

interface Appointment {
  id: string;
  service_name: string;
  barbershop_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await schedulingAPI.listAppointments();
      setAppointments(response.data);
    } catch (err: any) {
      setError('Falha ao carregar agendamentos');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        await schedulingAPI.cancelAppointment(appointmentId);
        loadAppointments();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Erro ao cancelar agendamento');
      }
    }
  };

  const canCancelAppointment = (apt: Appointment): boolean => {
    const appointmentDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
    const now = new Date();
    const oneHourBefore = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);
    return now < oneHourBefore && apt.status === 'confirmed';
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
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
          <p style={{ marginTop: '20px', color: colors.gray }}>Carregando seus agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '40px',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: colors.dark, fontSize: '32px', fontWeight: '800' }}>
            📅 Meus Agendamentos
          </h2>
          <p style={{ margin: 0, color: colors.gray, fontSize: '15px', fontWeight: '500' }}>
            Gerencie seus cortes e horários com facilidade
          </p>
        </div>
        <button
          onClick={() => navigate('/new-appointment')}
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
        >
          ➕ Novo Agendamento
        </button>
      </div>

      {error && <div style={errorMessageStyle}>⚠️ {error}</div>}

      {appointments.length === 0 ? (
        <div style={emptyStateStyle} className="fade-in">
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✂️</div>
          <h3 style={emptyStateTitleStyle}>Nenhum agendamento ainda</h3>
          <p style={{ color: colors.gray, marginBottom: '24px' }}>
            Clique em "Novo Agendamento" para reservar seu primeiro horário!
          </p>
          <button
            onClick={() => navigate('/new-appointment')}
            style={buttonStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          >
            🚀 Agendar Agora
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
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
                    {apt.barbershop_name}
                  </h3>
                  <p style={{ margin: 0, color: colors.gray, fontSize: '13px' }}>
                    📍 {apt.service_name}
                  </p>
                </div>
                <div
                  style={
                    apt.status === 'confirmed' ? badgeSuccessStyle : badgeDangerStyle
                  }
                >
                  {apt.status === 'confirmed' ? '✓ Confirmado' : '✕ Cancelado'}
                </div>
              </div>

              <div
                style={{
                  background: `${colors.primary}05`,
                  padding: '16px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  border: `1px solid ${colors.primary}15`,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: colors.gray, fontWeight: '700', textTransform: 'uppercase' }}>
                      Data
                    </p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: colors.dark }}>
                      {new Date(apt.appointment_date).toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: colors.gray, fontWeight: '700', textTransform: 'uppercase' }}>
                      Horário
                    </p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: colors.primary }}>
                      {apt.appointment_time}
                    </p>
                  </div>
                </div>
              </div>

              {apt.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(apt.id)}
                  style={
                    canCancelAppointment(apt)
                      ? buttonDangerStyle
                      : {
                          ...buttonDangerStyle,
                          opacity: 0.5,
                          cursor: 'not-allowed',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (canCancelAppointment(apt)) {
                      Object.assign(e.currentTarget.style, buttonDangerHoverStyle);
                    }
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, canCancelAppointment(apt) ? buttonDangerStyle : { ...buttonDangerStyle, opacity: '0.5' });
                  }}
                  disabled={!canCancelAppointment(apt)}
                  title={
                    !canCancelAppointment(apt)
                      ? 'Não é possível cancelar com menos de 1 hora de antecedência'
                      : 'Cancelar agendamento'
                  }
                >
                  🗑️ Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
