import { apiClient } from './api.js';

class FlashcardService {
  async createDeck(title, description = '') {
    return apiClient.post('/flashcards/deck', {
      title,
      description,
    });
  }

  async getDecks() {
    return apiClient.get('/flashcards/decks');
  }

  async getDeck(deckId) {
    return apiClient.get(`/flashcards/deck/${deckId}`);
  }

  async deleteDeck(deckId) {
    return apiClient.delete(`/flashcards/deck/${deckId}`);
  }

  async uploadAndGenerate(deckId, file) {
    return apiClient.uploadFile(`/flashcards/generate`, file, {
      deckId,
    });
  }

  async addCard(deckId, question, answer, hint = '') {
    return apiClient.post('/flashcards/card', {
      deckId,
      question,
      answer,
      hint,
    });
  }

  async deleteCard(cardId) {
    return apiClient.delete(`/flashcards/card/${cardId}`);
  }

  async getCardsForReview(deckId) {
    return apiClient.get(`/flashcards/review/${deckId}`);
  }

  async recordResponse(cardId, quality) {
    // quality: 0-5 (0=fail, 5=perfect)
    return apiClient.post('/flashcards/response', {
      cardId,
      quality,
    });
  }

  async getDeckStats(deckId) {
    return apiClient.get(`/flashcards/stats/${deckId}`);
  }

  async resetDeck(deckId) {
    return apiClient.post(`/flashcards/reset/${deckId}`, {});
  }

  // Local SM-2 algorithm (for client-side calculations)
  calculateNextReview(card, quality) {
    let ef = card.easeFactor || 2.5;
    let interval = card.interval || 1;
    let reps = card.repetitions || 0;

    // SM-2 Formula
    ef = Math.max(1.3, ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (reps === 0) {
      interval = 1;
    } else if (reps === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * ef);
    }

    reps += 1;

    return {
      easeFactor: ef,
      interval,
      repetitions: reps,
      nextReviewDate: new Date(Date.now() + interval * 24 * 60 * 60 * 1000),
    };
  }
}

export const flashcardService = new FlashcardService();
