
## 2024-03-22 - [React Table v8 Memoization]
**Learning:** React Table v8 (`@tanstack/react-table`) requires strict memoization of its options such as `columns` and `filterFns` and `data`. Failing to memoize causes the core to constantly recompute the entire internal pipeline and table instance upon every single component re-render. Additionally, extracting static objects/arrays outside components prevents repeated memory allocations during table rows rendering.
**Action:** Always wrap `columns`, config objects like `filterFns` and dependencies within `useMemo` and `useCallback` when working with React Table v8. Extract static lists out of render loops and table cell definitions.
