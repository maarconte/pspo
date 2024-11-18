<<<<<<< HEAD
import { Timestamp } from "firebase/firestore";

=======
>>>>>>> 1629881 (utils)
export type UserAnswer = {
  question: number;
  answer: number | number[] | boolean;
  isBookmarked?: boolean;
};

export type Question = {
<<<<<<< HEAD
  id: string;
=======
>>>>>>> 1629881 (utils)
  title: string;
  feedback: string;
  answers: string[];
  answerType: string;
  answer: number | number[] | boolean;
  isFlagged?: boolean;
<<<<<<< HEAD
  comments?: string[];
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
=======
>>>>>>> 1629881 (utils)
};
