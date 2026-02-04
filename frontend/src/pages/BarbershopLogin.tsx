import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../styles';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Logo = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const StyledInput = styled.input<{ $focused?: boolean }>`
  padding: 14px 16px;
  font-size: 15px;
  border: 1.5px solid ${(props) => (props.$focused ? '#667eea' : '#e2e8f0')};
  border-radius: 10px;
  transition: all 0.3s ease;
  font-family: inherit;
  background-color: ${(props) => (props.$focused ? '#ffffff' : '#f8fafc')};
  box-shadow: ${(props) => (props.$focused ? '0 0 0 4px rgba(102, 126, 234, 0.1)' : 'none')};
  transform: ${(props) => (props.$focused ? 'translateY(-1px)' : 'translateY(0)')};

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #cbd5e1;
  }
`;

const Button = styled.button<{ $loading?: boolean }>`
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${(props) => (props.$loading ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};
  transform: translateY(0);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Helper = styled.p`
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
  margin-bottom: 0;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
`;

const DividerText = styled.span`
  font-size: 13px;
  color: #94a3b8;
`;

const FooterLink = styled.a`
  text-align: center;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: block;

  &:hover {
    color: #764ba2;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
`;

export default function BarbershopLogin() {
  const [barbershop_id, setBarbershopId] = useState('barbearia-central-001');
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
      navigate('/barbershop-dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <Logo>✂️</Logo>
          <Title>Painel Barbearia</Title>
          <Subtitle>Acesse seu dashboard de agendamentos</Subtitle>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>ID da Barbearia</Label>
            <StyledInput
              type="text"
              $focused={focusedField === 'barbershop'}
              value={barbershop_id}
              onChange={(e) => setBarbershopId(e.target.value)}
              onFocus={() => setFocusedField('barbershop')}
              onBlur={() => setFocusedField(null)}
              placeholder="barbearia-central-001"
              required
            />
            <Helper>Use: barbearia-central-001 ou barbearia-premium-001</Helper>
          </FormGroup>

          <FormGroup>
            <Label>Senha</Label>
            <StyledInput
              type="password"
              $focused={focusedField === 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="admin123"
              required
            />
            <Helper>Senha padrão: admin123</Helper>
          </FormGroup>

          <Button type="submit" $loading={loading} disabled={loading}>
            {loading ? 'Acessando...' : 'Acessar Dashboard'}
          </Button>
        </Form>

        <Divider>
          <DividerText>Acesso de cliente?</DividerText>
        </Divider>

        <FooterLink href="/login">
          Faça login aqui
        </FooterLink>
      </Card>
    </Container>
  );
}
