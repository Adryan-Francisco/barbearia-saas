import React, { useEffect, useState } from 'react';
import { cardStyle } from '../styles';

interface Review {
  id: string;
  client_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsListProps {
  barbershopId: string;
}

export function ReviewsList({ barbershopId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [barbershopId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/barbershop/${barbershopId}/reviews`
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Carregando avaliações...</div>;

  return (
    <div style={cardStyle}>
      <h3>
        Avaliações ({reviews.length}) - ⭐ {averageRating.toFixed(1)}/5
      </h3>

      {reviews.length === 0 ? (
        <p>Nenhuma avaliação ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px',
                }}
              >
                <strong>{review.client_name}</strong>
                <span>{'⭐'.repeat(review.rating)}</span>
              </div>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                {review.comment}
              </p>
              <small style={{ color: '#999' }}>
                {new Date(review.created_at).toLocaleDateString('pt-BR')}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
