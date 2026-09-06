/**
 * Quiz Routes
 * GET  /api/quiz/list          — List quizzes
 * POST /api/quiz/start         — Start quiz attempt
 * GET  /api/quiz/attempt/:id   — Get questions for an attempt
 * POST /api/quiz/answer        — Submit an answer
 * POST /api/quiz/complete/:id  — Complete attempt, compute score
 * GET  /api/quiz/results/:id   — Get attempt results
 */

const express = require('express');
const pool = require('../db/connection');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ──── List Quizzes ────────────────────────────────────────────
router.get('/list', async (req, res) => {
  try {
    const subject = req.query.subject;
    let query = `
      SELECT q.id, q.title, q.subject, q.difficulty, q.time_limit, q.created_at AS createdAt,
             u.name AS createdByName, u.role AS creatorRole,
             COUNT(qq.id) AS questionsCount
      FROM quizzes q
      LEFT JOIN users u ON u.id = q.created_by
      LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
    `;
    const params = [];

    if (subject) {
      query += ' WHERE q.subject = ?';
      params.push(subject);
    }

    query += ' GROUP BY q.id, u.name, u.role ORDER BY q.created_at DESC';

    const [quizzes] = await pool.query(query, params);
    res.json(quizzes);
  } catch (err) {
    console.error('List quizzes error:', err);
    res.status(500).json({ error: 'Failed to fetch quizzes.' });
  }
});

// ──── Start Quiz ──────────────────────────────────────────────
router.post('/start', optionalAuth, async (req, res) => {
  try {
    const { quizId, topic } = req.body;

    let quiz;
    let questions;

    if (quizId) {
      // Start a specific quiz
      const [quizRows] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [quizId]);
      if (quizRows.length === 0) {
        return res.status(404).json({ error: 'Quiz not found.' });
      }
      quiz = quizRows[0];

      const [questionRows] = await pool.query(
        'SELECT id, question, options, correct_answer AS correctAnswer, explanation FROM quiz_questions WHERE quiz_id = ? ORDER BY sort_order',
        [quizId]
      );
      questions = questionRows.map((q) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      }));
    } else {
      // Fix 8: Require a non-empty topic so LIKE '%%' doesn't scan the whole table
      if (!topic || !topic.trim()) {
        return res.json({
          attemptId: `att-${Date.now()}`,
          quizId: 'dynamic',
          title: 'Practice Quiz',
          questions: [
            {
              id: 'q1',
              question: 'What is the time complexity of searching in a Balanced Binary Search Tree?',
              options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
              correctAnswer: 2,
              explanation: 'A balanced BST has height log n, ensuring logarithmic search performance.',
            },
          ],
        });
      }

      // Find a quiz by topic/subject
      const [quizRows] = await pool.query(
        'SELECT * FROM quizzes WHERE subject LIKE ? OR title LIKE ? LIMIT 1',
        [`%${topic}%`, `%${topic}%`]
      );

      if (quizRows.length === 0) {
        // Return default quiz data if none found
        return res.json({
          attemptId: `att-${Date.now()}`,
          quizId: 'dynamic',
          title: `${topic} Quiz`,
          questions: [
            {
              id: 'q1',
              question: 'What is the time complexity of searching in a Balanced Binary Search Tree?',
              options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
              correctAnswer: 2,
              explanation: 'A balanced BST has height log n, ensuring logarithmic search performance.',
            },
          ],
        });
      }

      quiz = quizRows[0];
      const [questionRows] = await pool.query(
        'SELECT id, question, options, correct_answer AS correctAnswer, explanation FROM quiz_questions WHERE quiz_id = ? ORDER BY sort_order',
        [quiz.id]
      );
      questions = questionRows.map((q) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      }));
    }

    // Create attempt record
    const attemptId = `att-${Date.now()}`;
    const userId = req.user ? req.user.id : 'anonymous';

    await pool.query(
      'INSERT INTO quiz_attempts (id, quiz_id, user_id, total_questions) VALUES (?, ?, ?, ?)',
      [attemptId, quiz.id, userId, questions.length]
    );

    res.json({
      attemptId,
      quizId: quiz.id,
      title: quiz.title,
      questions,
    });
  } catch (err) {
    console.error('Start quiz error:', err);
    res.status(500).json({ error: 'Failed to start quiz.' });
  }
});

