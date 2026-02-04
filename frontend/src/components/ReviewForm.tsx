import React, { useState } from 'react';
import { cardStyle, buttonStyle, buttonHoverStyle } from '../styles';

interface ReviewFormProps {
  barbershopId: string;
  clientId: string;
  appointmentId: string;
  clientName: string;
  onSubmit: (review: any) => void;
}

export function ReviewForm({
  barbershopId,
  clientId,
  appointmentId,
  clientName,
  onSubmit,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/barbershop/${barbershopId}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            barbershopId,
            clientId,
            appointmentId,
            rating,
            comment,
            clientName,
          }),
        }
      );

      if (response.ok) {
        const review = await response.json();
        onSubmit(review);
        setRating(5);
        setComment('');
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={cardStyle}>
      <h3>Avaliar Atendimento</h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Classificação (1-5 estrelas):
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{
                fontSize: '24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                opacity: star <= rating ? 1 : 0.3,
              }}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Comentário (opcional):
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          placeholder="Compartilhe sua experiência..."
          style={{
            width: '100%',
            height: '100px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontFamily: 'Arial, sans-serif',
            resize: 'vertical',
          }}
        />
        <small>{comment.length}/500</small>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          ...buttonStyle,
          ...(isSubmitting ? { opacity: 0.5 } : {}),
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            Object.assign(e.currentTarget.style, buttonHoverStyle);
          }
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyle);
        }}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
}
