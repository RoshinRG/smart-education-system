import { createElement as h, useState } from '../../utils/h.js';
import { studyPlanService } from '../../services/studyPlanService.js';

export default function PlanGenerator({ onPlanGenerated }) {
  const [goal, setGoal] = useState('');
  const [weakAreas, setWeakAreas] = useState('');
  const [hours, setHours] = useState(10);
  const [duration, setDuration] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePlan = async () => {
    if (!goal || !weakAreas) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const weakAreasArray = weakAreas.split(',').map((a) => a.trim());
      const plan = await studyPlanService.generatePlan(goal, weakAreasArray, hours, duration);
      onPlanGenerated?.(plan);
    } catch (err) {
      setError('Failed to generate plan');
    } finally {
      setIsLoading(false);
    }
  };

  return h('div', { className: 'plan-generator' }, [
    h('h2', {}, 'Create Your Study Plan'),

    h('div', { className: 'form-group' }, [
      h('label', {}, 'What is your goal?'),
      h('input', {
        type: 'text',
        placeholder: 'e.g., Pass final exam, improve GPA',
        value: goal,
        onInput: (e) => setGoal(e.target.value),
      }),
    ]),

    h('div', { className: 'form-group' }, [
      h('label', {}, 'Weak areas (comma-separated)'),
      h('textarea', {
        placeholder: 'e.g., Algebra, Trigonometry, Calculus',
        value: weakAreas,
        onInput: (e) => setWeakAreas(e.target.value),
      }),
    ]),

    h('div', { className: 'form-row' }, [
      h('div', { className: 'form-group' }, [
        h('label', {}, 'Hours per week'),
        h('input', {
          type: 'number',
          min: 1,
          max: 40,
          value: hours,
          onInput: (e) => setHours(Number(e.target.value)),
        }),
      ]),

      h('div', { className: 'form-group' }, [
        h('label', {}, 'Duration (weeks)'),
        h('input', {
          type: 'number',
          min: 1,
          max: 26,
          value: duration,
          onInput: (e) => setDuration(Number(e.target.value)),
        }),
      ]),
    ]),

    error && h('div', { className: 'error-message' }, error),

    h('button', {
      className: 'btn btn-primary btn-large',
      onClick: handleGeneratePlan,
      disabled: isLoading,
    }, isLoading ? 'Generating...' : 'Generate Plan'),
  ]);
}
