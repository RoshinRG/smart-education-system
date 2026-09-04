import React from 'react';

export default function PlanTimeline({ milestones = [], currentWeek = 1 }) {
  if (milestones.length === 0) {
    return (
      <div className="empty-state">
        <p>No milestones yet.</p>
      </div>
    );
  }

  return (
    <div className="plan-timeline">
      <h3>Your Study Roadmap</h3>
      <div className="timeline">
        {milestones.map((milestone) => {
          const isCurrent = milestone.weekNumber === currentWeek;
          const isCompleted = milestone.isCompleted;

          return (
            <div
              key={milestone.id}
              className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="timeline-marker">
                <div className="marker-circle">
                  {isCompleted ? '✓' : milestone.weekNumber}
                </div>
                <div className="marker-line" />
              </div>

              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>{milestone.title}</h4>
                  {isCurrent && (
                    <span className="badge badge-current">Current Week</span>
                  )}
                  {isCompleted && (
                    <span className="badge badge-completed">✓ Done</span>
                  )}
                </div>

                <p className="milestone-week text-muted">Week {milestone.weekNumber}</p>
                <p className="milestone-description">{milestone.description}</p>

                {milestone.topics?.length > 0 && (
                  <div className="milestone-topics">
                    <strong>Topics:</strong>
                    <ul>
                      {milestone.topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
