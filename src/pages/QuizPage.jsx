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

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setIsLoading(true);
    try {
      const data = await quizService.getQuizzes();
      setQuizzes(data.quizzes || []);
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

  const filteredQuizzes = filter
    ? quizzes.filter((q) =>
        q.subject?.toLowerCase().includes(filter.toLowerCase()) ||
        q.title?.toLowerCase().includes(filter.toLowerCase())
      )
    : quizzes;

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
        <div className="results-card">
          <div className="results-icon">🎉</div>
          <h2>Quiz Complete!</h2>
          <div className="results-score">
            <span className="score-number">{quizResult.score ?? 0}%</span>
            <span className="score-label">Final Score</span>
          </div>
          {quizResult.correctCount !== undefined && (
            <p className="results-detail">
              {quizResult.correctCount} / {quizResult.totalQuestions} correct
            </p>
          )}
          <div className="results-actions">
            <button className="btn btn-primary" onClick={loadQuizzes}>
              Try Another Quiz
            </button>
            <button className="btn btn-ghost" onClick={() => setQuizResult(null)}>
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="page-header">
        <div>
          <h1>📝 Quizzes</h1>
          <p className="text-muted">Test your knowledge with adaptive questions</p>
        </div>
      </div>

      {/* Filter */}
      <div className="quiz-filter">
        <input
          type="text"
          placeholder="Filter by subject or title…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading quizzes…</p>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="empty-state-large">
          <div className="empty-icon">📝</div>
          <h3>{filter ? 'No matching quizzes' : 'No quizzes available'}</h3>
          <p className="text-muted">Check back soon — new quizzes are added regularly.</p>
        </div>
      ) : (
        <div className="quizzes-grid">
          {filteredQuizzes.map((quiz) => {
            const color = SUBJECT_COLORS[quiz.subject] || SUBJECT_COLORS.default;
            return (
              <Card key={quiz.id} className="quiz-card" hoverable>
                <div
                  className="quiz-subject-tag"
                  style={{ backgroundColor: color }}
                >
                  {quiz.subject}
                </div>
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="text-muted quiz-desc">{quiz.description}</p>
                <div className="quiz-meta">
                  <span>📊 {quiz.questionCount ?? '?'} questions</span>
                  {quiz.duration && <span>⏱ {quiz.duration} min</span>}
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
