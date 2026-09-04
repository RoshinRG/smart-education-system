import React, { useState, useEffect } from 'react';
import { flashcardService } from '../services/flashcardService.js';
import FlashcardViewer from '../components/flashcards/FlashcardViewer.jsx';
import PdfUpload from '../components/flashcards/PdfUpload.jsx';
import Card from '../components/common/Card.jsx';
import Modal from '../components/common/Modal.jsx';

export default function FlashcardsPage() {
  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null); // deck being managed
  const [isReviewing, setIsReviewing] = useState(false);
  const [cardsToReview, setCardsToReview] = useState([]);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const data = await flashcardService.getDecks();
      setDecks(data.decks || []);
    } catch {
      console.error('Failed to load decks');
    }
  };

  const handleCreateDeck = async () => {
    if (!newDeckTitle.trim()) return;
    setIsCreating(true);
    try {
      await flashcardService.createDeck(newDeckTitle.trim());
      setNewDeckTitle('');
      setShowNewDeckModal(false);
      await loadDecks();
    } catch {
      console.error('Failed to create deck');
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartReview = async (deckId) => {
    try {
      const cards = await flashcardService.getCardsForReview(deckId);
      setCardsToReview(cards.cards || []);
      setIsReviewing(true);
    } catch {
      console.error('Failed to load review cards');
    }
  };

  const handleReviewComplete = async (responses) => {
    setIsReviewing(false);
    await loadDecks();
  };

  if (isReviewing) {
    return (
      <div className="review-page">
        <button
          className="btn btn-ghost back-btn"
          onClick={() => setIsReviewing(false)}
        >
          ← Back to Decks
        </button>
        <FlashcardViewer
          cards={cardsToReview}
          onComplete={handleReviewComplete}
        />
      </div>
    );
  }

  return (
    <div className="flashcards-page">
      <div className="page-header">
        <div>
          <h1>🃏 Flashcards</h1>
          <p className="text-muted">Learn with spaced repetition</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewDeckModal(true)}
        >
          + New Deck
        </button>
      </div>

      {/* Deck grid */}
      {decks.length === 0 ? (
        <div className="empty-state-large">
          <div className="empty-icon">🃏</div>
          <h3>No decks yet</h3>
          <p className="text-muted">Create your first flashcard deck to get started.</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowNewDeckModal(true)}
          >
            + Create Deck
          </button>
        </div>
      ) : (
        <div className="decks-grid">
          {decks.map((deck) => (
            <Card key={deck.id} className="deck-card" hoverable>
              <div className="deck-card-top">
                <div className="deck-icon">📚</div>
                <h3 className="deck-title">{deck.title}</h3>
                {deck.description && (
                  <p className="text-muted deck-desc">{deck.description}</p>
                )}
              </div>
              <div className="deck-stats">
                <span className="deck-stat">
                  <strong>{deck.totalCards ?? 0}</strong> cards
                </span>
                <span className="deck-stat">
                  <strong>{deck.masteryPercentage ?? 0}%</strong> mastered
                </span>
              </div>
              <div className="deck-mastery-bar">
                <div
                  className="mastery-fill"
                  style={{ width: `${deck.masteryPercentage ?? 0}%` }}
                />
              </div>
              <div className="deck-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleStartReview(deck.id)}
                >
                  Study
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setActiveDeck(deck)}
                >
                  Manage
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Manage deck (PDF upload) */}
      {activeDeck && (
        <div className="deck-manage-panel">
          <div className="panel-header">
            <h2>Manage: {activeDeck.title}</h2>
            <button
              className="btn btn-ghost"
              onClick={() => setActiveDeck(null)}
            >
              ✕ Close
            </button>
          </div>
          <PdfUpload
            deckId={activeDeck.id}
            onSuccess={() => {
              setActiveDeck(null);
              loadDecks();
            }}
          />
        </div>
      )}

      {/* New Deck Modal */}
      <Modal
        isOpen={showNewDeckModal}
        onClose={() => setShowNewDeckModal(false)}
        title="Create New Deck"
        actions={[
          {
            label: isCreating ? 'Creating…' : 'Create',
            variant: 'primary',
            onClick: handleCreateDeck,
          },
          {
            label: 'Cancel',
            variant: 'ghost',
            onClick: () => setShowNewDeckModal(false),
          },
        ]}
      >
        <div className="form-group">
          <label htmlFor="deck-title">Deck Name</label>
          <input
            id="deck-title"
            type="text"
            placeholder="e.g. Biology Chapter 5"
            value={newDeckTitle}
            onChange={(e) => setNewDeckTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateDeck()}
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
