import React, { useState } from 'react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

export default function FlashcardDeckBuilder({ onSaveDeck, onCancel }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([
    {
      question: 'What is a Binary Search Tree (BST)?',
      answer: 'A node-based binary tree data structure where left subtree values < root < right subtree values.',
      hint: 'Think about left vs right child order.',
    },
    {
      question: 'What is O(1) time complexity?',
      answer: 'Constant time complexity where execution time remains constant regardless of input size.',
      hint: 'Hash table lookup example.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleCardChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  const addCard = () => {
    setCards([
      ...cards,
      {
        question: '',
        answer: '',
        hint: '',
      },
    ]);
  };

  const removeCard = (index) => {
    if (cards.length === 1) return;
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || cards.length === 0) return;

    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].question.trim() || !cards[i].answer.trim()) {
        alert(`Card #${i + 1} must have both a question and answer!`);
        return;
      }
    }

    setLoading(true);
    try {
      await onSaveDeck({
        title,
        subject,
        description,
        cards,
      });
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create deck:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="deck-builder-card">
      <div className="card-header">
        <h3 className="card-title">🃏 Flashcard Deck Creator</h3>
        <p className="card-subtitle">Create study decks with question-and-answer cards for your classes</p>
      </div>

      <form onSubmit={handleSubmit} className="deck-builder-form">
        <div className="form-group-row">
          <div className="form-group flex-2">
            <label className="form-label" htmlFor="deck-title">Deck Title</label>
            <input
              id="deck-title"
              type="text"
              className="form-input"
              placeholder="e.g. Data Structures & Big-O Notation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label" htmlFor="deck-subject">Subject</label>
            <select
              id="deck-subject"
              className="form-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Math">Math</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="History">History</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="deck-desc">Description (optional)</label>
          <input
            id="deck-desc"
            type="text"
            className="form-input"
            placeholder="Brief overview of what this deck covers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h4>Flashcards ({cards.length})</h4>
            <Button type="button" variant="secondary" size="sm" onClick={addCard}>
              ➕ Add Card
            </Button>
          </div>

          {cards.map((card, cIndex) => (
            <div key={cIndex} className="card-editor-box">
              <div className="card-editor-header">
                <span className="card-number-tag">Card {cIndex + 1}</span>
                {cards.length > 1 && (
                  <button
                    type="button"
                    className="delete-question-btn"
                    onClick={() => removeCard(cIndex)}
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>

              <div className="form-group-row">
                <div className="form-group flex-1">
                  <label className="form-label">Front (Question / Prompt)</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Enter question or term..."
                    value={card.question}
                    onChange={(e) => handleCardChange(cIndex, 'question', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Back (Answer / Definition)</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Enter answer or explanation..."
                    value={card.answer}
                    onChange={(e) => handleCardChange(cIndex, 'answer', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hint (optional)</label>
                <input
                  type="text"
                  className="form-input form-input-sm"
                  placeholder="Optional hint for students..."
                  value={card.hint}
                  onChange={(e) => handleCardChange(cIndex, 'hint', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions mt-4">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" loading={loading}>
            ✨ Publish Deck for Students
          </Button>
        </div>
      </form>
    </Card>
  );
}
