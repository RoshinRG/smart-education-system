/**
 * Database Initializer
 * Reads schema.sql, executes it, and seeds demo data if tables are empty.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const pool = require('./connection');

async function initDatabase() {
  console.log('🗄️  Initializing database...');

  // --- 0. Create database if it doesn't exist ---
  try {
    const tempConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
    });
    const dbName = process.env.DB_NAME || 'smart_education';
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await tempConn.end();
    console.log(`✅ Database "${dbName}" ready.`);
  } catch (err) {
    console.error('❌ Could not create database:', err.message);
    console.error('   Make sure MySQL is running and credentials in server/.env are correct.');
    throw err;
  }

  // --- 1. Run schema ---
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(schemaSql);
    console.log('✅ Schema created / verified.');

    // Migration: add join_code column if missing
    try {
      await pool.query('ALTER TABLE classes ADD COLUMN join_code VARCHAR(10) UNIQUE');
    } catch {
      // Column already exists
    }

    // Set demo join codes if not set
    await pool.query(`UPDATE classes SET join_code = 'CS101' WHERE id = 'class-cs101' AND (join_code IS NULL OR join_code = '')`);
    await pool.query(`UPDATE classes SET join_code = 'CALC2' WHERE id = 'class-calc' AND (join_code IS NULL OR join_code = '')`);
    await pool.query(`UPDATE classes SET join_code = 'PY100' WHERE id = 'class-python' AND (join_code IS NULL OR join_code = '')`);

    // Migration: Seed default announcements if empty
    const [annCount] = await pool.query('SELECT COUNT(*) AS cnt FROM announcements');
    if (annCount[0].cnt === 0) {
      const [teachers] = await pool.query("SELECT id FROM users WHERE role = 'teacher' LIMIT 1");
      if (teachers.length > 0) {
        const teacherId = teachers[0].id;
        await pool.query(
          `INSERT INTO announcements (id, class_id, teacher_id, title, message, priority) VALUES
           (UUID(), 'class-cs101', ?, 'Midterm Review & Practice Quiz Published', 'Make sure to attempt the new CS Fundamentals Quiz before this Friday. All review slides are in your notes tab.', 'important'),
           (UUID(), 'class-calc', ?, 'Welcome to AP Calculus BC', 'Welcome learners! Start by reviewing the Derivatives & Limits cheat sheet in your class notes.', 'normal')`,
          [teacherId, teacherId]
        );
        console.log('📢 Seeded default class announcements.');
      }
    }
  } catch (err) {
    console.error('❌ Schema/Migration error:', err.message);
    throw err;
  }

  // --- 2. Seed demo data if users table is empty ---
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM users');
  if (rows[0].cnt > 0) {
    console.log('📦 Database already contains data — skipping seed.');
    return;
  }

  console.log('🌱 Seeding demo data...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Demo student
  const studentId = 'user-demo-student';
  await pool.query(
    `INSERT INTO users (id, name, email, password, role, avatar, bio, major, academic_year, gpa)
     VALUES (?, ?, ?, ?, 'student', '🎓', 'Passionate learner exploring CS and Mathematics.', 'Computer Science', 'Junior', 3.80)`,
    [studentId, 'Alex Student', 'demo@smartedu.com', hashedPassword]
  );

  // Demo teacher
  const teacherId = 'user-demo-teacher';
  await pool.query(
    `INSERT INTO users (id, name, email, password, role, avatar, bio, department, office_hours)
     VALUES (?, ?, ?, ?, 'teacher', '👨‍🏫', 'Professor of Computer Science with 15 years of experience.', 'Computer Science', 'Mon/Wed 2-4 PM')`,
    [teacherId, 'Prof. Miller', 'teacher@edu.com', hashedPassword]
  );

  // Demo classes
  const classIds = ['class-cs101', 'class-calc', 'class-python'];
  await pool.query(
    `INSERT INTO classes (id, name, subject, section, teacher_id) VALUES
     (?, 'AP Computer Science A', 'Computer Science', 'Period 2', ?),
     (?, 'Honors Calculus BC', 'Math', 'Period 4', ?),
     (?, 'Intro to Python Programming', 'CS', 'Period 6', ?)`,
    [classIds[0], teacherId, classIds[1], teacherId, classIds[2], teacherId]
  );

  // Enroll demo student
  await pool.query(
    `INSERT INTO class_enrollments (class_id, student_id) VALUES (?, ?), (?, ?)`,
    [classIds[0], studentId, classIds[2], studentId]
  );

  // Demo flashcard deck
  const deckId = 'deck-algo';
  await pool.query(
    `INSERT INTO flashcard_decks (id, title, subject, description, created_by)
     VALUES (?, 'Algorithms & Data Structures', 'Computer Science', 'Essential data structures and time complexity', ?)`,
    [deckId, teacherId]
  );

  await pool.query(
    `INSERT INTO flashcard_cards (id, deck_id, question, answer, hint) VALUES
     (UUID(), ?, 'What is the time complexity of binary search on a sorted array?', 'O(log n) because the search space halves at each step.', 'Think about logarithmic reduction.'),
     (UUID(), ?, 'Explain the difference between Stack and Queue.', 'Stack is LIFO (Last In, First Out) while Queue is FIFO (First In, First Out).', 'LIFO vs FIFO'),
     (UUID(), ?, 'What is a hash collision and how is it resolved?', 'A collision occurs when two keys hash to the same index. Resolved using Chaining or Open Addressing.', 'LinkedList vs Open addressing')`,
    [deckId, deckId, deckId]
  );

  // Demo quiz
  const quizId = 'quiz-cs-fundamentals';
  await pool.query(
    `INSERT INTO quizzes (id, title, subject, difficulty, time_limit, created_by)
     VALUES (?, 'CS Fundamentals Quiz', 'Computer Science', 'Medium', 300, ?)`,
    [quizId, teacherId]
  );

  await pool.query(
    `INSERT INTO quiz_questions (id, quiz_id, question, options, correct_answer, explanation, sort_order) VALUES
     (UUID(), ?, 'What is the time complexity of searching in a Balanced Binary Search Tree?', '["O(1)", "O(n)", "O(log n)", "O(n log n)"]', 2, 'A balanced BST has height log n, ensuring logarithmic search performance.', 1),
     (UUID(), ?, 'Which HTTP method is idempotent and safe for retrieving resources?', '["POST", "GET", "PUT", "DELETE"]', 1, 'GET requests retrieve data without modifying server state.', 2),
     (UUID(), ?, 'What does CSS stand for?', '["Creative Style Sheets", "Cascading Style Sheets", "Computer System Styles", "Colorful Sheet System"]', 1, 'CSS stands for Cascading Style Sheets.', 3)`,
    [quizId, quizId, quizId]
  );

  // Demo teacher notes
  await pool.query(
    `INSERT INTO teacher_notes (id, title, subject, content, tags, author_id) VALUES
     (UUID(), 'Mastering Big-O & Time Complexity', 'Computer Science', 'Comprehensive guide explaining O(1), O(log n), O(n), and O(n^2) with code examples in Python and Java.', '["Algorithms", "Big-O", "Data Structures"]', ?),
     (UUID(), 'Derivatives & Limits Cheat Sheet', 'Calculus', 'Quick reference sheet covering power rule, chain rule, product rule, quotient rule, and L\\'Hopital\\'s Rule.', '["Math", "Calculus", "Limits"]', ?)`,
    [teacherId, teacherId]
  );

  console.log('✅ Demo data seeded successfully.');
  console.log('   📧 Student login: demo@smartedu.com / password123');
  console.log('   📧 Teacher login: teacher@edu.com / password123');
}

module.exports = initDatabase;

if (require.main === module) {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
