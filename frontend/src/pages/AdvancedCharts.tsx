import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  containerStyle,
  buttonSecondaryStyle,
  buttonSecondaryHoverStyle,
  cardStyle,
  colors,
} from '../styles';

interface ChartData {
  name: string;
  value?: number;
  [key: string]: any;
}

export function AdvancedCharts() {
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [appointmentData, setAppointmentData] = useState<ChartData[]>([]);
  const [serviceData, setServiceData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [barbershopId, setBarbershopId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('barbershop_id');
    if (id) {
      setBarbershopId(id);
      fetchChartData(id);
    }
  }, []);

  const fetchChartData = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/barbershop/${id}/daily-trend?days=7`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Preparar dados para gráfico de receita
        const revenue = data.map((item: any) => ({
          name: new Date(item.date).toLocaleDateString('pt-BR'),
          revenue: item.revenue,
          date: item.date,
        }));
        setRevenueData(revenue);

        // Preparar dados para gráfico de agendamentos
        const appointments = data.map((item: any) => ({
          name: new Date(item.date).toLocaleDateString('pt-BR'),
          total: item.appointments,
          completed: item.completed,
          cancelled: item.cancelled,
          date: item.date,
        }));
        setAppointmentData(appointments);

        // Preparar dados para gráfico de distribuição de serviços (simulado)
        const services = [
          { name: 'Corte de Cabelo', value: 35, fill: colors.primary },
          { name: 'Barba', value: 25, fill: colors.success },
          { name: 'Corte + Barba', value: 40, fill: colors.warning },
        ];
        setServiceData(services);
      }
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = [colors.primary, colors.success, colors.warning, colors.info, colors.danger];

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

      <h1>Gráficos e Visualizações Avançadas</h1>

      {isLoading ? (
        <div>Carregando gráficos...</div>
      ) : (
        <>
          {/* Gráfico de Receita */}
          <div style={cardStyle}>
            <h2>Receita - Últimos 7 dias</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '4px',
                  }}
                  formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Receita']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={colors.success}
                  dot={{ fill: colors.success, r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  name="Receita"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Agendamentos */}
          <div style={cardStyle}>
            <h2>Agendamentos - Últimos 7 dias</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '4px',
                  }}
                />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill={colors.success} name="Concluídos" />
                <Bar dataKey="cancelled" stackId="a" fill={colors.danger} name="Cancelados" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Gráfico de Distribuição de Serviços */}
            <div style={cardStyle}>
              <h2>Distribuição de Serviços</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Estatísticas Rápidas */}
            <div style={cardStyle}>
              <h2>Estatísticas da Semana</h2>
              <div style={{ marginTop: '15px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>
                    Receita Total
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: colors.success, margin: '5px 0 0 0' }}>
                    R${' '}
                    {revenueData
                      .reduce((sum, item) => sum + (item.revenue || 0), 0)
                      .toFixed(2)}
                  </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>
                    Total de Agendamentos
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary, margin: '5px 0 0 0' }}>
                    {appointmentData.reduce((sum, item) => sum + (item.total || 0), 0)}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>
                    Taxa Média de Conclusão
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: colors.warning, margin: '5px 0 0 0' }}>
                    {appointmentData.length > 0
                      ? (
                          (appointmentData.reduce((sum, item) => sum + (item.completed || 0), 0) /
                            appointmentData.reduce((sum, item) => sum + (item.total || 1), 1)) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
