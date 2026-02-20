<div align="center">

# ✂️ BarberFlow SaaS

### A Plataforma Completa de Gestão para Barbearias

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**[🌐 Visite o Site](#) • [📖 Documentação](#estrutura-do-projeto) • [🚀 Deploy Rápido](#-deploy)**

---

Solução SaaS profissional para agendamento online, painel de gerenciamento inteligente e dashboard em tempo real com a melhor experiência do usuário.

</div>

---

## 🎯 Por que BarberFlow?

| Fácil de Usar | Agendamentos | Analytics | Seguro |
|:---:|:---:|:---:|:---:|
| 🔧 Interface intuitiva para clientes e barbeiros | 📅 Sistema robusto com validações inteligentes | 📊 Dashboard com insights em tempo real | 🔒 Autenticação JWT e dados criptografados |

---

## ✨ Funcionalidades Principais

### 👥 **Multi-User Sistema**
- Autenticação separada para clientes e barbeiros
- Perfis independentes com dados isolados
- Controle de acesso baseado em roles

### 📅 **Sistema Inteligente de Agendamentos**
- Marcação em tempo real com disponibilidade
- Confirmação automática e cancelamento com 1h de antecedência
- Notificações via WhatsApp (integração)
- Validações de conflito de horário

### 📊 **Dashboard Avançado**
- Gráficos de receita e agendamentos
- Análise de clientes mais frequentes
- Relatórios customizáveis
- Estatísticas em tempo real

### 💬 **Comunicação Integrada**
- WhatsApp Business API (envio de lembretes)
- Notificações push em tempo real
- Sistema de mensagens (em breve)

### 💳 **Pagamentos Online**
- Integração Stripe para cobranças
- Suporte a múltiplos métodos de pagamento
- Histórico de transações

### 📱 **PWA (Progressive Web App)**
- Funciona offline
- Instale como app nativa em qualquer dispositivo
- Sincronização automática de dados

---

## 🏗️ Stack Tecnológico

### Frontend
```
Next.js 16+ (App Router) + React 19 + TypeScript 5.7+
├── Tailwind CSS 3 - Estilização
├── shadcn/ui - Componentes premium
├── Recharts - Gráficos interativos
├── Socket.io - Comunicação em tempo real
└── jwt-decode - Autenticação
```

### Backend
```
Node.js 18+ + Express 4.18+ + TypeScript 5.7+
├── Prisma ORM - Banco de dados
├── PostgreSQL 15+ - Banco relacional
├── JWT - Autenticação segura
├── bcryptjs - Criptografia
└── Stripe SDK - Pagamentos
```

### DevOps & Deploy
```
├── Vercel - Frontend (recomendado)
├── Render.com - Backend (gratuito)
├── GitHub Actions - CI/CD
└── PostgreSQL Cloud - Banco de dados
```

---

## 🚀 Início Rápido

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/Adryan-Francisco/barbearia-saas.git
cd barbearia-saas
```

### 2️⃣ Configure o Backend

```bash
cd backend
npm install --legacy-peer-deps
```

**Crie `.env` na pasta `backend/`:**
```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/barbearia"

# Autenticação
JWT_SECRET=sua_chave_super_segura_aqui

# Frontend
FRONTEND_URL=http://localhost:3000

# Integrações (opcional)
WHATSAPP_API_TOKEN=seu_token
STRIPE_SECRET_KEY=seu_stripe_key
```

**Execute as migrações e inicie:**
```bash
npx prisma migrate dev          # Cria as tabelas
npm run seed                    # Popula com dados de teste
npm run dev                     # Inicia em desenvolvimento
```

✅ Backend rodando em: **http://localhost:3001/api/health**

### 3️⃣ Configure o Frontend

```bash
cd ../frontend
npm install --legacy-peer-deps
```

**Crie `.env.local` na pasta `frontend/`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

**Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

✅ Frontend rodando em: **http://localhost:3000**

---

## 📚 Estrutura do Projeto

```
barbearia-saas/
├── 📂 backend/
│   ├── src/
│   │   ├── controllers/        ← Lógica das rotas
│   │   ├── services/           ← Regras de negócio
│   │   ├── routes/             ← Endpoints da API
│   │   ├── middleware/         ← Auth, validação, errors
│   │   └── utils/              ← JWT, hash, database
│   ├── prisma/
│   │   ├── schema.prisma       ← Modelo do banco
│   │   ├── seed.ts             ← Dados iniciais
│   │   └── migrations/         ← Histórico de mudanças
│   └── package.json
│
└── 📂 frontend/
    ├── app/
    │   ├── layout.tsx          ← Layout global
    │   ├── page.tsx            ← Home / Landing
    │   ├── entrar/             ← Páginas de login
    │   ├── cadastro/           ← Páginas de registro
    │   ├── agendar/            ← Sistema de agendamento
    │   ├── cliente/            ← Painel do cliente
    │   └── dashboard/          ← Painel do barbeiro
    ├── components/
    │   ├── dashboard/          ← Componentes do painel
    │   ├── ui/                 ← shadcn/ui components
    │   └── app-*.tsx           ← Layout components
    ├── hooks/
    │   ├── use-pwa.tsx         ← PWA management
    │   └── use-user-role.tsx   ← Role verification
    ├── lib/
    │   ├── api.ts              ← API client centralizado
    │   ├── useApi.ts           ← Custom hooks
    │   └── utils.ts            ← Utilitários
    └── public/
        ├── manifest.json       ← PWA manifest
        ├── service-worker.js   ← Cache offline
        └── icons/              ← App icons
```

---

## 🌐 API Endpoints

### 🔐 **Autenticação**
```
POST   /api/auth/register              ➜ Registrar cliente
POST   /api/auth/login                 ➜ Login cliente
POST   /api/auth/barbershop-register   ➜ Registrar barbeiro
POST   /api/auth/barbershop-login      ➜ Login barbeiro
POST   /api/auth/logout                ➜ Logout
GET    /api/auth/me                    ➜ Dados do usuário
```

### 📅 **Agendamentos**
```
POST   /api/scheduling/appointments              ➜ Criar agendamento ⭐
GET    /api/scheduling/appointments              ➜ Listar agendamentos
PUT    /api/scheduling/appointments/:id          ➜ Atualizar
DELETE /api/scheduling/appointments/:id          ➜ Cancelar
GET    /api/barbershops/:id/appointments         ➜ Por barbearia
GET    /api/barbershops/:id/appointments/:date   ➜ Por data
```

### 🏪 **Barbearias**
```
GET    /api/barbershops                ➜ Todas as barbearias
GET    /api/barbershops/me             ➜ Minha barbearia
GET    /api/barbershops/:id            ➜ Detalhes
PUT    /api/barbershops/:id            ➜ Atualizar
POST   /api/barbershops/:id/services   ➜ Adicionar serviço
GET    /api/barbershops/:id/services   ➜ Listar serviços
```

### ⭐ **Avaliações**
```
POST   /api/reviews                 ➜ Criar review
GET    /api/reviews/:barbershop_id  ➜ Reviews de uma barbearia
DELETE /api/reviews/:id             ➜ Deletar review
```

### 📊 **Analytics**
```
GET    /api/analytics/:barbershop_id/stats           ➜ Estatísticas
GET    /api/analytics/:barbershop_id/clients         ➜ Top clientes
GET    /api/analytics/:barbershop_id/daily-trend     ➜ Tendência diária
GET    /api/analytics/:barbershop_id/hourly-metrics  ➜ Métricas por hora
```

---

## 👥 Contas de Teste

Após rodar `npm run seed`, use estas credenciais:

| Tipo | Telefone | Senha | Descrição |
|------|----------|-------|-----------|
| **Cliente** | `11987654321` | `123456` | Acesso ao painel de agendamentos |
| **Barbeiro** | `11987654322` | `123456` | Acesso ao dashboard completo |

---

## 📱 PWA - Progressive Web App

O BarberFlow é 100% PWA - funciona offline e pode ser instalado como app nativa!

### ✨ Capacidades PWA
- ✅ Funciona completamente offline
- ✅ Instale em Android, iOS, Windows, Mac
- ✅ Ícone na tela inicial
- ✅ Atualizações automáticas
- ✅ Cache inteligente de dados

### 📲 Como Instalar

#### **Chrome/Edge (Desktop)**
1. Abra http://localhost:3000
2. Clique no ícone "Instalar" na barra de endereço
3. Confirme

#### **Mobile**
1. Abra em navegador mobile
2. Toque no menu (⋮ ou Share)
3. Procure "Adicionar à Tela Inicial"
4. Confirme

---

## 🔐 Segurança

| Aspecto | Implementação |
|--------|---------------|
| **Autenticação** | JWT com refresh tokens |
| **Senhas** | bcryptjs (10 rounds) |
| **Validação** | Joi schemas nos endpoints |
| **CORS** | Whitelist de origens |
| **Rate Limiting** | 100 req/15min (geral), 5 req/15min (login) |
| **HTTPS** | Enforced em produção |
| **Encriptação** | Dados sensíveis criptografados |

---

## 📊 Dashboard - O que você pode fazer

### 👨‍💼 **Painel do Barbeiro**
- 📅 Ver agendamentos do dia e próximos
- 👥 Gerenciar lista de clientes
- 💰 Acompanhar receita em tempo real
- 🔧 Configurar serviços e preços
- 📈 Analisar tendências de negócio
- ⚙️ Gerenciar horários de funcionamento

### 👤 **Painel do Cliente**
- 📅 Agendar novos horários
- 📋 Ver histórico de agendamentos
- ✏️ Editar perfil pessoal
- ⭐ Deixar avaliações
- ❤️ Favoritar barbearias

---

## 🛠️ Scripts Disponíveis

### Backend
```bash
npm run dev              # Desenvolvimento com hot-reload
npm run build            # Build para produção
npm run start            # Inicia versão compilada
npm run seed             # Popula banco com dados
npm run migrate          # Roda migrações pendentes
npm run db:studio        # Abre Prisma Studio
```

### Frontend
```bash
npm run dev              # Dev server (porta 3000)
npm run build            # Build otimizado
npm run start            # Inicia production build
npm run lint             # Verifica erros de linting
npm run format           # Formata código
```

---

## 🚀 Deploy em Produção

### Frontend - Vercel (Recomendado) ⭐

```bash
npm install -g vercel
vercel login
vercel deploy
```

**Ou conecte seu repositório GitHub automática**

### Backend - Render.com

```bash
git push origin main  # Push dispara deploy automático
```

**Configurar variáveis de ambiente no painel do Render**

### Banco de Dados

```bash
# Railway + PostgreSQL (mais fácil)
# Render PostgreSQL (gratuito)
# Supabase (alternativa gratuita)
```

---

## 🐛 Solução de Problemas

### ❌ Erro: `Cannot find module`
```bash
# Reinstale dependências
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### ❌ Erro: `CORS not allowed`
```bash
# Verifique se FRONTEND_URL está correto no .env backend
# Ou verifique se o Origin da requisição está no whitelist
```

### ❌ Erro: `Token inválido`
```bash
# Limpe localStorage no navegador
localStorage.clear()
# Faça login novamente
```

### ❌ Erro: `Database connection failed`
```bash
# Verifique DATABASE_URL
# Teste conexão: psql $DATABASE_URL
```

---

## 🎯 Roadmap

- [x] Dashboard completo
- [x] Sistema robusto de agendamentos
- [x] Autenticação JWT
- [x] API RESTful with TypeScript
- [x] PWA (offline first)
- [ ] WhatsApp Business API
- [ ] Pagamentos Stripe
- [ ] App mobile (React Native)
- [ ] Integração Google Calendar
- [ ] Sistema de promoções e cupons

---

## 📞 Suporte & Comunidade

| Canal | Link |
|-------|------|
| 🐛 **Issues** | [GitHub Issues](https://github.com/Adryan-Francisco/barbearia-saas/issues) |
| 💬 **Discussions** | [GitHub Discussions](https://github.com/Adryan-Francisco/barbearia-saas/discussions) |
| 📧 **Email** | contact@barbearia-saas.com |

---

## 🤝 Como Contribuir

Tem uma ideia? Quer melhorar algo? Siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a **MIT License** - você é livre para usar, modificar e distribuir.

Veja [LICENSE](LICENSE) para mais detalhes.

---

## 🙌 Agradecimentos

Obrigado a todos os contribuidores e à comunidade open source que torna projetos incríveis possíveis!

---

<div align="center">

### Desenvolvido com ❤️ para simplificar a gestão de barbearias

![Stars](https://img.shields.io/github/stars/Adryan-Francisco/barbearia-saas?style=social)
![Forks](https://img.shields.io/github/forks/Adryan-Francisco/barbearia-saas?style=social)
![Last commit](https://img.shields.io/github/last-commit/Adryan-Francisco/barbearia-saas?style=social)

[⬆ Voltar ao Topo](#-barberflow-saas)

</div>
