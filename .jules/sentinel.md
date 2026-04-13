## 2024-05-24 - Leaking Authentication Errors
**Vulnerability:** Raw Firebase `error.code` and `error.message` strings were concatenated and rendered directly to the user in the `AuthContainer` component upon failed login, registration, or OAuth attempts.
**Learning:** Returning unhandled upstream error structures back to the client leaks details of internal system libraries (e.g. `firebase/auth`) and creates a user enumeration risk where attackers can verify whether specific email addresses correspond to existing accounts (e.g., distinguishing between `auth/user-not-found` and `auth/wrong-password`).
**Prevention:** Always catch and handle errors on the client side, then map specific codes to generic error messages for end-users (e.g. "Identifiants invalides.") using centralized error handlers like `src/features/auth/utils/authErrors.ts`.
## 2026-04-13 - Prevent Information Leakage in Error Messages
**Vulnerability:** Application UI directly surfaced raw backend and Firebase API error messages via `error.message` in toasts and exceptions.
**Learning:** Passing raw third-party/backend error messages to the frontend can expose sensitive internal structures or database details to malicious actors.
**Prevention:** Catch external API exceptions and map them to generic, user-friendly error strings or use a centralized error utility before displaying or re-throwing them.
