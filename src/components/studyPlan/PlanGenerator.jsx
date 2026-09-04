import React, { useState } from 'react';
import { studyPlanService } from '../../services/studyPlanService.js';

export default function PlanGenerator({ onPlanGenerated }) {
  const [goal, setGoal] = useState('');
  const [weakAreas, setWeakAreas] = useState('');
  const [hours, setHours] = useState(10);
  const [duration, setDuration] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePlan = async () => {
    if (!goal.trim() || !weakAreas.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const weakAreasArray = weakAreas
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);
      const plan = await studyPlanService.generatePlan(
        goal,
        weakAreasArray,
        hours,
        duration
      );
      onPlanGenerated?.(plan);
    } catch {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="plan-generator">
      <div className="generator-header">
        <div className="generator-icon">📅</div>
        <h2>Create Your Study Plan</h2>
        <p className="text-muted">
          Tell us your goals and we'll generate a personalised AI study plan.
        </p>
      </div>

      <div className="generator-form">
        <div className="form-group">
          <label htmlFor="pg-goal">What is your goal?</label>
          <input
            id="pg-goal"
            type="text"
            placeholder="e.g. Pass final exam, improve GPA"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pg-weak">Weak areas (comma-separated)</label>
          <textarea
            id="pg-weak"
            placeholder="e.g. Algebra, Trigonometry, Calculus"
            value={weakAreas}
            onChange={(e) => setWeakAreas(e.target.value)}
            disabled={isLoading}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pg-hours">Hours per week</label>
            <input
              id="pg-hours"
              type="number"
              min={1}
              max={40}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pg-duration">Duration (weeks)</label>
            <input
              id="pg-duration"
              type="number"
              min={1}
              max={26}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={isLoading}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="btn btn-primary btn-large"
          onClick={handleGeneratePlan}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-sm" /> Generating Plan…
            </>
          ) : (
            '✨ Generate Plan'
          )}
        </button>
      </div>
    </div>
  );
}
