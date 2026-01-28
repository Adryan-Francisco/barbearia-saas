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

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({ name, phone, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/appointments');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registro falhou');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authContainerStyle}>
      <div style={authCardStyle} className="fade-in">
        <div style={{ marginBottom: '30px' }}>
          <h1 style={authTitleStyle}>Crie sua Conta</h1>
          <p style={authSubtitleStyle}>Junte-se a nós para agendar seus cortes</p>
        </div>

        {error && <div style={errorMessageStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>👤 Nome Completo</label>
            <input
              type="text"
              style={
                focusedField === 'name'
                  ? inputFocusStyle
                  : inputStyle
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Seu nome completo"
              required
            />
          </div>

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
              placeholder="Digite uma senha segura"
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>✓ Confirmar Senha</label>
            <input
              type="password"
              style={
                focusedField === 'confirmPassword'
                  ? inputFocusStyle
                  : inputStyle
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              placeholder="Confirme sua senha"
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
            {loading ? '⏳ Cadastrando...' : '✨ Cadastrar'}
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
            Já tem conta?
          </p>
          <Link
            to="/login"
            style={linkStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
          >
            Faça login aqui
          </Link>
        </div>
      </div>
    </div>
  );
}
