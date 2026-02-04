import { Request, Response } from 'express';
import {
  createReview,
  getReviewsByBarbershop,
  getAverageRating,
  deleteReview,
  updateReview,
} from '../services/reviewService';

export async function postReview(req: Request, res: Response) {
  try {
    const { barbershopId, clientId, appointmentId, rating, comment, clientName } =
      req.body;

    if (!barbershopId || !clientId || !appointmentId || !rating || !clientName) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const review = await createReview(
      barbershopId,
      clientId,
      appointmentId,
      rating,
      comment || '',
      clientName
    );

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getReviews(req: Request, res: Response) {
  try {
    const { barbershopId } = req.params;

    const reviews = await getReviewsByBarbershop(barbershopId);
    const averageRating = await getAverageRating(barbershopId);

    res.json({
      reviews,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteReviewHandler(req: Request, res: Response) {
  try {
    const { reviewId } = req.params;

    await deleteReview(reviewId);
    res.json({ message: 'Avaliação removida' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateReviewHandler(req: Request, res: Response) {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await updateReview(reviewId, rating, comment);
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
