# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código
COPY . .

# Build Next.js
RUN npm run build



# Production stage
FROM node:18-alpine

WORKDIR /app

# Variáveis
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código compilado
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Expor porta
EXPOSE 3000

# Iniciar
CMD ["npm", "start"]
