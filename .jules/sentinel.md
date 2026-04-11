## 2024-05-24 - Leaking Authentication Errors
**Vulnerability:** Raw Firebase `error.code` and `error.message` strings were concatenated and rendered directly to the user in the `AuthContainer` component upon failed login, registration, or OAuth attempts.
**Learning:** Returning unhandled upstream error structures back to the client leaks details of internal system libraries (e.g. `firebase/auth`) and creates a user enumeration risk where attackers can verify whether specific email addresses correspond to existing accounts (e.g., distinguishing between `auth/user-not-found` and `auth/wrong-password`).
**Prevention:** Always catch and handle errors on the client side, then map specific codes to generic error messages for end-users (e.g. "Identifiants invalides.") using centralized error handlers like `src/features/auth/utils/authErrors.ts`.
## 2025-04-11 - Leaking API Error Messages
**Vulnerability:** Raw Firebase `error.message` strings were being exposed in thrown errors in `authService.ts`, `roleService.ts`, and `functions/src/index.ts`.
**Learning:** Exposing raw, third-party error messages in application exceptions can leak details about internal infrastructure, API keys, or system state. Even if these messages are meant for the frontend console, they represent unnecessary information leakage.
**Prevention:** Always map third-party API errors to safe, generic application-level errors using centralized handlers (like `getAuthErrorMessage`) or generic fallback strings before throwing them up the call stack or returning them via HTTP.
