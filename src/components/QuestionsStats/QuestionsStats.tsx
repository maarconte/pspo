import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useContext } from "react";

import { QuestionsContext } from "../../utils/context";
import { QuestionsStatsProps } from "./QuestionsStats.types";

const QuestionsStats: FC<QuestionsStatsProps> = () => {
  const { allQuestions } = useContext(QuestionsContext);
  const flaggedQuestions = allQuestions.filter(
    (question) => question.isFlagged
  );
  const noFeedbackQuestions = allQuestions.filter(
    (question) => !question.feedback
  );
  return (
    <div className="QuestionsStats">
      <div className="QuestionsStats__card">
        <h4 className="QuestionsStats__card__title">Total questions</h4>
        <p className="QuestionsStats__card__number">{allQuestions.length}</p>
      </div>
      <div
        className={`QuestionsStats__card ${
          flaggedQuestions.length > 0 && "error"
        }`}
      >
        <h4 className="QuestionsStats__card__title">Reported</h4>
        <p className="QuestionsStats__card__number">
          {flaggedQuestions.length}
        </p>
      </div>
      <div
        className={`QuestionsStats__card warning ${
          noFeedbackQuestions.length > 0 && "warning"
        }`}
      >
        <h4 className="QuestionsStats__card__title">No feedback</h4>
        <p className="QuestionsStats__card__number">
          {noFeedbackQuestions.length}
        </p>
      </div>
    </div>
  );
};

export default QuestionsStats;
