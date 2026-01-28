import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
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
  linkStyle,
  linkHoverStyle,
  colors,
} from '../styles';

export default function Login() {
  const [phone, setPhone] = useState('');
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
      const response = await authAPI.login({ phone, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/appointments');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authContainerStyle}>
      <div style={authCardStyle} className="fade-in">
        <div style={{ marginBottom: '30px' }}>
          <h1 style={authTitleStyle}>Bem-vindo</h1>
          <p style={authSubtitleStyle}>Faça login para agendar seu corte</p>
        </div>

        {error && <div style={errorMessageStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>📱 Telefone</label>
            <input
              type="tel"
              style={
                focusedField === 'phone'
                  ? inputFocusStyle
                  : inputStyle
              }
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              placeholder="(11) 99999-9999"
              required
            />
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
              placeholder="Sua senha segura"
              required
            />
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
            {loading ? '⏳ Entrando...' : '🚀 Entrar'}
          </button>
        </form>

        <div
          style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: `1px solid ${colors.border}`,
            textAlign: 'center',
          }}
        >
          <p style={{ color: colors.gray, fontSize: '14px', marginBottom: '10px' }}>
            Não tem conta?
          </p>
          <Link
            to="/register"
            style={linkStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
          >
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
}
