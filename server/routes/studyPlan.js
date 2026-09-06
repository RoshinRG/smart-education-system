/**
 * Study Plan Routes
 * POST /api/study-plan/generate              — Generate a study plan
 * GET  /api/study-plan/current               — Get active plan
 * GET  /api/study-plan/milestones            — Get milestones
 * POST /api/study-plan/milestone/:id/complete — Mark milestone complete
 * GET  /api/study-plan/progress              — Get progress
 * PUT  /api/study-plan/:id                   — Update plan
 */

const express = require('express');
const pool = require('../db/connection');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ──── Generate Study Plan ─────────────────────────────────────
router.post('/generate', optionalAuth, async (req, res) => {
  try {
    const { goal, weakAreas, availableHours, duration } = req.body;
    const userId = req.user ? req.user.id : 'anonymous';
    const totalWeeks = duration || 4;
    const planId = `sp-${Date.now()}`;
    const planTitle = goal || 'Master Web Development';

    await pool.query(
      `INSERT INTO study_plans (id, user_id, title, goal, total_weeks, current_week, progress, next_topic)
       VALUES (?, ?, ?, ?, ?, 1, 0, 'Foundational Principles')`,
      [planId, userId, planTitle, goal || '', totalWeeks]
    );

    // Generate milestones
    const milestoneTemplates = [
      { title: 'Core Fundamentals & Concepts', topics: ['Basic Principles', 'Environment Setup'] },
      { title: 'Intermediate Applications & Practice', topics: ['Key Mechanics', 'Building Projects'] },
      { title: 'Advanced Topics & Optimization', topics: ['Performance Tuning', 'Deep Dive'] },
      { title: 'Final Review & Assessment', topics: ['Practice Exams', 'Summary'] },
    ];

    const milestones = [];
    for (let i = 0; i < totalWeeks; i++) {
      const template = milestoneTemplates[i % milestoneTemplates.length];
      const milestoneId = `m-${Date.now()}-${i}`;
      const weekNum = i + 1;
      const title = `Week ${weekNum}: ${template.title}`;

      await pool.query(
        `INSERT INTO study_milestones (id, plan_id, week_number, title, topics, is_completed)
         VALUES (?, ?, ?, ?, ?, FALSE)`,
        [milestoneId, planId, weekNum, title, JSON.stringify(template.topics)]
      );

      milestones.push({
        id: milestoneId,
        weekNumber: weekNum,
        title,
        topics: template.topics,
        isCompleted: false,
      });
    }

    res.status(201).json({
      id: planId,
      title: planTitle,
      currentWeek: 1,
      totalWeeks,
      progress: 0,
      nextTopic: 'Foundational Principles',
      milestones,
    });
  } catch (err) {
    console.error('Generate plan error:', err);
    res.status(500).json({ error: 'Failed to generate study plan.' });
  }
});

// ──── Get Current Plan ────────────────────────────────────────
router.get('/current', optionalAuth, async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'anonymous';

    const [plans] = await pool.query(
      'SELECT * FROM study_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (plans.length === 0) {
      // Return default plan data
      return res.json({
        id: 'sp_default',
        title: 'Full Stack Development & CS Mastery',
        currentWeek: 2,
        totalWeeks: 6,
        progress: 35,
        nextTopic: 'React State Management & Hooks',
        milestones: [
          { id: 'm1', weekNumber: 1, title: 'Week 1: Modern JavaScript & Async Programming', isCompleted: true, topics: ['Promises', 'Async/Await', 'ES Modules'] },
          { id: 'm2', weekNumber: 2, title: 'Week 2: React Fundamentals & Component Design', isCompleted: false, topics: ['JSX Syntax', 'Props & State', 'Effect Hooks'] },
          { id: 'm3', weekNumber: 3, title: 'Week 3: State Management & Routing', isCompleted: false, topics: ['Context API', 'Zustand Store', 'React Router'] },
          { id: 'm4', weekNumber: 4, title: 'Week 4: API Integration & Backend Services', isCompleted: false, topics: ['REST APIs', 'Fetch Client', 'JWT Auth'] },
        ],
      });
    }

    const plan = plans[0];
    const [milestones] = await pool.query(
      'SELECT id, week_number AS weekNumber, title, topics, is_completed AS isCompleted FROM study_milestones WHERE plan_id = ? ORDER BY week_number',
      [plan.id]
    );

    const parsedMilestones = milestones.map((m) => ({
      ...m,
      isCompleted: !!m.isCompleted,
      topics: typeof m.topics === 'string' ? JSON.parse(m.topics) : m.topics,
    }));

    res.json({
      id: plan.id,
      title: plan.title,
      currentWeek: plan.current_week,
      totalWeeks: plan.total_weeks,
      progress: plan.progress,
      nextTopic: plan.next_topic,
      milestones: parsedMilestones,
    });
  } catch (err) {
    console.error('Get current plan error:', err);
    res.status(500).json({ error: 'Failed to fetch study plan.' });
  }
});

