import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quizService.js';
import QuizWindow from '../components/quiz/QuizWindow.jsx';
import Card from '../components/common/Card.jsx';

const SUBJECT_COLORS = {
  Math: '#6366f1',
  Science: '#10b981',
  English: '#f59e0b',
  History: '#ef4444',
  default: '#6b7280',
};

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeAttempt, setActiveAttempt] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'teacher' | 'practice'

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setIsLoading(true);
    try {
      const data = await quizService.getQuizzes();
      const list = Array.isArray(data) ? data : (data?.quizzes || []);
      setQuizzes(list);
    } catch {
      console.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async (quiz) => {
    try {
      const attempt = await quizService.startQuiz(quiz.id, quiz.subject);
      setActiveAttempt(attempt);
      setQuizResult(null);
    } catch {
      console.error('Failed to start quiz');
    }
  };

  const handleQuizComplete = (results) => {
    setActiveAttempt(null);
    setQuizResult(results);
  };

  const filteredQuizzes = quizzes.filter((q) => {
    const isTeacherQuiz = q.creatorRole === 'teacher' || q.createdByName;
    if (tabFilter === 'teacher' && !isTeacherQuiz) return false;
    if (tabFilter === 'practice' && isTeacherQuiz) return false;

    if (!filter) return true;
    return (
      q.subject?.toLowerCase().includes(filter.toLowerCase()) ||
      q.title?.toLowerCase().includes(filter.toLowerCase())
    );
  });

  // Quiz in progress
  if (activeAttempt) {
    return (
      <div className="quiz-page">
        <button
          className="btn btn-ghost back-btn"
          onClick={() => setActiveAttempt(null)}
        >
          ← Exit Quiz
        </button>
        <QuizWindow
          attemptId={activeAttempt.id}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  // Results screen
  if (quizResult) {
    return (
      <div className="quiz-page quiz-results">
        <Card className="results-card">
          <h2>🎉 Quiz Complete!</h2>
          <div className="results-score">
            <span className="score-value">{quizResult.score ?? 0}%</span>
            <span className="score-label">Final Score</span>
          </div>
          <div className="results-stats">
            <div>
              <strong>{quizResult.correctCount ?? 0}</strong>
              <span>Correct</span>
            </div>
            <div>
              <strong>{(quizResult.totalQuestions ?? 0) - (quizResult.correctCount ?? 0)}</strong>
              <span>Incorrect</span>
            </div>
            <div>
              <strong>{quizResult.masteryLevel ?? 'Novice'}</strong>
              <span>Mastery</span>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setQuizResult(null);
              loadQuizzes();
            }}
          >
            ← Back to Quizzes
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="page-header">
        <div>
          <h1>📝 Quizzes & Assessments</h1>
          <p className="text-muted">Explore teacher-assigned tests and interactive practice quizzes</p>
        </div>
      </div>

      {/* Filter & Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${tabFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTabFilter('all')}
          >
            All Quizzes ({quizzes.length})
          </button>
          <button
            className={`btn btn-sm ${tabFilter === 'teacher' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTabFilter('teacher')}
          >
            👨‍🏫 Teacher Assigned ({quizzes.filter(q => q.creatorRole === 'teacher' || q.createdByName).length})
          </button>
          <button
            className={`btn btn-sm ${tabFilter === 'practice' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTabFilter('practice')}
          >
            🤖 Practice Quizzes
          </button>
        </div>

        <div className="quiz-filter" style={{ marginBottom: 0 }}>
          <input
            type="text"
            placeholder="🔍 Search quizzes by topic…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading quizzes from MySQL…</p>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="empty-state-large">
          <div className="empty-icon">📝</div>
          <h3>{filter ? 'No matching quizzes' : 'No quizzes available in this category'}</h3>
          <p className="text-muted">Check back soon — new quizzes published by your teachers will appear here!</p>
        </div>
      ) : (
        <div className="quizzes-grid">
          {filteredQuizzes.map((quiz) => {
            const color = SUBJECT_COLORS[quiz.subject] || SUBJECT_COLORS.default;
            const isTeacherQuiz = quiz.creatorRole === 'teacher' || quiz.createdByName;
            const questionCount = quiz.questionsCount ?? quiz.questionCount ?? 5;

            return (
              <Card key={quiz.id} className="quiz-card" hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div
                    className="quiz-subject-tag"
                    style={{ backgroundColor: color, margin: 0 }}
                  >
                    {quiz.subject}
                  </div>
                  {isTeacherQuiz && (
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
                      👨‍🏫 Teacher: {quiz.createdByName || 'Faculty'}
                    </span>
                  )}
                </div>

                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="text-muted quiz-desc">{quiz.description || `Assessment for ${quiz.subject} • Passing score: ${quiz.passing_score || 60}%`}</p>

                <div className="quiz-meta">
                  <span>📊 {questionCount} questions</span>
                  <span>⚡ {quiz.difficulty || 'Adaptive'}</span>
                  {quiz.time_limit && <span>⏱ {Math.round(quiz.time_limit / 60)} min</span>}
                </div>

                <button
                  className="btn btn-primary btn-full"
                  onClick={() => handleStartQuiz(quiz)}
                >
                  Start Quiz →
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
