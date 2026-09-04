# Smart Education - Complete Starter Kit

AI-powered learning platform built with vanilla JavaScript, no frameworks.

## 📦 What's Included

### Frontend (Vanilla JS)
- **Services**: Auth, Tutor, Flashcards, Quiz, Study Plan, Teacher
- **Pages**: Login, Dashboard, Tutor, Flashcards, Quiz, Study Plan
- **Components**: Chat, Flashcard Viewer, Quiz Window, Plan Generator, Cards, Modal
- **State Management**: Event-driven store (no Redux)
- **Routing**: Client-side history API
- **Styling**: CSS variables, no framework

### Features
✅ AI Tutoring Chat  
✅ Flashcard System with Spaced Repetition  
✅ Adaptive Quiz Engine  
✅ Study Plan Generator  
✅ Teacher Dashboard  
✅ Progress Tracking  
✅ Mobile Responsive  

## 🚀 Quick Start

### 1. Clone & Setup

```bash
# Clone the repository
git clone <your-repo>
cd smart-education-starter

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your settings
API_BASE_URL=http://localhost:5000/api
```

### 2. Run Frontend

```bash
# Python 3 (built-in server)
python3 -m http.server 8000 --directory public

# OR use Node
npx http-server public -p 8000

# Open browser
open http://localhost:8000
```

The app will be at `http://localhost:8000`

### 3. Connect Backend

Update `.env.local` with your backend URL:
```
API_BASE_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/       # Button, Card, Modal
│   ├── tutor/        # ChatWindow, CodeEditor
│   ├── flashcards/   # FlashcardViewer, PdfUpload
│   ├── quiz/         # QuizWindow
│   └── studyPlan/    # PlanGenerator, Timeline
├── pages/            # Full page components
│   ├── LoginPage.js
│   ├── StudentDashboard.js
│   ├── TutorPage.js
│   ├── FlashcardsPage.js
│   ├── QuizPage.js
│   └── StudyPlanPage.js
├── services/         # API clients
│   ├── api.js        # HTTP wrapper
│   ├── authService.js
│   ├── tutorService.js
│   ├── flashcardService.js
│   ├── quizService.js
│   ├── studyPlanService.js
│   └── teacherService.js
├── state/            # State management
│   └── store.js      # Event-driven store
├── styles/           # CSS
│   ├── global.css
│   ├── variables.css
│   ├── tutor.css
│   └── flashcards.css
├── utils/            # Utilities
│   └── h.js          # DOM element creator
└── router.js         # Client-side routing

public/
└── index.html        # Entry point
```

## 🔑 Key Features Explained

### 1. **Vanilla JS - No React/Vue**
Uses lightweight `h.js` helper instead of React:

```javascript
import { createElement as h } from './utils/h.js';

export default function MyComponent() {
  return h('div', { className: 'card' }, [
    h('h1', {}, 'Hello'),
    h('p', {}, 'No JSX, no build step'),
  ]);
}
```

### 2. **Event-Driven State Management**
No Redux or Context - just a simple observer pattern:

```javascript
import { appStore } from './state/store.js';

// Subscribe to changes
const unsubscribe = appStore.subscribe('user', (user) => {
  console.log('User updated:', user);
});

// Update state
appStore.setState('user', newUser);
```

### 3. **Service Layer**
All API calls are centralized:

```javascript
import { tutorService } from './services/tutorService.js';

const response = await tutorService.sendMessage(chatId, message);
```

### 4. **CSS Variables**
Consistent design with CSS custom properties:

```css
:root {
  --primary: #6366f1;
  --spacing-md: 1rem;
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.button {
  background: var(--primary);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-lg);
}
```

## 🔐 Authentication

Login flow:
1. User enters email + password on `/login`
2. `authService.login()` calls `/auth/login` API
3. Backend returns JWT token
4. Token stored in localStorage and appStore
5. Added to all subsequent requests as `Authorization: Bearer {token}`

## 🤖 AI Integration Points

