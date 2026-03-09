# Bolt's Journal

## 2026-03-09 - Memoize TanStack Table Columns
**Learning:** In `@tanstack/react-table` (v8+), defining the `columns` array inside the component without `useMemo` causes the table to reconstruct its internal pipeline (sorting, filtering, etc.) on every render, leading to significant performance degradation on large datasets. Dependencies must include all accessed state.
**Action:** Always wrap `columns` definitions in `useMemo` and ensure all referenced handler functions are wrapped in `useCallback` and placed before the `columns` definition.