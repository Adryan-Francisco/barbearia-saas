# ✂️ BarberPro SaaS

> **Plataforma completa para gestão de barbearias com agendamento online, painel do barbeiro e dashboard do cliente.**

> **🎉 NOVO: Frontend integrado com Backend! Todos os dados são salvos em tempo real!**

---

## 🎯 Status do Projeto

| Componente | Status | Detalhes |
|---|---|---|
| **Frontend** | ✅ Completo | Next.js 16, React 19, Tailwind CSS |
| **Backend** | ✅ Completo | Node.js, Express, API REST |
| **Autenticação** | ✅ Integrada | JWT, localStorage, Bearer token |
| **Agendamentos** | ✅ Integrado | Criar, listar, cancelar via API |
| **Persistência** | ✅ JSON | Dados salvos em `data/barbearia.json` |
| **Compilação** | ✅ 0 Erros | Build frontend e backend sem problemas |
| **Deploy** | ⏳ Pronto | Aguardando configuração de produção |

---

## 📋 Sobre o Projeto

BarberPro é um SaaS moderno para barbearias que oferece:
- ✅ Agendamento online de clientes
- ✅ Painel de controle do barbeiro com gerenciamento de clientes
- ✅ Perfil e histórico de agendamentos do cliente
- ✅ Autenticação segura com JWT
- ✅ Comunicação em tempo real via WebSocket
- ✅ API RESTful completa

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnologia | Versão |
|------------|--------|
| **Next.js** | 16+ (App Router) |
| **React** | 19 |
| **TypeScript** | 5.7+ |
| **Tailwind CSS** | 3 |
| **Radix UI** | Latest |
| **shadcn/ui** | Components |

### Backend
| Tecnologia | Versão |
|------------|--------|
| **Node.js** | 18+ |
| **Express** | 4.18+ |
| **TypeScript** | 5.7+ |
| **JWT** | Para autenticação |
| **WebSocket** | Tempo real |

---

## 📦 Requisitos

- **Node.js** 18 ou superior
- **npm** ou **yarn**

---

## 🚀 Quick Start

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/Adryan-Francisco/barbearia-saas.git
cd barbearia-saas
```

### 2️⃣ Backend
```bash
cd backend
npm install --legacy-peer-deps
```

Criar arquivo `.env`:
```env
PORT=3001
JWT_SECRET=sua_senha_secreta_aqui
FRONTEND_URL=http://localhost:3000
```

Iniciar servidor:
```bash
npm run dev
```
API rodando em: **http://localhost:3001/api**

### 3️⃣ Frontend
```bash
cd ../frontend
npm install --legacy-peer-deps
```

Criar arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

Iniciar dev server:
```bash
npm run dev
```
Acesse em: **http://localhost:3000**

---

## ✨ Funcionalidades Integradas (Frontend-Backend)

### 🔐 Autenticação
- ✅ **Registro de Cliente**: Nome, telefone, senha → Salvo em backend
- ✅ **Login de Cliente**: Telefone + senha → Token JWT em localStorage
- ✅ **Registro de Barbeiro**: Nome barbearia, email, telefone, senha
- ✅ **Login de Barbeiro**: Email + senha → Acesso ao dashboard
- ✅ **Persistência**: Todos os dados salvos em `data/barbearia.json`

### 📅 Agendamentos
- ✅ **Criar Agendamento**: Cliente seleciona serviço + barbeiro + data + hora
- ✅ **Listar Agendamentos**: Carrega do backend em tempo real
- ✅ **Cancelar Agendamento**: Permite cancelamento com 1h de antecedência
- ✅ **Status**: Confirmado, concluído, cancelado

### 🔄 API Client
- ✅ **lib/api.ts**: Cliente centralizado com métodos para todas as operações
- ✅ **JWT Token**: Injetado automaticamente em todas as requisições
- ✅ **Error Handling**: Toast notifications para sucesso/erro
- ✅ **Loading States**: Indicadores visuais durante operações

---

## 📁 Estrutura do Projeto

```
barbearia-saas/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Lógica de requisições
│   │   ├── services/           # Regras de negócio
│   │   ├── routes/             # Endpoints da API
│   │   ├── middleware/         # Auth, error handling
│   │   └── utils/              # JWT, hash, database
│   ├── data/
│   │   └── barbearia.json      # Banco de dados local 📁
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.tsx            # Landing page
    │   ├── entrar/             # Login (cliente/barbeiro) ✨ INTEGRADO
    │   ├── cadastro/           # Registro (cliente/barbeiro) ✨ INTEGRADO
    │   ├── cliente/            # Dashboard cliente ✨ INTEGRADO
    │   ├── dashboard/          # Painel barbeiro ✨ INTEGRADO
    │   ├── agendar/            # Agendamento ✨ INTEGRADO
    │   └── layout.tsx
    ├── components/
    │   ├── landing/            # Seções da homepage
    │   └── ui/                 # shadcn components
    ├── lib/
    │   ├── api.ts              # Cliente HTTP ✨ ATUALIZADO
    │   └── utils.ts
    └── package.json
