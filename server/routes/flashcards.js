/**
 * Flashcard Routes
 * GET    /api/flashcards/decks       — List all decks
 * GET    /api/flashcards/deck/:id    — Get deck with cards
 * POST   /api/flashcards/deck       — Create deck
 * DELETE /api/flashcards/deck/:id   — Delete deck
 * POST   /api/flashcards/card       — Add card to deck
 * DELETE /api/flashcards/card/:id   — Delete card
 * POST   /api/flashcards/response   — Record spaced repetition response
 * POST   /api/flashcards/generate   — Generate cards (stub)
 */

const express = require('express');
const pool = require('../db/connection');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ──── List Decks ──────────────────────────────────────────────
router.get('/decks', optionalAuth, async (req, res) => {
  try {
    const [decks] = await pool.query(`
      SELECT 
        d.id, d.title, d.subject, d.description,
        COUNT(c.id) AS cardCount,
        d.created_at,
        u.name AS createdByName,
        u.role AS creatorRole
      FROM flashcard_decks d
      LEFT JOIN users u ON u.id = d.created_by
      LEFT JOIN flashcard_cards c ON c.deck_id = d.id
      GROUP BY d.id, u.name, u.role
      ORDER BY d.created_at DESC
    `);

    // Calculate mastery per deck if user is authenticated
    for (const deck of decks) {
      deck.mastery = 0;
      if (req.user && deck.cardCount > 0) {
        const [responses] = await pool.query(
          `SELECT AVG(quality) AS avgQuality FROM flashcard_responses 
           WHERE user_id = ? AND card_id IN (SELECT id FROM flashcard_cards WHERE deck_id = ?)`,
          [req.user.id, deck.id]
        );
        if (responses[0].avgQuality !== null) {
          deck.mastery = Math.round((responses[0].avgQuality / 5) * 100);
        }
      }
    }

    res.json(decks);
  } catch (err) {
    console.error('List decks error:', err);
    res.status(500).json({ error: 'Failed to fetch decks.' });
  }
});

// ──── Get Deck with Cards ─────────────────────────────────────
router.get('/deck/:id', async (req, res) => {
  try {
    const [decks] = await pool.query('SELECT * FROM flashcard_decks WHERE id = ?', [req.params.id]);
    if (decks.length === 0) {
      return res.status(404).json({ error: 'Deck not found.' });
    }

    const [cards] = await pool.query(
      'SELECT id, question, answer, hint FROM flashcard_cards WHERE deck_id = ? ORDER BY created_at',
      [req.params.id]
    );

    res.json({
      ...decks[0],
      cards,
    });
  } catch (err) {
    console.error('Get deck error:', err);
    res.status(500).json({ error: 'Failed to fetch deck.' });
  }
});

// ──── Create Deck ─────────────────────────────────────────────
router.post('/deck', authenticate, async (req, res) => {
  try {
    const { title, description, subject } = req.body;
    const deckId = `deck-${Date.now()}`;

    await pool.query(
      'INSERT INTO flashcard_decks (id, title, subject, description, created_by) VALUES (?, ?, ?, ?, ?)',
      [deckId, title || 'New Flashcard Deck', subject || 'General', description || '', req.user.id]
    );

    res.status(201).json({
      id: deckId,
      title: title || 'New Flashcard Deck',
      subject: subject || 'General',
      cardCount: 0,
      mastery: 0,
    });
  } catch (err) {
    console.error('Create deck error:', err);
    res.status(500).json({ error: 'Failed to create deck.' });
  }
});

// ──── Delete Deck ─────────────────────────────────────────────
router.delete('/deck/:id', authenticate, async (req, res) => {
  try {
    // Fix 4: Verify ownership before deleting
    const [rows] = await pool.query(
      'SELECT id FROM flashcard_decks WHERE id = ? AND created_by = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden: you do not own this deck.' });
    }
    await pool.query('DELETE FROM flashcard_decks WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete deck error:', err);
    res.status(500).json({ error: 'Failed to delete deck.' });
  }
});

// ──── Add Card ────────────────────────────────────────────────
router.post('/card', authenticate, async (req, res) => {
  try {
    const { deckId, question, answer, hint } = req.body;
    const cardId = `card-${Date.now()}`;

    await pool.query(
      'INSERT INTO flashcard_cards (id, deck_id, question, answer, hint) VALUES (?, ?, ?, ?, ?)',
      [cardId, deckId, question, answer, hint || null]
    );

    res.status(201).json({ success: true, id: cardId });
  } catch (err) {
    console.error('Add card error:', err);
    res.status(500).json({ error: 'Failed to add card.' });
  }
});

// ──── Delete Card ─────────────────────────────────────────────
router.delete('/card/:id', authenticate, async (req, res) => {
  try {
    // Fix 5: Verify the requesting user owns the parent deck of this card
    const [rows] = await pool.query(
      `SELECT fc.id FROM flashcard_cards fc
       JOIN flashcard_decks fd ON fd.id = fc.deck_id
       WHERE fc.id = ? AND fd.created_by = ?`,
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden: you do not own this card.' });
    }
    await pool.query('DELETE FROM flashcard_cards WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete card error:', err);
    res.status(500).json({ error: 'Failed to delete card.' });
  }
});

// ──── Record Response (Spaced Repetition SM-2) ────────────────
router.post('/response', authenticate, async (req, res) => {
  try {
    const { cardId, quality } = req.body; // quality: 0-5

    // Get existing response or create defaults
    const [existing] = await pool.query(
      'SELECT * FROM flashcard_responses WHERE card_id = ? AND user_id = ? ORDER BY reviewed_at DESC LIMIT 1',
      [cardId, req.user.id]
    );

    let easeFactor = 2.5;
    let interval = 1;
    let repetitions = 0;

    if (existing.length > 0) {
      easeFactor = parseFloat(existing[0].ease_factor);
      interval = existing[0].interval;
      repetitions = existing[0].repetitions;
    }

    // SM-2 Algorithm
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (quality < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 3;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    }

    const nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO flashcard_responses (id, card_id, user_id, quality, ease_factor, \`interval\`, repetitions, next_review)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)`,
      [cardId, req.user.id, quality, easeFactor, interval, repetitions, nextReview]
    );

    res.json({ success: true, id: `resp-${Date.now()}` });
  } catch (err) {
    console.error('Record response error:', err);
    res.status(500).json({ error: 'Failed to record response.' });
  }
});

// ──── Generate Cards (Stub) ───────────────────────────────────
router.post('/generate', authenticate, async (req, res) => {
  // PDF parsing would go here — for now return success
  res.json({ success: true, id: `gen-${Date.now()}` });
});

module.exports = router;
