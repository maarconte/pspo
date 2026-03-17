
## 2024-11-20 - Memoizing react-table v8+ Configurations
**Learning:** When using `@tanstack/react-table` (v8+), failure to memoize complex configuration objects (like `columns` arrays containing handlers, `filterFns` objects, or handlers passed into column definitions) causes `useReactTable` to recreate the entire table instance and reconstruct internal data pipelines on every single render. This leads to massive performance bottlenecks in list and table rendering.
**Action:** Always wrap column definitions (`useMemo`), handlers used in cells (`useCallback`), and custom filter/sorting functions (`useMemo` for objects, or declared outside the component) in memoization hooks to guarantee reference stability, being careful to list all accessed state in dependencies.
