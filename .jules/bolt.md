## 2024-05-18 - Missing memoization for React Table columns

**Learning:** `@tanstack/react-table` heavily relies on the stability of objects passed to `useReactTable`. If configuration objects like `columns` are redefined on every render in a component (e.g. `TableQuestions.tsx`), the table will needlessly reconstruct its internal column definition and pipeline states on each render, leading to significant performance hits especially as row count scales up.

**Action:** Always wrap column definitions and other complex configuration objects passed to `@tanstack/react-table` in `useMemo`, ensuring all external state accessed within column definitions are appropriately listed in the dependency array.