import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(__dirname, '../../data/barbearia.json');

interface Review {
  id: string;
  barbershop_id: string;
  client_id: string;
  appointment_id: string;
  rating: number; // 1-5
  comment: string;
  client_name: string;
  created_at: string;
  updated_at: string;
}

async function loadDatabase() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function saveDatabase(db: any) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function createReview(
  barbershopId: string,
  clientId: string,
  appointmentId: string,
  rating: number,
  comment: string,
  clientName: string
): Promise<Review> {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating deve estar entre 1 e 5');
  }

  const db = await loadDatabase();
  const review: Review = {
    id: uuidv4(),
    barbershop_id: barbershopId,
    client_id: clientId,
    appointment_id: appointmentId,
    rating,
    comment: comment.substring(0, 500),
    client_name: clientName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.reviews.push(review);
  await saveDatabase(db);
  return review;
}

export async function getReviewsByBarbershop(barbershopId: string): Promise<Review[]> {
  const db = await loadDatabase();
  return db.reviews.filter((r: Review) => r.barbershop_id === barbershopId);
}

export async function getAverageRating(barbershopId: string): Promise<number> {
  const reviews = await getReviewsByBarbershop(barbershopId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export async function deleteReview(reviewId: string): Promise<void> {
  const db = await loadDatabase();
  db.reviews = db.reviews.filter((r: Review) => r.id !== reviewId);
  await saveDatabase(db);
}

export async function updateReview(
  reviewId: string,
  rating?: number,
  comment?: string
): Promise<Review> {
  const db = await loadDatabase();
  const review = db.reviews.find((r: Review) => r.id === reviewId);

  if (!review) {
    throw new Error('Avaliação não encontrada');
  }

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    throw new Error('Rating deve estar entre 1 e 5');
  }

  if (rating) review.rating = rating;
  if (comment) review.comment = comment.substring(0, 500);
  review.updated_at = new Date().toISOString();

  await saveDatabase(db);
  return review;
}
