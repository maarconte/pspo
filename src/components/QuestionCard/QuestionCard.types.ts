<<<<<<< HEAD
import { Question } from "../../utils/types";
export interface QuestionCardProps {
  question: Question;
=======
export interface QuestionCardProps {
  question: {
    title: string;
    feedback: string;
    answers: string[];
    answerType: string;
    answer: number | number[] | boolean;
  };
>>>>>>> aab479d (Last components)
  currentQuestion: number;
  showAnswer: boolean;
}
