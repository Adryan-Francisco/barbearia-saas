// Log MUITO cedo - antes de qualquer importação ou operação
// Using stderr because it's always unbuffered
process.stderr.write('\n[PRE-STARTUP-STDERR] Process started at ' + new Date().toISOString() + '\n');
process.stderr.write('[PRE-STARTUP-STDERR] Node version: ' + process.version + '\n');
process.stderr.write('[PRE-STARTUP-STDERR] Working directory: ' + process.cwd() + '\n');
process.stderr.write('[PRE-STARTUP-STDERR] NODE_ENV: ' + (process.env.NODE_ENV || 'undefined') + '\n');

console.error('[PRE-STARTUP] Process started at', new Date().toISOString());
console.error('[PRE-STARTUP] Node version:', process.version);
console.error('[PRE-STARTUP] Working directory:', process.cwd());
console.error('[PRE-STARTUP] NODE_ENV:', process.env.NODE_ENV);

import dotenv from 'dotenv';
dotenv.config();

console.log('[STARTUP] Environment loaded');
console.log('[STARTUP] NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('[STARTUP] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

console.log('[STARTUP] Express imports loaded');

// Lazy load middleware
let cacheMiddleware: any;
let paginationMiddleware: any;
let errorHandler: any;

const loadMiddleware = async () => {
  console.log('[STARTUP] Loading middleware...');
  const cache = await import('./utils/cache');
  const pagination = await import('./utils/pagination');
  const errors = await import('./middleware/errorHandler');
  
  cacheMiddleware = cache.cacheMiddleware;
  paginationMiddleware = pagination.paginationMiddleware;
  errorHandler = errors.errorHandler;
  
  console.log('[STARTUP] Middleware loaded successfully');
};

// Lazy load routes
const loadRoutes = async () => {
  console.log('[STARTUP] Loading routes...');
  const auth = await import('./routes/authRoutes');
  const scheduling = await import('./routes/schedulingRoutes');
  const barbershop = await import('./routes/barbershopRoutes');
  const service = await import('./routes/serviceRoutes');
  const review = await import('./routes/reviewRoutes');
  const analytics = await import('./routes/analyticsRoutes');
  const payment = await import('./routes/paymentRoutes');
  const stripe = await import('./routes/stripeRoutes');
  const favorites = await import('./routes/favoritesRoutes');
  const cancellation = await import('./routes/cancellationRoutes');
  const version = await import('./routes/versionRoutes');
  
  console.log('[STARTUP] Routes loaded successfully');
  
  return {
    authRoutes: auth.default || auth,
    schedulingRoutes: scheduling.default || scheduling,
    barbershopRoutes: barbershop.default || barbershop,
    serviceRoutes: service.default || service,
    reviewRoutes: review.default || review,
    analyticsRoutes: analytics.default || analytics,
    paymentRoutes: payment.default || payment,
    stripeRoutes: stripe.default || stripe,
    favoritesRoutes: favorites.default || favorites,
    cancellationRoutes: cancellation.default || cancellation,
    versionRoutes: version.default || version,
  };
};

const app = express();
const httpServer = createServer(app);
const PORT = parseInt(process.env.PORT || '3001', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Determinar origens permitidas
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    // Em produção, aceitar o FRONTEND_URL + URLs conhecidas
    const origins = [
      FRONTEND_URL,
      'https://barberflow.vercel.app', // Vercel URL
      'https://barbearia-saas-eol3.vercel.app', // Alternate Vercel URL
    ];
    // Se houver uma URL customizada, adicionar também
    if (process.env.VERCEL_URL) {
      origins.push(`https://${process.env.VERCEL_URL}`);
    }
    return origins;
  } else {
    // Em desenvolvimento, aceitar localhost em todas as portas
    return ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3001', 'http://127.0.0.1:3000'];
  }
};

console.log('[STARTUP] Express app initialized');
console.log('[STARTUP] CORS origins:', getAllowedOrigins());

// Basic security middleware (no dependencies)
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Para requisições sem origin (como mobile apps ou requests sem header)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('[CORS] Blocked origin:', origin);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 10000,
  message: 'Muitas requisições de seu IP, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 100,
  skipSuccessfulRequests: true,
  message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos',
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

console.log('[STARTUP] Basic middleware configured');

// Health check - MINIMAL (no database)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

console.log('[STARTUP] Health check route registered');

// Initialize and start server
const startServer = async () => {
  try {
    console.log('[STARTUP] Loading application middleware and routes...');
    
    // Load middleware
    await loadMiddleware();
    
    // Apply loaded middleware
    if (paginationMiddleware) app.use(paginationMiddleware);
    if (cacheMiddleware) app.use(cacheMiddleware(5 * 60 * 1000));
    
    console.log('[STARTUP] Middleware applied');
    
    // Load and register routes
    const routes = await loadRoutes();
    
    app.use('/api/auth', routes.authRoutes);
    app.use('/api/scheduling', routes.schedulingRoutes);
    app.use('/api/barbershops', routes.barbershopRoutes);
    app.use('/api/barbershops', routes.serviceRoutes);
    app.use('/api/reviews', routes.reviewRoutes);
    app.use('/api/analytics', routes.analyticsRoutes);
    app.use('/api/payments', routes.paymentRoutes);
    app.use('/api/stripe', routes.stripeRoutes);
    app.use('/api/favorites', routes.favoritesRoutes);
    app.use('/api/cancellations', routes.cancellationRoutes);
    app.use('/api/version', routes.versionRoutes);
    
    console.log('[STARTUP] All routes registered');
    
    // Error handler
    if (errorHandler) app.use(errorHandler);
    
    console.log('[STARTUP] Error handler applied');
    
    // Start listening
    console.log(`[STARTUP] Starting server on 0.0.0.0:${PORT}`);
    
    return new Promise<void>((resolve, reject) => {
      httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`[SUCCESS] ✅ Server LIVE on port ${PORT}`);
        console.log(`[SUCCESS] ✅ WebSocket ready on ws://0.0.0.0:${PORT}`);
        resolve();
      });

      httpServer.on('error', (error: any) => {
        console.error('[ERROR] HTTP Server Error:', error.message);
        reject(error);
      });
    });
    
  } catch (error) {
    console.error('[ERROR] Server startup failed:', error instanceof Error ? error.message : error);
    console.error('[ERROR] Stack:', (error as any)?.stack);
    process.exit(1);
  }
};

// Handle process signals
process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] SIGTERM received, closing server...');
  httpServer.close(() => {
    console.log('[SHUTDOWN] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[SHUTDOWN] SIGINT received, closing server...');
  httpServer.close(() => {
    console.log('[SHUTDOWN] Server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('[FATAL] Uncaught Exception:', error instanceof Error ? error.message : error);
  console.error('[FATAL] Stack:', (error as Error)?.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
  process.exit(1);
});

// Start the server
console.log('[STARTUP] Initializing BarberFlow Backend...');
startServer().catch((error) => {
  console.error('[FATAL] Failed to start server:', error instanceof Error ? error.message : error);
  process.exit(1);
});
