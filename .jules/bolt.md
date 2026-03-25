
## 2025-03-25 - N+1 Firestore Mutations & Loop-Based State Re-renders
**Learning:** Performing multiple `addDoc` or `deleteDoc` operations inside `forEach` loops directly from components like `TableActions` and `TableQuestions` led to N+1 network requests and significant state thrashing (calling `setCsvData([])` repetitively inside an iterator loop resulting in O(N) re-renders).
**Action:** Create batch operation hooks (`useAddDocs`, `useDeleteDocs`) encapsulating Firestore's `writeBatch`, breaking larger operations into 500-chunk bundles. Handle state resets globally after the `Promise.all` completion rather than in individual iteration steps.
