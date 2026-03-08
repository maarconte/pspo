## 2024-03-08 - TableActions Batch Optimization
**Learning:** `setCsvData([])` is called inside a `forEach` loop in `TableActions.tsx` when adding questions from CSV (`addAllQuestions`). Since `setCsvData` causes a re-render, calling it N times in a loop will trigger an excessive number of redundant re-renders. Also, `handleAdd` is an async mutation wrapper but isn't awaited in a loop.
**Action:** Always move React state updates (like `setCsvData`) outside of loops. If batching multiple asynchronous calls, use `Promise.all` and wait for completion before setting state or triggering toasts.
