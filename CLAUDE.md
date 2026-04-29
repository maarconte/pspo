# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PSPO/PSM Certification Prep — an interactive study platform for Scrum certification preparation. React 19 + TypeScript frontend deployed on GitHub Pages, with Firebase (Auth + Firestore + Cloud Functions) as the backend.

## Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000
npm run build            # TypeScript check + Vite build

# Testing
npm run test             # Vitest in watch mode
npm run test:run         # Run all tests once
npm run test:run -- src/path/to/file.test.tsx  # Run a single test file
npm run test:coverage    # Generate coverage report (v8)
npm run test:ui          # Open Vitest UI dashboard

# Deploy
npm run deploy           # Build + deploy to GitHub Pages (gh-pages)
```

```bash
# Cloud Functions (from /functions)
npm run build            # Compile TypeScript → lib/
npm run serve            # Run Firebase emulator locally
npm run deploy           # Deploy functions to Firebase
```

## Architecture

### Feature-Based Structure

```text
src/
├── features/            # Domain modules (admin, auth, coop, quiz, support, ...)
├── pages/               # Route-level components (lazy-loaded)
├── stores/              # Zustand global state
├── hooks/               # Shared hooks
├── lib/
│   ├── firebase/        # Firebase auth + Firestore setup
│   └── react-query/     # TanStack Query client (staleTime: 5min, no window-focus refetch)
├── ui/                  # Reusable component kit
└── utils/
    ├── routes/          # Route definitions
    ├── types/
    ├── constants/
    └── helpers/
```

### State Management (Zustand)

Stores live in `src/stores/`. Always consume via selectors to prevent unnecessary re-renders.

Key stores:

- `useQuestionsStore` — quiz questions, answers, scoring, bookmarks (core logic)
- `useUserStore` — auth state and user roles
- `useCoopStore` — co-op mode participants & turn management (persisted to localStorage)
- `useQuizStatsStore` — timing & performance analytics

### Routing

Uses **HashRouter** (required for GitHub Pages). Routes are defined in `src/utils/routes/index.tsx`. Protected routes are wrapped with `AuthChecker`. Pages are lazy-loaded.

### Authentication

Magic Link (passwordless email) via FirebaseUI. Role-based access: `dev` > `admin` > `client`. Roles are set via the `setUserRole` Cloud Function and stored as Firebase custom claims. Idle timeout after 30 minutes.

### Quiz Engine

80 random questions per session, filtered by formation type (PSPO-I, PSM, etc.). Supports single and multi-answer questions. Score calculation is centralized in `useQuestionsStore.getSuccessPercentage()`.

### Firebase / Environment

Firebase credentials are injected via `VITE_FIREBASE_*` env vars (see `src/firebase.js`). In tests, these are mocked in `src/test/setup.ts` — do not import real Firebase modules in tests.

### Cloud Functions

Three functions in `functions/src/index.ts`:

- `setUserRole` — callable, dev-only, assigns roles
- `onUserCreated` — auth trigger, auto-assigns `client` role + creates Firestore doc
- `deleteUser` — callable, dev-only, deletes user + all associated data

### Build

Vite 5, base path is `/pspo/` in production and `/` in dev. SCSS uses the modern Sass compiler API (not legacy). TypeScript strict mode is enabled throughout.

## Linear Issue Creation

To create a Linear issue on demand, run:

```bash
python3 .github/scripts/linear_create.py --title "Issue title" [--description "..."] [--priority 3]
```

Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low (default: 0)

Issues are automatically assigned to project **Study Group** and to `marconte@thatmuch.fr`.
Requires `LINEAR_API_KEY` in the shell env or in `.env.local`. When the user asks to create a Linear issue, use this script via Bash.

## Git Convention

No enforced commit message format. The `commit-msg` Husky hook has been removed.

## Code Quality Standards

- **No `any`** — use proper types.
- **Atomic Zustand selectors** — subscribe to only what a component needs.
- **React 19 patterns** — prefer `useActionState` for form handling over manual state.
- **No premature memoization** — trust the React Compiler; only memoize demonstrably expensive computations.
