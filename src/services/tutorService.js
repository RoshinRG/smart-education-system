import { apiClient } from './api.js';

class TutorService {
  async createChat(subject, topic = '') {
    return apiClient.post('/tutor/chat/create', {
      subject,
      topic,
    });
  }

  async sendMessage(chatId, message, enableWebSearch = true) {
    return apiClient.post('/tutor/chat/message', {
      chatId,
      message,
      enableWebSearch,
    });
  }

  async searchWebReferences(query, subject = '') {
    return apiClient.post('/tutor/web-references', {
      query,
      subject,
    });
  }

  async getChatHistory(chatId) {
    return apiClient.get(`/tutor/chat/${chatId}`);
  }

  async listChats() {
    return apiClient.get('/tutor/chats');
  }

  async deleteChat(chatId) {
    return apiClient.delete(`/tutor/chat/${chatId}`);
  }

  async reviewCode(code, language, task, chatId) {
    return apiClient.post('/tutor/review-code', {
      code,
      language,
      task,
      chatId,
    });
  }

  async askQuestion(subject, question, gradeLevel) {
    return apiClient.post('/tutor/ask', {
      subject,
      question,
      gradeLevel,
    });
  }

  async explainConcept(topic, gradeLevel, context = '') {
    return apiClient.post('/tutor/explain', {
      topic,
      gradeLevel,
      context,
    });
  }

  async getConceptExamples(topic) {
    return apiClient.get(`/tutor/examples/${topic}`);
  }
}

export const tutorService = new TutorService();