// ──── Get Milestones ──────────────────────────────────────────
router.get('/milestones', optionalAuth, async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'anonymous';

    const [plans] = await pool.query(
      'SELECT id FROM study_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (plans.length === 0) {
      // Delegate to /current for default data
      return res.redirect('/api/study-plan/current');
    }

    const [milestones] = await pool.query(
      'SELECT id, week_number AS weekNumber, title, topics, is_completed AS isCompleted FROM study_milestones WHERE plan_id = ? ORDER BY week_number',
      [plans[0].id]
    );

    res.json(milestones.map((m) => ({
      ...m,
      isCompleted: !!m.isCompleted,
      topics: typeof m.topics === 'string' ? JSON.parse(m.topics) : m.topics,
    })));
  } catch (err) {
    console.error('Get milestones error:', err);
    res.status(500).json({ error: 'Failed to fetch milestones.' });
  }
});

// ──── Complete Milestone ──────────────────────────────────────
router.post('/milestone/:id/complete', optionalAuth, async (req, res) => {
  try {
    await pool.query(
      'UPDATE study_milestones SET is_completed = TRUE, completed_at = NOW() WHERE id = ?',
      [req.params.id]
    );

    // Recalculate plan progress
    const [milestone] = await pool.query('SELECT plan_id FROM study_milestones WHERE id = ?', [req.params.id]);
    if (milestone.length > 0) {
      const planId = milestone[0].plan_id;
      const [stats] = await pool.query(
        'SELECT COUNT(*) AS total, SUM(is_completed) AS completed FROM study_milestones WHERE plan_id = ?',
        [planId]
      );
      const progress = stats[0].total > 0
        ? Math.round((stats[0].completed / stats[0].total) * 100)
        : 0;

      // Find next incomplete milestone topic
      const [nextMilestone] = await pool.query(
        'SELECT topics FROM study_milestones WHERE plan_id = ? AND is_completed = FALSE ORDER BY week_number LIMIT 1',
        [planId]
      );
      const nextTopic = nextMilestone.length > 0
        ? (typeof nextMilestone[0].topics === 'string' ? JSON.parse(nextMilestone[0].topics) : nextMilestone[0].topics)[0]
        : 'All Complete!';

      await pool.query(
        'UPDATE study_plans SET progress = ?, next_topic = ? WHERE id = ?',
        [progress, nextTopic, planId]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Complete milestone error:', err);
    res.status(500).json({ error: 'Failed to complete milestone.' });
  }
});

// ──── Get Progress ────────────────────────────────────────────
router.get('/progress', optionalAuth, async (req, res) => {
  // Alias to /current
  return res.redirect('/api/study-plan/current');
});

// ──── Update Plan ─────────────────────────────────────────────
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, current_week } = req.body;
    const setClauses = [];
    const values = [];

    if (title) { setClauses.push('title = ?'); values.push(title); }
    if (current_week) { setClauses.push('current_week = ?'); values.push(current_week); }

    if (setClauses.length > 0) {
      values.push(req.params.id);
      await pool.query(`UPDATE study_plans SET ${setClauses.join(', ')} WHERE id = ?`, values);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Update plan error:', err);
    res.status(500).json({ error: 'Failed to update plan.' });
  }
});

module.exports = router;
