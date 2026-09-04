import { createElement as h } from '../../utils/h.js';

export default function PlanTimeline({ milestones = [], currentWeek = 1 }) {
  return h('div', { className: 'plan-timeline' }, [
    h('h3', {}, 'Your Study Roadmap'),

    h('div', { className: 'timeline' }, [
      milestones.map((milestone) =>
        h('div', {
          key: milestone.id,
          className: `timeline-item ${milestone.isCompleted ? 'completed' : ''} ${
            milestone.weekNumber === currentWeek ? 'current' : ''
          }`,
        }, [
          h('div', { className: 'timeline-marker' }, [
            h('div', { className: 'marker-circle' }, milestone.weekNumber),
          ]),
          h('div', { className: 'timeline-content' }, [
            h('h4', {}, milestone.title),
            h('p', { className: 'text-muted' }, `Week ${milestone.weekNumber}`),
            h('p', {}, milestone.description),
            milestone.topics.length > 0 && h('div', { className: 'topics' }, [
              h('strong', {}, 'Topics:'),
              h('ul', {}, [
                milestone.topics.map((topic) =>
                  h('li', { key: topic }, topic)
                ),
              ]),
            ]),
            milestone.isCompleted && h('span', { className: 'completed-badge' }, '✓ Completed'),
          ]),
        ])
      ),
    ]),
  ]);
}
