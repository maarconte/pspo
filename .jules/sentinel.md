## 2024-05-24 - Leaking Authentication Errors
**Vulnerability:** Raw Firebase `error.code` and `error.message` strings were concatenated and rendered directly to the user in the `AuthContainer` component upon failed login, registration, or OAuth attempts.
**Learning:** Returning unhandled upstream error structures back to the client leaks details of internal system libraries (e.g. `firebase/auth`) and creates a user enumeration risk where attackers can verify whether specific email addresses correspond to existing accounts (e.g., distinguishing between `auth/user-not-found` and `auth/wrong-password`).
**Prevention:** Always catch and handle errors on the client side, then map specific codes to generic error messages for end-users (e.g. "Identifiants invalides.") using centralized error handlers like `src/features/auth/utils/authErrors.ts`.

## 2026-04-22 - Information Leakage in Cloud Functions
**Vulnerability:** Raw error messages (`error.message`) generated inside Firebase Cloud Functions catch blocks were directly concatenated with `functions.https.HttpsError` and thrown to the client.
**Learning:** Exposing raw backend error details inside exceptions thrown to clients can leak sensitive environment details or stack traces, potentially revealing internal system behavior and aiding attackers in exploiting vulnerabilities.
**Prevention:** Remove backend error concatenations. Always catch and log raw errors server-side using `functions.logger.error`, while returning a predefined, generic `HttpsError` to the client that does not leak internal state.
