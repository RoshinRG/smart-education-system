import React, { useState, useEffect } from 'react';
import { studyPlanService } from '../services/studyPlanService.js';
import PlanGenerator from '../components/studyPlan/PlanGenerator.jsx';
import PlanTimeline from '../components/studyPlan/PlanTimeline.jsx';

export default function StudyPlanPage() {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setIsLoading(true);
    try {
      const data = await studyPlanService.getPlan();
      if (data?.plan) setPlan(data.plan);
    } catch {
      console.error('Failed to load plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMilestoneComplete = async (milestoneId) => {
    try {
      await studyPlanService.completeMilestone(milestoneId);
      // Optimistically update local state
      setPlan((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) =>
          m.id === milestoneId ? { ...m, isCompleted: true } : m
        ),
      }));
    } catch {
      console.error('Failed to mark milestone complete');
    }
  };

  if (isLoading) {
    return (
      <div className="study-plan-page">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading your study plan…</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="study-plan-page">
        <div className="page-header">
          <div>
            <h1>📅 Study Plan</h1>
            <p className="text-muted">AI-powered personalised roadmap</p>
          </div>
        </div>
        <PlanGenerator onPlanGenerated={setPlan} />
      </div>
    );
  }

  const progress = studyPlanService.calculateProgress(plan.milestones);
  const nextTopic = studyPlanService.getNextTopic(plan.milestones);

  return (
    <div className="study-plan-page">
      <div className="page-header">
        <div>
          <h1>📅 Your Study Plan</h1>
          <p className="text-muted">{plan.goal}</p>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => setPlan(null)}
        >
          ✨ New Plan
        </button>
      </div>

      {/* Progress overview */}
      <div className="plan-overview">
        <div className="plan-stat">
          <span className="plan-stat-value">{progress}%</span>
          <span className="plan-stat-label">Complete</span>
        </div>
        {nextTopic && (
          <div className="plan-stat">
            <span className="plan-stat-value next-topic">{nextTopic}</span>
            <span className="plan-stat-label">Up Next</span>
          </div>
        )}
        <div className="plan-stat">
          <span className="plan-stat-value">
            {plan.milestones?.filter((m) => m.isCompleted).length ?? 0} /&nbsp;
            {plan.milestones?.length ?? 0}
          </span>
          <span className="plan-stat-label">Milestones</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="plan-progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Week navigation */}
      <div className="week-nav">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setCurrentWeek((w) => Math.max(1, w - 1))}
          disabled={currentWeek === 1}
        >
          ← Prev Week
        </button>
        <span className="week-label">Week {currentWeek}</span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() =>
            setCurrentWeek((w) => Math.min(plan.milestones?.length || 1, w + 1))
          }
          disabled={currentWeek >= (plan.milestones?.length || 1)}
        >
          Next Week →
        </button>
      </div>

      <PlanTimeline
        milestones={plan.milestones}
        currentWeek={currentWeek}
        onComplete={handleMilestoneComplete}
      />
    </div>
  );
}
