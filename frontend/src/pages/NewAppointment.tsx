import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { schedulingAPI } from '../api';
import {
  containerStyle,
  buttonStyle,
  buttonHoverStyle,
  buttonSecondaryStyle,
  buttonSecondaryHoverStyle,
  inputStyle,
  inputFocusStyle,
  formGroupStyle,
  labelStyle,
  errorMessageStyle,
  successMessageStyle,
  colors,
} from '../styles';

export default function NewAppointment() {
  const [barbershopId, setBarbershopId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  const barbershops = [
    { id: '1', name: '✂️ Barbearia Central' },
    { id: '2', name: '✂️ Barbearia Premium' },
  ];

  const services = [
    { id: '1', name: 'Corte de Cabelo', duration: 30, price: 50 },
    { id: '2', name: 'Barba', duration: 20, price: 30 },
    { id: '3', name: 'Corte + Barba', duration: 50, price: 70 },
  ];

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setAppointmentDate(date);
    setAppointmentTime('');
    setAvailableSlots([]);

    if (date && barbershopId) {
      try {
        const response = await schedulingAPI.getAvailableSlots(barbershopId, date);
        setAvailableSlots(response.data.slots);
      } catch (err) {
        setError('Erro ao carregar horários disponíveis');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!barbershopId || !serviceId || !appointmentDate || !appointmentTime) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      await schedulingAPI.createAppointment({
        barbershop_id: barbershopId,
        service_id: serviceId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
      });

      setSuccess('🎉 Agendamento realizado com sucesso!');
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find((s) => s.id === serviceId);

  return (
    <div style={{ ...containerStyle, maxWidth: '700px', marginTop: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 5px 0', color: colors.dark, fontSize: '28px' }}>
          📅 Novo Agendamento
        </h2>
        <p style={{ margin: 0, color: colors.gray, fontSize: '14px' }}>
          Reserve seu horário na barbearia
        </p>
      </div>

      {error && <div style={errorMessageStyle}>{error}</div>}
      {success && <div style={successMessageStyle}>{success}</div>}

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: colors.white,
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <div style={formGroupStyle}>
          <label style={labelStyle}>✂️ Barbearia</label>
          <select
            style={
              focusedField === 'barbershop'
                ? inputFocusStyle
                : inputStyle
            }
            value={barbershopId}
            onChange={(e) => setBarbershopId(e.target.value)}
            onFocus={() => setFocusedField('barbershop')}
            onBlur={() => setFocusedField(null)}
            required
          >
            <option value="">Selecione uma barbearia</option>
            {barbershops.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>🔧 Serviço</label>
          <select
            style={
              focusedField === 'service'
                ? inputFocusStyle
                : inputStyle
            }
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            onFocus={() => setFocusedField('service')}
            onBlur={() => setFocusedField(null)}
            required
          >
            <option value="">Selecione um serviço</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} - R$ {s.price.toFixed(2)}
              </option>
            ))}
          </select>
          {selectedService && (
            <p
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: colors.gray,
              }}
            >
              ⏱️ Duração: {selectedService.duration} minutos
            </p>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>📅 Data</label>
          <input
            type="date"
            style={
              focusedField === 'date'
                ? inputFocusStyle
                : inputStyle
            }
            value={appointmentDate}
            onChange={handleDateChange}
            onFocus={() => setFocusedField('date')}
            onBlur={() => setFocusedField(null)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {availableSlots.length > 0 && (
          <div style={formGroupStyle} className="fade-in">
            <label style={labelStyle}>🕐 Horário</label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: '10px',
                marginBottom: '15px',
              }}
            >
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setAppointmentTime(slot)}
                  style={{
                    padding: '10px',
                    border:
                      appointmentTime === slot
                        ? `2px solid ${colors.primary}`
                        : `2px solid ${colors.border}`,
                    backgroundColor:
                      appointmentTime === slot
                        ? `${colors.primary}20`
                        : colors.white,
                    color: appointmentTime === slot ? colors.primary : colors.dark,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      appointmentTime === slot ? colors.primary : colors.border;
                    e.currentTarget.style.backgroundColor =
                      appointmentTime === slot ? `${colors.primary}20` : colors.white;
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {appointmentDate && availableSlots.length === 0 && (
          <div style={{ ...successMessageStyle, marginBottom: '20px' }}>
            ℹ️ Carregando horários disponíveis...
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={loading ? { ...buttonStyle, opacity: 0.7 } : buttonStyle}
            onMouseEnter={(e) => {
              if (!loading) Object.assign(e.currentTarget.style, buttonHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, buttonStyle);
            }}
            disabled={loading}
          >
            {loading ? '⏳ Agendando...' : '✓ Confirmar Agendamento'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/appointments')}
            style={buttonSecondaryStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonSecondaryHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonSecondaryStyle)}
          >
            ← Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
