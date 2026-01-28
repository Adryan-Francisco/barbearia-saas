import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  headerStyle,
  headerTitleStyle,
  headerSubtitleStyle,
  buttonSecondaryStyle,
  buttonSecondaryHoverStyle,
  buttonSmallStyle,
  colors,
} from '../styles';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const currentPage = location.pathname === '/appointments' ? 'appointments' : 'new-appointment';

  return (
    <div style={headerStyle}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 20px',
        }}
      >
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/appointments')}>
          <h1 style={headerTitleStyle}>✂️ BarberPro</h1>
          {user && <p style={headerSubtitleStyle}>Bem-vindo de volta, {user.name}!</p>}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          {/* Links de navegação */}
          <nav style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/appointments')}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 'appointments' ? 'rgba(255,255,255,0.3)' : 'transparent',
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  currentPage === 'appointments' ? 'rgba(255,255,255,0.3)' : 'transparent';
              }}
            >
              📅 Agendamentos
            </button>
            <button
              onClick={() => navigate('/new-appointment')}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 'new-appointment' ? 'rgba(255,255,255,0.3)' : 'transparent',
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  currentPage === 'new-appointment' ? 'rgba(255,255,255,0.3)' : 'transparent';
              }}
            >
              ➕ Novo
            </button>
          </nav>

          {/* Menu dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                ...buttonSecondaryStyle,
                ...buttonSmallStyle,
                width: 'auto',
                minWidth: '110px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: colors.white,
                border: '1px solid rgba(255,255,255,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
              }}
            >
              👤 {isDropdownOpen ? '▲' : '▼'}
            </button>

            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '12px',
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  minWidth: '160px',
                  overflow: 'hidden',
                }}
                className="fade-in"
              >
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: colors.dark,
                    transition: 'all 0.2s ease',
                    fontWeight: '600',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.grayLight;
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.dark;
                  }}
                >
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
