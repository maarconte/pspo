import "./style.scss";

import { QuestionsContext } from "../../utils/context";
import React from "react";

type Props = {
  setCurrentQuestion: (index: number) => void;
  currentQuestion: number;
};

export default function QuestionNavigation({
  setCurrentQuestion,
  currentQuestion,
}: Props) {
  const { userAnswers } = React.useContext(QuestionsContext);
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
        <button
          key={i}
          onClick={() => setCurrentQuestion(i)}
          className={`QuestionNavigation__button ${
            currentQuestion === i ? "active" : ""
          } ${isQuestionAnswered(i) ? "answered" : ""} ${
            isBookmarked(i) ? "bookmarked" : ""
          }`}
          disabled={currentQuestion === i}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
