import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  containerStyle,
  buttonSecondaryStyle,
  buttonSecondaryHoverStyle,
  cardStyle,
  colors,
  emptyStateStyle,
} from '../styles';

interface Payment {
  id: string;
  appointment_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  created_at: string;
}

export function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [barbershopId, setBarbershopId] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem('barbershop_id');
    if (id) {
      setBarbershopId(id);
      fetchPayments(id);
      fetchRevenue(id);
    }
  }, []);

  const fetchPayments = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/payments/${id}/payments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRevenue = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/payments/${id}/revenue`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTotalRevenue(data.revenue);
      }
    } catch (error) {
      console.error('Erro ao carregar receita:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'refunded':
        return colors.info;
      case 'failed':
        return colors.danger;
      default:
        return colors.text;
    }
  };

  const getStatusText = (status: string) => {
    const translations: { [key: string]: string } = {
      completed: 'Completo',
      pending: 'Pendente',
      refunded: 'Reembolsado',
      failed: 'Falhou',
    };
    return translations[status] || status;
  };

  const filteredPayments = filterStatus
    ? payments.filter((p) => p.status === filterStatus)
    : payments;

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

      <h1>Pagamentos</h1>

      <div style={cardStyle}>
        <h2>Receita Total: R$ {totalRevenue.toFixed(2)}</h2>
      </div>

      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <label>Filtrar por status: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${colors.border}`,
            marginLeft: '10px',
          }}
        >
          <option value="">Todos</option>
          <option value="completed">Completo</option>
          <option value="pending">Pendente</option>
          <option value="refunded">Reembolsado</option>
          <option value="failed">Falhou</option>
        </select>
      </div>

      {isLoading ? (
        <div>Carregando...</div>
      ) : filteredPayments.length === 0 ? (
        <div style={emptyStateStyle}>Nenhum pagamento encontrado</div>
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
                <th style={{ padding: '12px', textAlign: 'left' }}>ID Pagamento</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>
                  Agendamento
                </th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Valor</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Método</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr
                  key={payment.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5',
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <td style={{ padding: '12px', fontSize: '12px' }}>
                    {payment.id.substring(0, 8)}...
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>
                    {payment.appointment_id.substring(0, 8)}...
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                    R$ {payment.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {payment.payment_method}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: getStatusColor(payment.status),
                      fontWeight: 'bold',
                    }}
                  >
                    {getStatusText(payment.status)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {new Date(payment.created_at).toLocaleDateString('pt-BR')}
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
