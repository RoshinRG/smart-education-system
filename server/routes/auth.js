/**
 * Auth Routes
 * POST /api/auth/register — Create new user
 * POST /api/auth/login    — Login with email & password
 * GET  /api/auth/profile  — Get current user profile (JWT)
 * PUT  /api/auth/profile  — Update profile
 * POST /api/auth/logout   — Logout (client-side token clear)
 * POST /api/auth/refresh  — Refresh JWT
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/connection');
const { authenticate, optionalAuth, generateToken } = require('../middleware/auth');

const router = express.Router();

// ──── Register ────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if email exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}`;
    const userRole = role || 'student';
    const avatar = userRole === 'teacher' ? '👨‍🏫' : '🎓';

    await pool.query(
      `INSERT INTO users (id, name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name || email.split('@')[0], email, hashedPassword, userRole, avatar]
    );

    const token = generateToken(userId);
    const user = { id: userId, name: name || email.split('@')[0], email, role: userRole, avatar };

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// ──── Login ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// ──── Get Profile ─────────────────────────────────────────────
router.get('/profile', authenticate, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const u = users[0];
    res.json({
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        bio: u.bio,
        major: u.major,
        academic_year: u.academic_year,
        gpa: u.gpa ? parseFloat(u.gpa) : null,
        department: u.department,
        office_hours: u.office_hours,
      },
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// ──── Update Profile ──────────────────────────────────────────
router.put('/profile', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = ['name', 'avatar', 'bio', 'major', 'academic_year', 'gpa', 'department', 'office_hours'];

    const setClauses = [];
    const values = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update.' });
    }

    values.push(req.user.id);
    await pool.query(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`, values);

    // Return updated user
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const u = users[0];

    res.json({
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        bio: u.bio,
        major: u.major,
        academic_year: u.academic_year,
        gpa: u.gpa ? parseFloat(u.gpa) : null,
        department: u.department,
        office_hours: u.office_hours,
      },
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ──── Logout ──────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  // JWT is stateless — client just discards the token
  res.json({ success: true });
});

// ──── Student Join Class by Code ─────────────────────────────
router.post('/join-class', authenticate, async (req, res) => {
  try {
    const joinCode = req.body.joinCode || req.body.code;
    if (!joinCode || !joinCode.trim()) {
      return res.status(400).json({ error: 'Please enter a valid class join code.' });
    }

    const [classes] = await pool.query(
      'SELECT c.*, u.name AS teacherName FROM classes c JOIN users u ON u.id = c.teacher_id WHERE UPPER(c.join_code) = UPPER(?)',
      [joinCode.trim()]
    );

    if (classes.length === 0) {
      return res.status(404).json({ error: 'Invalid class code. Please check with your instructor.' });
    }

    const cls = classes[0];

    const [enrolled] = await pool.query(
      'SELECT * FROM class_enrollments WHERE class_id = ? AND student_id = ?',
      [cls.id, req.user.id]
    );

    if (enrolled.length > 0) {
      return res.status(400).json({ error: `You are already enrolled in ${cls.name}.` });
    }

    await pool.query(
      'INSERT INTO class_enrollments (id, class_id, student_id) VALUES (UUID(), ?, ?)',
      [cls.id, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: `Enrolled successfully in ${cls.name}!`,
      class: {
        id: cls.id,
        name: cls.name,
        subject: cls.subject,
        section: cls.section,
        teacherName: cls.teacherName,
        joinCode: cls.join_code,
      },
    });
  } catch (err) {
    console.error('Join class error:', err);
    res.status(500).json({ error: 'Failed to join class.' });
  }
});

// ──── Student Enrolled Announcements ─────────────────────────
router.get('/announcements', optionalAuth, async (req, res) => {
  try {
    const studentId = req.user ? req.user.id : 'user-demo-student';

    const [announcements] = await pool.query(`
      SELECT a.id, a.title, a.message, a.priority, a.created_at AS createdAt,
             c.name AS className, c.subject AS classSubject, u.name AS teacherName
      FROM announcements a
      LEFT JOIN classes c ON c.id = a.class_id
      LEFT JOIN users u ON u.id = a.teacher_id
      WHERE a.class_id IS NULL OR a.class_id IN (SELECT class_id FROM class_enrollments WHERE student_id = ?)
      ORDER BY a.created_at DESC
      LIMIT 10
    `, [studentId]);

    res.json(announcements);
  } catch (err) {
    console.error('Get student announcements error:', err);
    res.status(500).json({ error: 'Failed to fetch announcements.' });
  }
});

module.exports = router;
