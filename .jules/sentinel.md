## 2024-05-24 - Leaking Authentication Errors
**Vulnerability:** Raw Firebase `error.code` and `error.message` strings were concatenated and rendered directly to the user in the `AuthContainer` component upon failed login, registration, or OAuth attempts.
**Learning:** Returning unhandled upstream error structures back to the client leaks details of internal system libraries (e.g. `firebase/auth`) and creates a user enumeration risk where attackers can verify whether specific email addresses correspond to existing accounts (e.g., distinguishing between `auth/user-not-found` and `auth/wrong-password`).
**Prevention:** Always catch and handle errors on the client side, then map specific codes to generic error messages for end-users (e.g. "Identifiants invalides.") using centralized error handlers like `src/features/auth/utils/authErrors.ts`.
## 2024-05-24 - Leaking Internal Errors in Cloud Functions
**Vulnerability:** Raw error messages from backend services (like `admin.auth()` or `admin.firestore()`) were caught and directly appended to the error message thrown back to the client via `functions.https.HttpsError`.
**Learning:** Exposing raw `error.message` strings from backend infrastructure leaks internal details (e.g., database structures, library behavior) and stack traces. This violates the principle of not exposing internal system details to end-users.
**Prevention:** Cloud functions must securely log the detailed error internally (`functions.logger.error`) but only return generic, sanitized error messages (e.g., "Une erreur interne est survenue") to the client.
