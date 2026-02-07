import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
} from '../controllers/favoritesController';

const router = Router();

// Adicionar aos favoritos
router.post('/favorites', authMiddleware, addFavorite);

// Remover dos favoritos
router.delete('/favorites/:barbershopId', authMiddleware, removeFavorite);

// Listar favoritos do cliente
router.get('/favorites', authMiddleware, getFavorites);

// Verificar se barbearia está nos favoritos
router.get('/favorites/:barbershopId/check', authMiddleware, isFavorite);

export default router;
