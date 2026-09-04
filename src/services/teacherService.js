import { apiClient } from './api.js';

class TeacherService {
  async createClass(name, subject, section, gradeLevel) {
    return apiClient.post('/teacher/class', {
      name,
      subject,
      section,
      gradeLevel,
    });
  }

  async getClasses() {
    return apiClient.get('/teacher/classes');
  }

  async getClass(classId) {
    return apiClient.get(`/teacher/class/${classId}`);
  }

  async getStudents(classId = 'c1') {
    return apiClient.get(`/teacher/class/${classId}/students`);
  }

  async getAssignments(classId = 'c1') {
    return apiClient.get(`/teacher/class/${classId}/assignments`);
  }

  async createAssignment(classId, title, description, type, dueDate) {
    return apiClient.post('/teacher/assignment', {
      classId,
      title,
      description,
      type,
      dueDate,
    });
  }

  async gradeSubmission(submissionId, score, feedback) {
    return apiClient.put(`/teacher/submission/${submissionId}/grade`, {
      score,
      feedback,
    });
  }

  async getStudentProgress(classId, studentId) {
    return apiClient.get(`/teacher/class/${classId}/student/${studentId}/progress`);
  }

  async getClassAnalytics(classId = 'c1') {
    return apiClient.get(`/teacher/class/${classId}/analytics`);
  }

  async identifyAtRiskStudents(classId = 'c1') {
    return apiClient.get(`/teacher/class/${classId}/at-risk`);
  }

  // --- Notes Management ---
  async getNotes() {
    return apiClient.get('/teacher/notes');
  }

  async createNote(title, subject, content, tags = []) {
    return apiClient.post('/teacher/note/create', {
      title,
      subject,
      content,
      tags,
    });
  }

  async deleteNote(noteId) {
    return apiClient.delete(`/teacher/note/${noteId}`);
  }

  // --- Teacher Quiz Creator ---
  async createQuiz(title, subject, difficulty, questions = []) {
    return apiClient.post('/teacher/quiz/create', {
      title,
      subject,
      difficulty,
      questions,
    });
  }

  // --- Teacher Flashcard Creator ---
  async createClassDeck(title, subject, description, cards = []) {
    return apiClient.post('/teacher/flashcards/create', {
      title,
      subject,
      description,
      cards,
    });
  }

  // --- AI Lesson Plan Generator ---
  async generateLessonPlan(objective, subject, gradeLevel, duration) {
    return apiClient.post('/teacher/lesson-plan', {
      objective,
      subject,
      gradeLevel,
      duration,
    });
  }

  async saveLessonPlan(title, content, subject, gradeLevel) {
    return apiClient.post('/teacher/lesson-plan/save', {
      title,
      content,
      subject,
      gradeLevel,
    });
  }

  async getLessonPlans() {
    return apiClient.get('/teacher/lesson-plans');
  }

  // Calculate class average
  calculateClassAverage(students = []) {
    if (students.length === 0) return 0;
    const sum = students.reduce((acc, s) => acc + (s.avgScore || 0), 0);
    return (sum / students.length).toFixed(1);
  }

  // Identify struggling students (score < 60%)
  getStrugglingStudents(students = []) {
    return students.filter((s) => (s.avgScore || 0) < 60);
  }

  // Calculate attendance rate
  calculateAttendanceRate(attendanceRecords = []) {
    if (attendanceRecords.length === 0) return 100;
    const present = attendanceRecords.filter((r) => r.present).length;
    return Math.round((present / attendanceRecords.length) * 100);
  }
}

export const teacherService = new TeacherService();
