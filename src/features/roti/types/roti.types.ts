import { Timestamp } from 'firebase/firestore';

export type RotiScore = 1 | 2 | 3 | 4 | 5;

/** Where the rating was submitted: end-of-quiz pop-up or the dedicated page. */
export type RotiSource = 'quiz' | 'page';

export const ROTI_SCORES: readonly RotiScore[] = [1, 2, 3, 4, 5];

/** Scores at or below this value show the optional comment field. */
export const ROTI_COMMENT_MAX_SCORE: RotiScore = 3;

export const ROTI_COMMENT_MAX_LENGTH = 1000;

export interface RotiEntry {
  id: string;
  score: RotiScore;
  comment?: string;
  source: RotiSource;
  /**
   * Module the quiz belonged to, as the app identifies it: the formation value
   * (e.g. "pspo-I"), not the module document id. Absent on rating from the
   * ROTI page and on entries saved before this field existed.
   */
  formation?: string | null;
  /** UID of the author; null for anonymous visitors. */
  userId: string | null;
  createdAt: Timestamp;
}

export interface SubmitRotiPayload {
  score: RotiScore;
  comment?: string;
  source: RotiSource;
  formation?: string | null;
  /** Admins and devs may rate as often as they want (tests). */
  unlimited?: boolean;
}

export interface RotiStats {
  total: number;
  /** Average score, or null when there is no rating yet. */
  average: number | null;
  /** Count of ratings per score (1 to 5). */
  distribution: Record<RotiScore, number>;
  /** Ratings carrying a comment, newest first. */
  comments: RotiEntry[];
}
