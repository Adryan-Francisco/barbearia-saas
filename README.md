<div align="center">

# ✂️ BarberFlow SaaS
## A Plataforma Completa para Gestão de Barbearias

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178c6?style=flat-square)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-000000?style=flat-square)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> Solução SaaS moderna para agendamento online, painel de gerenciamento e dashboard personalizado

</div>

---

## 🚀 Visão Geral

O **BarberFlow** é uma plataforma completa e profissional para gestão de barbearias. Com integração total entre frontend e backend, oferece:

- 📱 **Interface Moderna**: Design responsivo com Next.js 16 e Tailwind CSS
- 🔐 **Segurança**: Autenticação JWT com tokens seguros
- 📅 **Agendamentos**: Sistema robusto de marcação de horários
- 📊 **Dashboard**: Painel de controle para barbeiros com analytics
- ⚡ **Tempo Real**: WebSocket para notificações instantâneas
- 🎨 **UI Premium**: Componentes shadcn/ui com dark mode

---

## ✨ Funcionalidades Principais

<table>
  <tr>
    <td align="center">
      <h4>👥 Multi-User</h4>
      <p>Clientes e Barbeiros<br/>com perfis independentes</p>
    </td>
    <td align="center">
      <h4>📅 Agendamentos</h4>
      <p>Sistema inteligente de<br/>marcação com validações</p>
    </td>
    <td align="center">
      <h4>📊 Analytics</h4>
      <p>Relatórios e gráficos<br/>em tempo real</p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <h4>💬 WhatsApp</h4>
      <p>Integração com<br/>WhatsApp Business API</p>
    </td>
    <td align="center">
      <h4>💳 Pagamentos</h4>
      <p>Integração Stripe<br/>para cobranças</p>
    </td>
    <td align="center">
      <h4>⚙️ Configurável</h4>
      <p>Gerenciamento completo<br/>de horários e serviços</p>
    </td>
  </tr>
</table>

---

## 🏗️ Stack Tecnológico

<table>
  <tr>
    <td align="center" width="50%">
      <h3>🎨 Frontend</h3>
      <ul align="left">
        <li>Next.js 16+ (App Router)</li>
        <li>React 19</li>
        <li>TypeScript 5.7+</li>
        <li>Tailwind CSS 3</li>
        <li>shadcn/ui Components</li>
        <li>Recharts para Gráficos</li>
      </ul>
    </td>
    <td align="center" width="50%">
      <h3>🔧 Backend</h3>
      <ul align="left">
        <li>Node.js 18+</li>
        <li>Express 4.18+</li>
        <li>TypeScript 5.7+</li>
        <li>Prisma ORM</li>
        <li>PostgreSQL</li>
        <li>JWT Authentication</li>
      </ul>
    </td>
  </tr>
</table>

---

## � Guia de Início Rápido

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Adryan-Francisco/barbearia-saas.git
cd barbearia-saas
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install --legacy-peer-deps
```

**Criar arquivo `.env`:**
```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/barbearia"
JWT_SECRET=sua_senha_secreta_super_segura
FRONTEND_URL=http://localhost:3000
```

**Iniciar servidor:**
```bash
npm run dev          # Desenvolvimento
npm run build       # Build para produção
npm run seed        # Popular banco com dados
```

✅ API rodando em: **http://localhost:3001**

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install --legacy-peer-deps
```

**Criar arquivo `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

**Iniciar dev server:**
```bash
npm run dev          # Desenvolvimento na porta 3000
npm run build       # Build para produção
npm run lint        # Verificar erros
```

✅ Acesse em: **http://localhost:3000**

---

## 📁 Estrutura do Projeto

```
barbearia-saas/
│
├── 📂 backend/
│   ├── src/
│   │   ├── controllers/        # Lógica das rotas
│   │   ├── services/           # Regras de negócio
│   │   ├── routes/             # Endpoints da API
│   │   ├── middleware/         # Auth, Error Handling
│   │   └── utils/              # JWT, Hash, Database
│   ├── prisma/
│   │   └── schema.prisma       # Schema do banco
│   └── package.json
│
└── 📂 frontend/
    ├── app/
    │   ├── page.tsx            # Landing Page
    │   ├── entrar/             # Login (Cliente/Barbeiro)
    │   ├── cadastro/           # Registro (Cliente/Barbeiro)
    │   ├── cliente/            # Dashboard Cliente
    │   ├── dashboard/          # Painel Barbeiro
    │   └── agendar/            # Sistema de Agendamento
    ├── components/
    │   ├── dashboard/          # Componentes do painel
    │   ├── landing/            # Seções da homepage
    │   └── ui/                 # shadcn/ui Components
    ├── lib/
    │   ├── api.ts              # Cliente HTTP centralizado
    │   └── utils.ts            # Utilitários
    └── package.json
