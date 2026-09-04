import React, { useState, useEffect } from 'react';
import { tutorService } from '../services/tutorService.js';
import ChatWindow from '../components/tutor/ChatWindow.jsx';
import Card from '../components/common/Card.jsx';

export default function TutorPage() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [subject, setSubject] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await tutorService.listChats();
      setChats(data.chats || []);
    } catch {
      console.error('Failed to load chats');
    }
  };

  const handleCreateChat = async () => {
    if (!subject.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const newChat = await tutorService.createChat(subject.trim());
      setChats((prev) => [newChat, ...prev]);
      setActiveChat(newChat);
      setSubject('');
    } catch {
      setError('Failed to create chat. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCreateChat();
  };

  return (
    <div className="tutor-page">
      <div className="tutor-layout">
        {/* Sidebar */}
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <h3>🤖 Tutoring Chats</h3>
          </div>

          <div className="new-chat-form">
            <input
              type="text"
              placeholder="Subject (Math, Science…)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isCreating}
            />
            <button
              className="btn btn-primary"
              onClick={handleCreateChat}
              disabled={isCreating || !subject.trim()}
            >
              {isCreating ? '…' : '+ New Chat'}
            </button>
          </div>

          {error && <div className="error-message sidebar-error">{error}</div>}

          <div className="chat-list">
            {chats.length === 0 ? (
              <p className="text-muted sidebar-empty">
                Start a new chat to begin tutoring.
              </p>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => setActiveChat(chat)}
                  role="button"
                >
                  <div className="chat-item-icon">
                    {chat.subject?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="chat-item-info">
                    <strong>{chat.subject}</strong>
                    <span className="text-muted">
                      {chat.messages?.length || 0} messages
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main area */}
        <main className="chat-main">
          {activeChat ? (
            <ChatWindow
              chatId={activeChat.id}
              subject={activeChat.subject}
              gradeLevel={9}
            />
          ) : (
            <div className="chat-welcome">
              <div className="welcome-icon">🤖</div>
              <h2>Welcome to Smart Tutor</h2>
              <p>Select an existing chat or create a new one to get started.</p>
              <p className="text-muted">
                Ask questions and get personalised AI explanations on any subject.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
