## 2024-03-02 - Memoize Table Columns in `@tanstack/react-table`
**Learning:** In `@tanstack/react-table`, recreating the `columns` configuration array on every render is a common anti-pattern that forces the table to deeply re-evaluate its internal state, causing performance degradation (especially with large datasets).
**Action:** Always wrap column definitions and their associated handlers (like `handleSelectQuestion`) in `useMemo` and `useCallback` to ensure stable references across renders, keeping `selectedQuestions` and other necessary dependencies updated.
