import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../state/store.js';
import Card from '../components/common/Card.jsx';
import Modal from '../components/common/Modal.jsx';
import { teacherService } from '../services/teacherService.js';

const QUICK_ACTIONS = [
  { to: '/tutor', icon: '🤖', label: 'Ask Tutor', desc: 'Get AI-powered help', color: '#6366f1' },
  { to: '/flashcards', icon: '🃏', label: 'Study Cards', desc: 'Spaced repetition review', color: '#10b981' },
  { to: '/quiz', icon: '📝', label: 'Take Quiz', desc: 'Test your knowledge', color: '#f59e0b' },
  { to: '/study-plan', icon: '📅', label: 'Study Plan', desc: 'AI-generated roadmap', color: '#3b82f6' },
  { to: '/teacher', icon: '👨‍🏫', label: 'Teacher Portal', desc: 'Manage notes & quizzes', color: '#a855f7' },
];

export default function StudentDashboard() {
  const user = useAppStore('user');
  const [progress, setProgress] = useState(68);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const teacherNotes = await teacherService.getNotes();
      setNotes(teacherNotes);
    } catch (err) {
      console.error('Failed to load teacher notes:', err);
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
      <div className="dashboard-hero">
        <div className="hero-text">
          <h1>Welcome back, {firstName}! 👋</h1>
          <p className="text-muted">
            You're on a <strong>{streak}-day</strong> learning streak. Keep it up!
          </p>
        </div>
        <div className="hero-streak">
          <span className="streak-flame">🔥</span>
          <span className="streak-count">{streak}</span>
          <span className="streak-label">day streak</span>
        </div>
      </div>

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

      {/* Quick actions */}
      <section className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
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
    </div>
  );
}
