## 2024-03-20 - Interval State React Anti-Pattern
**Learning:** Using `useState` to track background metrics (like `timeSpent` in `Quizz.tsx` via `setInterval`) causes unnecessary full-tree re-renders every second, even when the value is only read intermittently (e.g., when transitioning to the next question).
**Action:** Always prefer `useRef` over `useState` for tracking values that update frequently but do not need to trigger visual UI updates immediately.
