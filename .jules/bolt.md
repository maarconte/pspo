
## 2024-03-04 - Memoize `columns` array in React Table
**Learning:** React Table instances recreate themselves entirely whenever the `columns` definition array is recreated on component render, causing massive unnecessary re-renders when local component state changes.
**Action:** Always wrap `columns` configuration for `@tanstack/react-table` in a `useMemo` block, and verify handler callbacks within columns are memoized via `useCallback` to minimize the dependency array footprint.
