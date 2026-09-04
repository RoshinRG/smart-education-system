import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quizService.js';

export default function QuizWindow({ attemptId, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null); // { correct, explanation }

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  const loadQuestion = async () => {
    setIsLoading(true);
    try {
      const data = await quizService.getQuestions(attemptId);
      setCurrentQuestion(data.currentQuestion);
      setScore(data.score || 0);
      setError(null);
    } catch {
      setError('Failed to load question. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return;

    try {
      const response = await quizService.submitAnswer(
        attemptId,
        currentQuestion.id,
        selectedAnswer
      );

      setAnswers((prev) => [
        ...prev,
        { questionId: currentQuestion.id, answer: selectedAnswer },
      ]);
      setScore(response.score || 0);

      if (response.isComplete) {
        const results = await quizService.getResults(attemptId);
        onComplete?.(results);
      } else {
        // Brief feedback before advancing
        setShowFeedback({
          correct: response.isCorrect,
          explanation: response.explanation,
        });
        setTimeout(() => {
          setCurrentQuestion(response.nextQuestion);
          setSelectedAnswer('');
          setShowFeedback(null);
        }, 1500);
      }
    } catch {
      setError('Failed to submit answer.');
    }
  };

  if (isLoading) {
    return (
      <div className="quiz-loading">
        <div className="spinner" />
        <p>Loading question…</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎉</div>
        <h3>Quiz Complete!</h3>
        <p>Final Score: <strong>{score}%</strong></p>
      </div>
    );
  }

  return (
    <div className="quiz-window">
      {/* Header */}
      <div className="quiz-header">
        <div className="score-badge">Score: {score}%</div>
        <div className="difficulty-badge">
          Difficulty: {(currentQuestion.difficulty || 2.5).toFixed(1)} / 5
        </div>
        <div className="question-counter">
          Q{answers.length + 1}
        </div>
      </div>

      {/* Question */}
      <div className="quiz-content">
        <h3 className="question-text">{currentQuestion.text}</h3>

        {currentQuestion.type === 'mcq' ? (
          <div className="options">
            {currentQuestion.options?.map((option, idx) => (
              <label
                key={idx}
                className={`option ${selectedAnswer === option ? 'selected' : ''} ${
                  showFeedback
                    ? option === currentQuestion.correctAnswer
                      ? 'correct'
                      : selectedAnswer === option
                      ? 'incorrect'
                      : ''
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => !showFeedback && setSelectedAnswer(e.target.value)}
                  disabled={!!showFeedback}
                />
                <span className="option-letter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            className="answer-input"
            placeholder="Type your answer here…"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            rows={4}
            disabled={!!showFeedback}
          />
        )}

        {showFeedback && (
          <div className={`feedback-banner ${showFeedback.correct ? 'correct' : 'incorrect'}`}>
            {showFeedback.correct ? '✅ Correct!' : '❌ Not quite.'}
            {showFeedback.explanation && (
              <p className="feedback-explanation">{showFeedback.explanation}</p>
            )}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Actions */}
      <div className="quiz-actions">
        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmitAnswer}
          disabled={!selectedAnswer || !!showFeedback}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
