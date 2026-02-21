import { memo } from "react";
import { UserAnswer } from "../../../../utils/types";

interface QuestionNavigationButtonProps {
  index: number;
  isActive: boolean;
  setCurrentQuestion: (index: number) => void;
  userAnswer?: UserAnswer;
}

export const QuestionNavigationButton = memo(
  ({
    index,
    isActive,
    setCurrentQuestion,
    userAnswer,
  }: QuestionNavigationButtonProps) => {
    // Check if the answer exists. If userAnswer is undefined (sparse array hole), it's false.
    // If it exists, it's considered answered (matching existing behavior).
    const isAnswered = !!userAnswer;
    const isBookmarked = userAnswer?.isBookmarked;

    return (
      <button
        onClick={() => setCurrentQuestion(index)}
        className={`QuestionNavigation__button ${isActive ? "active" : ""} ${
          isAnswered ? "answered" : ""
        } ${isBookmarked ? "bookmarked" : ""}`}
        disabled={isActive}
        aria-label={`Go to question ${index + 1}`}
      >
        {index + 1}
      </button>
    );
  }
);

QuestionNavigationButton.displayName = "QuestionNavigationButton";
