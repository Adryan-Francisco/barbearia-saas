# 🚀 Checklist de Produção - Barbearia SaaS

## 1. 🔒 SEGURANÇA (CRÍTICO)

### 1.1 Autenticação & Autorização
- [ ] **Variáveis de Ambiente**: Mover `JWT_SECRET` para `.env` com valor seguro
  - Atualmente: `'secret-key'` (hardcoded)
  - Solução: Gerar token seguro e adicionar ao `.env`

- [ ] **Barbershop Login**: Implementar autenticação real (atualmente usa `password !== 'admin123'`)
  - Problema: Senha fixa em plain text
  - Solução: Hash das senhas de barbearias no banco de dados (como clientes)
  - Adicionar tabela de `barbershop_users` com roles (admin, manager, staff)

- [ ] **Rate Limiting**: Implementar proteção contra brute force
  - Instalar: `express-rate-limit`
  - Limitar: 5 tentativas de login a cada 15 minutos
  - Aplicar em: `/api/auth/login`, `/api/barbershop/login`

- [ ] **HTTPS/TLS**: Configurar certificados SSL
  - Usar nginx como reverse proxy com SSL
  - Forçar redirect HTTP → HTTPS
  - Configurar headers de segurança

### 1.2 Validação & Sanitização
- [ ] **Input Validation**: Implementar validação robusta
  - Instalar: `joi` ou `zod`
  - Validar: telefone (formato), nome (min/max length), data (não passada)
  - Aplicar em todos os endpoints

- [ ] **SQL Injection / JSON Injection**: 
  - Atualmente usando JSON file (mais seguro que SQL direto)
  - Porém: adicionar sanitização em campos de busca/filtro

- [ ] **CORS**: Configurar whitelist de domínios
  ```typescript
  cors({
    origin: process.env.FRONTEND_URL, // Ex: https://barbearia.com.br
    credentials: true,
    optionsSuccessStatus: 200
  })
  ```

- [ ] **Helmet**: Adicionar headers de segurança HTTP
  - Instalar: `helmet`
  - Protege contra: XSS, clickjacking, MIME type sniffing

### 1.3 Proteção de Dados
- [ ] **Senhas**: Nunca retornar senhas nas respostas
  - Revisar todos os endpoints para remover `password` do JSON

- [ ] **Tokens**: Implementar refresh tokens
  - Access token: 15 minutos
  - Refresh token: 7 dias (armazenar em DB)
  - Endpoint: `POST /api/auth/refresh`

- [ ] **GDPR/Lei Geral de Proteção de Dados**:
  - Implementar delete account (`DELETE /api/users/:id`)
  - Implementar export data (`GET /api/users/:id/export`)
  - Adicionar política de cookies e privacidade

---

## 2. 🗄️ BANCO DE DADOS (CRÍTICO)

### 2.1 Migrar do JSON para Banco Real
**Problema**: JSON file não é escalável, não tem concorrência, sem backup automático

**Opções**:
1. **PostgreSQL** (recomendado para produção)
2. **MongoDB** (mais simples, NoSQL)
3. **Supabase** (PostgreSQL + auth + realtime)

**Passos**:
- [ ] Escolher banco de dados
- [ ] Criar scripts de migração
- [ ] Implementar connection pooling
- [ ] Adicionar índices em tabelas frequentes
- [ ] Configurar backups automáticos

**Exemplo com PostgreSQL**:
```bash
npm install pg pg-pool dotenv
```

### 2.2 Estrutura do Banco de Dados
- [ ] **Users Table**: Adicionar campos
  - `email` (unique)
  - `phone_verified` (boolean)
  - `is_active` (boolean)
  - `last_login` (timestamp)
  - `deleted_at` (soft delete)

- [ ] **Barbershop Users**: Nova tabela
  - `barbershop_id` (FK)
  - `user_id` (FK)
  - `role` (admin | manager | staff)
  - `permissions` (JSON array)

- [ ] **Appointments**: Adicionar campos
  - `status` (scheduled | confirmed | completed | cancelled)
  - `notes` (text)
  - `reminder_sent` (boolean)
  - `indexes` em `barbershop_id`, `user_id`, `appointment_date`

- [ ] **Payments**: Relacionar com Stripe
  - `stripe_payment_intent_id`
  - `stripe_customer_id`
  - `transaction_id`

- [ ] **Audit Logs**: Nova tabela
  - `user_id`
  - `action` (create, update, delete)
  - `table_name`
  - `record_id`
  - `old_values` (JSON)
  - `new_values` (JSON)
  - `created_at`

