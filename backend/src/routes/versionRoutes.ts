import { Router } from 'express';
import {
  getSystemVersion,
  incrementVersion,
} from '../controllers/versionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Buscar versão do sistema (público)
router.get('/', getSystemVersion);

// Incrementar versão (requer autenticação admin)
router.post('/increment', authMiddleware, incrementVersion);

export default router;
