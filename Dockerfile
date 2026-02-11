# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY backend/package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build TypeScript
RUN npm run build



# Production stage
FROM node:18-alpine

WORKDIR /app

# Variáveis de ambiente
ENV NODE_ENV=production

# Copiar package files
COPY backend/package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código compilado do build stage
COPY --from=builder /app/dist ./dist

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Expor porta
EXPOSE ${PORT:-3001}

# Iniciar aplicação
CMD ["npm", "start"]
