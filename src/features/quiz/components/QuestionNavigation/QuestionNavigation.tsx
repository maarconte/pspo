import "./style.scss";

import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

type Props = {
  setCurrentQuestion: (index: number) => void;
  currentQuestion: number;
};

export default function QuestionNavigation({
  setCurrentQuestion,
  currentQuestion,
}: Props) {
  const userAnswers = useQuestionsStore((s) => s.userAnswers);

  const isQuestionAnswered = (index: number) => {
    const userAnswer = userAnswers[index];
    return userAnswer?.answer !== undefined;
  };

  const isBookmarked = (index: number) => {
    return !!userAnswers[index]?.isBookmarked;
  };

  return (
    <div className="QuestionNavigation">
      {Array.from({ length: 80 }, (_, i) => {
        const isCurrent = currentQuestion === i;
        const answered = isQuestionAnswered(i);
        const bookmarked = isBookmarked(i);

        return (
          <button
            key={i}
            onClick={() => setCurrentQuestion(i)}
            className={`QuestionNavigation__button ${
              isCurrent ? "active" : ""
            } ${answered ? "answered" : ""} ${
              bookmarked ? "bookmarked" : ""
            }`}
            disabled={isCurrent}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
