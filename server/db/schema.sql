-- ============================================================
-- Smart Education Platform — Upgraded MySQL Schema
-- Character Set: utf8mb4 (supports emojis & academic symbols)
-- Engine: InnoDB (full ACID compliance & foreign keys)
-- ============================================================

-- ─── 1. Users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  role          ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
  avatar        VARCHAR(50)  DEFAULT '🎓',
  bio           TEXT,
  major         VARCHAR(255),
  academic_year VARCHAR(50),
  gpa           DECIMAL(3,2),
  department    VARCHAR(255),
  office_hours  VARCHAR(255),
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2. Classes ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  name        VARCHAR(255) NOT NULL,
  subject     VARCHAR(255) NOT NULL,
  section     VARCHAR(100),
  grade_level VARCHAR(50),
  join_code   VARCHAR(10)  UNIQUE,
  teacher_id  VARCHAR(36)  NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_classes_teacher (teacher_id),
  INDEX idx_classes_subject (subject),
  INDEX idx_classes_join_code (join_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3. Class Enrollments ────────────────────────────────────
CREATE TABLE IF NOT EXISTS class_enrollments (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  class_id    VARCHAR(36)  NOT NULL,
  student_id  VARCHAR(36)  NOT NULL,
  enrolled_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (class_id, student_id),
  INDEX idx_enrollment_student (student_id),
  INDEX idx_enrollment_class (class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 4. Flashcard Decks ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS flashcard_decks (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  title       VARCHAR(255) NOT NULL,
  subject     VARCHAR(255) DEFAULT 'General',
  description TEXT,
  created_by  VARCHAR(36),
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_decks_creator (created_by),
  INDEX idx_decks_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 5. Flashcard Cards ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS flashcard_cards (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  deck_id     VARCHAR(36)  NOT NULL,
  question    TEXT         NOT NULL,
  answer      TEXT         NOT NULL,
  hint        TEXT,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  INDEX idx_cards_deck (deck_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 6. Flashcard Responses (Spaced Repetition SM-2) ─────────
CREATE TABLE IF NOT EXISTS flashcard_responses (
  id           VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  card_id      VARCHAR(36) NOT NULL,
  user_id      VARCHAR(36) NOT NULL,
  quality      INT         NOT NULL DEFAULT 3,
  ease_factor  DECIMAL(4,2) DEFAULT 2.50,
  `interval`   INT         DEFAULT 1,
  repetitions  INT         DEFAULT 0,
  next_review  TIMESTAMP   NULL,
  reviewed_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES flashcard_cards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_fc_user_card (user_id, card_id),
  INDEX idx_fc_next_review (user_id, next_review)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 7. Quizzes ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quizzes (
  id            VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  title         VARCHAR(255) NOT NULL,
  subject       VARCHAR(255) DEFAULT 'General',
  difficulty    VARCHAR(50)  DEFAULT 'Medium',
  time_limit    INT          DEFAULT 300,
  passing_score INT          DEFAULT 60,
  created_by    VARCHAR(36),
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_quizzes_subject (subject),
  INDEX idx_quizzes_creator (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 8. Quiz Questions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_questions (
  id             VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  quiz_id        VARCHAR(36) NOT NULL,
  question       TEXT        NOT NULL,
  options        JSON        NOT NULL,
  correct_answer INT         NOT NULL,
  explanation    TEXT,
  sort_order     INT         DEFAULT 0,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  INDEX idx_questions_quiz (quiz_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 9. Quiz Attempts ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id              VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  quiz_id         VARCHAR(36)  NOT NULL,
  user_id         VARCHAR(36)  NOT NULL,
  score           DECIMAL(5,2) DEFAULT 0,
  total_questions INT          DEFAULT 0,
  correct_count   INT          DEFAULT 0,
  mastery_level   VARCHAR(50),
  started_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  completed_at    TIMESTAMP    NULL,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)   ON DELETE CASCADE,
  INDEX idx_attempts_user_quiz (user_id, quiz_id),
  INDEX idx_attempts_completed (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 10. Quiz Answers ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_answers (
  id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  attempt_id      VARCHAR(36) NOT NULL,
  question_id     VARCHAR(36) NOT NULL,
  selected_answer INT,
  is_correct      BOOLEAN     DEFAULT FALSE,
  answered_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id)  REFERENCES quiz_attempts(id)  ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id)  ON DELETE CASCADE,
  INDEX idx_qa_attempt (attempt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 11. Study Plans ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_plans (
  id           VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  user_id      VARCHAR(36)  NOT NULL,
  title        VARCHAR(255) NOT NULL,
  goal         TEXT,
  total_weeks  INT          DEFAULT 4,
  current_week INT          DEFAULT 1,
  progress     INT          DEFAULT 0,
  next_topic   VARCHAR(255),
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_plans_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 12. Study Milestones ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_milestones (
  id           VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  plan_id      VARCHAR(36)  NOT NULL,
  week_number  INT          NOT NULL,
  title        VARCHAR(255) NOT NULL,
  topics       JSON,
  is_completed BOOLEAN      DEFAULT FALSE,
  completed_at TIMESTAMP    NULL,
  FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE CASCADE,
  INDEX idx_milestones_plan_week (plan_id, week_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 13. Teacher Notes ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teacher_notes (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  title       VARCHAR(255) NOT NULL,
  subject     VARCHAR(255) DEFAULT 'General',
  content     LONGTEXT,
  tags        JSON,
  author_id   VARCHAR(36),
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_notes_author (author_id),
  INDEX idx_notes_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 14. Tutor Chat Sessions ─────────────────────────────────
CREATE TABLE IF NOT EXISTS tutor_chats (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  user_id     VARCHAR(36)  NOT NULL,
  subject     VARCHAR(255) DEFAULT 'General Study',
  title       VARCHAR(255),
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_chats_user (user_id, updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 15. Tutor Messages ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS tutor_messages (
  id              VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  chat_id         VARCHAR(36)  NOT NULL,
  sender          ENUM('user', 'ai') NOT NULL,
  text            LONGTEXT     NOT NULL,
  web_references  JSON,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES tutor_chats(id) ON DELETE CASCADE,
  INDEX idx_messages_chat_time (chat_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 16. Announcements ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id          VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  class_id    VARCHAR(36) NULL,
  teacher_id  VARCHAR(36) NOT NULL,
  title       VARCHAR(255) NOT NULL,
  message     LONGTEXT NOT NULL,
  priority    ENUM('normal', 'important', 'urgent') DEFAULT 'normal',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_announcements_time (created_at DESC)
);

-- ============================================================
-- 📊 Analytical Views for MySQL Workbench
-- ============================================================

-- View: Class Summary with Enrolled Count & Teacher Name
CREATE OR REPLACE VIEW v_class_summary AS
SELECT 
  c.id AS class_id,
  c.name AS class_name,
  c.subject,
  c.section,
  c.grade_level,
  u.name AS teacher_name,
  u.email AS teacher_email,
  COUNT(ce.student_id) AS enrolled_students_count,
  c.created_at
FROM classes c
JOIN users u ON c.teacher_id = u.id
LEFT JOIN class_enrollments ce ON c.id = ce.class_id
GROUP BY c.id, u.id;

-- View: Quiz Overview with Question Count & Attempt Stats
CREATE OR REPLACE VIEW v_quiz_overview AS
SELECT 
  q.id AS quiz_id,
  q.title,
  q.subject,
  q.difficulty,
  q.time_limit,
  q.passing_score,
  u.name AS created_by_name,
  COUNT(DISTINCT qq.id) AS total_questions,
  COUNT(DISTINCT qa.id) AS total_attempts,
  ROUND(AVG(qa.score), 2) AS average_score
FROM quizzes q
LEFT JOIN users u ON q.created_by = u.id
LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
GROUP BY q.id, u.name;

-- View: Flashcard Deck Summary with Total Cards
CREATE OR REPLACE VIEW v_deck_summary AS
SELECT 
  d.id AS deck_id,
  d.title AS deck_title,
  d.subject,
  d.description,
  u.name AS creator_name,
  COUNT(c.id) AS card_count,
  d.created_at
FROM flashcard_decks d
LEFT JOIN users u ON d.created_by = u.id
LEFT JOIN flashcard_cards c ON d.id = c.deck_id
GROUP BY d.id, u.name;

-- View: Student Performance Dashboard
CREATE OR REPLACE VIEW v_student_performance AS
SELECT 
  u.id AS student_id,
  u.name AS student_name,
  u.email AS student_email,
  u.major,
  u.academic_year,
  u.gpa,
  COUNT(DISTINCT ce.class_id) AS enrolled_classes,
  COUNT(DISTINCT qa.id) AS quizzes_attempted,
  ROUND(COALESCE(AVG(qa.score), 0), 1) AS avg_quiz_score,
  COUNT(DISTINCT fr.id) AS flashcards_reviewed
FROM users u
LEFT JOIN class_enrollments ce ON u.id = ce.student_id
LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
LEFT JOIN flashcard_responses fr ON u.id = fr.user_id
WHERE u.role = 'student'
GROUP BY u.id;
