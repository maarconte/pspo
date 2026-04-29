# study-group - PSPO & PSM Certification Prep

An interactive study platform designed for Professional Scrum Product Owner (PSPO) and Professional Scrum Master (PSM) certification preparation. Built with React 19, TypeScript, and Firebase.

## 🚀 Key Features

### 📝 Interactive Quiz Mode
- **Realistic Simulation**: 80 randomly selected questions per session.
- **Time Pressure**: Built-in 60-minute timer for exam conditions.
- **Immediate Feedback**: Optional answer disclosure with detailed feedback.
- **Bookmarking**: Save difficult questions to review them later in your profile.

### 📊 Performance Analytics
- **Personal Dashboard**: Track your success rate and average response time over time.
- **History Tracker**: Review previous sessions and identify patterns in your errors.
- **Wrong Answers Analysis**: A dedicated section to specifically review and master the concepts you missed.

### 👥 Collaboration & Co-op
- **Co-op Mode**: Study together! Add participants and rotate turns automatically as you progress through the quiz.
- **Activity Monitoring**: Visual indicators of whose turn it is in co-op sessions.

### 🔐 Security & UX
- **Magic Link Auth**: Secure, passwordless authentication via email.
- **Idle Timeout**: Automatic protection that logs out inactive sessions after 30 minutes.
- **Premium UI**: Modern glassmorphism design with smooth animations and responsive layouts.
- **Info Popups**: Contextual notifications for new features and helpful study tips.

### 🛠 Administrative Dashboard
- **Question Management**: Full CRUD capabilities for the question database.
- **User Permissions**: Role-based access control (Admin, Developer, Client).
- **Import/Export**: Easy question management via CSV integration.

## 🛠 Tech Stack

### Core
- **React 19** - UI Library (utilizing the new React Compiler)
- **TypeScript** - Strict static typing
- **Vite** - High-performance build tool
- **React Router 7** - Declarative routing

### State Management & Data
- **Zustand** - Atomic state management with persistence
- **Firebase** - Authentication (Magic Links), Firestore (Database), and Cloud Functions

### UI & Styling
- **SCSS** - Modular design system
- **Lucide React** - Modern iconography
- **RSuite** - Specialized UI components
- **React Toastify** - Real-time notifications
- **Recharts** - Dynamic performance visualization

## 📊 Google Analytics 4 (GA4)

The application tracks user engagement and learning progress through custom GA4 events.

### Implemented Events

| Event Name | Description | Parameters |
|:---|:---|:---|
| `login_success` | User successfully authenticated via Magic Link. | - |
| `quiz_started` | A new quiz session was initiated. | `formation`, `is_logged_in` |
| `coop_session_started` | A collaborative session began with 2+ participants. | `formation`, `participant_count` |
| `quiz_completed` | User reached the end of the quiz. | `formation`, `score_pct`, `passed`, `total_time_sec`, `questions_answered`, `bookmarks_count` |
| `quiz_restarted` | User reset the current session to start over. | `formation`, `previous_score_pct` |
| `question_bookmarked` | A question was saved for future review. | `question_id`, `question_index` |
| `question_unbookmarked`| A question was removed from bookmarks. | `question_id`, `question_index` |

### Debugging
To enable GA4 debug mode locally, add `?ga_debug` to the URL. This will bypass the localhost disable filter and send events to the GA4 DebugView.

## 🏗️ Architecture

The project follows a **Feature-Based Architecture** for maximum scalability:

```text
src/
├── features/          # Domain-specific logic
│   ├── admin/         # Question CRUD & Management
│   ├── auth/          # Authentication & Role guards
│   ├── coop/          # Multi-user study logic
│   ├── info-popup/    # Contextual notifications
│   └── quiz/          # Core quiz engine & components
├── ui/                # Shared UI Kit (Button, Input, Modal, etc.)
├── pages/             # Route-level views
├── stores/            # Global/Atomic Zustand stores
├── hooks/             # Shared custom React hooks
├── lib/               # Third-party configurations (Firebase)
└── utils/             # Helper functions & types
```

## 🛠️ Development

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase**:
   Create a `.env` file or update `src/firebase.js` with your Firebase credentials.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

### Quality Standards

This project adheres to the **"Torvalds Quality Protocol"**:
- **Strict Typing**: No `any` shortcuts.
- **Atomic Selectors**: Zustand stores must be consumed via selectors to prevent unnecessary re-renders.
- **React 19 Actions**: Prioritize `useActionState` and modern form handling.
- **No Over-memoization**: Trust the React Compiler unless dealing with heavy computations.

## 📄 License

Private project - designed for personal and study group use only.

---

**Current Version:** 2.3.0
