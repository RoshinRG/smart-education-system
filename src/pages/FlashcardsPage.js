import { createElement as h, useState, useEffect } from '../utils/h.js';
import { flashcardService } from '../services/flashcardService.js';
import FlashcardViewer from '../components/flashcards/FlashcardViewer.js';
import PdfUpload from '../components/flashcards/PdfUpload.js';
import Card from '../components/common/Card.js';

export default function FlashcardsPage() {
  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [cardsToReview, setCardsToReview] = useState([]);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const data = await flashcardService.getDecks();
      setDecks(data.decks || []);
    } catch (err) {
      console.error('Failed to load decks');
    }
  };

  const handleStartReview = async (deckId) => {
    try {
      const cards = await flashcardService.getCardsForReview(deckId);
      setCardsToReview(cards.cards || []);
      setIsReviewing(true);
    } catch (err) {
      console.error('Failed to load review cards');
    }
  };

  const handleReviewComplete = async () => {
    setIsReviewing(false);
    await loadDecks();
  };

  if (isReviewing) {
    return h('div', { className: 'review-page' }, [
      h(FlashcardViewer, {
        cards: cardsToReview,
        onComplete: handleReviewComplete,
      }),
    ]);
  }

  return h('div', { className: 'flashcards-page' }, [
    h('div', { className: 'page-header' }, [
      h('h1', {}, 'Flashcards'),
      h('p', {}, 'Learn with spaced repetition'),
    ]),

    h('div', { className: 'decks-grid' }, [
      decks.map((deck) =>
        h(Card, {
          key: deck.id,
          title: deck.title,
          className: 'deck-card',
          hoverable: true,
        }, [
          h('p', {}, deck.description),
          h('div', { className: 'deck-stats' }, [
            h('span', {}, `${deck.totalCards} cards`),
            h('span', {}, `${deck.masteryPercentage}% mastery`),
          ]),
          h('div', { className: 'deck-actions' }, [
            h('button', {
              className: 'btn btn-primary',
              onClick: () => handleStartReview(deck.id),
            }, 'Study'),
            h('button', {
              className: 'btn btn-secondary',
              onClick: () => setActiveDeck(deck),
            }, 'Manage'),
          ]),
        ])
      ),

      h(Card, {
        title: '+ New Deck',
        className: 'deck-card new-deck',
        onClick: () => {
          const title = prompt('Deck name:');
          if (title) loadDecks();
        },
      }, [
        h('p', {}, 'Create a new flashcard deck'),
      ]),
    ]),

    activeDeck && h(Card, { title: `Manage: ${activeDeck.title}` }, [
      h(PdfUpload, {
        deckId: activeDeck.id,
        onSuccess: () => {
          setActiveDeck(null);
          loadDecks();
        },
      }),
    ]),
  ]);
}