---

## 3. 📱 INTEGRAÇÕES (IMPORTANTE)

### 3.1 WhatsApp Business API
- [ ] **Configuração Real**:
  - Atualmente: Mock/placeholder
  - Implementar: Integração real com Meta API
  - Testes: Usar ambiente de teste da Meta
  - Variáveis de ambiente:
    ```
    WHATSAPP_API_TOKEN=seu_token
    WHATSAPP_BUSINESS_ACCOUNT_ID=seu_id
    WHATSAPP_PHONE_NUMBER_ID=seu_numero
    ```

- [ ] **Webhooks**: Receber status de entrega
  - `POST /api/webhooks/whatsapp`
  - Validar assinatura
  - Atualizar status no banco

- [ ] **Rate Limiting**: Meta limita a 1000 mensagens/dia
  - Implementar fila de mensagens
  - Usar Bull.js para job queue

### 3.2 Stripe (Pagamentos)
- [ ] **Implementação Completa**:
  - Webhook para `charge.completed`, `charge.failed`
  - Armazenar `customer_id` do Stripe
  - Implementar `payment_intents` em vez de charges direto

- [ ] **Segurança**:
  - Nunca armazenar números de cartão (usar Stripe Tokens)
  - PCI DSS Compliance
  - Usar Stripe Hosted Checkout

---

## 4. ⚡ PERFORMANCE

### 4.1 Frontend (React)
- [ ] **Code Splitting**: 
  ```typescript
  const BarbershopDashboard = lazy(() => import('./pages/BarbershopDashboard'));
  ```

- [ ] **Image Optimization**:
  - Usar WebP com fallback
  - Implementar lazy loading
  - Instalar: `next-image` ou `sharp`

- [ ] **Bundle Size**: Analisar com `webpack-bundle-analyzer`
  - Remover dependências não usadas
  - Tree-shaking de imports

- [ ] **Caching**: 
  - Service Workers para offline capability
  - Cache HTTP headers

### 4.2 Backend (Node.js)
- [ ] **Database Caching**: Redis
  ```typescript
  npm install redis ioredis
  ```
  - Cache: Barbershops, Services, Available slots
  - TTL: 1 hora

- [ ] **Connection Pooling**: Gerenciar conexões de DB
  - Pool size: 10-20
  - Idle timeout: 30s

- [ ] **Compression**: 
  ```typescript
  npm install compression
  app.use(compression());
  ```

- [ ] **CDN**: Servir assets estáticos via CloudFlare/AWS CloudFront

### 4.3 WebSocket
- [ ] **Connection Management**:
  - Limitar conexões por usuário (máximo 3)
  - Implementar heartbeat/ping-pong
  - Graceful shutdown

- [ ] **Memory Leaks**: 
  - Monitorar com `clinic.js`
  - Garantir desconexão ao logout

---

## 5. 🧪 TESTES

### 5.1 Backend Tests
- [ ] **Unit Tests**: Controllers e Services
  ```bash
  npm install --save-dev jest @types/jest ts-jest
  ```
  - Cobertura: Mínimo 70%

- [ ] **Integration Tests**: Rotas + banco de dados
  - Usar banco de teste (test database)
  - Limpar dados após cada teste

- [ ] **API Tests**: Postman/Newman
  - Coleção de testes
  - CI/CD: Rodar automaticamente

### 5.2 Frontend Tests
- [ ] **Unit Tests**: Componentes React
  ```bash
  npm install --save-dev @testing-library/react vitest
  ```

- [ ] **E2E Tests**: Cypress/Playwright
  - Cenários: Login → Agendamento → Cancelamento
  - Rodar em CI/CD

---

## 6. 📊 MONITORAMENTO & LOGS

### 6.1 Logging
- [ ] **Winston/Pino**: Logger estruturado
  ```bash
  npm install winston
  ```
  - Registrar: todos os erros, requisições importantes
  - Níveis: error, warn, info, debug
  - Saída: arquivo + stdout

- [ ] **Log Aggregation**: 
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Ou: Datadog, New Relic, Sentry

### 6.2 Monitoring
- [ ] **Uptime Monitoring**: 
  - Instalar health check endpoint
  - Usar: Uptime Robot, Pingdom
  - Alertas: Email/SMS se down

- [ ] **Performance Monitoring**:
  - New Relic, DataDog, APM
  - Alertas para: response time > 2s, error rate > 1%

- [ ] **Error Tracking**: 
  - Sentry para exceções
  - Alertar time quando erro crítico