The frontend calls these endpoints - implement in backend:

### Tutoring
```
POST /api/tutor/chat/message
GET /api/tutor/chat/:id
POST /api/tutor/review-code
```

### Flashcards
```
POST /api/flashcards/generate  # PDF → cards (Claude)
POST /api/flashcards/response  # Record answer
GET /api/flashcards/review/:id
```

### Quiz
```
POST /api/quiz/start
POST /api/quiz/answer
GET /api/quiz/results/:id
```

### Study Plan
```
POST /api/study-plan/generate  # Claude generates plan
PUT /api/study-plan/:id
GET /api/study-plan/progress
```

## 📱 Mobile Responsive

All components use flexbox/grid and breakpoints:

```css
@media (max-width: 768px) {
  .chat-sidebar { width: 100%; }
  .flashcard { height: 250px; }
}
```

## 🛠️ Development Tips

### Add a New Page
1. Create `src/pages/MyPage.js`
2. Import in `router.js`
3. Add to `routes` object
4. Navigate with `navigate('/my-page')`

### Add a New Component
1. Create `src/components/folder/MyComponent.js`
2. Export as default function
3. Use with `h(MyComponent, { prop: value })`

### Add a New Service
1. Create `src/services/myService.js`
2. Use `apiClient` for HTTP:
   ```javascript
   const response = await apiClient.get('/endpoint');
   ```

### Styling
- Use CSS variables for colors/spacing
- Add component styles to `src/styles/`
- Keep styles modular and component-scoped

## 📊 State Flow

```
User Action (click, input)
        ↓
Component Event Handler
        ↓
Service Call (apiClient.post)
        ↓
appStore.setState() 
        ↓
Listeners Notified
        ↓
Component Re-render
```

## 🔄 API Client Features

```javascript
import { apiClient } from './services/api.js';

// Automatic auth header
apiClient.setToken(token);

// Automatic error handling (401 → redirect to login)
try {
  const data = await apiClient.get('/endpoint');
} catch (error) {
  console.error(error.message);
}

// File uploads
await apiClient.uploadFile('/upload', file, { deckId });

// Request/Response interceptors
apiClient.addRequestInterceptor((config) => {
  console.log('Request:', config);
  return config;
});
```

## 🚀 Deployment

### Frontend Only (Static)
```bash
# Netlify / Vercel
# Point to `public/` directory
# Set API_BASE_URL env var to production API

# Or traditional hosting
scp -r public/* user@server:/var/www/smart-education
```

## 📝 Next Steps

1. **Backend Setup** - Use backend starter code from docs
2. **Database** - Set up PostgreSQL + Prisma
3. **Claude API Integration** - Add to backend services
4. **Testing** - Add unit tests in `tests/`
5. **Styling** - Customize colors in `variables.css`

## 🎓 Learning Path

1. Read `src/utils/h.js` - understand DOM creation
2. Read `src/state/store.js` - understand state management
3. Read `src/services/api.js` - understand API wrapper
4. Read `src/pages/StudentDashboard.js` - understand component structure
5. Read `src/router.js` - understand routing

## 🐛 Debugging

```javascript
// Log all state changes
appStore.subscribeAll((state, key) => {
  console.log('State changed:', key, state);
});

// View state history
console.log(appStore.getHistory());

// Inspect store
console.log(appStore.getState());
```

## 📚 API Reference

### appStore
- `getState(key)` - Get state value
- `setState(key, value)` - Update state
- `subscribe(key, listener)` - Listen to changes
- `batchUpdate(updates)` - Update multiple values

### apiClient
- `get(endpoint, options)`
- `post(endpoint, data, options)`
- `put(endpoint, data, options)`
- `delete(endpoint, options)`
- `uploadFile(endpoint, file, data)`

### h() function
- `h(tag, props, children)`
- `h(Component, props, children)`
- Returns HTMLElement

## 📞 Support

For issues or questions, refer to the backend documentation or file an issue.

---

**Happy Learning! 🎓**
