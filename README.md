# Smart Education — Complete Starter Kit 🎓🤖

AI-powered personalized learning platform built with React, Vite, OpenAI ChatGPT, and dynamic Web Reference Gathering.

---

## 📦 What's Included

### Modern Frontend (React + Vite)

- **AI Tutor with Web References**: Dynamic tutoring chat powered by OpenAI (`gpt-4o-mini`) and automatic educational citation discovery (MIT OpenCourseWare, Khan Academy, Stanford CS, MDN, arXiv, etc.).
- **Interactive Flashcards**: Spaced repetition viewer, PDF slide/note extraction, and interactive Teacher Deck Builder.
- **Adaptive Quiz Engine**: Interactive student quiz runner and Teacher Quiz Builder.
- **Dynamic Study Plan**: Automated weekly study schedule generator with timeline tracking.
- **Teacher & Student Portals**: Role-specific dashboards, student progress tracking, class analytics, and note editor.
- **User Profiles**: Comprehensive profiles for both students and teachers with academic history, stats, and subject management.

### Key Features

- ✅ Live AI Tutoring with OpenAI ChatGPT (`gpt-4o-mini`)
- ✅ Automated Educational Web Reference & Citation Gathering
- ✅ Reference Hub with Citation Export & Source Filtering
- ✅ Interactive Code Sandbox for in-chat programming practice
- ✅ Spaced Repetition Flashcard System with Deck Builder
- ✅ Adaptive Quiz Engine with Timer & Instant Explanations
- ✅ Dynamic Study Plan Timeline
- ✅ Teacher Course & Note Management
- ✅ Standalone Offline Mode with Instant Mock Data
- ✅ Responsive Glassmorphism Design with Dark/Light Tokens

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/roshinrg/smart-education-starter.git
cd smart-education-starter

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Copy the example configuration file:

```bash
cp .env.example .env
```

Edit `.env` to configure your API keys:

```env
# API Configuration (optional backend server)
API_BASE_URL=http://localhost:5000/api

# OpenAI / ChatGPT API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Frontend Direct Access (standalone mode)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini
```

> **Note**: If `VITE_OPENAI_API_KEY` is omitted, the application runs in offline educational simulation mode with verified reference materials and mock responses.

### 3. Run Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:5173` (or the port displayed in your terminal).

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```text
smart-education-starter/
├── public/                 # Static assets & HTML template
│   └── index.html
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Button, Card, Modal, Navbar
│   │   ├── flashcards/     # FlashcardViewer, PdfUpload
│   │   ├── quiz/           # QuizWindow
│   │   ├── studyPlan/      # PlanGenerator, PlanTimeline
│   │   ├── teacher/        # FlashcardDeckBuilder, QuizBuilder, NoteEditor
│   │   └── tutor/          # ChatWindow, CodeSandboxModal, WebReferencesDrawer
│   ├── pages/              # Full page views
│   │   ├── FlashcardsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── QuizPage.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── StudyPlanPage.jsx
│   │   ├── TeacherDashboard.jsx
│   │   └── TutorPage.jsx
│   ├── services/           # Service & API layer
│   │   ├── api.js          # Centralized HTTP client + mock fallback
│   │   ├── authService.js
│   │   ├── flashcardService.js
│   │   ├── openaiService.js
│   │   ├── quizService.js
│   │   ├── studyPlanService.js
│   │   ├── teacherService.js
│   │   └── tutorService.js
│   ├── state/              # Reactive store
│   │   └── store.js
│   ├── styles/             # Modular CSS styles
│   │   ├── flashcards.css
│   │   ├── global.css
│   │   ├── tutor.css
│   │   └── variables.css
│   ├── App.jsx             # Root application component & routing
│   ├── main.jsx            # Vite React entry point
│   └── router.js           # Client-side route declarations
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules (protects secrets & node_modules)
├── package.json            # Scripts & project metadata
├── README.md               # Project documentation
└── vite.config.js          # Vite configuration
```

---

## 🤖 AI & Web Research Integration

### 1. OpenAI ChatGPT Integration

The platform connects to OpenAI's Chat Completions API (`gpt-4o-mini`) via [`src/services/openaiService.js`](file:///d:/Semester%205/smart-education-starter/src/services/openaiService.js):

- Configured using `VITE_OPENAI_API_KEY` or dynamically saved in `localStorage.getItem('openai_api_key')`.
- Formulates pedagogical prompts tailored to subject areas (Computer Science, Math, Science, Humanities).

### 2. Verified Web Reference Gathering

Whenever a student asks a question in the AI Tutor, the system automatically retrieves relevant citations and reference materials:

- **Computer Science**: MIT OpenCourseWare, Stanford CS, MDN Web Docs, GeeksforGeeks, React Docs.
- **Mathematics**: Khan Academy, MIT 18.01, Wolfram MathWorld.
- **Sciences**: Nature Scitable, NCBI Bookshelf, Khan Academy Science.
- **General Academia**: arXiv.org, Wikipedia Open Knowledge.

Students can view source badges, copy formatted academic citations with one click, or review all session citations in the **Reference Hub**.

---

## 🔐 Authentication & Roles

The app supports two primary roles:

- **Student**: Access to AI Tutor, Interactive Flashcards, Adaptive Quizzes, Study Plans, and Learning Analytics.
- **Teacher**: Access to Class Management, Flashcard Deck Builder, Quiz Builder, Note Publishing, and Student Mastery Tracking.

Authentication tokens are managed via [`src/services/authService.js`](file:///d:/Semester%205/smart-education-starter/src/services/authService.js) and injected into all outgoing requests.

---

## 📊 Available Scripts

In the project directory, you can run:

```bash
# Start Vite development server
npm run dev

# Build production bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 🛡️ Security Best Practices

- Never commit `.env` or files containing secret API keys to version control.
- `.gitignore` is preconfigured to exclude `.env`, `node_modules/`, and build artifacts (`dist/`).
- Use `.env.example` as a template for team onboarding.

---

## 📞 Support & Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

### Happy Learning! 🎓
