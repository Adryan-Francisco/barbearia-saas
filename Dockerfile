# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY backend . 

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma schema and migrations
COPY backend/prisma ./prisma

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run with dumb-init
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# Start app
CMD ["node", "dist/index.js"]
