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

  const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'teacher' | 'my'

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const data = await flashcardService.getDecks();
      const list = Array.isArray(data) ? data : (data?.decks || []);
      setDecks(list);
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
      const list = Array.isArray(cards) ? cards : (cards?.cards || []);
      setCardsToReview(list);
      setIsReviewing(true);
    } catch {
      console.error('Failed to load review cards');
    }
  };

  const handleReviewComplete = async (responses) => {
    setIsReviewing(false);
    await loadDecks();
  };

  const filteredDecks = decks.filter((d) => {
    const isTeacherDeck = d.creatorRole === 'teacher' || d.createdByName;
    if (tabFilter === 'teacher' && !isTeacherDeck) return false;
    if (tabFilter === 'my' && isTeacherDeck) return false;
    return true;
  });

  if (isReviewing) {
    return (
      <div className="flashcards-page reviewing">
        <button
          className="btn btn-ghost back-btn"
          onClick={() => setIsReviewing(false)}
        >
          ← Exit Study Session
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
          <h1>🃏 Flashcards & Spaced Repetition</h1>
          <p className="text-muted">
            Master concepts with scientific SM-2 spaced repetition
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewDeckModal(true)}
        >
          + New Deck
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          className={`btn btn-sm ${tabFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setTabFilter('all')}
        >
          All Decks ({decks.length})
        </button>
        <button
          className={`btn btn-sm ${tabFilter === 'teacher' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setTabFilter('teacher')}
        >
          👨‍🏫 Teacher Assigned ({decks.filter(d => d.creatorRole === 'teacher' || d.createdByName).length})
        </button>
        <button
          className={`btn btn-sm ${tabFilter === 'my' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setTabFilter('my')}
        >
          📁 Custom Decks
        </button>
      </div>

      {filteredDecks.length === 0 ? (
        <div className="empty-state-large">
          <div className="empty-icon">🃏</div>
          <h3>No decks found</h3>
          <p className="text-muted">
            {tabFilter === 'teacher'
              ? 'Your teacher has not published decks in this category yet.'
              : 'Create your first flashcard deck to get started.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowNewDeckModal(true)}
          >
            + Create Deck
          </button>
        </div>
      ) : (
        <div className="decks-grid">
          {filteredDecks.map((deck) => {
            const isTeacherDeck = deck.creatorRole === 'teacher' || deck.createdByName;
            const totalCards = deck.cardCount ?? deck.totalCards ?? 0;
            const mastery = deck.mastery ?? deck.masteryPercentage ?? 0;

            return (
              <Card key={deck.id} className="deck-card" hoverable>
                <div className="deck-card-top">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div className="deck-icon">📚</div>
                    {isTeacherDeck && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          color: '#c084fc',
                          background: 'rgba(168, 85, 247, 0.15)',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                        }}
                      >
                        👨‍🏫 Teacher: {deck.createdByName || 'Faculty'}
                      </span>
                    )}
                  </div>
                  <h3 className="deck-title">{deck.title}</h3>
                  {deck.description && (
                    <p className="text-muted deck-desc">{deck.description}</p>
                  )}
                </div>
                <div className="deck-stats">
                  <span className="deck-stat">
                    <strong>{totalCards}</strong> cards
                  </span>
                  <span className="deck-stat">
                    <strong>{mastery}%</strong> mastered
                  </span>
                </div>
                <div className="deck-mastery-bar">
                  <div
                    className="mastery-fill"
                    style={{ width: `${mastery}%` }}
                  />
                </div>
                <div className="deck-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStartReview(deck.id)}
                  >
                    Study Now
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setActiveDeck(deck)}
                  >
                    Manage
                  </button>
                </div>
              </Card>
            );
          })}
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