### 6.3 Métrica de Negócio
- [ ] **Analytics**:
  - Agendamentos por dia
  - Taxa de cancelamento
  - Receita total
  - Clientes ativos
  - Tempo médio de agendamento

---

## 7. 🚢 DEPLOYMENT

### 7.1 Docker & Containerização
- [ ] **Dockerfile** (Backend)
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  RUN npm run build
  EXPOSE 3001
  CMD ["npm", "start"]
  ```

- [ ] **Docker Compose**: Ambiente local com DB
  ```yaml
  version: '3'
  services:
    postgres:
      image: postgres:15
      environment:
        POSTGRES_DB: barbearia
        POSTGRES_PASSWORD: senha_segura
  ```

### 7.2 CI/CD Pipeline
- [ ] **GitHub Actions / GitLab CI**
  - Build
  - Run tests
  - Security scan (SAST)
  - Dependency check
  - Build Docker image
  - Push to registry
  - Deploy to production

### 7.3 Hosting
**Opções**:
1. **Vercel** (Frontend): Mais simples, gratuito até certo ponto
2. **Heroku** (Backend): Fácil deployment
3. **AWS** (mais controle, mais caro)
4. **DigitalOcean** (boa relação custo-benefício)

**Recomendado**: DigitalOcean App Platform ou Render.com

---

## 8. 📋 CONFORMIDADE & DOCUMENTAÇÃO

### 8.1 Legal
- [ ] **Termos de Serviço** (TOS)
- [ ] **Política de Privacidade** 
- [ ] **Aviso de Cookies**
- [ ] **LGPD Compliance** (Lei Geral de Proteção de Dados)

### 8.2 Documentação
- [ ] **API Documentation**: Swagger/OpenAPI
  ```bash
  npm install swagger-ui-express
  ```

- [ ] **README Atualizado**: Instruções deployment
- [ ] **Architecture Diagram**: Documentar arquitetura
- [ ] **Database Schema**: Diagrama ER
- [ ] **Runbook**: Como responder a incidentes

---

## 9. 🔧 VARIÁVEIS DE AMBIENTE

### Backend (.env Production)
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/barbearia
JWT_SECRET=gerar_token_seguro_aqui
REFRESH_TOKEN_SECRET=outro_token_seguro
REDIS_URL=redis://host:6379
CORS_ORIGIN=https://barbearia.com.br
WHATSAPP_API_TOKEN=token_real
WHATSAPP_BUSINESS_ACCOUNT_ID=id_real
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SENTRY_DSN=seu_sentry_url
LOG_LEVEL=info
```

### Frontend (.env Production)
```
VITE_API_URL=https://api.barbearia.com.br
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_APP_NAME=BarberPro
VITE_APP_VERSION=1.0.0
```

---

## 10. ✅ CHECKLIST FINAL PRÉ-PRODUÇÃO

- [ ] Código revisado (code review)
- [ ] Testes com 70%+ cobertura
- [ ] Não há secrets/tokens no git
- [ ] HTTPS configurado
- [ ] Banco de dados em produção (não JSON)
- [ ] Backups configurados
- [ ] Monitoramento ativo
- [ ] Logging estruturado
- [ ] Rate limiting implementado
- [ ] Input validation em todos endpoints
- [ ] CORS whitelist configurado
- [ ] Helmet + headers de segurança
- [ ] WhatsApp integrado e testado
- [ ] Stripe em modo live
- [ ] WebSocket em produção (com reconexão)
- [ ] Performance: Lighthouse score > 80
- [ ] SEO básico (meta tags, sitemap)
- [ ] Suporte/Help documentado
- [ ] Disaster recovery plan
- [ ] Load testing realizado

---

## 🎯 Prioridades

### Fase 1 (URGENT - Primeira Semana)
1. Migrar para PostgreSQL
2. Implementar Rate Limiting
3. Configurar CORS whitelist
4. Validação de inputs completa
5. WhatsApp integrado
6. Testes críticos

### Fase 2 (IMPORTANTE - Primeira Mês)
1. Redis caching
2. CI/CD pipeline
3. Docker setup
4. Logging + Monitoring
5. Stripe production
6. GDPR compliance

### Fase 3 (MELHORIAS - Próximos 3 Meses)
1. E2E tests
2. Performance optimization
3. SEO + Analytics
4. Mobile app (se planejado)
5. Internacionalization (i18n)

---

**Última Atualização**: 3 de Fevereiro de 2026
**Status**: 🔴 DESENVOLVIMENTO → 🟡 PRÉ-PRODUÇÃO
