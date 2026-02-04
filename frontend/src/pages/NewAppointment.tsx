import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { schedulingAPI } from '../api';
import { colors } from '../styles';

const Container = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 40px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 15px;
    color: #64748b;
    margin: 0;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SelectInput = styled.select<{ $focused?: boolean }>`
  padding: 14px 16px;
  font-size: 15px;
  border: 1.5px solid ${(props) => (props.$focused ? '#667eea' : '#e2e8f0')};
  border-radius: 10px;
  transition: all 0.3s ease;
  font-family: inherit;
  background-color: ${(props) => (props.$focused ? '#ffffff' : '#f8fafc')};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  &:hover {
    border-color: #cbd5e1;
  }
`;

const DateInput = styled.input<{ $focused?: boolean }>`
  padding: 14px 16px;
  font-size: 15px;
  border: 1.5px solid ${(props) => (props.$focused ? '#667eea' : '#e2e8f0')};
  border-radius: 10px;
  transition: all 0.3s ease;
  font-family: inherit;
  background-color: ${(props) => (props.$focused ? '#ffffff' : '#f8fafc')};

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
`;

const SlotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  margin-top: 12px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SlotButton = styled.button<{ $selected?: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.$selected ? '#667eea' : '#e2e8f0')};
  background-color: ${(props) => (props.$selected ? 'rgba(102, 126, 234, 0.1)' : '#ffffff')};
  color: ${(props) => (props.$selected ? '#667eea' : '#334155')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    background-color: rgba(102, 126, 234, 0.05);
  }
`;

const HelperText = styled.p`
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
  margin-bottom: 0;
`;

const Message = styled.div<{ $type?: 'error' | 'success' | 'info' }>`
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid;

  ${(props) => {
    switch (props.$type) {
      case 'error':
        return `
          background: #fee2e2;
          border-color: #fecaca;
          color: #dc2626;
        `;
      case 'success':
        return `
          background: #dcfce7;
          border-color: #bbf7d0;
          color: #16a34a;
        `;
      case 'info':
      default:
        return `
          background: #dbeafe;
          border-color: #bfdbfe;
          color: #1e40af;
        `;
    }
  }}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 30px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary'; $loading?: boolean }>`
  flex: 1;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: ${(props) => (props.$loading ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) => {
    if (props.$variant === 'secondary') {
      return `
        background: #f1f5f9;
        color: #334155;
        
        &:hover:not(:disabled) {
          background: #e2e8f0;
          transform: translateY(-2px);
        }
      `;
    }
    return `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      opacity: ${props.$loading ? 0.7 : 1};
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
      }
    `;
  }}
`;

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
    { id: 'barbearia-central-001', name: 'Barbearia Central' },
    { id: 'barbearia-premium-001', name: 'Barbearia Premium' },
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

      setSuccess('Agendamento realizado com sucesso!');
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find((s) => s.id === serviceId);

  return (
    <Container>
      <Header>
        <h1>Novo Agendamento</h1>
        <p>Reserve seu horário na barbearia</p>
      </Header>

      <Card>
        {error && <Message $type="error">{error}</Message>}
        {success && <Message $type="success">{success}</Message>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Barbearia</Label>
            <SelectInput
              $focused={focusedField === 'barbershop'}
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
            </SelectInput>
          </FormGroup>

          <FormGroup>
            <Label>Serviço</Label>
            <SelectInput
              $focused={focusedField === 'service'}
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
            </SelectInput>
            {selectedService && (
              <HelperText>
                Duração: {selectedService.duration} minutos
              </HelperText>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Data</Label>
            <DateInput
              type="date"
              $focused={focusedField === 'date'}
              value={appointmentDate}
              onChange={handleDateChange}
              onFocus={() => setFocusedField('date')}
              onBlur={() => setFocusedField(null)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </FormGroup>

          {availableSlots.length > 0 && (
            <FormGroup>
              <Label>Horário Disponível</Label>
              <SlotsContainer>
                {availableSlots.map((slot) => (
                  <SlotButton
                    key={slot}
                    type="button"
                    $selected={appointmentTime === slot}
                    onClick={() => setAppointmentTime(slot)}
                  >
                    {slot}
                  </SlotButton>
                ))}
              </SlotsContainer>
            </FormGroup>
          )}

          {appointmentDate && availableSlots.length === 0 && (
            <Message $type="info">Carregando horários disponíveis...</Message>
          )}

          <ButtonGroup>
            <Button type="submit" $variant="primary" $loading={loading} disabled={loading}>
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
            <Button type="button" $variant="secondary" onClick={() => navigate('/appointments')}>
              Voltar
            </Button>
          </ButtonGroup>
        </Form>
      </Card>
    </Container>
  );
}
