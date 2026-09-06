/**
 * Smart Education Backend — Express Server
 * Entry point: loads env, mounts middleware & routes, starts server.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const initDatabase = require('./db/init');

const app = express();
const PORT = process.env.PORT || 5000;

// ──── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (dev)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// ──── Routes ──────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const flashcardRoutes = require('./routes/flashcards');
const quizRoutes = require('./routes/quiz');
const studyPlanRoutes = require('./routes/studyPlan');
const teacherRoutes = require('./routes/teacher');
const tutorRoutes = require('./routes/tutor');

app.use('/api/auth', authRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/tutor', tutorRoutes);

// ──── Root & Health Check ───────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Education Backend API',
    status: 'running',
    database: 'MySQL connected',
    frontend: 'http://localhost:5173',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      flashcards: '/api/flashcards',
      quiz: '/api/quiz',
      studyPlan: '/api/study-plan',
      teacher: '/api/teacher',
      tutor: '/api/tutor',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ──── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ──── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ──── Start Server ────────────────────────────────────────────
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`\n🚀 Smart Education Backend running on http://localhost:${PORT}`);
      console.log(`📡 API base: http://localhost:${PORT}/api`);
      console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
