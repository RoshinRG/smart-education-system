import React, { useState, useEffect, useRef } from 'react';
import { tutorService } from '../../services/tutorService.js';
import Modal from '../common/Modal.jsx';
import CodeSandboxModal from './CodeSandboxModal.jsx';
import WebReferencesDrawer from './WebReferencesDrawer.jsx';

export default function ChatWindow({ chatId, gradeLevel, subject }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [showReferencesModal, setShowReferencesModal] = useState(false);
  const [liveWebSearch, setLiveWebSearch] = useState(true);
  const [openReferencesMap, setOpenReferencesMap] = useState({});

  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (chatId) loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await tutorService.getChatHistory(chatId);
      setMessages(data.messages || []);
      setError(null);
    } catch {
      setError('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const sentText = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await tutorService.sendMessage(chatId, sentText, liveWebSearch);
      const incomingMsg = response.message || response;
      setMessages((prev) => [...prev, incomingMsg]);
      
      // Auto-expand references for the latest message if present
      if (incomingMsg.id && incomingMsg.webReferences?.length) {
        setOpenReferencesMap((prev) => ({ ...prev, [incomingMsg.id]: true }));
      }
      setError(null);
    } catch {
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- Voice Speech-to-Text Dictation ---
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge!');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('');
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // --- Voice Text-to-Speech Output ---
  const toggleTextToSpeech = (msgId, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle reference expansion on a specific message
  const toggleReferences = (msgId) => {
    setOpenReferencesMap((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  // Aggregate all references gathered throughout the chat
  const allSessionReferences = messages.reduce((acc, m) => {
    if (m.webReferences && Array.isArray(m.webReferences)) {
      m.webReferences.forEach((r) => {
        if (!acc.some((existing) => existing.url === r.url)) {
          acc.push(r);
        }
      });
    }
    return acc;
  }, []);

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>{subject || 'Tutor'}</h2>
          <span className="chat-grade-badge">Grade {gradeLevel || '11th'}</span>
          <span className="web-search-badge" title="AI automatically retrieves references from the web">
            🌐 Web Research Active
          </span>
        </div>

        <div className="chat-header-controls">
          {/* Session References Hub button */}
          <button
            className="btn btn-ghost btn-sm reference-hub-btn"
            onClick={() => setShowReferencesModal(true)}
            title="View all verified educational references gathered in this chat"
          >
            📚 Reference Hub ({allSessionReferences.length})
          </button>

          {/* Live Code Sandbox Button */}
          <button
            className="btn btn-secondary btn-sm sandbox-trigger-btn"
            onClick={() => setShowSandbox(true)}
            title="Open Live Code Sandbox"
          >
            💻 Code Sandbox
          </button>

          <div className="chat-status">
            <span className={`status-dot ${isLoading ? 'thinking' : 'online'}`} />
            <span>{isLoading ? 'Researching Web…' : 'Online'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">🤖</div>
            <p>Hi! I'm your AI tutor for <strong>{subject || 'learning'}</strong>.</p>
            <p className="text-muted">
              Ask any question — I will explain it with verified references, theorems, and tutorials gathered from across the web!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAI = msg.role === 'assistant' || msg.sender === 'ai';
            const text = msg.content || msg.text || '';
            const hasRefs = isAI && msg.webReferences && msg.webReferences.length > 0;
            const isRefsOpen = openReferencesMap[msg.id] ?? true;

            return (
              <div key={msg.id} className={`message message-${isAI ? 'assistant' : 'user'}`}>
                <div className="message-avatar">
                  {isAI ? '🤖' : '👤'}
                </div>
                <div className="message-bubble">
                  <div className="message-content" style={{ whiteSpace: 'pre-line' }}>{text}</div>

                  {/* Web References Drawer / Cards attached to AI responses */}
                  {hasRefs && (
                    <div className="message-references-block">
                      <div
                        className="references-toggle-bar"
                        onClick={() => toggleReferences(msg.id)}
                      >
                        <span className="ref-toggle-label">
                          🌐 <strong>Verified Web References</strong> ({msg.webReferences.length} sources)
                        </span>
                        <span className="ref-toggle-arrow">
                          {isRefsOpen ? '▲ Hide' : '▼ View Sources'}
                        </span>
                      </div>

                      {isRefsOpen && (
                        <div className="references-collapsible-body">
                          <WebReferencesDrawer references={msg.webReferences} />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="message-footer">
                    <span className="message-time">
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {/* TTS Listen Button for AI bubbles */}
                    {isAI && (
                      <button
                        className={`btn-tts ${speakingMsgId === msg.id ? 'tts-active' : ''}`}
                        onClick={() => toggleTextToSpeech(msg.id, text)}
                        title={speakingMsgId === msg.id ? 'Stop listening' : 'Listen to response'}
                      >
                        {speakingMsgId === msg.id ? '🔊 Speaking...' : '🔊 Listen'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="message message-assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-bubble">
              <div className="web-search-loading">
                <span className="search-pulse-icon">🔍</span>
                <span className="search-loading-text">Gathering reference materials from educational web sources…</span>
              </div>
              <div className="typing-indicator mt-2">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input area with Voice Dictation and Web Search Indicator */}
      <div className="chat-input-wrapper">
        <div className="chat-input-toolbar">
          <button
            type="button"
            className={`web-search-toggle ${liveWebSearch ? 'active' : ''}`}
            onClick={() => setLiveWebSearch((v) => !v)}
            title="Toggle whether AI queries verified educational web databases"
          >
            <span>{liveWebSearch ? '🌐 Live Web Search: Enabled' : '⚡ Fast Mode (No Web Search)'}</span>
          </button>
          <span className="text-subtle text-xs">Sources: MIT OCW • Khan Academy • MDN • Wikipedia • arXiv</span>
        </div>

        <div className="chat-input-area">
          <button
            className={`btn-mic ${isRecording ? 'mic-recording' : ''}`}
            onClick={toggleSpeechRecognition}
            title={isRecording ? 'Stop recording voice' : 'Dictate with voice microphone'}
          >
            {isRecording ? '🎙️ Listening...' : '🎤'}
          </button>

          <textarea
            className="chat-input"
            placeholder={isRecording ? 'Listening to your voice...' : 'Ask a question… (Enter to send, Shift+Enter for new line)'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
          />
          <button
            className="btn btn-primary btn-send"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            Send ↑
          </button>
        </div>
      </div>

      {/* Code Sandbox Modal */}
      {showSandbox && (
        <Modal title="Interactive Code Sandbox" onClose={() => setShowSandbox(false)}>
          <CodeSandboxModal onClose={() => setShowSandbox(false)} />
        </Modal>
      )}

      {/* Session Web References Bibliography Modal */}
      {showReferencesModal && (
        <Modal title="Session Reference Hub & Bibliography" onClose={() => setShowReferencesModal(false)}>
          <WebReferencesDrawer
            references={allSessionReferences}
            isModal={true}
            onClose={() => setShowReferencesModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
