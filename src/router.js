import { createElement as h } from './utils/h.js';
import { appStore } from './state/store.js';

// Import pages
import LoginPage from './pages/LoginPage.js';
import StudentDashboard from './pages/StudentDashboard.js';
import TutorPage from './pages/TutorPage.js';
import FlashcardsPage from './pages/FlashcardsPage.js';
import QuizPage from './pages/QuizPage.js';
import StudyPlanPage from './pages/StudyPlanPage.js';

const routes = {
  '/': StudentDashboard,
  '/login': LoginPage,
  '/tutor': TutorPage,
  '/flashcards': FlashcardsPage,
  '/quiz': QuizPage,
  '/study-plan': StudyPlanPage,
};

export function navigate(path) {
  window.history.pushState({}, '', path);
  render();
}

export function render() {
  const path = window.location.pathname || '/';
  const Page = routes[path] || (() => h('div', {}, '404 Not Found'));
  
  const isAuthenticated = appStore.getState('isAuthenticated');
  
  if (!isAuthenticated && path !== '/login') {
    navigate('/login');
    return;
  }

  const root = document.getElementById('app');
  root.innerHTML = '';
  root.appendChild(h(Page, {}));
}

// Handle browser back/forward
window.addEventListener('popstate', render);

// Initial render
render();
