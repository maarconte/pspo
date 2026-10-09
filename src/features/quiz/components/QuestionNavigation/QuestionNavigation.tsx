import "./style.scss";

import { Bookmark, Check, LayoutGrid, X } from "lucide-react";
import { Button_Style, Button_Type } from "../../../../ui/Button/Button.types";
import {
  ReviewFilter,
  getQuestionStatus as computeStatus,
} from "../../utils/reviewFilter";

import Button from "../../../../ui/Button/Button";
import { ReactNode } from "react";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

type Props = {
  setCurrentQuestion: (index: number) => void;
  currentQuestion: number;
  isFinished?: boolean;
  filter?: ReviewFilter;
  onFilterChange?: (filter: ReviewFilter) => void;
};

const FILTERS: {
  value: ReviewFilter;
  label: string;
  icon: ReactNode;
  type: Button_Type;
}[] = [
  {
    value: "all",
    label: "All",
    type: Button_Type.PRIMARY,
  },
  {
    value: "incorrect",
    label: "Incorrect",
    icon: <X />,
    type: Button_Type.ERROR,
  },
  {
    value: "correct",
    label: "Correct",
    icon: <Check />,
    type: Button_Type.SUCCESS,
  },
  {
    value: "bookmarked",
    label: "Bookmarked",
    icon: <Bookmark />,
    type: Button_Type.WARNING,
  },
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
          {FILTERS.map(({ value, label, icon, type }) => (
            <Button
              key={value}
              label={label}
              icon={icon}
              type={type}
              size="M"
              buttonType="button"
              style={filter === value ? Button_Style.SOLID : Button_Style.TONAL}
              onClick={() => onFilterChange(value)}
            />
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
