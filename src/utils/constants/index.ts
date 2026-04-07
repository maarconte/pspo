import { Timestamp } from "firebase/firestore";

/**
 * Default date for legacy questions missing createdAt/updatedAt fields.
 * Set to November 12, 2024.
 */
export const DEFAULT_QUESTION_DATE = Timestamp.fromDate(new Date(2024, 10, 12));
