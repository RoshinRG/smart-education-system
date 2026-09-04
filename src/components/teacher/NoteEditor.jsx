import React, { useState } from 'react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

export default function NoteEditor({ onSaveNote, onCancel }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Algorithms', 'Study Guide']);
  const [loading, setLoading] = useState(false);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await onSaveNote({
        title,
        subject,
        content,
        tags,
      });
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="note-editor-card">
      <div className="card-header">
        <h3 className="card-title">📝 Create Lesson Note & Study Guide</h3>
        <p className="card-subtitle">Publish study notes, lecture summaries, and resources for your students</p>
      </div>

      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group-row">
          <div className="form-group flex-2">
            <label className="form-label" htmlFor="note-title">Note Title</label>
            <input
              id="note-title"
              type="text"
              className="form-input"
              placeholder="e.g. Understanding Recursion & Dynamic Programming"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label" htmlFor="note-subject">Subject</label>
            <select
              id="note-subject"
              className="form-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Math">Math / Calculus</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="History">History</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <div className="tags-input-container">
            <div className="tags-list">
              {tags.map((tag) => (
                <span key={tag} className="badge badge-purple tag-badge">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="tag-remove-btn">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="tag-input-row">
              <input
                type="text"
                className="form-input form-input-sm"
                placeholder="Add tag (press enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
                Add Tag
              </Button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="note-content">Note Content (Markdown supported)</label>
          <textarea
            id="note-content"
            className="form-textarea"
            rows="7"
            placeholder="Write your study notes, key takeaways, code examples, or lecture summary here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" loading={loading}>
            ✨ Publish Note for Students
          </Button>
        </div>
      </form>
    </Card>
  );
}
