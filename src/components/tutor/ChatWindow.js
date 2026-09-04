import { createElement as h, useState, useEffect } from '../../utils/h.js';
import { tutorService } from '../../services/tutorService.js';

export default function ChatWindow({ chatId, gradeLevel, subject }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (chatId) loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      const data = await tutorService.getChatHistory(chatId);
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
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
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await tutorService.sendMessage(chatId, inputValue);
      setMessages((prev) => [...prev, response.message]);
      setError(null);
    } catch (err) {
      setError('Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  return h('div', { className: 'chat-window' }, [
    h('div', { className: 'chat-header' }, [
      h('h2', {}, `${subject || 'Tutor'} • Grade ${gradeLevel}`),
    ]),

    h('div', { className: 'chat-messages' }, [
      messages.length === 0
        ? h('div', { className: 'chat-empty' }, [
            h('p', {}, 'Start asking questions to get help!'),
          ])
        : messages.map((msg) =>
            h('div', {
              key: msg.id,
              className: `message message-${msg.role}`,
            }, [
              h('div', { className: 'message-content' }, msg.content),
              h('span', { className: 'message-time' }, 
                new Date(msg.timestamp).toLocaleTimeString()
              ),
            ])
          ),
      isLoading && h('div', { className: 'message-loading' }, '...'),
      error && h('div', { className: 'error-message' }, error),
    ]),

    h('div', { className: 'chat-input-area' }, [
      h('input', {
        type: 'text',
        className: 'chat-input',
        placeholder: 'Ask a question...',
        value: inputValue,
        onInput: (e) => setInputValue(e.target.value),
        onKeypress: (e) => e.key === 'Enter' && handleSendMessage(),
        disabled: isLoading,
      }),
      h('button', {
        className: 'btn btn-primary btn-send',
        onClick: handleSendMessage,
        disabled: isLoading || !inputValue.trim(),
      }, 'Send'),
    ]),
  ]);
}
