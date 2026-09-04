import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { useAppStore } from '../../state/store.js';

const NAV_LINKS = [
  { to: '/', label: '🏠 Dashboard' },
  { to: '/teacher', label: '👨‍🏫 Teacher Hub' },
  { to: '/tutor', label: '🤖 Tutor' },
  { to: '/flashcards', label: '🃏 Flashcards' },
  { to: '/quiz', label: '📝 Quiz' },
  { to: '/study-plan', label: '📅 Study Plan' },
];

export default function Navbar() {
  const user = useAppStore('user');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <span className="brand-icon">🎓</span>
        <span className="brand-text">Smart Education</span>
      </div>

      {/* Desktop links */}
      <div className="navbar-links">
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <div className="navbar-right">
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
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <button className="btn btn-ghost mobile-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
