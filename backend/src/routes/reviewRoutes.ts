import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  postReview,
  getReviews,
  deleteReviewHandler,
  updateReviewHandler,
} from '../controllers/reviewController';

const router = Router();

// Criar avaliação (cliente autenticado)
router.post('/:barbershopId/reviews', authMiddleware, postReview);

// Obter avaliações de uma barbearia
router.get('/:barbershopId/reviews', getReviews);

// Atualizar avaliação
router.put('/reviews/:reviewId', authMiddleware, updateReviewHandler);

// Deletar avaliação
router.delete('/reviews/:reviewId', authMiddleware, deleteReviewHandler);

export default router;
