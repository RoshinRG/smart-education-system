import { createElement as h, useState, useEffect } from '../utils/h.js';
import { studyPlanService } from '../services/studyPlanService.js';
import PlanGenerator from '../components/studyPlan/PlanGenerator.js';
import PlanTimeline from '../components/studyPlan/PlanTimeline.js';
import Card from '../components/common/Card.js';

export default function StudyPlanPage() {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const data = await studyPlanService.getPlan();
      if (data.plan) {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error('Failed to load plan');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return h('div', { className: 'loading' }, 'Loading...');
  }

  if (!plan) {
    return h('div', { className: 'study-plan-page' }, [
      h(PlanGenerator, { onPlanGenerated: setPlan }),
    ]);
  }

  return h('div', { className: 'study-plan-page' }, [
    h('div', { className: 'page-header' }, [
      h('h1', {}, 'Your Study Plan'),
      h('div', { className: 'plan-progress' }, [
        h('div', { className: 'progress-bar' }, [
          h('div', {
            className: 'progress-fill',
            style: `width: ${studyPlanService.calculateProgress(plan.milestones)}%`,
          }, []),
        ]),
        h('p', {}, `${studyPlanService.calculateProgress(plan.milestones)}% Complete`),
      ]),
    ]),

    h(PlanTimeline, { milestones: plan.milestones }),

    h('div', { className: 'plan-actions' }, [
      h('button', {
        className: 'btn btn-secondary',
        onClick: () => setPlan(null),
      }, 'Create New Plan'),
    ]),
  ]);
}
