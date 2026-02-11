import { prisma } from '../utils/prisma';

export async function createReview(
  barbershopId: string,
  clientId: string,
  appointmentId: string,
  rating: number,
  comment: string,
  clientName: string
) {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating deve estar entre 1 e 5');
  }

  const review = await prisma.review.create({
    data: {
      barbershopId,
      userId: clientId,
      rating,
      comment: comment.substring(0, 500),
    },
  });

  return review;
}

export async function getReviewsByBarbershop(barbershopId: string) {
  return await prisma.review.findMany({
    where: { barbershopId },
    include: { user: true },
  });
}

export async function getAverageRating(barbershopId: string): Promise<number> {
  const reviews = await getReviewsByBarbershop(barbershopId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc: number, r: typeof reviews[0]) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export async function deleteReview(reviewId: string): Promise<void> {
  await prisma.review.delete({
    where: { id: reviewId },
  });
}

export async function updateReview(
  reviewId: string,
  rating?: number,
  comment?: string
) {
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    throw new Error('Rating deve estar entre 1 e 5');
  }

  const update: any = {};
  if (rating) update.rating = rating;
  if (comment) update.comment = comment.substring(0, 500);

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: update,
  });

  return review;
}
