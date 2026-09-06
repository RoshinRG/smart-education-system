import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../state/store.js';
import Card from '../components/common/Card.jsx';
import Modal from '../components/common/Modal.jsx';
import { teacherService } from '../services/teacherService.js';
import { quizService } from '../services/quizService.js';
import { flashcardService } from '../services/flashcardService.js';

import { apiClient } from '../services/api.js';

const QUICK_ACTIONS = [
  { to: '/tutor', icon: '🤖', label: 'Ask AI Tutor', desc: 'Get personalized help', color: '#6366f1' },
  { to: '/flashcards', icon: '🃏', label: 'Study Flashcards', desc: 'SM-2 spaced review', color: '#10b981' },
  { to: '/quiz', icon: '📝', label: 'Take Quizzes', desc: 'Teacher & practice tests', color: '#f59e0b' },
  { to: '/study-plan', icon: '📅', label: 'My Study Plan', desc: 'AI-generated roadmap', color: '#3b82f6' },
];

export default function StudentDashboard() {
  const user = useAppStore('user');
  const [progress, setProgress] = useState(68);
  const [notes, setNotes] = useState([]);
  const [teacherQuizzes, setTeacherQuizzes] = useState([]);
  const [teacherDecks, setTeacherDecks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  // Class Join Code Modal state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinStatus, setJoinStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      const [teacherNotes, quizData, deckData, annData] = await Promise.all([
        teacherService.getNotes().catch(() => []),
        quizService.getQuizzes().catch(() => []),
        flashcardService.getDecks().catch(() => []),
        apiClient.get('/auth/announcements').catch(() => []),
      ]);

      setNotes(teacherNotes || []);

      const qList = Array.isArray(quizData) ? quizData : (quizData?.quizzes || []);
      setTeacherQuizzes(qList.filter((q) => q.creatorRole === 'teacher' || q.createdByName));

      const dList = Array.isArray(deckData) ? deckData : (deckData?.decks || []);
      setTeacherDecks(dList.filter((d) => d.creatorRole === 'teacher' || d.createdByName));

      setAnnouncements(Array.isArray(annData) ? annData : []);
    } catch (err) {
      console.error('Failed to load student content:', err);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    setIsJoining(true);
    setJoinStatus(null);
    try {
      const res = await apiClient.post('/auth/join-class', { joinCode: joinCodeInput.trim() });
      setJoinStatus({ type: 'success', text: res.message || 'Enrolled successfully!' });
      setJoinCodeInput('');
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinStatus(null);
        loadAllContent();
      }, 1500);
    } catch (err) {
      setJoinStatus({ type: 'error', text: err.message || 'Failed to enroll in class.' });
    } finally {
      setIsJoining(false);
    }
  };

  const totalPoints = user?.totalPoints ?? 1250;
  const streak = user?.streak ?? 5;
  const firstName = user?.name?.split(' ')[0] || 'Learner';

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="student-dashboard">
      {/* Hero greeting */}
      <div className="dashboard-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="hero-text">
          <h1>Welcome back, {firstName}! 👋</h1>
          <p className="text-muted">
            You're on a <strong>{streak}-day</strong> learning streak. Daily Goal: <strong>75/100 XP</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowJoinModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>➕</span> Join Class by Code
          </button>
          <div className="hero-streak">
            <span className="streak-flame">🔥</span>
            <span className="streak-count">{streak}</span>
            <span className="streak-label">day streak</span>
          </div>
        </div>
      </div>

      {/* Announcements Alert Banner */}
      {announcements.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '14px',
            padding: '14px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>📢</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{announcements[0].title}</strong>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                {announcements[0].className || 'All Classes'} • {announcements[0].teacherName || 'Instructor'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
              {announcements[0].message}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{totalPoints.toLocaleString()}</div>
          <div className="stat-label">Total Points</div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{progress}%</div>
          <div className="stat-label">Overall Progress</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak</div>
        </Card>
      </div>

      {/* 📢 Live Teacher Updates Section */}
      <section className="dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 className="section-title mb-0" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📢</span> Live Updates from Your Teachers
          </h2>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '20px',
              padding: '3px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
            Live Sync with MySQL
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {/* Latest Teacher Quiz */}
          <Card style={{ borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>📝 New Quiz Assigned</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {teacherQuizzes.length} available
              </span>
            </div>
            {teacherQuizzes.length > 0 ? (
              <>
                <h4 style={{ margin: '4px 0 6px', fontSize: '1rem' }}>{teacherQuizzes[0].title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 10px' }}>
                  By {teacherQuizzes[0].createdByName || 'Faculty'} • {teacherQuizzes[0].questionsCount ?? 5} questions
                </p>
                <Link to="/quiz" className="btn btn-sm btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  Take Assigned Quiz →
                </Link>
              </>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '10px 0' }}>No active quiz assignments right now.</p>
            )}
          </Card>

          {/* Latest Teacher Flashcard Deck */}
          <Card style={{ borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>🃏 Class Deck Published</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {teacherDecks.length} available
              </span>
            </div>
            {teacherDecks.length > 0 ? (
              <>
                <h4 style={{ margin: '4px 0 6px', fontSize: '1rem' }}>{teacherDecks[0].title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 10px' }}>
                  By {teacherDecks[0].createdByName || 'Faculty'} • {teacherDecks[0].cardCount ?? 0} cards
                </p>
                <Link to="/flashcards" className="btn btn-sm btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  Study Class Deck →
                </Link>
              </>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '10px 0' }}>No teacher decks published yet.</p>
            )}
          </Card>

          {/* Latest Note Highlight */}
          <Card style={{ borderLeft: '4px solid #a855f7', background: 'rgba(168, 85, 247, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>📖 Latest Lecture Note</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {notes.length} notes
              </span>
            </div>
            {notes.length > 0 ? (
              <>
                <h4 style={{ margin: '4px 0 6px', fontSize: '1rem' }}>{notes[0].title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 10px' }}>
                  {notes[0].subject} • By {notes[0].author || 'Instructor'}
                </p>
                <button
                  className="btn btn-sm btn-ghost"
                  style={{ width: '100%', border: '1px solid rgba(255,255,255,0.15)' }}
                  onClick={() => setSelectedNote(notes[0])}
                >
                  Read Note Summary ↗
                </button>
              </>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '10px 0' }}>No notes published yet.</p>
            )}
          </Card>
        </div>
      </section>

      {/* Quick actions */}
      <section className="dashboard-section">
        <h2 className="section-title">Student Quick Actions</h2>
        <div className="actions-grid">
          {QUICK_ACTIONS.map(({ to, icon, label, desc, color }) => (
            <Link key={to} to={to} className="action-card" style={{ '--action-color': color }}>
              <div className="action-icon">{icon}</div>
              <div className="action-info">
                <strong>{label}</strong>
                <span>{desc}</span>
              </div>
              <span className="action-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Published Teacher Notes & Study Guides */}
      <section className="dashboard-section">
        <div className="pane-header mb-3">
          <h2 className="section-title mb-0">📚 Published Teacher Notes & Study Guides</h2>
          <input
            type="text"
            className="form-input form-input-sm"
            style={{ maxWidth: '280px' }}
            placeholder="🔍 Search notes by topic or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredNotes.length === 0 ? (
          <Card>
            <div className="empty-state-inline">
              <span>📖</span>
              <p>No notes found matching your search.</p>
            </div>
          </Card>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                className="note-card note-card-interactive"
                onClick={() => setSelectedNote(note)}
              >
                <div className="note-header">
                  <span className="badge badge-purple">{note.subject}</span>
                  <span className="note-date">By {note.author}</span>
                </div>
                <h4 className="note-title">{note.title}</h4>
                <p className="note-snippet">{note.content}</p>
                <div className="note-footer mt-3">
                  <div className="note-tags">
                    {note.tags?.map((t) => (
                      <span key={t} className="tag-chip">#{t}</span>
                    ))}
                  </div>
                  <span className="text-primary font-semibold text-sm">Read Full Note →</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Full Note Reading Modal */}
      {selectedNote && (
        <Modal title={selectedNote.title} onClose={() => setSelectedNote(null)}>
          <div className="note-modal-content">
            <div className="note-modal-meta mb-3">
              <span className="badge badge-purple">{selectedNote.subject}</span>
              <span className="text-subtle text-sm">Published by {selectedNote.author} on {selectedNote.createdAt}</span>
            </div>
            <div className="note-modal-body">
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7', color: '#e2e8f0' }}>
                {selectedNote.content}
              </p>
            </div>
            <div className="note-tags mt-4">
              {selectedNote.tags?.map((t) => (
                <span key={t} className="tag-chip">#{t}</span>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Class Join Code Modal */}
      {showJoinModal && (
        <Modal title="➕ Join a Class with Code" onClose={() => setShowJoinModal(false)}>
          <form onSubmit={handleJoinClass} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
              Enter the unique 5-6 character invite code provided by your teacher (e.g. <code>CS101</code>, <code>CALC2</code>).
            </p>

            <div>
              <label className="form-label" style={{ fontWeight: '600' }}>Class Join Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CS101"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                style={{
                  fontSize: '1.2rem',
                  letterSpacing: '0.15em',
                  fontWeight: '700',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}
                maxLength={10}
                autoFocus
              />
            </div>

            {joinStatus && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  background: joinStatus.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: joinStatus.type === 'success' ? '#4ade80' : '#f87171',
                  border: `1px solid ${joinStatus.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                }}
              >
                {joinStatus.text}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowJoinModal(false)}
                disabled={isJoining}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isJoining || !joinCodeInput.trim()}
              >
                {isJoining ? 'Enrolling…' : 'Enroll in Class'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
