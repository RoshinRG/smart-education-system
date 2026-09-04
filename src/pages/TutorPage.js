import { createElement as h, useState, useEffect } from '../utils/h.js';
import { tutorService } from '../services/tutorService.js';
import ChatWindow from '../components/tutor/ChatWindow.js';
import Card from '../components/common/Card.js';

export default function TutorPage() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [subject, setSubject] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await tutorService.listChats();
      setChats(data.chats || []);
    } catch (err) {
      console.error('Failed to load chats');
    }
  };

  const handleCreateChat = async () => {
    if (!subject.trim()) return;

    setIsCreating(true);
    try {
      const newChat = await tutorService.createChat(subject);
      setActiveChat(newChat);
      setChats((prev) => [newChat, ...prev]);
      setSubject('');
    } catch (err) {
      console.error('Failed to create chat');
    } finally {
      setIsCreating(false);
    }
  };

  return h('div', { className: 'tutor-page' }, [
    h('div', { className: 'tutor-layout' }, [
      h('div', { className: 'chat-sidebar' }, [
        h('h3', {}, 'Tutoring Chats'),
        h('div', { className: 'new-chat-form' }, [
          h('input', {
            type: 'text',
            placeholder: 'Math, Science, etc.',
            value: subject,
            onInput: (e) => setSubject(e.target.value),
            disabled: isCreating,
          }),
          h('button', {
            className: 'btn btn-primary',
            onClick: handleCreateChat,
            disabled: isCreating || !subject.trim(),
          }, 'New Chat'),
        ]),

        h('div', { className: 'chat-list' }, [
          chats.length === 0
            ? h('p', { className: 'text-muted' }, 'Start a new chat')
            : chats.map((chat) =>
                h('div', {
                  key: chat.id,
                  className: `chat-item ${activeChat?.id === chat.id ? 'active' : ''}`,
                  onClick: () => setActiveChat(chat),
                }, [
                  h('strong', {}, chat.subject),
                  h('p', { className: 'text-muted' }, `${chat.messages?.length || 0} messages`),
                ])
              ),
        ]),
      ]),

      h('div', { className: 'chat-main' }, [
        activeChat
          ? h(ChatWindow, {
              chatId: activeChat.id,
              subject: activeChat.subject,
              gradeLevel: 9,
            })
          : h(Card, { title: 'Welcome to Smart Tutor' }, [
              h('p', {}, 'Select a chat or create a new one to get started!'),
              h('p', { className: 'text-muted' }, 'Ask questions and get personalized explanations.'),
            ]),
      ]),
    ]),
  ]);
}
