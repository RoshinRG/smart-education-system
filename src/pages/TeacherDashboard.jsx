import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import NoteEditor from '../components/teacher/NoteEditor.jsx';
import QuizBuilder from '../components/teacher/QuizBuilder.jsx';
import FlashcardDeckBuilder from '../components/teacher/FlashcardDeckBuilder.jsx';
import { teacherService } from '../services/teacherService.js';
import { apiClient } from '../services/api.js';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'notes' | 'quizzes' | 'flashcards' | 'lesson-plans'
  
  // Data states
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notes, setNotes] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  // Modals & Forms
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [showDeckBuilder, setShowDeckBuilder] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annPriority, setAnnPriority] = useState('important');
  const [isPublishingAnn, setIsPublishingAnn] = useState(false);
  const [notification, setNotification] = useState(null);

  // AI Lesson Plan Generator state
  const [lpObjective, setLpObjective] = useState('');
  const [lpSubject, setLpSubject] = useState('Computer Science');
  const [lpGrade, setLpGrade] = useState('11th Grade');
  const [lpDuration, setLpDuration] = useState('60 mins');
  const [generatingLp, setGeneratingLp] = useState(false);
  const [currentLpResult, setCurrentLpResult] = useState(null);

  useEffect(() => {
    loadTeacherData();
  }, [selectedClassId]);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  const loadTeacherData = async () => {
    try {
      const classList = await teacherService.getClasses();
      setClasses(classList);

      const activeId = selectedClassId || (classList.length > 0 ? classList[0].id : '');
      if (!selectedClassId && classList.length > 0) {
        setSelectedClassId(classList[0].id);
      }

      if (activeId) {
        const studentList = await teacherService.getStudents(activeId);
        setStudents(studentList);

        const analyticsData = await teacherService.getClassAnalytics(activeId);
        setAnalytics(analyticsData);
      }

      const notesList = await teacherService.getNotes();
      setNotes(notesList);

      const assignmentList = await teacherService.getAssignments(selectedClassId);
      setAssignments(assignmentList);
    } catch (err) {
      console.error('Failed to load teacher dashboard data:', err);
    }
  };

  // Handlers
  const handleSaveNote = async (noteData) => {
    const newNote = await teacherService.createNote(
      noteData.title,
      noteData.subject,
      noteData.content,
      noteData.tags
    );
    setNotes([newNote, ...notes]);
    setShowNoteEditor(false);
    showToast('✨ Lesson note published successfully for students!');
  };

  const handleSaveQuiz = async (quizData) => {
    await teacherService.createQuiz(
      quizData.title,
      quizData.subject,
      quizData.difficulty,
      quizData.questions
    );
    setShowQuizBuilder(false);
    showToast('✨ Interactive quiz published for students!');
  };

  const handleSaveDeck = async (deckData) => {
    await teacherService.createClassDeck(
      deckData.title,
      deckData.subject,
      deckData.description,
      deckData.cards
    );
    setShowDeckBuilder(false);
    showToast('✨ Flashcard deck published for students!');
  };

  const handleGenerateLessonPlan = async (e) => {
    e.preventDefault();
    if (!lpObjective.trim()) return;

    setGeneratingLp(true);
    try {
      const res = await teacherService.generateLessonPlan(
        lpObjective,
        lpSubject,
        lpGrade,
        lpDuration
      );
      setCurrentLpResult(res);
      showToast('🤖 AI Lesson Plan generated!');
    } catch (err) {
      console.error('Lesson plan error:', err);
    } finally {
      setGeneratingLp(false);
    }
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;

    setIsPublishingAnn(true);
    try {
      await apiClient.post('/teacher/announcements', {
        classId: selectedClassId || null,
        title: annTitle.trim(),
        message: annMessage.trim(),
        priority: annPriority,
      });

      setShowAnnouncementModal(false);
      setAnnTitle('');
      setAnnMessage('');
      showToast('📢 Announcement broadcasted to students via MySQL!');
    } catch (err) {
      showToast('❌ Failed to broadcast announcement: ' + err.message);
    } finally {
      setIsPublishingAnn(false);
    }
  };

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  return (
    <div className="teacher-dashboard">
      {/* Toast Notification */}
      {notification && (
        <div className="toast-notification">
          <span>{notification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="teacher-hero">
        <div className="teacher-hero-content">
          <div className="hero-badge">👨‍🏫 Teacher Command Center</div>
          <h1 className="hero-title">Welcome to the Teacher Hub</h1>
          <p className="hero-subtitle">
            Create lesson notes, design quizzes, build flashcards, track student mastery, and generate AI lesson plans.
          </p>
        </div>
        <div className="hero-quick-actions">
          <Button variant="primary" size="sm" onClick={() => setShowNoteEditor(true)}>
            📝 New Note
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowQuizBuilder(true)}>
            ❓ New Quiz
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowDeckBuilder(true)}>
            🃏 New Deck
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="teacher-tabs">
        <button
          className={`teacher-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Class Analytics & Roster
        </button>
        <button
          className={`teacher-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          📝 Lesson Notes ({notes.length})
        </button>
        <button
          className={`teacher-tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          ❓ Quiz Creator
        </button>
        <button
          className={`teacher-tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          🃏 Flashcard Creator
        </button>
        <button
          className={`teacher-tab-btn ${activeTab === 'lesson-plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('lesson-plans')}
        >
          📑 Assignments & AI Lesson Plans
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CLASS ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="tab-pane">
          <div className="class-selector-row mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <label className="form-label mb-0" htmlFor="class-select" style={{ fontWeight: '600' }}>Active Class:</label>
              <select
                id="class-select"
                className="form-select form-select-inline"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.section})
                  </option>
                ))}
              </select>

              {activeClass?.joinCode && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '4px 12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: '600' }}>Invite Code:</span>
                  <strong style={{ fontSize: '0.95rem', color: '#fff', fontFamily: 'monospace', letterSpacing: '0.08em' }}>{activeClass.joinCode}</strong>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: '2px 8px', fontSize: '0.75rem', minHeight: 'auto', height: '24px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(activeClass.joinCode);
                      showToast(`📋 Copied class code "${activeClass.joinCode}" to clipboard!`);
                    }}
                    title="Copy invite code for students"
                  >
                    📋 Copy
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => setShowAnnouncementModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>📢</span> Broadcast Announcement
            </button>
          </div>

          {/* Stats Bar */}
          <div className="dashboard-grid mb-4">
            <Card className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Enrolled Students</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-value">{analytics?.classAverage || 82.4}%</div>
              <div className="stat-label">Class Average Score</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-value">{analytics?.atRiskCount || 2}</div>
              <div className="stat-label">Students Needing Support</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{analytics?.completionRate || 91}%</div>
              <div className="stat-label">Assignment Completion</div>
            </Card>
          </div>

          {/* Student Roster Table */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">👨‍🎓 Student Performance Roster</h3>
              <p className="card-subtitle">Real-time breakdown of scores and attendance</p>
            </div>
            <div className="table-responsive">
              <table className="teacher-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Average Score</th>
                    <th>Attendance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="font-semibold">{student.name}</td>
                      <td className="text-subtle">{student.email}</td>
                      <td>
                        <span className={`score-pill ${student.avgScore >= 80 ? 'score-high' : student.avgScore >= 60 ? 'score-med' : 'score-low'}`}>
                          {student.avgScore}%
                        </span>
                      </td>
                      <td>{student.attendance}%</td>
                      <td>
                        <span className={`badge ${student.status === 'At Risk' ? 'badge-danger' : student.status === 'Top Performer' ? 'badge-success' : 'badge-purple'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <Button size="sm" variant="ghost" onClick={() => showToast(`Sent intervention message to ${student.name}`)}>
                          ✉️ Message
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: LESSON NOTES */}
      {activeTab === 'notes' && (
        <div className="tab-pane">
          <div className="pane-header mb-4">
            <div>
              <h3>Lesson Notes & Study Materials</h3>
              <p className="text-subtle">Publish notes, summaries, and lecture material for your students</p>
            </div>
            <Button variant="primary" onClick={() => setShowNoteEditor(true)}>
              ➕ Publish New Note
            </Button>
          </div>

          <div className="notes-grid">
            {notes.map((note) => (
              <Card key={note.id} className="note-card">
                <div className="note-header">
                  <span className="badge badge-purple">{note.subject}</span>
                  <span className="note-date">{note.createdAt}</span>
                </div>
                <h4 className="note-title">{note.title}</h4>
                <p className="note-snippet">{note.content}</p>
                <div className="note-tags mt-3">
                  {note.tags?.map((t) => (
                    <span key={t} className="tag-chip">#{t}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ CREATOR */}
      {activeTab === 'quizzes' && (
        <div className="tab-pane">
          <QuizBuilder onSaveQuiz={handleSaveQuiz} />
        </div>
      )}

      {/* TAB 4: FLASHCARD CREATOR */}
      {activeTab === 'flashcards' && (
        <div className="tab-pane">
          <FlashcardDeckBuilder onSaveDeck={handleSaveDeck} />
        </div>
      )}

      {/* TAB 5: ASSIGNMENTS & AI LESSON PLANS */}
      {activeTab === 'lesson-plans' && (
        <div className="tab-pane">
          <div className="grid-2-col">
            {/* AI Lesson Plan Generator */}
            <Card>
              <div className="card-header">
                <h3 className="card-title">🤖 AI Lesson Plan Generator</h3>
                <p className="card-subtitle">Generate structured lesson plans with objectives and timelines</p>
              </div>

              <form onSubmit={handleGenerateLessonPlan} className="form">
                <div className="form-group">
                  <label className="form-label" htmlFor="lp-objective">Lesson Objective / Topic</label>
                  <input
                    id="lp-objective"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Introduction to Graph Traversal (BFS and DFS)"
                    value={lpObjective}
                    onChange={(e) => setLpObjective(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group flex-1">
                    <label className="form-label" htmlFor="lp-subject">Subject</label>
                    <select id="lp-subject" className="form-select" value={lpSubject} onChange={(e) => setLpSubject(e.target.value)}>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Math">Math</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label" htmlFor="lp-duration">Duration</label>
                    <select id="lp-duration" className="form-select" value={lpDuration} onChange={(e) => setLpDuration(e.target.value)}>
                      <option value="45 mins">45 mins</option>
                      <option value="60 mins">60 mins</option>
                      <option value="90 mins">90 mins</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" variant="primary" loading={generatingLp}>
                  ⚡ Generate AI Lesson Plan
                </Button>
              </form>

              {currentLpResult && (
                <div className="lp-result-box mt-4">
                  <h4>{currentLpResult.title}</h4>
                  <pre className="lp-result-pre">{currentLpResult.plan}</pre>
                </div>
              )}
            </Card>

            {/* Assignments List */}
            <Card>
              <div className="card-header">
                <h3 className="card-title">📚 Active Class Assignments</h3>
                <p className="card-subtitle">Submissions & grading progress</p>
              </div>

              <div className="assignments-list">
                {assignments.map((asg) => (
                  <div key={asg.id} className="assignment-item-box">
                    <div>
                      <h4 className="asg-title">{asg.title}</h4>
                      <span className="text-subtle">Due: {asg.dueDate}</span>
                    </div>
                    <div className="asg-progress">
                      <span className="badge badge-purple">
                        {asg.submissionsCount} / {asg.totalStudents} Submitted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Note Editor Modal */}
      {showNoteEditor && (
        <Modal title="Create Lesson Note" onClose={() => setShowNoteEditor(false)}>
          <NoteEditor onSaveNote={handleSaveNote} onCancel={() => setShowNoteEditor(false)} />
        </Modal>
      )}

      {/* Quiz Builder Modal */}
      {showQuizBuilder && (
        <Modal title="Create Quiz" onClose={() => setShowQuizBuilder(false)}>
          <QuizBuilder onSaveQuiz={handleSaveQuiz} onCancel={() => setShowQuizBuilder(false)} />
        </Modal>
      )}

      {/* Deck Builder Modal */}
      {showDeckBuilder && (
        <Modal title="Create Flashcard Deck" onClose={() => setShowDeckBuilder(false)}>
          <FlashcardDeckBuilder onSaveDeck={handleSaveDeck} onCancel={() => setShowDeckBuilder(false)} />
        </Modal>
      )}

      {/* Broadcast Announcement Modal */}
      {showAnnouncementModal && (
        <Modal title="📢 Broadcast Class Announcement" onClose={() => setShowAnnouncementModal(false)}>
          <form onSubmit={handlePublishAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-muted" style={{ fontSize: '0.88rem', margin: 0 }}>
              This message will immediately appear as a live alert on all enrolled students' dashboards.
            </p>

            <div>
              <label className="form-label" style={{ fontWeight: '600' }}>Announcement Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Midterm Exam Preparation & Schedule"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: '600' }}>Priority Level</label>
              <select
                className="form-select"
                value={annPriority}
                onChange={(e) => setAnnPriority(e.target.value)}
              >
                <option value="normal">Normal Announcement (📢 Update)</option>
                <option value="important">Important (📌 Exam / Due Date)</option>
                <option value="urgent">Urgent (🚨 Immediate Action)</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: '600' }}>Message Content</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Write the detailed message for your students..."
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowAnnouncementModal(false)}
                disabled={isPublishingAnn}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPublishingAnn || !annTitle.trim() || !annMessage.trim()}
              >
                {isPublishingAnn ? 'Broadcasting…' : '📢 Broadcast to Students'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
