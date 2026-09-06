/**
 * JWT Authentication Middleware
 * Verifies Bearer token and attaches user to request.
 */

const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server will not start.');
}

/**
 * Middleware: require valid JWT
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please provide a valid token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user from DB to ensure they still exist
    const [users] = await pool.query('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [decoded.userId]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found. Token may be invalid.' });
    }

    req.user = users[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

/**
 * Middleware: optionally authenticate (doesn't fail if no token)
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.query('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [decoded.userId]);
    req.user = users.length > 0 ? users[0] : null;
  } catch {
    req.user = null;
  }

  next();
}

/**
 * Middleware: require teacher role
 */
function requireTeacher(req, res, next) {
  if (!req.user || req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Teacher access required.' });
  }
  next();
}

/**
 * Helper: generate JWT for a user
 */
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { authenticate, optionalAuth, requireTeacher, generateToken };
