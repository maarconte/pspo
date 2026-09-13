import { Timestamp } from "firebase/firestore";

export type UserAnswer = {
  question: number;
  answer: number | number[] | boolean;
  isBookmarked?: boolean;
};

export type Question = {
  id: string;
  title: string;
  feedback: string;
  answers: string[];
  answerType: string;
  answer: number | number[] | boolean;
  isFlagged?: boolean;
  comments?: string[];
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
  type?: string;
  /**
   * Per-answer explanations. Index-aligned with `answers` for "S"/"M".
   * For "TF" (which has no `answers`), index 0 is the explanation for
   * True and index 1 for False, mirroring the implicit order used
   * elsewhere for TF questions (see getAnswerLabel/isUserChoice).
   * Not surfaced in the UI yet.
   */
  answerExplanations?: string[];
  /** Free-text topic/category imported from external question banks. Not surfaced in the UI yet. */
  domain?: string;
};

export * from "./stats";
