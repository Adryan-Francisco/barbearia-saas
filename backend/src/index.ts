import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeDatabase } from './utils/database';
import { websocketService } from './services/websocketService';
import { cacheMiddleware } from './utils/cache';
import { paginationMiddleware } from './utils/pagination';
import authRoutes from './routes/authRoutes';
import schedulingRoutes from './routes/schedulingRoutes';
import barbershopRoutes from './routes/barbershopRoutes';
import reviewRoutes from './routes/reviewRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import paymentRoutes from './routes/paymentRoutes';
import stripeRoutes from './routes/stripeRoutes';
import favoritesRoutes from './routes/favoritesRoutes';
import cancellationRoutes from './routes/cancellationRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(paginationMiddleware); // Middleware de paginação
app.use(cacheMiddleware(5 * 60 * 1000)); // Cache de 5 minutos para GET requests

// Inicializar banco de dados
initializeDatabase().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Falha ao inicializar banco de dados:', err);
});

// Inicializar WebSocket
websocketService.initialize(httpServer);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/barbershop', barbershopRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/cancellations', cancellationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handler
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});