```

---

## 🔌 API Endpoints

### 🔐 Autenticação
- `POST /api/auth/register` - Registrar novo cliente
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/barbershop-register` - Registrar barbearia
- `POST /api/auth/barbershop-login` - Login barbeiro
- `GET /api/auth/me` - Dados do usuário autenticado

### 📅 Agendamentos
- `POST /api/scheduling/appointments` - Criar agendamento ✨
- `GET /api/barbershops/{id}/appointments` - Listar agendamentos
- `DELETE /api/scheduling/{id}` - Cancelar agendamento

### 🏪 Barbearias
- `GET /api/barbershops/me` - Dados da minha barbearia
- `GET /api/barbershops/{id}` - Detalhes de uma barbearia
- `PUT /api/barbershops/{id}` - Atualizar informações
- `GET /api/barbershops/{id}/services` - Listar serviços

### ⭐ Avaliações
- `POST /api/reviews` - Criar review
- `GET /api/reviews/shops/{id}` - Reviews de uma barbearia

---

## 📊 Dashboard Features

### Para Barbeiros 💇‍♂️
- ✅ **Agendamentos do Dia**: Visualize todos os agendamentos programados
- ✅ **Clientes**: Gerencie clientes e histórico de atendimentos
- ✅ **Serviços**: Configure catálogo de serviços e preços
- ✅ **Relatórios**: Análise de receita, agendamentos e clientes
- ✅ **Configurações**: Horários de funcionamento e dados da barbearia

### Para Clientes 👥
- ✅ **Agendamentos**: Marque horários com barbeiros
- ✅ **Histórico**: Veja todos seus agendamentos passados
- ✅ **Perfil**: Atualize suas informações pessoais
- ✅ **Cancelamento**: Cancele com 1 hora de antecedência

---

## 🔐 Segurança

- 🔒 **JWT Authentication**: Tokens seguros com expiração
- 🛡️ **Password Hashing**: Senhas criptografadas com bcrypt
- ⚔️ **CORS Protection**: Controle de origem
- 🔑 **Role-based Access**: Diferentes permissões por tipo de usuário
- 🚫 **Rate Limiting**: Proteção contra abuso

---

## 📝 Scripts Disponíveis

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor em modo desenvolvimento |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm run start` | Executa versão compilada |
| `npm run seed` | Popula banco com dados de teste |

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia dev server (porta 3000) |
| `npm run build` | Build otimizado para produção |
| `npm run start` | Executa build de produção |
| `npm run lint` | Verifica erros de linting |

---

## 🎯 Roadmap

- [x] Dashboard barbeiro completo
- [x] Sistema de agendamentos
- [x] Autenticação JWT
- [x] API RESTful robusta
- [ ] Integração WhatsApp Business
- [ ] Pagamentos Stripe
- [ ] App mobile (React Native)
- [ ] Notificações em tempo real
- [ ] Sistema de cupons e promoções
- [ ] Integração com Google Calendar

---

## 🚀 Deploy

### Frontend
- **Vercel** (Recomendado)
  ```bash
  vercel deploy
  ```
- **Netlify**: Conecte seu repositório do Git
- **AWS S3 + CloudFront**: Para máximo desempenho

### Backend
- **Railway**: Connecção rápida com banco PostgreSQL
- **Render.com**: Hospedagem gratuita com limite
- **AWS EC2**: Para total controle
- **DigitalOcean App Platform**: Alternativa econômica

### Banco de Dados
- **PostgreSQL** (Railway, Render, Supabase)
- **MySQL** (Compatível via Prisma)

---

## 🐛 Troubleshooting

### Erro de conexão com API
```bash
# Verifique se o backend está rodando
curl http://localhost:3001/api/health
```

### Token inválido/expirado
```bash
# Limpe localStorage no navegador
localStorage.clear()
# Faça login novamente
```

### Problemas com peer dependencies
```bash
npm install --legacy-peer-deps
# ou
npm install --force
```

---

## 📞 Suporte & Contribuição

💬 **Dúvidas?** Abra uma [issue](https://github.com/Adryan-Francisco/barbearia-saas/issues)

🤝 **Quer contribuir?** Faça um fork e envie um pull request

✨ **Tem uma ideia?** Abre uma discussion ou issue

---

## 📄 License

Este projeto está sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

### Desenvolvido com ❤️ para simplificar a gestão de barbearias

![BarberFlow Banner](https://img.shields.io/badge/BarberFlow-Made%20with%20%E2%9D%A4-ff69b4)

[⬆ Voltar ao Topo](#-barberflow-saas)

</div>
