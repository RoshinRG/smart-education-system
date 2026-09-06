import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { useAppStore } from '../../state/store.js';

const STUDENT_LINKS = [
  { to: '/', label: '🏠 Dashboard' },
  { to: '/quiz', label: '📝 Quizzes' },
  { to: '/flashcards', label: '🃏 Flashcards' },
  { to: '/tutor', label: '🤖 AI Tutor' },
  { to: '/study-plan', label: '📅 Study Plan' },
];

const TEACHER_LINKS = [
  { to: '/teacher', label: '📊 Teacher Hub' },
  { to: '/quiz', label: '📝 View Quizzes' },
  { to: '/flashcards', label: '🃏 Flashcards Studio' },
  { to: '/profile', label: '👤 Profile' },
];

export default function Navbar() {
  const user = useAppStore('user');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(null);

  const isTeacher = user?.role === 'teacher';
  const navLinks = isTeacher ? TEACHER_LINKS : STUDENT_LINKS;

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setDbConnected(data?.status === 'ok'))
      .catch(() => setDbConnected(false));
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate(isTeacher ? '/teacher' : '/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span className="brand-icon">{isTeacher ? '👨‍🏫' : '🎓'}</span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span className="brand-text">Smart Education</span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: isTeacher ? '#a855f7' : '#6366f1',
            }}
          >
            {isTeacher ? 'Teacher Studio' : 'Student Portal'}
          </span>
        </div>
      </div>

      {/* Desktop links */}
      <div className="navbar-links">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/' || to === '/teacher'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
        {isTeacher && (
          <NavLink
            to="/"
            className="nav-link"
            style={{
              fontSize: '0.75rem',
              opacity: 0.8,
              border: '1px dashed rgba(255, 255, 255, 0.25)',
              borderRadius: '6px',
              padding: '3px 8px',
            }}
            title="Preview student dashboard"
          >
            👁️ Student View
          </NavLink>
        )}
      </div>

      <div className="navbar-right">
        {dbConnected !== null && (
          <span
            title={dbConnected ? 'Connected to MySQL Database via Backend API' : 'Running in Offline / Mock Mode'}
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '3px 9px',
              borderRadius: '12px',
              background: dbConnected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: dbConnected ? '#22c55e' : '#f59e0b',
              border: `1px solid ${dbConnected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: dbConnected ? '#22c55e' : '#f59e0b',
                boxShadow: dbConnected ? '0 0 6px #22c55e' : 'none',
              }}
            />
            {dbConnected ? 'MySQL Connected' : 'Offline Mode'}
          </span>
        )}

        {user && (
          <div
            className="user-badge"
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer' }}
            title="Click to view & edit profile"
          >
            <span className="user-avatar">
              {user.avatar || (user.name || user.email || 'U')[0].toUpperCase()}
            </span>
            <span className="user-name">{user.name || user.email}</span>
            <span
              style={{
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '8px',
                background: isTeacher ? 'rgba(168, 85, 247, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                color: isTeacher ? '#c084fc' : '#a5b4fc',
                fontWeight: '600',
              }}
            >
              {isTeacher ? 'Teacher' : 'Student'}
            </span>
          </div>
        )}
        <button className="btn btn-ghost" onClick={handleLogout}>
          Sign Out
        </button>

        {/* Hamburger for mobile */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="navbar-mobile-menu" onClick={() => setMenuOpen(false)}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/' || to === '/teacher'}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          {isTeacher && (
            <NavLink
              to="/"
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              👁️ Preview Student View
            </NavLink>
          )}
          <button className="btn btn-ghost mobile-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
