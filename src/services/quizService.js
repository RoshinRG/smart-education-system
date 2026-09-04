import { apiClient } from './api.js';

class QuizService {
  async startQuiz(quizId, topic) {
    return apiClient.post('/quiz/start', {
      quizId,
      topic,
    });
  }

  async getQuestions(attemptId) {
    return apiClient.get(`/quiz/attempt/${attemptId}`);
  }

  async submitAnswer(attemptId, questionId, answer) {
    return apiClient.post('/quiz/answer', {
      attemptId,
      questionId,
      answer,
    });
  }

  async completeQuiz(attemptId) {
    return apiClient.post(`/quiz/complete/${attemptId}`, {});
  }

  async getResults(attemptId) {
    return apiClient.get(`/quiz/results/${attemptId}`);
  }

  async getQuizzes(subject = '') {
    const url = subject ? `/quiz/list?subject=${subject}` : '/quiz/list';
    return apiClient.get(url);
  }

  async getAttemptHistory() {
    return apiClient.get('/quiz/history');
  }

  async getConceptMastery() {
    return apiClient.get('/quiz/mastery');
  }

  // Calculate adaptive difficulty
  calculateDifficulty(currentScore, minDifficulty = 1, maxDifficulty = 5) {
    // Score-based difficulty adjustment
    // 0-40%: decrease difficulty
    // 40-60%: keep same
    // 60-100%: increase difficulty
    
    let nextDifficulty = 2.5; // default medium

    if (currentScore < 40) {
      nextDifficulty = Math.max(minDifficulty, 2.0);
    } else if (currentScore < 60) {
      nextDifficulty = 2.5;
    } else if (currentScore < 80) {
      nextDifficulty = 3.5;
    } else {
      nextDifficulty = Math.min(maxDifficulty, 4.5);
    }

    return nextDifficulty;
  }

  // Calculate mastery percentage
  calculateMastery(attempts = []) {
    if (attempts.length === 0) return 0;

    const recentAttempts = attempts.slice(-5); // Last 5 attempts
    const avgScore = recentAttempts.reduce((sum, att) => sum + att.score, 0) / recentAttempts.length;

    return Math.round(avgScore);
  }
}

export const quizService = new QuizService();
