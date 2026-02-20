import { memo } from "react";
import { UserAnswer } from "../../../../utils/types";

type QuestionNavigationButtonProps = {
  index: number;
  isActive: boolean;
  setCurrentQuestion: (index: number) => void;
  userAnswer?: UserAnswer;
};

export const QuestionNavigationButton = memo(({
  index,
  isActive,
  setCurrentQuestion,
  userAnswer,
}: QuestionNavigationButtonProps) => {
  const isAnswered = !!userAnswer;
  const isBookmarked = userAnswer?.isBookmarked;

  return (
    <button
      onClick={() => setCurrentQuestion(index)}
      className={`QuestionNavigation__button ${
        isActive ? "active" : ""
      } ${isAnswered ? "answered" : ""} ${
        isBookmarked ? "bookmarked" : ""
      }`}
      disabled={isActive}
    >
      {index + 1}
    </button>
  );
});

QuestionNavigationButton.displayName = "QuestionNavigationButton";
