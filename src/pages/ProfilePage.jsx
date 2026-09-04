import React, { useState } from 'react';
import { useAppStore, appStore } from '../state/store.js';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import { authService } from '../services/authService.js';

const AVATAR_OPTIONS = ['🎓', '👨‍🏫', '👩‍🏫', '🚀', '🔬', '📐', '🧪', '🎨', '💡', '💻', '📚', '🏆'];

export default function ProfilePage() {
  const user = useAppStore('user') || {};
  const isTeacher = user.role === 'teacher';

  const [name, setName] = useState(user.name || (isTeacher ? 'Prof. Miller' : 'Alex Student'));
  const [email, setEmail] = useState(user.email || 'user@smartedu.com');
  const [avatar, setAvatar] = useState(user.avatar || (isTeacher ? '👨‍🏫' : '🎓'));
  
  // Student Specific Fields
  const [gradeLevel, setGradeLevel] = useState(user.gradeLevel || '11th Grade');
  const [learningGoal, setLearningGoal] = useState(user.learningGoal || 'Master Web Development & Computer Science');
  const [preferredSubject, setPreferredSubject] = useState(user.preferredSubject || 'Computer Science');

  // Teacher Specific Fields
  const [department, setDepartment] = useState(user.department || 'Computer Science & Mathematics');
  const [schoolName, setSchoolName] = useState(user.schoolName || 'Smart Education Academy');
  const [bio, setBio] = useState(user.bio || 'Passionate educator with 8+ years experience teaching algorithms, calculus, and web engineering.');
  const [officeHours, setOfficeHours] = useState(user.officeHours || 'Mon & Wed: 3:00 PM - 5:00 PM');

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedData = {
      ...user,
      name,
      email,
      avatar,
      ...(isTeacher
        ? { department, schoolName, bio, officeHours }
        : { gradeLevel, learningGoal, preferredSubject }),
    };

    try {
      await authService.updateProfile(updatedData);
      appStore.setState('user', updatedData);
      showToast('✨ Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast('❌ Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Toast notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header Banner */}
      <div className="profile-hero-card">
        <div className="profile-avatar-large">{avatar}</div>
        <div className="profile-hero-info">
          <div className="profile-name-row">
            <h2>{name}</h2>
            <span className={`badge ${isTeacher ? 'badge-purple' : 'badge-success'}`}>
              {isTeacher ? '👨‍🏫 Teacher' : '🎓 Student'}
            </span>
          </div>
          <p className="text-subtle">{email} • {isTeacher ? schoolName : gradeLevel}</p>
          <p className="profile-tagline mt-1">
            {isTeacher ? bio : `Goal: "${learningGoal}"`}
          </p>
        </div>
      </div>

      <div className="grid-2-col">
        {/* Profile Edit Form */}
        <Card>
          <div className="card-header">
            <h3 className="card-title">✏️ Edit {isTeacher ? 'Teacher' : 'Student'} Profile</h3>
            <p className="card-subtitle">Update your personal information and preferences</p>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            {/* Avatar Selector */}
            <div className="form-group">
              <label className="form-label">Choose Avatar Icon</label>
              <div className="avatar-selector-grid">
                {AVATAR_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`avatar-option-btn ${avatar === icon ? 'selected' : ''}`}
                    onClick={() => setAvatar(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Common Fields */}
            <div className="form-group-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="user-name">Full Name</label>
                <input
                  id="user-name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label className="form-label" htmlFor="user-email">Email Address</label>
                <input
                  id="user-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Role Specific Fields */}
            {!isTeacher ? (
              <>
                <div className="form-group-row">
                  <div className="form-group flex-1">
                    <label className="form-label" htmlFor="grade-level">Grade / Academic Level</label>
                    <select
                      id="grade-level"
                      className="form-select"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                    >
                      <option value="9th Grade">9th Grade (Freshman)</option>
                      <option value="10th Grade">10th Grade (Sophomore)</option>
                      <option value="11th Grade">11th Grade (Junior)</option>
                      <option value="12th Grade">12th Grade (Senior)</option>
                      <option value="Undergraduate">Undergraduate Student</option>
                      <option value="Self-Learner">Self-Learner</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label" htmlFor="pref-subject">Primary Subject Focus</label>
                    <select
                      id="pref-subject"
                      className="form-select"
                      value={preferredSubject}
                      onChange={(e) => setPreferredSubject(e.target.value)}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Math">Math / Calculus</option>
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Physics">Physics</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="learning-goal">Main Learning Goal</label>
                  <input
                    id="learning-goal"
                    type="text"
                    className="form-input"
                    placeholder="What do you want to accomplish?"
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group-row">
                  <div className="form-group flex-1">
                    <label className="form-label" htmlFor="department">Department / Field</label>
                    <input
                      id="department"
                      type="text"
                      className="form-input"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label" htmlFor="school-name">School / University</label>
                    <input
                      id="school-name"
                      type="text"
                      className="form-input"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="office-hours">Office Hours & Availability</label>
                  <input
                    id="office-hours"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mon & Wed: 3:00 PM - 5:00 PM"
                    value={officeHours}
                    onChange={(e) => setOfficeHours(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="teacher-bio">Teacher Bio / Summary</label>
                  <textarea
                    id="teacher-bio"
                    className="form-textarea"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button type="submit" variant="primary" loading={saving}>
              💾 Save Profile Changes
            </Button>
          </form>
        </Card>

        {/* Stats & Role Achievements Summary */}
        <Card>
          <div className="card-header">
            <h3 className="card-title">📊 {isTeacher ? 'Teacher Performance Stats' : 'Learning Achievements'}</h3>
            <p className="card-subtitle">Overview of your activity on Smart Education</p>
          </div>

          {!isTeacher ? (
            <div className="profile-stats-list">
              <div className="profile-stat-box">
                <span className="profile-stat-icon">⭐</span>
                <div>
                  <span className="profile-stat-number">{user.totalPoints || 1250}</span>
                  <span className="profile-stat-label">Total Knowledge Points</span>
                </div>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-icon">🔥</span>
                <div>
                  <span className="profile-stat-number">{user.streak || 5} Days</span>
                  <span className="profile-stat-label">Active Learning Streak</span>
                </div>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-icon">🃏</span>
                <div>
                  <span className="profile-stat-number">4 Decks</span>
                  <span className="profile-stat-label">Mastered Flashcard Decks</span>
                </div>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-icon">📝</span>
                <div>
                  <span className="profile-stat-number">12 Quizzes</span>
                  <span className="profile-stat-label">Completed Practice Quizzes</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="profile-stats-list">
              <div className="profile-stat-box">
                <span className="profile-stat-icon">🏫</span>
                <div>
                  <span className="profile-stat-number">3 Classes</span>
                  <span className="profile-stat-label">Active Courses Managed</span>
                </div>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-icon">👥</span>
                <div>
                  <span className="profile-stat-number">80 Students</span>
                  <span className="profile-stat-label">Total Enrolled Students</span>
                </div>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-icon">📝</span>
                <div>
                  <span className="profile-stat-number">6 Notes</span>
                  <span className="profile-stat-label">Published Study Guides</span>
                </div>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-icon">❓</span>
                <div>
                  <span className="profile-stat-number">8 Quizzes</span>
                  <span className="profile-stat-label">Published Class Quizzes</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