// ──── Get Attempt Questions ───────────────────────────────────
router.get('/attempt/:id', async (req, res) => {
  try {
    const [attempts] = await pool.query('SELECT * FROM quiz_attempts WHERE id = ?', [req.params.id]);
    if (attempts.length === 0) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    const [questions] = await pool.query(
      'SELECT id, question, options, correct_answer AS correctAnswer, explanation FROM quiz_questions WHERE quiz_id = ? ORDER BY sort_order',
      [attempts[0].quiz_id]
    );

    res.json({
      attemptId: req.params.id,
      questions: questions.map((q) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      })),
    });
  } catch (err) {
    console.error('Get attempt error:', err);
    res.status(500).json({ error: 'Failed to fetch attempt.' });
  }
});

// ──── Submit Answer ───────────────────────────────────────────
router.post('/answer', async (req, res) => {
  try {
    const { attemptId, questionId, answer } = req.body;

    // Get the question to check correctness
    const [questions] = await pool.query('SELECT * FROM quiz_questions WHERE id = ?', [questionId]);
    if (questions.length === 0) {
      return res.json({ success: true, isCorrect: false, explanation: 'Question not found.' });
    }

    // Fix 2: Guard against duplicate submissions for the same question in this attempt
    const [existing] = await pool.query(
      'SELECT id FROM quiz_answers WHERE attempt_id = ? AND question_id = ? LIMIT 1',
      [attemptId, questionId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Answer already submitted for this question.' });
    }

    const question = questions[0];
    // Fix 1: Cast both sides to Number so "2" === 2 evaluates correctly
    const isCorrect = Number(answer) === Number(question.correct_answer);

    // Record the answer
    await pool.query(
      'INSERT INTO quiz_answers (id, attempt_id, question_id, selected_answer, is_correct) VALUES (UUID(), ?, ?, ?, ?)',
      [attemptId, questionId, answer, isCorrect]
    );

    // Update attempt correct count
    if (isCorrect) {
      await pool.query(
        'UPDATE quiz_attempts SET correct_count = correct_count + 1 WHERE id = ?',
        [attemptId]
      );
    }

    res.json({
      success: true,
      isCorrect,
      explanation: question.explanation || (isCorrect ? 'Correct!' : 'Incorrect.'),
    });
  } catch (err) {
    console.error('Submit answer error:', err);
    res.status(500).json({ error: 'Failed to submit answer.' });
  }
});

// ──── Complete Quiz ───────────────────────────────────────────
router.post('/complete/:id', async (req, res) => {
  try {
    const attemptId = req.params.id;

    const [attempts] = await pool.query('SELECT * FROM quiz_attempts WHERE id = ?', [attemptId]);
    if (attempts.length === 0) {
      return res.json({ success: true });
    }

    const attempt = attempts[0];
    const score = attempt.total_questions > 0
      ? Math.round((attempt.correct_count / attempt.total_questions) * 100)
      : 0;

    let masteryLevel = 'Beginner';
    if (score >= 90) masteryLevel = 'Expert';
    else if (score >= 75) masteryLevel = 'Proficient';
    else if (score >= 60) masteryLevel = 'Intermediate';

    await pool.query(
      'UPDATE quiz_attempts SET score = ?, mastery_level = ?, completed_at = NOW() WHERE id = ?',
      [score, masteryLevel, attemptId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Complete quiz error:', err);
    res.status(500).json({ error: 'Failed to complete quiz.' });
  }
});

// ──── Get Results ─────────────────────────────────────────────
router.get('/results/:id', async (req, res) => {
  try {
    const [attempts] = await pool.query('SELECT * FROM quiz_attempts WHERE id = ?', [req.params.id]);
    if (attempts.length === 0) {
      return res.status(404).json({ error: 'Results not found.' });
    }

    const attempt = attempts[0];
    const score = attempt.total_questions > 0
      ? Math.round((attempt.correct_count / attempt.total_questions) * 100)
      : 0;

    res.json({
      score,
      totalQuestions: attempt.total_questions,
      correctCount: attempt.correct_count,
      masteryLevel: attempt.mastery_level || 'Beginner',
      feedback: score >= 80
        ? 'Great performance! You showed strong understanding of the core concepts.'
        : score >= 60
          ? 'Good effort! Review the topics you missed to strengthen your understanding.'
          : 'Keep practicing! Focus on the fundamentals and try again.',
    });
  } catch (err) {
    console.error('Get results error:', err);
    res.status(500).json({ error: 'Failed to fetch results.' });
  }
});

module.exports = router;
