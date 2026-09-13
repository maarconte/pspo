import { Timestamp } from "firebase/firestore";

/**
 * Default date for legacy questions missing createdAt/updatedAt fields.
 * Set to November 12, 2024.
 */
export const DEFAULT_QUESTION_DATE = Timestamp.fromDate(new Date(2024, 10, 12));

/**
 * Firestore collection used for questions. Defaults to "questions_dev" in
 * `npm run dev` and "questions" in production builds, so local testing
 * (e.g. CSV imports) never touches published questions. Override with
 * VITE_FIREBASE_QUESTIONS_COLLECTION to point at a different collection.
 */
export const QUESTIONS_COLLECTION =
  import.meta.env.VITE_FIREBASE_QUESTIONS_COLLECTION ||
  (import.meta.env.DEV ? "questions_dev" : "questions");
