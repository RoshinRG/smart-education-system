import { createElement as h, useState, useEffect } from '../../utils/h.js';
import { quizService } from '../../services/quizService.js';

export default function QuizWindow({ attemptId, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuestion();
  }, [attemptId]);

  const loadQuestion = async () => {
    setIsLoading(true);
    try {
      const data = await quizService.getQuestions(attemptId);
      setCurrentQuestion(data.currentQuestion);
      setScore(data.score || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load question');
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

      setAnswers((prev) => [...prev, { questionId: currentQuestion.id, answer: selectedAnswer }]);
      setScore(response.score || 0);

      if (response.isComplete) {
        const results = await quizService.getResults(attemptId);
        onComplete?.(results);
      } else {
        setCurrentQuestion(response.nextQuestion);
        setSelectedAnswer('');
      }
    } catch (err) {
      setError('Failed to submit answer');
    }
  };

  if (isLoading) return h('div', { className: 'loading' }, 'Loading question...');

  if (!currentQuestion) {
    return h('div', { className: 'empty-state' }, h('p', {}, 'Quiz complete!'));
  }

  return h('div', { className: 'quiz-window' }, [
    h('div', { className: 'quiz-header' }, [
      h('div', { className: 'score-badge' }, `Score: ${score}%`),
      h('div', { className: 'difficulty-badge' }, 
        `Difficulty: ${(currentQuestion.difficulty || 2.5).toFixed(1)}/5`
      ),
    ]),

    h('div', { className: 'quiz-content' }, [
      h('h3', {}, currentQuestion.text),

      currentQuestion.type === 'mcq'
        ? h('div', { className: 'options' }, [
            currentQuestion.options.map((option, idx) =>
              h('label', { className: 'option' }, [
                h('input', {
                  type: 'radio',
                  name: 'answer',
                  value: option,
                  checked: selectedAnswer === option,
                  onChange: (e) => setSelectedAnswer(e.target.value),
                }),
                h('span', {}, option),
              ])
            ),
          ])
        : h('textarea', {
            className: 'answer-input',
            placeholder: 'Type your answer here...',
            value: selectedAnswer,
            onInput: (e) => setSelectedAnswer(e.target.value),
          }),

      error && h('div', { className: 'error-message' }, error),
    ]),

    h('div', { className: 'quiz-actions' }, [
      h('button', {
        className: 'btn btn-primary',
        onClick: handleSubmitAnswer,
        disabled: !selectedAnswer,
      }, 'Submit Answer'),
    ]),
  ]);
}
