# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY backend . 

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL required by Prisma
RUN apk add --no-cache openssl

# Force backend rebuild - 2026-02-17 CORS fix
ARG BUILD_DATE=2026-02-17
ENV BUILD_DATE=${BUILD_DATE}

# Copy package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma schema and migrations
COPY backend/prisma ./prisma

# Copy generated Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Generate Prisma client in production stage
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start app directly - with unbuffered output
CMD ["node", "--unhandled-rejections=strict", "--trace-warnings", "dist/index.js"]
