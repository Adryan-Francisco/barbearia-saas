import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;

const Logo = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
`;

const LogoSubtitle = styled.p`
  font-size: 12px;
  color: #64748b;
`;

const Nav = styled.nav`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NavLink = styled.button<{ $active?: boolean }>`
  padding: 10px 18px;
  background: ${(props) => (props.$active ? '#f1f5f9' : 'transparent')};
  color: ${(props) => (props.$active ? '#0f172a' : '#64748b')};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 18px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
  }
`;

export default function BarbershopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const barbershop_name = localStorage.getItem('barbershop_name');

  const handleLogout = () => {
    localStorage.removeItem('barbershop_id');
    localStorage.removeItem('barbershop_name');
    navigate('/barbershop/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <HeaderWrapper>
      <HeaderContent>
        <Logo onClick={() => navigate('/barbershop-dashboard')}>
          <div>
            <LogoTitle>BarberPro</LogoTitle>
            {barbershop_name && <LogoSubtitle>{barbershop_name}</LogoSubtitle>}
          </div>
        </Logo>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Nav>
            <NavLink
              $active={isActive('/barbershop-dashboard')}
              onClick={() => navigate('/barbershop-dashboard')}
            >
              Dashboard
            </NavLink>
            <NavLink
              $active={isActive('/realtime-dashboard')}
              onClick={() => navigate('/realtime-dashboard')}
            >
              Tempo Real
            </NavLink>
            <NavLink
              $active={isActive('/analytics')}
              onClick={() => navigate('/analytics')}
            >
              Análises
            </NavLink>
            <NavLink
              $active={isActive('/charts')}
              onClick={() => navigate('/charts')}
            >
              Gráficos
            </NavLink>
            <NavLink
              $active={isActive('/payments')}
              onClick={() => navigate('/payments')}
            >
              Pagamentos
            </NavLink>
            <NavLink
              $active={isActive('/client-history')}
              onClick={() => navigate('/client-history')}
            >
              Histórico
            </NavLink>
          </Nav>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </div>
      </HeaderContent>
    </HeaderWrapper>
  );
}
