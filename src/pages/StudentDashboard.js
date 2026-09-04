import { createElement as h, useState, useEffect } from '../utils/h.js';
import { appStore, useStore } from '../state/store.js';
import Card from '../components/common/Card.js';

export default function StudentDashboard() {
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const user = appStore.getState('user');
    setTotalPoints(user?.totalPoints || 0);
    setStreak(user?.streak || 0);
    setProgress(Math.round(Math.random() * 100));
  }, []);

  return h('div', { className: 'student-dashboard' }, [
    h('div', { className: 'dashboard-header' }, [
      h('h1', {}, 'Welcome back!'),
      h('p', {}, 'Here\'s your learning progress'),
    ]),

    h('div', { className: 'stats-grid' }, [
      h(Card, { title: 'Total Points' }, [
        h('div', { className: 'stat-value' }, totalPoints.toString()),
        h('p', { className: 'text-muted' }, 'Points earned'),
      ]),

      h(Card, { title: 'Study Streak' }, [
        h('div', { className: 'stat-value' }, streak.toString()),
        h('p', { className: 'text-muted' }, 'Days in a row'),
      ]),

      h(Card, { title: 'Overall Progress' }, [
        h('div', { className: 'stat-value' }, `${progress}%`),
        h('div', { className: 'progress-bar' }, [
          h('div', { className: 'progress-fill', style: `width: ${progress}%` }, []),
        ]),
      ]),
    ]),

    h('div', { className: 'dashboard-sections' }, [
      h(Card, { title: 'Recent Activities' }, [
        h('p', { className: 'text-muted' }, 'No activities yet. Start learning!'),
      ]),

      h(Card, { title: 'Quick Actions' }, [
        h('div', { className: 'action-buttons' }, [
          h('a', { href: '/tutor', className: 'btn btn-secondary' }, 'Ask Tutor'),
          h('a', { href: '/flashcards', className: 'btn btn-secondary' }, 'Study Cards'),
          h('a', { href: '/quiz', className: 'btn btn-secondary' }, 'Take Quiz'),
        ]),
      ]),
    ]),
  ]);
}
