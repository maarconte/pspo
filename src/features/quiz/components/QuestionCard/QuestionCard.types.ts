import { Question } from "../../../../utils/types";
export interface QuestionCardProps {
  question: Question;
  currentQuestion: number;
  showAnswer: boolean;
  isReadOnly?: boolean;
  /** Show the question's domain tag above the title (end-of-quiz review only). */
  showDomain?: boolean;
}
