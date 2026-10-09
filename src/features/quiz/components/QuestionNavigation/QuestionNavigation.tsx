import "./style.scss";

import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import {
  ReviewFilter,
  getQuestionStatus as computeStatus,
} from "../../utils/reviewFilter";

type Props = {
  setCurrentQuestion: (index: number) => void;
  currentQuestion: number;
  isFinished?: boolean;
  filter?: ReviewFilter;
  onFilterChange?: (filter: ReviewFilter) => void;
};

const FILTERS: { value: ReviewFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "incorrect", label: "Incorrect" },
  { value: "correct", label: "Correct" },
  { value: "bookmarked", label: "Bookmarked" },
];

export default function QuestionNavigation({
  setCurrentQuestion,
  currentQuestion,
  isFinished = false,
  filter = "all",
  onFilterChange,
}: Props) {
  const userAnswers = useQuestionsStore((s) => s.userAnswers);
  const questions = useQuestionsStore((s) => s.questions);

  const isQuestionAnswered = (index: number) => {
    const userAnswer = userAnswers?.[index];
    return userAnswer?.answer !== undefined;
  };

  const isBookmarked = (index: number) => {
    return !!userAnswers?.[index]?.isBookmarked;
  };

  const getQuestionStatus = (index: number) => {
    if (!isFinished) return "";
    return computeStatus(questions[index], userAnswers[index]);
  };

  const indexes = Array.from({ length: questions?.length || 0 }, (_, i) => i);

  return (
    <>
      {isFinished && onFilterChange && (
        <div className="QuestionNavigation__filters">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`QuestionNavigation__filter ${filter === value ? "active" : ""}`}
              onClick={() => onFilterChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="QuestionNavigation">
        {indexes.map((i) => {
          const isCurrent = currentQuestion === i;
          const answered = isQuestionAnswered(i);
          const bookmarked = isBookmarked(i);
          const status = getQuestionStatus(i);

          return (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={`QuestionNavigation__button ${
                isCurrent ? "active" : ""
              } ${answered ? "answered" : ""} ${
                bookmarked ? "bookmarked" : ""
              } ${status}`}
              disabled={isCurrent && !isFinished}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </>
  );
}
