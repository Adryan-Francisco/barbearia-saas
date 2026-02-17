import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

console.log('✅ Starting BarberFlow Backend...');console.log('✅ Module imports starting...');

dotenv.config();

console.log('✅ Dotenv loaded');
console.log('📋 Environment:', process.env.NODE_ENV);
console.log('🔌 Database URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('🔐 JWT Secret:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

import { createServer } from 'http';
import { cacheMiddleware } from './utils/cache';
import { paginationMiddleware } from './utils/pagination';
import authRoutes from './routes/authRoutes';
import schedulingRoutes from './routes/schedulingRoutes';
import barbershopRoutes from './routes/barbershopRoutes';
import serviceRoutes from './routes/serviceRoutes';
import reviewRoutes from './routes/reviewRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import paymentRoutes from './routes/paymentRoutes';
import stripeRoutes from './routes/stripeRoutes';
import favoritesRoutes from './routes/favoritesRoutes';
import cancellationRoutes from './routes/cancellationRoutes';
import versionRoutes from './routes/versionRoutes';
import { errorHandler } from './middleware/errorHandler';

console.log('✅ All imports completed');

const app = express();
const httpServer = createServer(app);
const PORT = parseInt(process.env.PORT || '3001', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Security & Performance Middleware
app.use(helmet()); // Segurança de headers
app.use(compression()); // Gzip compression

// CORS configurado para produção
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [FRONTEND_URL] 
    : ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting - Geral
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 100 : 10000, // Muito mais permissivo em dev
  message: 'Muitas requisições de seu IP, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Rate Limiting - Autenticação (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 100, // Muito mais permissivo em dev
  skipSuccessfulRequests: true, // Não conta sucessos
  message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos',
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(paginationMiddleware);
app.use(cacheMiddleware(5 * 60 * 1000));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/barbershops', barbershopRoutes);
app.use('/api/barbershops', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/cancellations', cancellationRoutes);
app.use('/api/version', versionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handler
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server with error handling
try {
  console.log('🚀 Attempting to start server on port:', PORT);
  
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ WebSocket server listening on ws://0.0.0.0:${PORT}`);
  });

  httpServer.on('error', (error: any) => {
    console.error('❌ HTTP Server Error:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
} catch (error) {
  console.error('❌ Server startup error:', error);
  console.error('❌ Stack:', (error as any)?.stack);
  process.exit(1);
}
