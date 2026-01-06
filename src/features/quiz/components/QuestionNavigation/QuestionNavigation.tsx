import "./style.scss";

import { Button } from "@/components/ui/button";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

type Props = {
  setCurrentQuestion: (index: number) => void;
  currentQuestion: number;
};

export default function QuestionNavigation({
  setCurrentQuestion,
  currentQuestion,
}: Props) {
  const { userAnswers } = useQuestionsStore();
  const isQuestionAnswered = (index: number) => {
    return userAnswers.some((answer) => answer.question === index);
  };

  const isBookmarked = (index: number) => {
    return userAnswers.some(
      (answer) => answer.question === index && answer.isBookmarked
    );
  };

  return (
    <div className="QuestionNavigation">
      {Array.from({ length: 80 }, (_, i) => (
        <Button
          key={i}
          variant={currentQuestion === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentQuestion(i)}
          className={`QuestionNavigation__button ${
            isQuestionAnswered(i) ? "answered" : ""
          } ${
            isBookmarked(i) ? "bookmarked" : ""
          }`}
          disabled={currentQuestion === i}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
