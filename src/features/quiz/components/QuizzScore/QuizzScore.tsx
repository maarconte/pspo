import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useContext, useEffect } from "react";

import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { QuizzScoreProps } from "./QuizzScore.types";

const QuizzScore: FC<QuizzScoreProps> = () => {
  const score = useQuestionsStore((s) => s.score);
  const setScore = useQuestionsStore((s) => s.setScore);
  const userAnswers = useQuestionsStore((s) => s.userAnswers);
  const questions = useQuestionsStore((s) => s.questions);

  const answeredCount = userAnswers?.filter((a) => a?.answer !== undefined).length || 0;
  const percent = answeredCount > 0 ? ((score / answeredCount) * 100).toFixed(0) : "0";
  const percentNumber = parseFloat(percent);

  useEffect(() => {
    let currentScore = 0;
    userAnswers?.forEach((userAnswer) => {
      if (!userAnswer || !questions[userAnswer.question]) return;

      const question = questions[userAnswer.question];
      const correctAnswer = question?.answer;
      const userAnswerValue = userAnswer?.answer;

      if (Array.isArray(correctAnswer) && Array.isArray(userAnswerValue)) {
        if (correctAnswer.length === userAnswerValue.length) {
          const sortedCorrect = [...correctAnswer].sort();
          const sortedUser = [...userAnswerValue].sort();
          if (sortedCorrect.every((val, idx) => val === sortedUser[idx])) {
            currentScore++;
          }
        }
      } else if (correctAnswer === userAnswerValue) {
        currentScore++;
      }
    });
    setScore(currentScore);
  }, [userAnswers, questions, setScore]);

  return (
    <div className="QuizzScore">
      <p className="displayScore-title">Score actuel</p>
      <p className="percent">
        {
          // if is not a number, display 0
          isNaN(percentNumber) ? 0 : percentNumber
        }
        %
      </p>
    </div>
  );
};

export default QuizzScore;
