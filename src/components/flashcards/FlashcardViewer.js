import { createElement as h, useState } from '../../utils/h.js';
import { flashcardService } from '../../services/flashcardService.js';

export default function FlashcardViewer({ cards, deckId, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [responses, setResponses] = useState([]);

  if (!cards || cards.length === 0) {
    return h('div', { className: 'empty-state' }, [
      h('p', {}, 'No cards to review!'),
    ]);
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleResponse = async (quality) => {
    try {
      await flashcardService.recordResponse(currentCard.id, quality);
      setResponses((prev) => [...prev, { cardId: currentCard.id, quality }]);

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        onComplete?.(responses);
      }
    } catch (error) {
      console.error('Error recording response:', error);
    }
  };

  return h('div', { className: 'flashcard-viewer' }, [
    h('div', { className: 'progress-bar' }, [
      h('div', { className: 'progress-fill', style: `width: ${progress}%` }, []),
      h('span', { className: 'progress-text' }, `${currentIndex + 1} / ${cards.length}`),
    ]),

    h('div', { className: 'card-container' }, [
      h('div', {
        className: `flashcard ${isFlipped ? 'flipped' : ''}`,
        onClick: () => setIsFlipped(!isFlipped),
      }, [
        h('div', { className: 'card-inner' }, [
          h('div', { className: 'card-front' }, [
            h('p', { className: 'card-label' }, 'Question'),
            h('p', { className: 'card-content' }, currentCard.question),
          ]),
          h('div', { className: 'card-back' }, [
            h('p', { className: 'card-label' }, 'Answer'),
            h('p', { className: 'card-content' }, currentCard.answer),
            currentCard.hint && h('p', { className: 'card-hint' }, `Hint: ${currentCard.hint}`),
          ]),
        ]),
      ]),
      h('p', { className: 'flip-hint' }, 'Click to flip'),
    ]),

    h('div', { className: 'response-buttons' }, [
      h('button', {
        className: 'btn btn-danger',
        onClick: () => handleResponse(1),
      }, 'Hard'),
      h('button', {
        className: 'btn btn-warning',
        onClick: () => handleResponse(3),
      }, 'OK'),
      h('button', {
        className: 'btn btn-success',
        onClick: () => handleResponse(5),
      }, 'Easy'),
    ]),
  ]);
}
