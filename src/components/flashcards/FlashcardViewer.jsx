import React, { useState } from 'react';
import { flashcardService } from '../../services/flashcardService.js';

const QUALITY_LABELS = [
  { quality: 1, label: 'Hard', variant: 'btn-danger', emoji: '😓' },
  { quality: 3, label: 'OK', variant: 'btn-warning', emoji: '😐' },
  { quality: 5, label: 'Easy', variant: 'btn-success', emoji: '😊' },
];

export default function FlashcardViewer({ cards, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [responses, setResponses] = useState([]);

  if (!cards || cards.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🃏</div>
        <p>No cards to review right now!</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleResponse = async (quality) => {
    try {
      await flashcardService.recordResponse(currentCard.id, quality);
      const newResponses = [...responses, { cardId: currentCard.id, quality }];
      setResponses(newResponses);

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((i) => i + 1);
        setIsFlipped(false);
      } else {
        onComplete?.(newResponses);
      }
    } catch (error) {
      console.error('Error recording response:', error);
    }
  };

  return (
    <div className="flashcard-viewer">
      {/* Progress */}
      <div className="flashcard-progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="flashcard-progress-text">
        <span>{currentIndex + 1} of {cards.length}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>

      {/* Card */}
      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped((f) => !f)}
        role="button"
        aria-label="Click to flip card"
      >
        <div className="card-inner">
          <div className="card-face card-front">
            <span className="face-label">Question</span>
            <p className="card-content">{currentCard.question}</p>
            <span className="flip-hint">Click to reveal answer ↓</span>
          </div>
          <div className="card-face card-back">
            <span className="face-label">Answer</span>
            <p className="card-content">{currentCard.answer}</p>
            {currentCard.hint && (
              <p className="card-hint">💡 {currentCard.hint}</p>
            )}
          </div>
        </div>
      </div>

      {/* Response buttons — only show after flipping */}
      <div className={`response-buttons ${isFlipped ? 'visible' : ''}`}>
        <p className="response-prompt">How well did you know this?</p>
        <div className="response-btn-group">
          {QUALITY_LABELS.map(({ quality, label, variant, emoji }) => (
            <button
              key={quality}
              className={`btn ${variant} response-btn`}
              onClick={() => handleResponse(quality)}
            >
              <span className="response-emoji">{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
