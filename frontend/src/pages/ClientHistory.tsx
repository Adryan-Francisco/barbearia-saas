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
  emptyStateStyle,
} from '../styles';

interface ClientHistory {
  id: string;
  client_name: string;
  client_phone: string;
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  total_spent: number;
  last_appointment_date?: string;
}

export function ClientHistory() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [barbershopId, setBarbershopId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('barbershop_id');
    if (id) {
      setBarbershopId(id);
      fetchClients(id);
    }
  }, []);

  const fetchClients = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/analytics/${id}/clients`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.client_phone.includes(searchTerm)
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

      <h1>Histórico de Clientes</h1>

      <input
        type="text"
        placeholder="Buscar por nome ou telefone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          border: `1px solid ${colors.border}`,
        }}
      />

      {isLoading ? (
        <div>Carregando...</div>
      ) : filteredClients.length === 0 ? (
        <div style={emptyStateStyle}>Nenhum cliente encontrado</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: colors.primary, color: '#fff' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Telefone</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>
                  Agendamentos
                </th>
                <th style={{ padding: '12px', textAlign: 'center' }}>
                  Concluídos
                </th>
                <th style={{ padding: '12px', textAlign: 'center' }}>
                  Cancelados
                </th>
                <th style={{ padding: '12px', textAlign: 'right' }}>
                  Gasto Total
                </th>
                <th style={{ padding: '12px', textAlign: 'center' }}>
                  Último Agendamento
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => (
                <tr
                  key={client.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5',
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <td style={{ padding: '12px' }}>{client.client_name}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {client.client_phone}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {client.total_appointments}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{ color: colors.success }}>
                      {client.completed_appointments}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{ color: colors.danger }}>
                      {client.cancelled_appointments}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    R$ {client.total_spent.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {client.last_appointment_date
                      ? new Date(client.last_appointment_date).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
