import React, { useState } from 'react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

export default function QuizBuilder({ onSaveQuiz, onCancel }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState([
    {
      question: 'What is the time complexity of QuickSort in the average case?',
      options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
      correctAnswer: 1,
      explanation: 'Average case of QuickSort is O(n log n) with good pivot selection.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) return;

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        alert(`Question #${i + 1} needs text!`);
        return;
      }
      if (questions[i].options.some((opt) => !opt.trim())) {
        alert(`Question #${i + 1} has empty options!`);
        return;
      }
    }

    setLoading(true);
    try {
      await onSaveQuiz({
        title,
        subject,
        difficulty,
        questions,
      });
      setTitle('');
    } catch (err) {
      console.error('Failed to create quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="quiz-builder-card">
      <div className="card-header">
        <h3 className="card-title">❓ Quiz Creator</h3>
        <p className="card-subtitle">Design interactive multiple-choice quizzes with explanations for your students</p>
      </div>

      <form onSubmit={handleSubmit} className="quiz-builder-form">
        <div className="form-group-row">
          <div className="form-group flex-2">
            <label className="form-label" htmlFor="quiz-title">Quiz Title</label>
            <input
              id="quiz-title"
              type="text"
              className="form-input"
              placeholder="e.g. Data Structures Midterm Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label" htmlFor="quiz-subject">Subject</label>
            <select
              id="quiz-subject"
              className="form-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Math">Math</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="History">History</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label" htmlFor="quiz-difficulty">Difficulty</label>
            <select
              id="quiz-difficulty"
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="questions-section">
          <div className="section-header">
            <h4>Questions ({questions.length})</h4>
            <Button type="button" variant="secondary" size="sm" onClick={addQuestion}>
              ➕ Add Question
            </Button>
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-item-card">
              <div className="question-item-header">
                <span className="question-number-badge">Q{qIndex + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="delete-question-btn"
                    onClick={() => removeQuestion(qIndex)}
                    title="Delete question"
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Question Text</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Question ${qIndex + 1}...`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                  required
                />
              </div>

              <div className="options-grid">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="option-input-group">
                    <span className="option-label">{String.fromCharCode(65 + oIndex)}</span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      required
                    />
                    <label className="radio-correct">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswer === oIndex}
                        onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Explanation (optional)</label>
                <input
                  type="text"
                  className="form-input form-input-sm"
                  placeholder="Why is this the correct answer?"
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions mt-4">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" loading={loading}>
            ✨ Publish Quiz for Students
          </Button>
        </div>
      </form>
    </Card>
  );
}
