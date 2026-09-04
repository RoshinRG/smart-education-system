import { apiClient } from './api.js';

class StudyPlanService {
  async generatePlan(goal, weakAreas, availableHours, duration) {
    return apiClient.post('/study-plan/generate', {
      goal,
      weakAreas,
      availableHours,
      duration,
    });
  }

  async getPlan() {
    return apiClient.get('/study-plan/current');
  }

  async updatePlan(planId, updates) {
    return apiClient.put(`/study-plan/${planId}`, updates);
  }

  async getMilestones() {
    return apiClient.get('/study-plan/milestones');
  }

  async completeMilestone(milestoneId) {
    return apiClient.post(`/study-plan/milestone/${milestoneId}/complete`, {});
  }

  async getProgress() {
    return apiClient.get('/study-plan/progress');
  }

  async regeneratePlan(planId) {
    return apiClient.post(`/study-plan/${planId}/regenerate`, {});
  }

  async updateMilestone(milestoneId, updates) {
    return apiClient.put(`/study-plan/milestone/${milestoneId}`, updates);
  }

  // Calculate progress percentage
  calculateProgress(milestones = []) {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter((m) => m.isCompleted).length;
    return Math.round((completed / milestones.length) * 100);
  }

  // Get recommended next topic
  getNextTopic(milestones = []) {
    const incomplete = milestones.find((m) => !m.isCompleted);
    return incomplete ? incomplete.topics[0] : null;
  }

  // Check if on track
  isOnTrack(currentWeek, milestones = []) {
    const targetMilestones = milestones.filter((m) => m.weekNumber <= currentWeek);
    const completedMilestones = targetMilestones.filter((m) => m.isCompleted);
    return completedMilestones.length >= targetMilestones.length * 0.8; // 80% on track
  }
}

export const studyPlanService = new StudyPlanService();
