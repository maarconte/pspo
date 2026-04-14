## 2024-05-24 - Leaking Authentication Errors
**Vulnerability:** Raw Firebase `error.code` and `error.message` strings were concatenated and rendered directly to the user in the `AuthContainer` component upon failed login, registration, or OAuth attempts.
**Learning:** Returning unhandled upstream error structures back to the client leaks details of internal system libraries (e.g. `firebase/auth`) and creates a user enumeration risk where attackers can verify whether specific email addresses correspond to existing accounts (e.g., distinguishing between `auth/user-not-found` and `auth/wrong-password`).
**Prevention:** Always catch and handle errors on the client side, then map specific codes to generic error messages for end-users (e.g. "Identifiants invalides.") using centralized error handlers like `src/features/auth/utils/authErrors.ts`.

## 2026-04-14 - Error Message Leakage in Auth Services
**Vulnerability:** Raw third-party API error messages (like Firebase `error.message`) were being thrown un-sanitized in authentication and role services, which could expose internal system details or enable user enumeration if surfaced to the UI.
**Learning:** Third-party APIs frequently embed sensitive structural data or precise failure reasons in their error messages. Passing these un-sanitized to the UI layer bypasses the application's secure error masking.
**Prevention:** Always catch exceptions at the service boundary. Map known error codes to generic, safe error messages using centralized utilities (e.g., `getAuthErrorMessage`), and fallback to static safe strings for unknown errors instead of passing through `error.message`.
