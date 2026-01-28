import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  authContainerStyle,
  authCardStyle,
  authTitleStyle,
  authSubtitleStyle,
  formGroupStyle,
  labelStyle,
  inputStyle,
  inputFocusStyle,
  buttonStyle,
  buttonHoverStyle,
  errorMessageStyle,
  colors,
} from '../styles';

export default function BarbershopLogin() {
  const [barbershop_id, setBarbershopId] = useState('1');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/barbershop/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barbershop_id, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha no login');
      }

      localStorage.setItem('barbershop_id', data.barbershop.id);
      localStorage.setItem('barbershop_name', data.barbershop.name);
      navigate('/barbershop/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authContainerStyle}>
      <div style={authCardStyle} className="fade-in">
        <div style={{ marginBottom: '30px' }}>
          <h1 style={authTitleStyle}>🏪 Painel da Barbearia</h1>
          <p style={authSubtitleStyle}>Acesse o dashboard de agendamentos</p>
        </div>

        {error && <div style={errorMessageStyle}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>🏢 ID da Barbearia</label>
            <input
              type="text"
              style={
                focusedField === 'barbershop'
                  ? inputFocusStyle
                  : inputStyle
              }
              value={barbershop_id}
              onChange={(e) => setBarbershopId(e.target.value)}
              onFocus={() => setFocusedField('barbershop')}
              onBlur={() => setFocusedField(null)}
              placeholder="1 ou 2"
              required
            />
            <p style={{ fontSize: '12px', color: colors.gray, marginTop: '6px' }}>
              💡 Use: 1 para Barbearia Central ou 2 para Barbearia Premium
            </p>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>🔐 Senha</label>
            <input
              type="password"
              style={
                focusedField === 'password'
                  ? inputFocusStyle
                  : inputStyle
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="admin123"
              required
            />
            <p style={{ fontSize: '12px', color: colors.gray, marginTop: '6px' }}>
              💡 Senha padrão: admin123
            </p>
          </div>

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
            {loading ? '⏳ Acessando...' : '🚀 Acessar Dashboard'}
          </button>

          <div
            style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: `1px solid ${colors.border}`,
              textAlign: 'center',
            }}
          >
            <p style={{ color: colors.gray, fontSize: '14px', marginBottom: '10px' }}>
              Acesso de cliente?
            </p>
            <a
              href="/login"
              style={{
                color: colors.primary,
                textDecoration: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.primaryLight;
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.primary;
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Faça login aqui
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
