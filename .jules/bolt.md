## 2025-03-05 - Optimize TanStack React Table columns and filters memoization
**Learning:** In `@tanstack/react-table` (v8+), passing unstable references for `columns`, `filterFns`, and other configuration objects to `useReactTable` causes severe performance degradation, as it reconstructs internal state and pipelines on every render.
**Action:** Always memoize `columns` (with `useMemo`) and associated cell handlers (with `useCallback`), as well as other complex objects like `filterFns`, when configuring `useReactTable` instances.
