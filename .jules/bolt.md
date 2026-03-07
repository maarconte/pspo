## 2024-05-20 - Avoid `useState` for interval-based tracking values not rendered in DOM

**Learning:** Managing an interval-based counter (like `timeSpent` tracking seconds) with `useState` triggers component re-renders every second. In components like `Quizz.tsx`, this can unnecessarily re-render the entire quiz view (and all its children) even if the value is never directly rendered, leading to performance degradation.

**Action:** For variables tracking state that only needs to be read during specific events or transitions (e.g. tracking total seconds for a completion notification, rather than showing a live timer), use `useRef` to hold the current value and mutate `.current`. This eliminates the unnecessary $O(n)$ re-renders associated with `useState`.
