
## 2023-10-24 - React Re-renders caused by timers
**Learning:** Storing `setInterval` ticking values in `useState` within a top-level component (like `Quizz.tsx`) causes re-renders across the whole sub-tree every second. If the value is only needed episodically (like on question change to show a toast), this forces unnecessary render cycles.
**Action:** Use `useRef` to hold ticking values that do not need to be rendered directly to the screen. Read `ref.current` only when the value is actually needed to trigger effects/notifications without triggering a re-render.
