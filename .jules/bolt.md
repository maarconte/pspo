## 2024-03-28 - Firestore Bulk Operations N+1
**Learning:** Bulk operations (like deletions or additions) implemented using a loop that calls a singular document operation (e.g., `useDeleteDoc`, `useAddDoc`) create an N+1 network request anti-pattern. This hits Firestore quotas faster and blocks the thread.
**Action:** Always implement dedicated bulk operations hooks (`useDeleteDocs`, `useAddDocs`) utilizing Firestore's `writeBatch`, and chunk items into groups of 500 to respect Firestore limits.
