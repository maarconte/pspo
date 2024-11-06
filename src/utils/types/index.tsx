import { FieldValue } from "firebase/firestore";

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
  updatedAt?: FieldValue;
};
