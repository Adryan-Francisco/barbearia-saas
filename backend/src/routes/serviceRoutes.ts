import { Router } from 'express';
import {
  createService,
  getServicesByBarbershop,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/serviceController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Criar serviço (requer autenticação)
router.post('/:barbershop_id/services', authMiddleware, createService);

// Obter serviços de uma barbearia (público)
router.get('/:barbershop_id/services', getServicesByBarbershop);

// Obter um serviço específico (público)
router.get('/services/:service_id', getServiceById);

// Atualizar serviço (requer autenticação)
router.put('/services/:service_id', authMiddleware, updateService);

// Deletar serviço (requer autenticação)
router.delete('/services/:service_id', authMiddleware, deleteService);

export default router;
