## 2024-05-20 - [tanstack/react-table: Memoizing configuration objects]
**Learning:** @tanstack/react-table (v8+) reconstructs its internal pipelines and causes unnecessary re-renders of the entire table if complex configuration objects like `columns` or `filterFns` are not memoized and passed as new references on every render.
**Action:** Always wrap the `columns` array in `useMemo` (and handlers in `useCallback` if they are dependencies) and configuration objects like `filterFns` in `useMemo` when configuring a `useReactTable` instance.
