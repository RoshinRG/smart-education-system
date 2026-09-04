import { createElement as h, useState, useEffect } from '../utils/h.js';
import { quizService } from '../services/quizService.js';
import QuizWindow from '../components/quiz/QuizWindow.js';
import Card from '../components/common/Card.js';

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeAttempt, setActiveAttempt] = useState(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await quizService.getQuizzes();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      console.error('Failed to load quizzes');
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      const attempt = await quizService.startQuiz(quizId);
      setActiveAttempt(attempt);
    } catch (err) {
      console.error('Failed to start quiz');
    }
  };

  const handleQuizComplete = () => {
    setActiveAttempt(null);
    loadQuizzes();
  };

  if (activeAttempt) {
    return h('div', { className: 'quiz-page' }, [
      h(QuizWindow, {
        attemptId: activeAttempt.id,
        onComplete: handleQuizComplete,
      }),
    ]);
  }

  return h('div', { className: 'quiz-page' }, [
    h('div', { className: 'page-header' }, [
      h('h1', {}, 'Quizzes'),
      h('p', {}, 'Test your knowledge with adaptive questions'),
    ]),

    h('div', { className: 'quizzes-list' }, [
      quizzes.length === 0
        ? h(Card, { title: 'No Quizzes Available' }, [
            h('p', {}, 'Check back soon!'),
          ])
        : quizzes.map((quiz) =>
            h(Card, {
              key: quiz.id,
              title: quiz.title,
              className: 'quiz-card',
            }, [
              h('p', {}, quiz.description),
              h('div', { className: 'quiz-meta' }, [
                h('span', {}, `${quiz.questionCount} questions`),
                h('span', {}, quiz.subject),
              ]),
              h('button', {
                className: 'btn btn-primary',
                onClick: () => handleStartQuiz(quiz.id),
              }, 'Start Quiz'),
            ])
          ),
    ]),
  ]);
}