```

---

## 🔑 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo cliente
- `POST /api/auth/login` - Fazer login cliente
- `POST /api/auth/barbershop-register` - Registrar barbearia
- `POST /api/auth/barbershop-login` - Login barbeiro
- `GET /api/auth/me` - Dados do usuário autenticado

### Agendamentos
- `GET /api/scheduling/appointments` - Listar agendamentos
- `POST /api/scheduling/appointments` - Criar agendamento
- `PUT /api/scheduling/appointments/:id` - Atualizar agendamento
- `DELETE /api/scheduling/appointments/:id` - Cancelar agendamento

### Barbearias
- `GET /api/barbershop/shops` - Listar todas as barbearias
- `GET /api/barbershop/shops/:id` - Detalhes da barbearia

### Avaliações
- `GET /api/reviews/shops/:id` - Reviews de uma barbearia
- `POST /api/reviews` - Criar review

---

## 📝 Scripts Disponíveis

### Backend
```bash
npm run dev      # Desenvolvimento com hot-reload
npm run build    # Build para produção
npm run start    # Rodar versão compilada
```

### Frontend
```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run start    # Rodar versão otimizada
npm run lint     # Verificar erros de linting
```

---

## 🔐 Autenticação

O projeto utiliza **JWT (JSON Web Tokens)** para autenticação:
- Token armazenado no `localStorage`
- Renovação automática de sessão
- Proteção de rotas com middleware
- Logout seguro

---

## 🌐 Dados em Tempo Real

WebSocket configurado para:
- Notificações de novo agendamento
- Status de chamadas/check-in
- Atualizações da agenda em tempo real

---

## 📌 Notas Importantes

⚠️ **Banco de Dados**: O projeto usa JSON local (`backend/data/barbearia.json`) para simplificar o setup. Para produção, considere usar um banco relacional (PostgreSQL, MySQL) ou NoSQL.

⚠️ **Supabase**: Não utilizamos Supabase. Toda a autenticação e API são gerenciadas pelo backend Express.

⚠️ **Imagens**: As imagens da landing usam placeholders. Para usar imagens reais, adicione os arquivos em `frontend/public/images/`.

---

## 💡 Funcionalidades

✨ **Landing Page**
- Showcase de barbearias
- Depoimentos de clientes
- Call-to-action para agendamento

✨ **Cliente**
- Agendamento em tempo real
- Histórico de agendamentos
- Perfil pessoal
- Cancelamento com aviso de 1h

✨ **Barbeiro**
- Dashboard com agendamentos do dia
- Gerenciamento de clientes
- Catálogo de serviços
- Relatórios e analytics

---

## 🚢 Deploy

Para produção, considere:
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Heroku, Railway, AWS EC2, DigitalOcean
- **Banco de dados**: PostgreSQL (Render, Supabase)

---

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ para simplificar a gestão de barbearias.

**Contribuições são bem-vindas!** Sinta-se livre para abrir issues e pull requests.
