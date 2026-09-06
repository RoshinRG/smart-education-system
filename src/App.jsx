import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { appStore } from './state/store.js';
import { authService } from './services/authService.js';

import Navbar from './components/common/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import TutorPage from './pages/TutorPage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import StudyPlanPage from './pages/StudyPlanPage.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const isAuthenticated = appStore.getState('isAuthenticated');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Teacher-only protected route
function TeacherRoute({ children }) {
  const isAuthenticated = appStore.getState('isAuthenticated');
  const user = appStore.getState('user');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'teacher') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    appStore.getState('isAuthenticated')
  );

  useEffect(() => {
    // Sync auth state to component
    const unsub = appStore.subscribe('isAuthenticated', (val) => {
      setIsAuthenticated(val);
    });
    return unsub;
  }, []);

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? 'main-content' : 'main-content-full'}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <TeacherRoute>
                <TeacherDashboard />
              </TeacherRoute>
            }
          />
          <Route
            path="/tutor"
            element={
              <ProtectedRoute>
                <TutorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flashcards"
            element={
              <ProtectedRoute>
                <FlashcardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-plan"
            element={
              <ProtectedRoute>
                <StudyPlanPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
