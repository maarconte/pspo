export interface QuestionCardProps {
  question: {
    title: string;
    feedback: string;
    answers: string[];
    answerType: string;
    answer: number | number[] | boolean;
  };
  currentQuestion: number;
  showAnswer: boolean;
}
