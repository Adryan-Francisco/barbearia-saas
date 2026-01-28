import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './utils/database';
import authRoutes from './routes/authRoutes';
import schedulingRoutes from './routes/schedulingRoutes';
import barbershopRoutes from './routes/barbershopRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
initializeDatabase().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Falha ao inicializar banco de dados:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/barbershop', barbershopRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
