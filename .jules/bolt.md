## 2024-03-21 - Optimization Log

**Learning:** `useReactTable` instances often re-render excessively when state is updated because non-primitive objects (like column definitions) or array references constantly change, forcing the table to re-compute internally or triggering unwanted effects.

**Action:** Wrap array states in `useMemo` and functions in `useCallback` when passing them into dependencies or props that are deeply watched, particularly `columns` for `@tanstack/react-table`.
