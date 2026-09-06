import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup extra fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let loggedUser;
      if (tab === 'login') {
        loggedUser = await authService.login(email, password);
      } else {
        if (!name) { setError('Please enter your name.'); setIsLoading(false); return; }
        loggedUser = await authService.signup(email, password, name, role);
      }
      
      if (loggedUser?.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || (tab === 'login' ? 'Login failed.' : 'Sign-up failed.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      <div className="auth-container">
        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand-icon">🎓</span>
          <h1 className="auth-brand-name">Smart Education</h1>
          <p className="auth-brand-tagline">AI-powered learning, personalised for you</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(null); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setError(null); }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {tab === 'signup' && (
            <>
              <div className="form-group">
                <label htmlFor="auth-name">Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="auth-role">I am a…</label>
                <select
                  id="auth-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-large btn-full"
            disabled={isLoading}
          >
            {isLoading
              ? (tab === 'login' ? 'Signing in…' : 'Creating account…')
              : (tab === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
