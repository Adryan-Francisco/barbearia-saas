# Barbearia SaaS - Sistema de Agendamento

Sistema completo de agendamento para barbearias com integração WhatsApp, autenticação por nome/telefone e senha.

## 📋 Navegação Rápida

| Documento | Descrição |
|-----------|-----------|
| **[SUMARIO.md](SUMARIO.md)** | 📊 O que foi feito nesta sessão |
| **[COMECE_AQUI.md](COMECE_AQUI.md)** | 🚀 Guia de início rápido (5 min) |
| **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** | 👨‍💻 Como adicionar barbearias |
| **[ARQUITETURA.md](ARQUITETURA.md)** | 🏗️ Visão geral do sistema |
| **[GUIA_TESTES.md](GUIA_TESTES.md)** | 🧪 Como testar o sistema |

## 📋 Características

- ✅ **Autenticação de Clientes**: Login com telefone e senha
- ✅ **Dashboard de Barbearia**: Visualizar e confirmar agendamentos
- ✅ **Agendamento**: Clientes podem agendar horários disponíveis
- ✅ **Cancelamento**: Cancelamento com 1 hora de antecedência
- ✅ **WhatsApp**: Notificações via WhatsApp Business API
- ✅ **Segurança**: Apenas desenvolvedores podem adicionar barbearias
- ✅ **Backend**: Node.js + Express + TypeScript
- ✅ **Frontend**: React + TypeScript + Vite

## 🚀 Instalação

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:3000`
O backend estará disponível em `http://localhost:3001`

## 🔑 Variáveis de Ambiente

### Backend (.env)

```
NODE_ENV=development
PORT=3001
JWT_SECRET=sua_chave_secreta_aqui

# WhatsApp API
WHATSAPP_API_URL=https://graph.instagram.com/v18.0
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_account_id
WHATSAPP_API_TOKEN=seu_token_api

# Database
DATABASE_URL=./data/barbearia.db
```

## 📚 Endpoints da API

### Autenticação (Clientes)

- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário (protegido)

### Agendamentos (Clientes)

- `POST /api/scheduling/appointments` - Criar agendamento (protegido)
- `GET /api/scheduling/appointments` - Listar agendamentos (protegido)
- `DELETE /api/scheduling/appointments/:appointmentId` - Cancelar agendamento (protegido)
- `GET /api/scheduling/available-slots` - Horários disponíveis

### Dashboard da Barbearia

- `POST /api/barbershop/login` - Login da barbearia
- `GET /api/barbershop/:barbershop_id/appointments` - Todos agendamentos
- `GET /api/barbershop/:barbershop_id/appointments/:date` - Agendamentos por data
- `PUT /api/barbershop/appointments/:appointment_id/confirm` - Confirmar agendamento
- `GET /api/barbershop/:barbershop_id/stats` - Estatísticas

## 🗄️ Estrutura do Banco de Dados

### Tabelas

1. **users** - Usuários/clientes
2. **barbershops** - Dados das barbearias
3. **services** - Serviços oferecidos
4. **appointments** - Agendamentos
5. **availability** - Horários de funcionamento

## 📱 Integração WhatsApp

A integração com WhatsApp Business API envia mensagens de confirmação e cancelamento automaticamente.

### Configuração

1. Obtenha uma conta WhatsApp Business
2. Configure as variáveis de ambiente com:
   - `WHATSAPP_API_TOKEN` - Token de autenticação
   - `WHATSAPP_BUSINESS_ACCOUNT_ID` - ID da conta

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- JWT para autenticação
- Validação de entrada de dados
- Proteção de rotas com middleware de autenticação

## 📝 Estrutura do Projeto

```
Barbearia/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🛠️ Próximos Passos

- [ ] Adicionar painel administrativo para barbearias
- [ ] Sistema de avaliações
- [ ] Histórico de clientes
- [ ] Relatórios e analytics
- [ ] Integração com gateway de pagamento
- [ ] Notificações por email

## 📄 Licença

MIT
